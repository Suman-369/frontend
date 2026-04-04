import React, { useState, useEffect } from 'react';
import { Users, FileText, ClipboardList, TrendingUp, User, Loader2 } from 'lucide-react';
import { authApi, staffRoomApi, complaintApi, reportApi } from '../../lib/api.js';

const AdminDashboardHome = () => {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalStaff: 0,
    pendingReports: 0,
    workAssignments: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStaffName = (staffId) => {
    // Simplified - in full impl, fetch staff list or use context
    return staffId ? `Staff ${staffId.slice(-4)}` : 'Unassigned';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roomStatsRes, staffUsersRes, complaintStatsRes, tasksRes, activitiesRes] = await Promise.all([
          staffRoomApi.get('/stats').catch(() => ({ data: {} })),
          authApi.get('/users?role=staff').catch(() => ({ data: { users: [] } })),
          complaintApi.get('/staff/complaints/stats').catch(() => ({ data: {} })),
          reportApi.get('/tasks').catch(() => ({ data: { tasks: [] } })),
          complaintApi.get('/complaints?limit=3&sort=-createdAt&status=pending').catch(() => ({ data: { complaints: [] } })),
        ]);

        const roomStats = roomStatsRes.data;
        const staffUsers = staffUsersRes.data.users || [];
        const complaintStats = complaintStatsRes.data;
        const tasks = tasksRes.data.tasks || [];
        const recentComplaints = activitiesRes.data.complaints || [];

        setStatsData({
          totalStudents: roomStats.totalStudents ?? 0,
          totalStaff: staffUsers.length,
          pendingReports: complaintStats.pendingReports ?? tasks.filter(t => t.status === 'pending').length,
          workAssignments: tasks.length,
        });

        // Recent 3 complaints (generic fallback if empty)
        setRecentActivities(recentComplaints.length > 0 ? recentComplaints.slice(0, 3) : [
          { title: 'New student registered', timestamp: new Date(Date.now() - 2*60*60*1000) },
          { title: 'Room inspection completed', timestamp: new Date(Date.now() - 5*60*60*1000) },
          { title: 'Complaint resolved', timestamp: new Date(Date.now() - 8*60*60*1000) },
        ]);

        // Pending tasks slice(0,3)
        setPendingTasks(tasks.filter(t => t.status === 'pending').slice(0, 3));

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Some stats may show defaults.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { 
      name: 'Total Students', 
      value: loading ? '...' : statsData.totalStudents.toLocaleString(), 
      icon: Users, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-100' 
    },
    { 
      name: 'Total Staff', 
      value: loading ? '...' : statsData.totalStaff.toLocaleString(), 
      icon: Users, 
      color: 'text-green-500', 
      bgColor: 'bg-green-100' 
    },
    { 
      name: 'Pending Reports', 
      value: loading ? '...' : statsData.pendingReports.toLocaleString(), 
      icon: FileText, 
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-100' 
    },
    { 
      name: 'Work Assignments', 
      value: loading ? '...' : statsData.workAssignments.toLocaleString(), 
      icon: ClipboardList, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-100' 
    },
  ];

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recent';
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800 text-sm">
          <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
          {error}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor all hostel operations from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                {loading ? <Loader2 size={20} className="text-gray-300 animate-spin" /> : <TrendingUp size={20} className="text-gray-300" />}
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin flex-shrink-0" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            ) : (
            recentActivities.map((complaint, i) => (
                <div key={i} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                    <User size={18} />
                  </div>
                  <div>
                <p className="text-sm font-medium text-gray-800">New Complaint</p>
                <p className="text-xs text-gray-600">{complaint.description || 'Issue reported'}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(complaint.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Work Assignments</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin flex-shrink-0" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending tasks
              </div>
            ) : (
              pendingTasks.map((task, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 mr-4">
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-500">Assigned to: {getStaffName(task.staffId)}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;

