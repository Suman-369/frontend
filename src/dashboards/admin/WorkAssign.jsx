import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  X,
  Search,
  UserPlus,
  Trash2,
  Edit3,
  Loader2,
} from "lucide-react";
import { authApi, reportApi } from "../../lib/api";
const AdminWorkAssign = () => {
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    staffId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (staffList.length > 0) {
      fetchTasks();
    }
  }, [staffList.length]);

  const fetchStaff = async () => {
    try {
      setStaffLoading(true);
      const res = await authApi.get("/users?role=staff");
      setStaffList(res.data.users || []);
    } catch (err) {
      console.error("Fetch staff error", err);
    } finally {
      setStaffLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await reportApi.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.staffId ||
      !formData.deadline
    ) {
      return alert("Please fill all fields");
    }

    try {
      if (editingId) {
        await reportApi.patch(`/tasks/${editingId}`, formData);
      } else {
        await reportApi.post("/tasks", formData);
      }
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        deadline: "",
        staffId: "",
      });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error("Submit error", err);
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this task?")) {
      try {
        await reportApi.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const getStaffName = (staffId) => {
    if (!staffId) return "Unassigned";
    
    console.log('getStaffName input:', staffId, 'type:', typeof staffId);
    console.log('staffList length:', staffList.length, staffList.slice(0,2)); // sample
    
    // Case 1: Already has populated name
    if (typeof staffId === 'object' && staffId?.name) {
      return staffId.name;
    }
    
    // Case 2: Has fullname object
    if (typeof staffId === 'object' && staffId?.fullname) {
      return `${staffId.fullname.firstName || ''} ${staffId.fullname.lastName || ''}`.trim() || 'Unknown';
    }
    
    // Case 3: Extract and lookup ID
    const id = String(staffId?._id || staffId?.id || staffId).trim();
    console.log('Extracted ID:', id);
    
    if (!staffList.length) {
      return `Loading staff... (ID: ${id})`;
    }
    
    const matched = staffList.find((s) => String(s._id).trim() === id);
    if (matched?.fullname) {
      return `${matched.fullname.firstName} ${matched.fullname.lastName}`.trim();
    }
    
    console.warn('Staff not found:', { id, staffListLength: staffList.length });
    return `ID: ${id}`;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = tab === "all" || task.status === tab;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Assignments</h1>
          <p className="text-gray-500 mt-1">
            Create tasks and assign to staff members
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          New Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "pending", "in-progress", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setTab(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === status
                    ? "bg-[#1E3A8A] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status
                      .replace("-", " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
                    <span className="text-gray-500">Loading tasks...</span>
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No tasks match your filters
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or status filter
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-xs truncate">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 max-w-md truncate">
                      {task.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {getStaffName(task.staffId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "No deadline"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          task.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {task.status?.replace("-", " ").toUpperCase() ||
                          "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(task._id);
                          setFormData({
                            title: task.title,
                            description: task.description,
                            priority: task.priority || "medium",
                            deadline: task.deadline
                              ? task.deadline.split("T")[0]
                              : "",
                            staffId: task.staffId?._id || task.staffId || "",
                          });
                          setShowModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              setShowModal(false);
              setEditingId(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 lg:mx-auto max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Task" : "New Assignment"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-vertical"
                        required
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assign To
                      </label>
                      <select
                        value={formData.staffId}
                        onChange={(e) =>
                          setFormData({ ...formData, staffId: e.target.value })
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                        required
                      >
                        <option value="">Select Staff</option>
                        {staffList.length > 0 ? (
                          staffList.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                              {staff.fullname.firstName +
                                " " +
                                staff.fullname.lastName}{" "}
                              ({staff.email})
                            </option>
                          ))
                        ) : (
                          <option disabled>No staff available</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setFormData({
                        title: "",
                        description: "",
                        priority: "medium",
                        deadline: "",
                        staffId: "",
                      });
                    }}
                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingId ? "Update Task" : "Create Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminWorkAssign;