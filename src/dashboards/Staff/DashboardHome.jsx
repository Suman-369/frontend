import React from 'react';
import { Users, DoorOpen, HardHat, FileCheck } from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    { title: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Available Rooms', value: '34', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { title: 'Active Complaints', value: '12', icon: HardHat, color: 'text-orange-500', bg: 'bg-orange-100' },
    { title: 'New Applications', value: '28', icon: FileCheck, color: 'text-violet-500', bg: 'bg-violet-100' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Welcome back, Staff member! Here is today's summary.</p>
        </div>
        <button className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h3>
           <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Student Room Assignment</h4>
                    <p className="text-xs text-gray-500 mt-1">Room 304 assigned to Rahul Khanna.</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">2 hours ago</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-[#1E3A8A] p-8 rounded-3xl shadow-[0_4px_24px_rgba(30,58,138,0.2)] text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <h3 className="text-xl font-bold mb-2">Notice Board Update</h3>
          <p className="text-blue-200 text-sm mb-8">Publish new notices and announcements for all students in one click.</p>
          <button className="bg-[#FFB800] text-[#1E3A8A] px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 active:scale-95">
            + Create Notice
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
