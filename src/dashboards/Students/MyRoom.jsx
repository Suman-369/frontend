import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '../../lib/api.js';
import { 
  BedDouble, Wind, Wifi, ShieldCheck, Mail, Phone, MoreVertical, Loader2, AlertCircle, Home, Users 
} from 'lucide-react';

const MyRoom = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({ room: null, roommates: [] });
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (!token) {
      navigate('/login?from=student');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [roomRes, appsRes] = await Promise.all([
        roomApi.get('/student/me/room', { headers: { Authorization: `Bearer ${token}` } }),
        roomApi.get('/student/applications', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRoomData(roomRes.data);
      setMyApps(appsRes.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login?from=student');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getOccupantName = (occupant) => {
    const user = occupant.user || occupant;
    return user.fullname ? `${user.fullname.firstName || ''} ${user.fullname.lastName || ''}`.trim() || user.email || 'Unknown' : user.email || 'Unknown';
  };

  const getOccupantAvatar = (occupant) => {
    const user = occupant.user || occupant;
    return user.profileImage || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
  };

  const getOccupantCourse = (occupant) => {
    const user = occupant.user || occupant;
    return user.course || user.rollNo || user.courseStream || 'Student';
  };

  const getOccupantPhone = (occupant) => {
    const user = occupant.user || occupant;
    return user.phone || user.mobile || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg font-semibold text-gray-600">Loading your room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchData}
          className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasApprovedApp = myApps.some(app => app.status === 'approved');
  const room = roomData.room;
  if (!room || !hasApprovedApp) {
    const hasPendingApp = myApps.some(app => app.status === 'pending');
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 text-center border border-gray-200">
        <Home className="w-20 h-20 text-gray-400 mx-auto mb-6 opacity-60" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Room Assigned</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          {hasPendingApp ? 'Your application is under review. Wait for approval.' : 'No approved application found. Please apply for a room.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/student/vacancy" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all text-center">
            {hasPendingApp ? 'View Vacancies' : 'Apply for Room'}
          </a>
          <button 
            onClick={fetchData}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const amenities = room.amenities || ['AC Available', 'High-speed WiFi', 'Daily Cleaning'];
  const roomType = room.capacity === 1 ? 'Single' : room.capacity === 2 ? 'Double' : `${room.capacity}-Seater`;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Room Overview</h2>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
        >
          <span>Refresh</span>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Room Info Hero Card */}
        <div className="xl:col-span-2 bg-[#F4F2FF] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden border border-violet-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group">
          {room.images && room.images.length > 0 && (
            <div 
              className="absolute inset-0 opacity-5 z-0"
              style={{ backgroundImage: `url(${room.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/40 rounded-full blur-3xl z-0"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
             <div>
                <span className="text-xs font-bold text-violet-600 bg-white/60 px-3 py-1.5 rounded-lg backdrop-blur-md uppercase tracking-wider shadow-sm">
                  {room.block || 'Main Block'}
                </span>
                <h3 className="text-4xl font-black text-gray-900 mt-4 mb-2 tracking-tight">Room {room.roomNumber}</h3>
                <p className="text-gray-600 font-medium">{roomType} {room.amenities?.[0] ? room.amenities[0] : ''} Room</p>
                {room.price > 0 && (
                  <p className="text-2xl font-bold text-emerald-600 mt-2">₹{Number(room.price).toLocaleString('en-IN')}/month</p>
                )}
             </div>
             <div className="p-4 rounded-2xl bg-white shadow-sm border border-violet-50 text-violet-600 group-hover:scale-105 transition-transform">
               <BedDouble className="w-8 h-8" />
             </div>
          </div>

          <div className="flex gap-4 relative z-10 mt-2 flex-wrap">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 backdrop-blur-md shadow-sm hover:shadow-md transition-all">
                {idx === 0 && <Wind className="w-4 h-4 text-sky-500" />}
                {idx === 1 && <Wifi className="w-4 h-4 text-emerald-500" />}
                {idx === 2 && <ShieldCheck className="w-4 h-4 text-violet-500" />}
                <span>{amenity}</span>
              </div>
            ))}
            {room.vacancy > 0 && (
              <div className="flex items-center gap-2 bg-yellow-100/80 px-4 py-2 rounded-xl text-sm font-semibold text-yellow-800 backdrop-blur-md shadow-sm border border-yellow-200">
                <span>{room.vacancy} Bed(s) Free</span>
              </div>
            )}
          </div>
        </div>

        {/* Room Admin Card - Keep Dummy Warden */}
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
          <h2 className="text-xl font-bold text-gray-900">Your Roommates ({roomData.roommates.length})</h2>
        </div>
        
        {roomData.roommates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">You are the only occupant</p>
            <p className="text-gray-500 text-sm mt-2">Other beds are available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomData.roommates.map((person, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm border border-white hover:border-sky-100 transition-all group">
                <div className="flex items-center gap-4">
                  <img 
                    src={getOccupantAvatar(person)} 
                    alt={getOccupantName(person)} 
                    className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform shadow-sm" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-sky-600 transition-colors">
                      {getOccupantName(person)}
                    </h4>
                    <p className="text-sm font-semibold text-gray-500">
                      {getOccupantCourse(person)}
                    </p>
                    {getOccupantPhone(person) && (
                      <p className="text-xs text-gray-400 mt-1">{getOccupantPhone(person)}</p>
                    )}
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
        )}
      </div>
    </>
  );
};

export default MyRoom;

