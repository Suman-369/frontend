import React from 'react';
import { BedDouble, Wind, Wifi, ShieldCheck, Mail, Phone, MoreVertical } from 'lucide-react';

const MyRoom = () => {
  const roommates = [
    { name: 'Arjun Mehta', course: 'B.Tech CS 2nd Year', phone: '+91 9876543210', avatar: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Karan Singh', course: 'B.Tech IT 2nd Year', phone: '+91 8765432109', avatar: 'https://i.pravatar.cc/150?img=15' }
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Room Overview</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Room Info Hero Card */}
        <div className="xl:col-span-2 bg-[#F4F2FF] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden border border-violet-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/40 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-6 z-10">
             <div>
                <span className="text-xs font-bold text-violet-600 bg-white/60 px-3 py-1.5 rounded-lg backdrop-blur-md uppercase tracking-wider shadow-sm">
                  Block A
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-4 mb-2 tracking-tight">Room 101</h3>
                <p className="text-gray-600 font-medium">3-Seater Premium Air-Conditioned Room</p>
             </div>
             <div className="p-4 rounded-2xl bg-white shadow-sm border border-violet-50 text-violet-600">
               <BedDouble className="w-8 h-8" />
             </div>
          </div>

          <div className="flex gap-4 z-10 mt-2">
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 backdrop-blur-md shadow-sm">
              <Wind className="w-4 h-4 text-sky-500" /> AC Available
            </div>
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 backdrop-blur-md shadow-sm">
              <Wifi className="w-4 h-4 text-emerald-500" /> High-speed WiFi
            </div>
            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-4 h-4 text-violet-500" /> Daily Cleaning
            </div>
          </div>
        </div>

        {/* Room Admin Card */}
        <div className="bg-[#FFF4E5] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(255,184,0,0.04)] relative overflow-hidden border border-yellow-100/50">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl"></div>
           <div className="w-20 h-20 mb-4">
              <img src="https://i.pravatar.cc/150?img=11" alt="Warden" className="w-full h-full rounded-full border-4 border-white shadow-md object-cover" />
           </div>
           <h3 className="text-gray-900 font-bold text-lg">Dr. A. Sharma</h3>
           <p className="text-sm font-medium text-gray-600 mb-6">Warden - Block A</p>
           <button className="bg-[#FFB800] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md active:scale-95 w-full">
             Contact Warden
           </button>
        </div>
      </div>

      {/* Roommates Section */}
      <div className="bg-[#F3F8FF]/60 rounded-3xl p-6 lg:p-8 border border-sky-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Roommates</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roommates.map((person, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm border border-white hover:border-sky-100 transition-all group">
              <div className="flex items-center gap-4">
                <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform shadow-sm" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">{person.name}</h4>
                  <p className="text-sm font-semibold text-gray-500">{person.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 bg-[#EAF6FF] text-blue-500 rounded-xl hover:bg-blue-100 transition-colors active:scale-95">
                    <Phone className="w-5 h-5" />
                 </button>
                 <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-colors active:scale-95">
                    <Mail className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyRoom;
