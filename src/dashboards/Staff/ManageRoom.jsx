import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  X,
  Loader2,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Wifi,
  Home,
  BedDouble,
} from "lucide-react";
import axios from "axios";

const ROOM_SERVICE_URL = "http://localhost:3002/api/staff";

// ── Extracted OUTSIDE ManageRoom to prevent remount on every render ──
const RoomFormFields = ({
  formData,
  handleInputChange,
  amenitiesInput,
  setAmenitiesInput,
  imagePreview,
  handleImageSelect,
  toggleOccupant,
  removeOccupant,
  getOccupantName,
  displayedUsers,
  studentSearchQuery,
  setStudentSearchQuery,
  studentUsers,
  availableStudentsCount,
  submitLoading,
  selectedRoom,
  onCancel,
  handleSubmit,
  errorMsg,
}) => (
  <form onSubmit={handleSubmit} className="space-y-8">
    {/* Basic Info */}
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Room Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Room Number *
          </label>
          <input
            required
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleInputChange}
            placeholder="E.g. A-101"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Capacity *
          </label>
          <input
            required
            type="number"
            min="1"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Block
          </label>
          <input
            type="text"
            name="block"
            value={formData.block}
            onChange={handleInputChange}
            placeholder="E.g. Block A"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Floor
          </label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            placeholder="E.g. Ground"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
          >
            <option value="available">Available</option>
            <option value="full">Full</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Price (₹/month)
          </label>
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
      </div>
    </div>

    {/* Amenities */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Amenities
      </label>
      <input
        type="text"
        name="amenities"
        value={amenitiesInput}
        onChange={(e) => setAmenitiesInput(e.target.value)}
        placeholder="E.g. AC, TV, WiFi, Attach Bath (comma separated)"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Room Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Add specific details about the room..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-vertical"
      />
    </div>

    {/* Room Image */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Room Image
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {(imagePreview || formData.images.length > 0) && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {imagePreview && (
            <div className="relative w-20 h-20 shrink-0">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover rounded-xl border border-gray-200"
              />
            </div>
          )}
          {formData.images
            .filter((img) => img !== imagePreview)
            .map((img, i) => (
              <div key={i} className="relative w-20 h-20 shrink-0">
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl border border-gray-200"
                />
              </div>
            ))}
        </div>
      )}
    </div>

    {/* Occupants Section */}
    <div className="border-t-2 border-gray-200 pt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users size={20} className="text-blue-600" />
        Assign Occupants
      </h3>

      {/* Selected Occupants Pills */}
      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200 min-h-14">
        {formData.occupants.length === 0 ? (
          <span className="text-sm text-gray-500 italic">
            No occupants assigned yet
          </span>
        ) : (
          formData.occupants.map((occupant) => (
            <div
              key={occupant.userId}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              <span>{getOccupantName(occupant.userId)}</span>
              <button
                type="button"
                onClick={() => removeOccupant(occupant.userId)}
                className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Student Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          Search Students
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {availableStudentsCount} available
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type student name or email (e.g. John Doe, john@example.com)"
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {studentSearchQuery && (
            <button
              type="button"
              onClick={() => setStudentSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {studentSearchQuery && (
          <p className="text-xs text-gray-500 mt-1">
            Showing {displayedUsers.length} of {studentUsers.length} students
          </p>
        )}
      </div>

      {/* Occupants Grid Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
        {displayedUsers.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            {studentSearchQuery
              ? "No students match your search"
              : "No students available to assign"}
            {studentSearchQuery && (
              <button
                type="button"
                onClick={() => setStudentSearchQuery("")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          displayedUsers.map((user) => {
            const isSelected = formData.occupants.some(
              (o) => o.userId === user._id,
            );
            return (
              <button
                key={user._id}
                type="button"
                onClick={() => toggleOccupant(user._id)}
                className={`text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 border-2 ${
                  isSelected
                    ? "bg-blue-100 border-blue-400 shadow-sm"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.fullname?.firstName || ""}{" "}
                    {user.fullname?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user.email} • {user.role || "Student"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="border-t-2 border-gray-200 pt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitLoading}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:shadow-lg transition-all disabled:opacity-70 shadow-md"
      >
        {submitLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <span>{selectedRoom ? "Save Details" : "Create Room"}</span>
        )}
      </button>
    </div>
  </form>
);

const ManageRoom = () => {
  const token = localStorage.getItem("token") || "";
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEditRoom, setExpandedEditRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    block: "",
    floor: "",
    description: "",
    capacity: 1,
    status: "available",
    amenities: [],
    price: 0,
    occupants: [],
    images: [],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewRoom, setViewRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login?from=staff";
      return;
    }
  }, [token]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ROOM_SERVICE_URL}/rooms`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=staff";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${ROOM_SERVICE_URL}/users`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=staff";
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "capacity" || name === "price"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleOccupant = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.occupants.some((o) => o.userId === userId);
      return {
        ...prev,
        occupants: isSelected
          ? prev.occupants.filter((o) => o.userId !== userId)
          : [...prev.occupants, { userId }],
      };
    });
  };

  const removeOccupant = (userId) => {
    setFormData((prev) => ({
      ...prev,
      occupants: prev.occupants.filter((o) => o.userId !== userId),
    }));
  };

  const getOccupantName = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return "Unknown";
    return `${user.fullname?.firstName || ""} ${user.fullname?.lastName || ""}`.trim();
  };

  const studentUsers = users.filter((user) => user.role === "student");
  const displayedUsers = studentUsers.filter((user) =>
    studentSearchQuery === ""
      ? true
      : `${user.fullname?.firstName || ""} ${user.fullname?.lastName || ""} ${user.email || ""}`
          .toLowerCase()
          .includes(studentSearchQuery.toLowerCase()),
  );
  const availableStudentsCount =
    studentUsers.length - formData.occupants.length;

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      block: "",
      floor: "",
      description: "",
      capacity: 1,
      status: "available",
      amenities: [],
      price: 0,
      occupants: [],
      images: [],
    });
    setAmenitiesInput("");
    setImagePreview("");
    setErrorMsg("");
    setStudentSearchQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amenities = amenitiesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      ...formData,
      roomNumber: formData.roomNumber.trim(),
      block: formData.block.trim(),
      floor: formData.floor.trim(),
      description: formData.description.trim(),
      amenities,
    };

    if ((formData.images || []).length > 0 || imagePreview) {
      payload.images = [...(formData.images || [])];
      if (imagePreview && !payload.images.includes(imagePreview)) {
        payload.images.push(imagePreview);
      }
    }

    setSubmitLoading(true);
    setErrorMsg("");

    try {
      if (selectedRoom) {
        await axios.patch(
          `${ROOM_SERVICE_URL}/rooms/${selectedRoom._id}`,
          payload,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post(`${ROOM_SERVICE_URL}/rooms`, payload, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsModalOpen(false);
      setSelectedRoom(null);
      setExpandedEditRoom(null);
      resetForm();
      fetchRooms();
    } catch (err) {
      console.error("Failed to save room:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=staff";
        return;
      }
      const serverMsg =
        err?.response?.data?.error || err?.response?.data?.message;
      setErrorMsg(serverMsg || err.message || "Failed to save room.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${ROOM_SERVICE_URL}/rooms/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login?from=staff";
        return;
      }
      alert(err.response?.data?.message || "Failed to delete room.");
    }
  };

  const handleEdit = (room) => {
    const amenitiesStr = (room.amenities || []).join(", ");
    setAmenitiesInput(amenitiesStr);
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber || "",
      block: room.block || "",
      floor: room.floor || "",
      description: room.description || "",
      capacity: room.capacity || 1,
      status: room.status || "available",
      amenities: room.amenities || [],
      price: room.price || 0,
      occupants: (room.occupants || []).map((o) => ({
        userId: o.user?.id || o.user?._id || o.userId || "",
      })),
      images: room.images || [],
    });
    setImagePreview((room.images && room.images[0]) || "");
    setExpandedEditRoom(room._id);
    setErrorMsg("");
  };

  const handleView = (room) => setViewRoom(room);

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    full: rooms.filter((r) => r.status === "full").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  // Shared props for RoomFormFields
  const sharedFormProps = {
    formData,
    handleInputChange,
    amenitiesInput,
    setAmenitiesInput,
    imagePreview,
    handleImageSelect,
    toggleOccupant,
    removeOccupant,
    getOccupantName,
    displayedUsers,
    studentSearchQuery,
    setStudentSearchQuery,
    studentUsers,
    availableStudentsCount,
    submitLoading,
    selectedRoom,
    handleSubmit,
    errorMsg,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Rooms</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Add, update, or remove hostel rooms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} /> Filter
          </button>
          <button
            onClick={() => {
              resetForm();
              setSelectedRoom(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-900 transition-colors active:scale-95"
          >
            <Plus size={18} /> Add New Room
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "All Rooms", count: stats.total, color: "blue" },
          { label: "Available", count: stats.available, color: "emerald" },
          { label: "Occupied", count: stats.full, color: "indigo" },
          { label: "Maintenance", count: stats.maintenance, color: "orange" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm font-bold text-gray-700 hover:border-blue-200 hover:text-blue-700 transition-colors flex items-center justify-between"
          >
            {stat.label}
            <span
              className={`bg-${stat.color}-50 text-${stat.color}-600 px-2 py-0.5 rounded-md text-xs`}
            >
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-500"
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden p-6">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-500 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              No rooms found matching your search.
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room._id} className="group">
                <div className="min-h-[400px] bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 shadow-md">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={room.images[0]}
                            alt="room"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <Home className="w-10 h-10 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight truncate">
                              Room {room.roomNumber}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Block {room.block || "N/A"} • Floor{" "}
                              {room.floor || "N/A"}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 shadow-sm border ${
                              room.status === "available"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : room.status === "full"
                                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                                  : "bg-orange-100 text-orange-800 border-orange-200"
                            }`}
                          >
                            {room.status.charAt(0).toUpperCase() +
                              room.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
                          {room.description ||
                            "Comfortable room with modern amenities."}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(room.amenities || []).slice(0, 4).map((a, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-200"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{Number(room.price || 0).toLocaleString("en-IN")}
                          </p>
                          <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-xl">
                            {room.occupants?.length || 0}/{room.capacity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-4 flex gap-2">
                    <button
                      onClick={() => handleView(room)}
                      className="flex-1 h-12 text-blue-700 bg-blue-50/80 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 px-4 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> View
                    </button>
                    <button
                      onClick={() => handleEdit(room)}
                      className="flex-1 h-12 text-indigo-700 bg-indigo-50/80 border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 px-4 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-1.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="flex-1 h-12 text-red-700 bg-red-50/80 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 px-4 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Room No
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Block
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Occupants
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-sm text-gray-500"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading rooms...
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-sm text-gray-500"
                  >
                    No rooms found.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr
                    key={room._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={room.images[0]}
                            alt="room"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                            img
                          </div>
                        )}
                        {room.roomNumber}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-600">
                      {room.block || "-"}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-600">
                      {room.capacity}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-lg border uppercase tracking-wider ${
                          room.status === "available"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : room.status === "full"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-orange-50 text-orange-600 border-orange-200"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-600 w-80 truncate">
                      {room.occupants && room.occupants.length > 0
                        ? `${room.occupants.length} / ${room.capacity} occupied`
                        : "Empty"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(room)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD NEW ROOM MODAL ── */}
      {isModalOpen && !selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-5 md:zoom-in-95">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 md:px-8 py-6 flex justify-between items-center z-10 shadow-lg">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Add New Room
                </h1>
                <p className="text-blue-100 text-sm md:text-base mt-1">
                  Fill in the details to create a new hostel room
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}
              <RoomFormFields
                {...sharedFormProps}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedRoom(null);
                  resetForm();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW DETAILS MODAL ── */}
      {viewRoom && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-5 md:zoom-in-95">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 md:px-8 py-6 flex justify-between items-center z-10 shadow-lg">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Room {viewRoom.roomNumber}
                </h1>
                <p className="text-blue-100 text-sm md:text-base mt-1">
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

            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              {viewRoom.images && viewRoom.images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Room Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Home size={20} className="text-blue-700" />
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
                      className={`inline-block w-2 h-2 rounded-full ${viewRoom.status === "available" ? "bg-emerald-500" : viewRoom.status === "full" ? "bg-indigo-500" : "bg-orange-500"}`}
                    />
                    <span
                      className={`text-sm font-semibold ${viewRoom.status === "available" ? "text-emerald-600" : viewRoom.status === "full" ? "text-indigo-600" : "text-orange-600"}`}
                    >
                      {viewRoom.status === "available"
                        ? "Available for booking"
                        : viewRoom.status === "full"
                          ? "Fully Occupied"
                          : "Under Maintenance"}
                    </span>
                  </div>
                </div>

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
                    Current Occupants:{" "}
                    <span className="font-bold text-gray-900">
                      {viewRoom.occupants?.length || 0}
                    </span>
                  </p>
                </div>

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
              </div>

              {viewRoom.amenities && viewRoom.amenities.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Wifi size={20} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Amenities
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {viewRoom.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full font-semibold text-sm border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              {viewRoom.occupants && viewRoom.occupants.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Current Occupants
                  </h3>
                  <div className="space-y-3">
                    {viewRoom.occupants.map((occupant, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {occupant.user?.fullname?.firstName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {occupant.user?.fullname?.firstName || ""}{" "}
                            {occupant.user?.fullname?.lastName || ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            {occupant.user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-4 flex justify-end gap-3">
              <button
                onClick={() => setViewRoom(null)}
                className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(viewRoom);
                  setViewRoom(null);
                }}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
              >
                Edit Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT ROOM MODAL ── */}
      {selectedRoom && expandedEditRoom && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-5 md:zoom-in-95">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 md:px-8 py-6 flex justify-between items-center z-10 shadow-lg">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Edit Room {selectedRoom.roomNumber}
                </h1>
                <p className="text-blue-100 text-sm md:text-base mt-1">
                  Update room details and occupants
                </p>
              </div>
              <button
                onClick={() => {
                  setExpandedEditRoom(null);
                  setSelectedRoom(null);
                  resetForm();
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}
              <RoomFormFields
                {...sharedFormProps}
                onCancel={() => {
                  setExpandedEditRoom(null);
                  setSelectedRoom(null);
                  resetForm();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoom;