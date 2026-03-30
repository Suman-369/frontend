import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Filter, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const STUDENT_ROOM_API = 'http://localhost:3002/api/student';

const Vacancy = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${STUDENT_ROOM_API}/rooms`, { withCredentials: true });
      // The API returns an array, let's filter only the ones with vacancy > 0
      const availableRooms = (res.data.rooms || []).filter(r => r.vacancy > 0);
      setRooms(availableRooms);
    } catch (err) {
      console.error("Failed to fetch available rooms", err);
    } finally {
      setLoading(false);
    }
  };

  const getStyle = (idx) => {
    const colors = ['violet', 'orange', 'sky', 'emerald'];
    const color = colors[idx % colors.length];
    switch (color) {
      case 'violet': return { bg: 'bg-[#F4F2FF]', border: 'border-violet-100', text: 'text-violet-600', iconBg: 'bg-violet-100' };
      case 'orange': return { bg: 'bg-[#FFF3EC]', border: 'border-orange-100', text: 'text-orange-500', iconBg: 'bg-orange-100' };
      case 'sky': return { bg: 'bg-[#EAF6FF]', border: 'border-blue-100', text: 'text-blue-500', iconBg: 'bg-blue-100' };
      case 'emerald': return { bg: 'bg-[#EEF8F3]', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-600', iconBg: 'bg-gray-100' };
    }
  };

  const handleApply = async (roomId) => {
    try {
      await axios.post(`${STUDENT_ROOM_API}/applications`, { roomId, message: "I would like to apply for this room." }, { withCredentials: true });
      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit application.");
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    room.block?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Room Vacancies</h2>
          <p className="text-sm font-semibold text-gray-500">Find and apply for available rooms</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative w-full max-w-xs">
             <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search block or room..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 py-2.5 bg-white shadow-sm border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] outline-none transition-all placeholder-gray-400 font-medium"
             />
           </div>
           <button className="p-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-gray-500 hover:text-gray-900 hover:border-gray-200 transition-all">
             <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <Users className="w-8 h-8 text-gray-400" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">No Vacancies Found</h3>
           <p className="text-gray-500 text-sm font-medium">There are currently no rooms available matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => {
            const styles = getStyle(idx);
            
            // Generate a fake type based on capacity if amenities are empty
            let roomType = "Standard Room";
            if (room.amenities && room.amenities.length > 0) {
               roomType = room.amenities[0];
            } else if (room.capacity === 1) {
               roomType = "Single Room";
            } else if (room.capacity === 2) {
               roomType = "Double Room";
            } else {
               roomType = "Shared Room";
            }

            return (
              <div key={room._id} className={`${styles.bg} rounded-3xl p-6 transition-all hover:-translate-y-1 duration-300 border ${styles.border} shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group relative overflow-hidden flex flex-col`}>
                 {/* Background Decorative Element */}
                 {room.images && room.images.length > 0 ? (
                    <div className="absolute inset-0 opacity-10 z-0">
                       <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                 ) : (
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/40 rounded-full blur-2xl z-0"></div>
                 )}

                 <div className="flex justify-between items-start mb-6 z-10 relative">
                   <div>
                      <span className={`text-[10px] font-bold ${styles.text} uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md`}>
                        {roomType}
                      </span>
                      <h3 className="text-3xl font-black text-gray-900 mt-4 mb-1 tracking-tight">
                         Room {room.roomNumber}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                         <MapPin className="w-3.5 h-3.5" /> {room.block || 'Main Block'}
                      </div>
                   </div>
                   <div className={`p-3 rounded-2xl ${styles.iconBg} ${styles.text} shadow-inner group-hover:scale-110 transition-transform duration-300 bg-white/50 backdrop-blur-sm`}>
                      {room.images && room.images.length > 0 ? <ImageIcon className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/40 z-10 relative">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-2">
                         {Array.from({ length: Math.min(room.capacity - room.vacancy, 4) }).map((_, i) => (
                           <div key={`occ-${i}`} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">
                             <Users className="w-3.5 h-3.5" />
                           </div>
                         ))}
                         {Array.from({ length: Math.min(room.vacancy, 4) }).map((_, i) => (
                           <div key={`vac-${i}`} className={`w-8 h-8 rounded-full border-2 border-white ${styles.bg} border-dashed flex items-center justify-center text-[10px] font-bold ${styles.text} bg-white/50`}>
                             +
                           </div>
                         ))}
                       </div>
                       <span className="text-xs font-bold text-gray-600 ml-2">
                          {room.vacancy} Bed(s) Free
                       </span>
                    </div>
                    
                    <button onClick={() => handleApply(room._id)} className="bg-white/80 hover:bg-white backdrop-blur-md text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-white hover:border-gray-100 transition-all active:scale-95">
                      Apply Now
                    </button>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Vacancy;
