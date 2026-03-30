import React, { useState } from 'react';
import { Download, Filter, FileText, Calendar, ChevronRight } from 'lucide-react';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('financial');

  const tabs = [
    { id: 'financial', label: 'Financial Reports' },
    { id: 'students', label: 'Student Data' },
    { id: 'staff', label: 'Staff Performance' },
    { id: 'maintenance', label: 'Maintenance Log' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and analyze hostel operational reports.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tl-xl rounded-bl-xl">Report Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Generated Date</th>
                <th scope="col" className="px-6 py-4 font-semibold">Size</th>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tr-xl rounded-br-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="bg-white hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{`Monthly ${activeTab} Summary Q${i}`}</div>
                        <div className="text-xs text-gray-400 mt-0.5">PDF Document</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Oct 1{i}, 2024
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{(Math.random() * 5 + 1).toFixed(1)} MB</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#1E3A8A] hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm inline-flex items-center">
                      Download
                      <ChevronRight className="w-4 h-4 ml-1" />
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

export default AdminReports;
