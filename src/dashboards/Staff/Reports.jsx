import React from 'react';
import { Download, Filter, BarChart3, PieChart } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { title: 'Occupancy Report', desc: 'Monthly view of room occupancy limits', date: 'Last generated: Today, 10:00 AM' },
    { title: 'Fee Defaults Report', desc: 'List of students with pending dues', date: 'Last generated: Yesterday, 5:30 PM' },
    { title: 'Maintenance Log', desc: 'Summary of all resolved & pending complaints', date: 'Last generated: Oct 20, 2023' },
    { title: 'Visitor Log', desc: 'Details of all hostel visitors this month', date: 'Last generated: Oct 15, 2023' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Generate and download official hostel records</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} /> Date Range
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <BarChart3 className="w-8 h-8 text-[#FFB800] mb-4" />
           <p className="text-3xl font-bold mb-1">1,248</p>
           <p className="text-sm font-medium text-blue-200">Total Residents</p>
        </div>
        <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <PieChart className="w-8 h-8 text-white mb-4" />
           <p className="text-3xl font-bold mb-1">94%</p>
           <p className="text-sm font-medium text-emerald-100">Occupancy Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reportTypes.map((rep, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-blue-100 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
             <div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">{rep.title}</h3>
               <p className="text-sm font-medium text-gray-600 mb-2">{rep.desc}</p>
               <p className="text-xs font-semibold text-gray-400">{rep.date}</p>
             </div>
             <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors text-sm shrink-0">
               <Download size={16} /> Download CSV
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
