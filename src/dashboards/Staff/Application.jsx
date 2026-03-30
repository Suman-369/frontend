import React from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye } from 'lucide-react';

const Application = () => {
  const applications = [
    { id: 'APP-1029', student: 'Sarah Khan', course: 'B.Tech CS', year: '1st Year', date: 'Oct 23, 2023', status: 'Pending' },
    { id: 'APP-1030', student: 'Vikram Singh', course: 'B.Com', year: '2nd Year', date: 'Oct 22, 2023', status: 'Approved' },
    { id: 'APP-1031', student: 'Priya Patel', course: 'MBA', year: '1st Year', date: 'Oct 20, 2023', status: 'Rejected' },
    { id: 'APP-1032', student: 'Amit Verma', course: 'M.Tech', year: '1st Year', date: 'Oct 19, 2023', status: 'Pending' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Applications</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Review new hostel admission requests</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} /> Status: Pending
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Student Name..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">App ID</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Course / Year</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{app.id}</td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{app.student}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-gray-700">{app.course}</p>
                    <p className="text-xs font-semibold text-gray-500">{app.year}</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-500">{app.date}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                      app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 transition-colors rounded-lg" title="View Details">
                         <Eye size={18} />
                       </button>
                       {app.status === 'Pending' && (
                         <>
                           <button className="p-2 text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg" title="Approve">
                             <CheckCircle size={18} />
                           </button>
                           <button className="p-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg" title="Reject">
                             <XCircle size={18} />
                           </button>
                         </>
                       )}
                    </div>
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

export default Application;
