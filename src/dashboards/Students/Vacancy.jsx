import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Filter,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Wifi,
  Home,
  CheckCircle,
  XCircle,
  User,
  Hash,
  Phone,
  MessageSquare,
} from "lucide-react";
import { studentRoomApi } from "../../lib/api";
import { useNavigate } from "react-router-dom";

const Vacancy = () => {
  const token = localStorage.getItem("token") || "";
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewRoom, setViewRoom] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    courseStream: "",
    mobile: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [rejectedApp, setRejectedApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableRooms();
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await studentRoomApi.get("/applications");
      setMyApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login?from=student";
      return;
    }
  }, [token]);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const res = await studentRoomApi.get("/rooms");
      const availableRooms = (res.data.rooms || []).filter(
        (r) => r.vacancy > 0,
      );
      setRooms(availableRooms);
    } catch (err) {
      console.error("Failed to fetch available rooms", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=student";
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getStyle = (idx) => {
    const colors = ["violet", "orange", "sky", "emerald"];
    const color = colors[idx % colors.length];
    switch (color) {
      case "violet":
        return {
          bg: "bg-[#F4F2FF]",
          border: "border-violet-100",
          text: "text-violet-600",
          iconBg: "bg-violet-100",
        };
      case "orange":
        return {
          bg: "bg-[#FFF3EC]",
          border: "border-orange-100",
          text: "text-orange-500",
          iconBg: "bg-orange-100",
        };
      case "sky":
        return {
          bg: "bg-[#EAF6FF]",
          border: "border-blue-100",
          text: "text-blue-500",
          iconBg: "bg-blue-100",
        };
      case "emerald":
        return {
          bg: "bg-[#EEF8F3]",
          border: "border-emerald-100",
          text: "text-emerald-600",
          iconBg: "bg-emerald-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-100",
          text: "text-gray-600",
          iconBg: "bg-gray-100",
        };
    }
  };

  const handleOpenApply = (room) => {
    const status = getRoomApplicationStatus(room._id);
    if (status === "pending" || status === "approved") {
      alert(`Application is ${status}. Cannot apply again.`);
      return;
    }
    setSelectedRoom(room);
    setApplyOpen(true);
  };

  const handleCloseApply = () => {
    setApplyOpen(false);
    setSelectedRoom(null);
    setFormData({
      name: "",
      rollNo: "",
      courseStream: "",
      mobile: "",
      message: "",
    });
  };

  const closeNotification = () => {
    setNotification({ open: false, type: "", message: "" });
  };

  const getRoomApplicationStatus = (roomId) => {
    const app = myApplications.find((a) => a.room._id === roomId);
    if (!app) return "apply";
    if (app.status === "pending") return "pending";
    if (app.status === "approved") return "approved";
    if (app.status === "rejected" || app.status === "cancelled")
      return "rejected";
    return "apply";
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending Review",
          color:
            "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-50",
        };
      case "approved":
        return {
          text: "Approved ✓",
          color:
            "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
        };
      case "rejected":
        return {
          text: "Rejected",
          color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-50",
        };
      default:
        return null;
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.rollNo ||
      !formData.courseStream ||
      !formData.mobile
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      setSubmitting(true);
      await studentRoomApi.post("/applications", {
        roomId: selectedRoom._id,
        studentDetails: {
          name: formData.name,
          rollNo: formData.rollNo,
          courseStream: formData.courseStream,
          mobile: formData.mobile,
        },
        message: formData.message || "I would like to apply for this room.",
      });
      setNotification({
        open: true,
        type: "success",
        message: "Application submitted! Status: Pending",
      });
      fetchAvailableRooms();
      fetchMyApplications();
      handleCloseApply();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=student";
        return;
      }
      setNotification({
        open: true,
        type: "error",
        message: err.response?.data?.message || "Failed to submit application.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRoomDetail = async (id) => {
    try {
      const res = await studentRoomApi.get(`/rooms/${id}`);
      const data = res.data.room ? res.data.room : res.data;
      setViewRoom(data);
    } catch (err) {
      console.error("Failed to fetch room detail", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=student";
        return;
      }
      alert(err?.response?.data?.message || "Failed to fetch room details.");
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Build occupant display name
  const getOccupantName = (o) => {
    const user = o.user || o || {};
    const nm =
      `${user.fullname?.firstName || ""} ${user.fullname?.lastName || ""}`.trim();
    return nm || user.email || user._id || "Unknown";
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Room Vacancies
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Find and apply for available rooms
          </p>
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

      {/* Room Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Vacancies Found
          </h3>
          <p className="text-gray-500 text-sm font-medium">
            There are currently no rooms available matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => {
            const styles = getStyle(idx);

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
              <div
                key={room._id}
                className={`${styles.bg} rounded-3xl p-6 transition-all hover:-translate-y-1 duration-300 border ${styles.border} shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group relative overflow-hidden flex flex-col`}
              >
                {/* Background Decorative Element */}
                {room.images && room.images.length > 0 ? (
                  <div className="absolute inset-0 opacity-10 z-0">
                    <img
                      src={room.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/40 rounded-full blur-2xl z-0" />
                )}

                <div className="flex items-center justify-between mb-4 z-10 relative">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-xs uppercase text-gray-500 font-semibold">
                      {roomType} · {room.block || "Main Block"} ·{" "}
                      {room.floor || "Floor N/A"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    {room.status || "Available"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 z-10 relative">
                  <div className="text-sm text-gray-700">
                    <strong>Capacity:</strong> {room.capacity}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Vacancy:</strong> {room.vacancy}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Price:</strong> ₹
                    {Number(room.price || 0).toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Occupants:</strong> {room.occupants?.length || 0}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2 z-10 relative">
                  {room.description ||
                    "High-quality room with comfortable amenities."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 z-10 relative">
                  {(room.amenities || []).slice(0, 5).map((a, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold uppercase text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                {/* Occupant Avatars */}
                <div className="flex items-center gap-2 mb-4 z-10 relative">
                  <div className="flex -space-x-2">
                    {Array.from({
                      length: Math.min(room.capacity - room.vacancy, 4),
                    }).map((_, i) => (
                      <div
                        key={`occ-${i}`}
                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                      >
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                    {Array.from({ length: Math.min(room.vacancy, 4) }).map(
                      (_, i) => (
                        <div
                          key={`vac-${i}`}
                          className={`w-8 h-8 rounded-full border-2 border-dashed border-gray-300 bg-white/50 flex items-center justify-center text-[10px] font-bold ${styles.text}`}
                        >
                          +
                        </div>
                      ),
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-600">
                    {room.vacancy} Bed(s) Free
                  </span>
                </div>

                <div className="flex gap-2 justify-between items-center mt-auto z-10 relative">
                  <button
                    onClick={() => fetchRoomDetail(room._id)}
                    className="text-xs font-semibold transition-all text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-3 py-2"
                  >
                    View Details
                  </button>
                  {(() => {
                    const status = getRoomApplicationStatus(room._id);
                    const config = getStatusConfig(status);
                    if (config) {
                      return (
                        <button
                          onClick={() => {
                            const app = myApplications.find(
                              (a) =>
                                a.room._id === room._id &&
                                (a.status === "rejected" ||
                                  a.status === "cancelled"),
                            );
                            if (app && app.staffNote) {
                              setRejectedApp(app);
                            }
                          }}
                          className={`text-xs font-bold px-4 py-2 rounded-xl border-2 shadow-sm transition-all cursor-pointer ${config.color}`}
                        >
                          {config.text}
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleOpenApply(room)}
                        className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Apply Now
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {applyOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] mx-4 shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Apply for Room</h2>
                  <p className="text-emerald-100">
                    Room {selectedRoom.roomNumber} - Block {selectedRoom.block}
                  </p>
                </div>
                <button
                  onClick={handleCloseApply}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 pb-8">
              <form
                onSubmit={handleSubmitForm}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User size={18} className="text-indigo-500" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-14"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Hash size={18} className="text-indigo-500" />
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNo: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-14"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Users size={18} className="text-indigo-500" />
                    Course / Stream <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.courseStream}
                    onChange={(e) =>
                      setFormData({ ...formData, courseStream: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-14"
                    placeholder="e.g., B.Tech Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Phone size={18} className="text-indigo-500" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-14"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MessageSquare size={18} className="text-indigo-500" />
                    Message (Optional)
                  </label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-vertical"
                    placeholder="Any additional information about your application..."
                  />
                </div>
                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseApply}
                    className="flex-1 px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-lg h-14 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-8 py-4 text-lg font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center gap-2 h-14"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rejected Application Modal */}
      {rejectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-xl font-bold">Application Rejected</h2>
              <p className="text-red-100 mt-1">
                Room {rejectedApp.room.roomNumber}
              </p>
            </div>
            <div className="p-6 space-y-4">
              {rejectedApp.staffNote && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Staff Note:
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {rejectedApp.staffNote}
                  </p>
                </div>
              )}
              {!rejectedApp.staffNote && (
                <p className="text-gray-500 italic text-center py-8">
                  No specific reason provided
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRejectedApp(null)}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setRejectedApp(null);
                    navigate("/student/complaints");
                  }}
                  className="flex-1 px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2"
                >
                  Contact Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {notification.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div
            className={`relative rounded-3xl p-6 shadow-2xl max-w-md w-full transform transition-all animate-in fade-in-0 zoom-in-95 ${
              notification.type === "success"
                ? "bg-emerald-500 text-white border-emerald-400 border-2"
                : "bg-red-500 text-white border-red-400 border-2"
            }`}
          >
            <button
              onClick={closeNotification}
              className="absolute top-3 right-3 p-1.5 bg-white/30 rounded-full transition-all hover:bg-white/40 shadow-lg z-10"
              style={{ minWidth: "28px", minHeight: "28px" }}
            >
              <XCircle size={18} className="text-white drop-shadow-sm" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === "success" ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {notification.type === "success" ? "Success!" : "Error!"}
                </h3>
                <p className="text-white/90 mt-1">{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Detail Modal */}
      {viewRoom && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-5 md:zoom-in-95">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 md:px-8 py-6 flex justify-between items-center z-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Room {viewRoom.roomNumber}
                </h1>
                <p className="text-indigo-100 text-sm md:text-base mt-1">
                  Block {viewRoom.block} • Floor {viewRoom.floor}
                </p>
              </div>
              <button
                onClick={() => setViewRoom(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              {/* Room Image Gallery */}
              {viewRoom.images && viewRoom.images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Room Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {viewRoom.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-full h-48 md:h-56 rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={img}
                          alt={`room-${idx}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-200 rounded-lg">
                      <Home size={20} className="text-indigo-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Status
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {viewRoom.status}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        viewRoom.status === "available"
                          ? "bg-emerald-500"
                          : "bg-orange-500"
                      }`}
                    ></span>
                    <span
                      className={`text-sm font-semibold ${
                        viewRoom.status === "available"
                          ? "text-emerald-600"
                          : "text-orange-600"
                      }`}
                    >
                      {viewRoom.status === "available"
                        ? "Available for Booking"
                        : "Limited Availability"}
                    </span>
                  </div>
                </div>

                {/* Capacity Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-200 rounded-lg">
                      <Users size={20} className="text-purple-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Capacity
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {viewRoom.capacity} Persons
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-bold text-emerald-600">
                      {viewRoom.vacancy} Beds
                    </span>{" "}
                    Available
                  </p>
                </div>

                {/* Price Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-200 rounded-lg">
                      <DollarSign size={20} className="text-emerald-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Price
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Number(viewRoom.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">Per Month</p>
                </div>

                {/* Location Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-200 rounded-lg">
                      <MapPin size={20} className="text-orange-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Location
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {viewRoom.block || "N/A"} • Floor {viewRoom.floor || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    Room #{viewRoom.roomNumber}
                  </p>
                </div>

                {/* Occupants Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Users size={20} className="text-blue-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Occupants
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(viewRoom.occupants || []).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    Current Residents
                  </p>
                </div>

                {/* Vacancy Card */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl border border-rose-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-200 rounded-lg">
                      <CheckCircle size={20} className="text-rose-700" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Vacancy
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {viewRoom.vacancy}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">Beds Available</p>
                </div>
              </div>

              {/* Amenities Section */}
              {viewRoom.amenities && viewRoom.amenities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Wifi size={20} className="text-indigo-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Amenities
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {viewRoom.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-full font-semibold text-sm border border-indigo-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              {viewRoom.description && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {viewRoom.description}
                  </p>
                </div>
              )}

              {/* Occupants Section */}
              {viewRoom.occupants && viewRoom.occupants.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Current Occupants
                  </h3>
                  <div className="space-y-3">
                    {viewRoom.occupants.map((occupant, idx) => {
                      const name = getOccupantName(occupant);
                      const user = occupant.user || occupant;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {name.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{name}</p>
                            <p className="text-sm text-gray-600">
                              {user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-4 flex justify-end gap-3">
              <button
                onClick={() => setViewRoom(null)}
                className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleOpenApply(viewRoom);
                  setViewRoom(null);
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vacancy;
