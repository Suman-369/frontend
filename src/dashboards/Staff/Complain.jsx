import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi, complaintApi } from "../../lib/api";
import {
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit3,
  Trash2,
  RefreshCw,
  XCircle,
} from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-600 border-orange-200";
    case "in_progress":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "resolved":
      return "bg-emerald-100 text-emerald-600 border-emerald-200";
    case "rejected":
      return "bg-red-100 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-orange-600 bg-orange-50";
    case "low":
      return "text-blue-600 bg-blue-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getCategoryLabel = (category) => {
  const labels = {
    room: "Room Maintenance",
    service: "Service",
    facility: "Facility",
    other: "Other",
  };
  return labels[category] || category;
};

const Complain = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({
    show: false,
    complaintId: null,
  });
  const [actionData, setActionData] = useState({ status: "", staffNote: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, roomsRes] = await Promise.all([
        complaintApi.get(
          `/staff/complaints${filterStatus === "all" ? "" : `?status=${filterStatus}`}`,
        ),
        roomApi.get("/rooms"),
      ]);
      setComplaints(complaintsRes.data.complaints || []);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch complaints. Check your connection and auth.",
      );
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setError(null);
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    setError(null);
    fetchData();
  }, [filterStatus]);

  const getStudentRoom = (studentId) => {
    for (const room of rooms) {
      const occupant = room.occupants.find((o) => o.user.id === studentId);
      if (occupant) return room.roomNumber;
    }
    return "N/A";
  };

  const getStudentName = (student) => {
    if (student.fullname) {
      return (
        `${student.fullname.firstName || ""} ${student.fullname.lastName || ""}`.trim() ||
        student.email
      );
    }
    return student.email || "Unknown";
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await complaintApi.patch(
        `/staff/complaints/${actionModal.complaintId}/action`,
        actionData,
      );
      setActionModal({ show: false, complaintId: null });
      fetchData();
    } catch (err) {
      console.error("Failed to update complaint:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((comp) => {
    const studentName = getStudentName(comp.student).toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      studentName.includes(search) ||
      comp.title.toLowerCase().includes(search) ||
      comp.description.toLowerCase().includes(search)
    );
  });

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading complaints data... please wait.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Complaints Management
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Handle and track student issues
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setError(null);
            }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            title="Refresh data"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-200 mb-6">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900 mb-1">
                Failed to load complaints
              </p>
              <p className="text-sm text-red-800 mb-3">{error}</p>
            </div>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </>
            )}
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, room, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    {error
                      ? "Error loading data. Please refresh."
                      : "No complaints matching your filters. Have students submit complaints via their dashboard, then refresh."}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((comp) => (
                  <tr
                    key={comp.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900">
                        {getStudentName(comp.student)}
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        Room: {getStudentRoom(comp.studentId)}
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        {comp.student?.email || "N/A"}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900">
                        {getCategoryLabel(comp.category)}
                      </p>
                      <p
                        className="text-xs font-medium text-gray-500 truncate max-w-50"
                        title={comp.description}
                      >
                        {comp.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPriorityColor(comp.priority)}`}
                      >
                        {comp.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg border ${getStatusColor(comp.status)} flex items-center justify-center w-max gap-1 mb-1`}
                      >
                        {comp.status === "resolved" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {(comp.status === "pending" ||
                          comp.status === "in_progress") && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {comp.status.replace("_", " ").toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-500 italic truncate max-w-37.5">
                        {comp.staffNote || "No note"}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/staff/complaints/${comp.id}`)}
                        className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          setActionModal({ show: true, complaintId: comp.id })
                        }
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                        title="Update Status"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this complaint? This action cannot be undone.",
                            )
                          ) {
                            try {
                              await complaintApi.delete(
                                `/staff/complaints/${comp.id}`,
                              );
                              fetchData();
                            } catch (err) {
                              console.error("Delete failed:", err);
                              alert("Failed to delete complaint");
                            }
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 ml-1"
                        title="Delete Complaint"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Complaint Status
            </h3>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={actionData.status}
                  onChange={(e) =>
                    setActionData({ ...actionData, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Staff Note (Optional)
                </label>
                <textarea
                  rows="4"
                  value={actionData.staffNote}
                  onChange={(e) =>
                    setActionData({ ...actionData, staffNote: e.target.value })
                  }
                  placeholder="Add notes for this update..."
                  className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-vertical"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setActionModal({ show: false, complaintId: null })
                  }
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complain;
