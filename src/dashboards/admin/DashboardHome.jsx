import React from 'react';
import { Users, FileText, ClipboardList, TrendingUp, User } from 'lucide-react';

const AdminDashboardHome = () => {
  const stats = [
    { name: 'Total Students', value: '1,245', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { name: 'Total Staff', value: '45', icon: Users, color: 'text-green-500', bgColor: 'bg-green-100' },
    { name: 'Pending Reports', value: '12', icon: FileText, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { name: 'Work Assignments', value: '8', icon: ClipboardList, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
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
                <TrendingUp size={20} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Actvity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">New student registered</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Work Assign</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 mr-4">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fix broken pipe Room 10{i}</p>
                    <p className="text-xs text-gray-500">Assigned to: Plumber</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
