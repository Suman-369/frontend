import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Send, FileWarning } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 'CMP-1042', type: 'Maintenance', description: 'AC not cooling properly in room 101', status: 'Pending', date: 'Oct 24, 2023', color: 'orange' },
    { id: 'CMP-1038', type: 'Cleaning', description: 'Bathroom cleaning delayed by 2 days', status: 'Resolved', date: 'Oct 20, 2023', color: 'emerald' },
    { id: 'CMP-1021', type: 'Food/Mess', description: 'Dinner quality was subpar tonight', status: 'Resolved', date: 'Oct 15, 2023', color: 'emerald' }
  ]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Complaints Helpdesk</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="xl:col-span-1 bg-[#EEF8F3]/60 rounded-3xl p-6 lg:p-8 flex flex-col border border-emerald-50 h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-emerald-100 pb-4">
            <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600">
               <FileWarning className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Register New<br/>Complaint</h3>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Category</label>
              <select className="w-full bg-white border-none rounded-2xl py-3 px-4 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm transition-all cursor-pointer">
                <option>Maintenance</option>
                <option>Cleaning</option>
                <option>Food / Mess</option>
                <option>Internet / WiFi</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Description</label>
              <textarea 
                rows="4"
                placeholder="Describe your issue in detail..."
                className="w-full bg-white border border-transparent rounded-2xl py-3 px-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-100 outline-none shadow-sm transition-all resize-none placeholder-gray-400"
              />
            </div>
            
            <button type="button" className="w-full bg-emerald-500 text-white rounded-2xl py-3.5 mt-2 flex items-center justify-center gap-2 font-bold hover:bg-emerald-600 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] active:scale-95">
              <Send className="w-4 h-4" /> Submit Complaint
            </button>
          </form>
        </div>

        {/* Complaints History */}
        <div className="xl:col-span-2 bg-[#F3F8FF]/60 rounded-3xl p-6 lg:p-8 border border-sky-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">My Past Complaints</h2>
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg shadow-sm">Total: {complaints.length}</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {complaints.map((comp, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:border-sky-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                 <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl mt-1 shadow-inner ${comp.status === 'Pending' ? 'bg-orange-100 text-orange-500' : 'bg-emerald-100 text-emerald-500'}`}>
                      {comp.status === 'Pending' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase">{comp.id}</span>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md uppercase tracking-wide">{comp.type}</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-blue-600 transition-colors">{comp.description}</h4>
                      <p className="text-xs font-semibold text-gray-400 mt-2">{comp.date}</p>
                    </div>
                 </div>
                 <div className="flex justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                    <span className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center min-w-[100px] shadow-sm ${comp.status === 'Pending' ? 'bg-[#FFF3EC] text-orange-600 border border-orange-100' : 'bg-[#EEF8F3] text-emerald-600 border border-emerald-100'}`}>
                      {comp.status}
                    </span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaints;
