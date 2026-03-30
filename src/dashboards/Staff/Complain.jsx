import React from 'react';
import { Search, Filter, MoreVertical, AlertCircle, CheckCircle2 } from 'lucide-react';

const Complain = () => {
  const complaints = [
    { id: '#CMP-001', student: 'Rahul Kumar', room: 'A-204', type: 'Maintenance', desc: 'Ceiling fan is making loud noise', status: 'Pending', date: 'Oct 24, 2023', priority: 'High' },
    { id: '#CMP-002', student: 'Arjun Singh', room: 'B-105', type: 'Cleaning', desc: 'Room not cleaned for 3 days', status: 'Resolved', date: 'Oct 23, 2023', priority: 'Medium' },
    { id: '#CMP-003', student: 'Rohan Sharma', room: 'C-310', type: 'Electrical', desc: 'Study lamp socket broken', status: 'In Progress', date: 'Oct 22, 2023', priority: 'Low' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Handle and track student issues</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Student, or Room..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Complaint ID</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{comp.id}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-bold text-gray-900">{comp.student}</p>
                    <p className="text-xs font-semibold text-gray-500">Room: {comp.room}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-bold text-gray-900">{comp.type}</p>
                    <p className="text-xs font-medium text-gray-500 truncate max-w-[200px]" title={comp.desc}>{comp.desc}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${comp.priority === 'High' ? 'text-red-600 bg-red-50' : comp.priority === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50' }`}>
                      {comp.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getStatusColor(comp.status)} flex items-center justify-center w-max gap-1`}>
                      {comp.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {comp.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Complain;
