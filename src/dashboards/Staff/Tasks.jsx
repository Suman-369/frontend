import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  ClipboardList,
  Play,
  Check
} from "lucide-react";
import { reportApi } from '../../../lib/api.js';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, overdue: 0 });
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await reportApi.get('/tasks/staff');
      setTasks(res.data.tasks || []);
      const pending = res.data.tasks?.filter(t => t.status === 'pending').length || 0;
      const overdue = res.data.tasks?.filter(t => t.status === 'pending' && new Date(t.deadline) < new Date()).length || 0;
      setStats({ total: res.data.tasks?.length || 0, pending, overdue });
    } catch (err) {
      console.error('Fetch tasks error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await reportApi.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Update status error', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-orange-100 text-orange-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/staff')} 
          className="inline-flex items-center gap-2 mb-4 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <div className="ml-8">
          <h1 className="text-3xl font-bold text-gray-900">My Assigned Tasks</h1>
          <p className="text-gray-500 mt-2">Tasks assigned to you by admin. Update status as you progress.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm font-semibold text-gray-500">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm font-semibold text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-3xl shadow-lg border border-red-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-2xl">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-sm font-semibold text-red-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Tasks</h2>
          <p className="text-gray-500">Click to update status</p>
        </div>
        <div className="divide-y divide-gray-100">
          {tasks.length === 0 ? (
            <div className="text-center py-20 px-8">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks assigned</h3>
              <p className="text-gray-500 mb-6">Tasks will appear here when admin assigns them.</p>
              <button 
                onClick={fetchTasks}
                className="px-6 py-2 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1e40af] transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : tasks.map((task) => (
            <div key={task._id} className="p-8 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start lg:items-center">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span>Due {formatDate(task.deadline)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2 lg:justify-end">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                      disabled={updatingId === task._id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      <Play size={16} />
                      Start
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusUpdate(task._id, 'completed')}
                      disabled={updatingId === task._id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      <Check size={16} />
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;

