import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Edit, Trash2, X, Loader2, Eye } from "lucide-react";
import axios from "axios";

const ROOM_SERVICE_URL = "http://localhost:3002/api/staff";

const ManageRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewRoom, setViewRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ROOM_SERVICE_URL}/rooms`, {
        withCredentials: true,
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${ROOM_SERVICE_URL}/users`, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        ...formData,
        images: [...(formData.images || [])],
        occupants: formData.occupants,
      };

      if (imagePreview) {
        payload.images.push(imagePreview);
      }

      if (selectedRoom) {
        // Update existing room
        await axios.patch(`${ROOM_SERVICE_URL}/rooms/${selectedRoom._id}`, payload, { withCredentials: true });
      } else {
        // Create new room
        await axios.post(`${ROOM_SERVICE_URL}/rooms`, payload, { withCredentials: true });
      }

      setIsModalOpen(false);
      setSelectedRoom(null);
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
      setImageFile(null);
      setImagePreview("");
      fetchRooms();
    } catch (err) {
      console.error("Failed to save room:", err);
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setErrorMsg(serverMsg || err.message || "Failed to save room.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${ROOM_SERVICE_URL}/rooms/${id}`, { withCredentials: true });
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert(err.response?.data?.message || "Failed to delete room.");
    }
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      description: room.description,
      capacity: room.capacity,
      status: room.status,
      amenities: room.amenities,
      price: room.price,
      occupants: room.occupants.map(o => ({ userId: o.user._id })),
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleView = (room) => {
    setViewRoom(room);
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    full: rooms.filter((r) => r.status === "full").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
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
            onClick={() => setIsModalOpen(true)}
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
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#FFB800]/20 focus:border-[#FFB800] outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
                    <td className="py-4 px-6 text-sm font-medium text-gray-600 w-48 truncate">
                      {room.occupants && room.occupants.length > 0
                        ? `${room.occupants.length} / ${room.capacity}`
                        : "Empty"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
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

      {/* Add New Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Create New Room
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">
                      Room Number*
                    </label>
                    <input
                      required
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="E.g. A-101"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">
                      Capacity*
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">
                      Block
                    </label>
                    <input
                      type="text"
                      name="block"
                      value={formData.block}
                      onChange={handleInputChange}
                      placeholder="E.g. Block A"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">
                      Floor
                    </label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      placeholder="E.g. Ground"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
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
                  {/* Occupants Multi-select */}
                  <select
                    multiple
                    name="occupants"
                    value={formData.occupants.map(o => o.userId)}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(opt => ({ userId: opt.value }));
                      setFormData(prev => ({ ...prev, occupants: selected }));
                    }}
                    className="w-full mt-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium"
                  >
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.fullname?.firstName || ''} {u.fullname?.lastName || ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Amenities
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={(formData.amenities || []).join(", ")}
                    onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                    placeholder="E.g. AC, TV, Attach Bath (comma separated)"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                  />
                  {/* Price Input */}

                   <label className="text-sm font-bold text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price (INR)"
                    className="w-full mt-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add specific details..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
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

                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        Selected Image Preview
                      </p>
                      <div className="w-28 h-28 rounded-xl border border-gray-200 mt-2 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {formData.images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {formData.images.map((img, i) => (
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

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#1E3A8A] rounded-xl hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {submitLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save Room"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Room Details</h3>
              <button
                onClick={() => setViewRoom(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p><strong>Room Number:</strong> {viewRoom.roomNumber}</p>
              <p><strong>Block:</strong> {viewRoom.block}</p>
              <p><strong>Floor:</strong> {viewRoom.floor}</p>
              <p><strong>Capacity:</strong> {viewRoom.capacity}</p>
              <p><strong>Status:</strong> {viewRoom.status}</p>
              <p><strong>Price (INR):</strong> {viewRoom.price}</p>
              <p><strong>Amenities:</strong> {(viewRoom.amenities || []).join(', ')}</p>
              <p><strong>Occupants:</strong> {(viewRoom.occupants || []).map(o => o.user.fullname?.firstName + ' ' + o.user.fullname?.lastName).join(', ') || 'None'}</p>
              <p><strong>Description:</strong> {viewRoom.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoom;
