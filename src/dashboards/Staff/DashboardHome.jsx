import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Users,
  DoorOpen,
  HardHat,
  FileCheck,
  CheckCircle2,
  XCircle,
  Info,
  X,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";
import { staffRoomApi, complaintApi } from "../../lib/api.js";

const TOAST_TYPES = {
  success: {
    icon: CheckCircle2,
    bar: "bg-emerald-500",
    iconClass: "text-emerald-500",
    bg: "bg-white",
    border: "border-emerald-100",
  },
  error: {
    icon: XCircle,
    bar: "bg-rose-500",
    iconClass: "text-rose-500",
    bg: "bg-white",
    border: "border-rose-100",
  },
  info: {
    icon: Info,
    bar: "bg-blue-500",
    iconClass: "text-blue-500",
    bg: "bg-white",
    border: "border-blue-100",
  },
  loading: {
    icon: Loader2,
    bar: "bg-amber-400",
    iconClass: "text-amber-500 animate-spin",
    bg: "bg-white",
    border: "border-amber-100",
  },
};

const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
    {toasts.map((t) => {
      const cfg = TOAST_TYPES[t.type] || TOAST_TYPES.info;
      const Icon = cfg.icon;
      return (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-sm rounded-xl border shadow-xl ${cfg.bg} ${cfg.border} overflow-hidden animate-slide-in`}
        >
          <div
            className={`w-1 self-stretch flex-shrink-0 ${cfg.bar} rounded-l-xl`}
          />
          <div className="flex items-start gap-3 py-3 pr-4 w-full">
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.iconClass}`} />
            <div className="flex-1">
              {t.title && (
                <p className="text-sm font-semibold text-gray-900">{t.title}</p>
              )}
              <p className="text-sm text-gray-600 leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 mt-0.5 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const addToast = ({ type = "info", title, message, duration = 4000 }) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
    return id;
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, addToast, removeToast };
};

const typeStyles = {
  general: {
    card: "bg-[#F5F8FF] border-blue-100",
    title: "text-blue-700",
    progress: "bg-blue-500",
    progressBg: "bg-blue-200",
  },
  event: {
    card: "bg-[#FFF7ED] border-orange-100",
    title: "text-orange-700",
    progress: "bg-orange-500",
    progressBg: "bg-orange-200",
  },
  maintenance: {
    card: "bg-[#FDF2F8] border-pink-100",
    title: "text-pink-700",
    progress: "bg-pink-500",
    progressBg: "bg-pink-200",
  },
  academic: {
    card: "bg-[#ECFDF5] border-emerald-100",
    title: "text-emerald-700",
    progress: "bg-emerald-500",
    progressBg: "bg-emerald-200",
  },
  default: {
    card: "bg-gray-50 border-gray-100",
    title: "text-gray-700",
    progress: "bg-gray-500",
    progressBg: "bg-gray-200",
  },
};

const DashboardHome = () => {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    availableRooms: 0,
    activeComplaints: 0,
    newApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "general",
    description: "",
    relevancePercentage: 0,
  });
  const [formError, setFormError] = useState("");
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [editingForm, setEditingForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);
  const { toasts, addToast, removeToast } = useToast();


  const typeOptions = ["general", "event", "maintenance", "academic"];

  useEffect(() => {
    const fetchNotices = async () => {
      setLoadingNotices(true);
      try {
        const res = await staffRoomApi.get("/notices?limit=10");
        setNotices(res.data?.notices ?? []);
      } catch (err) {
        console.error("Failed to load notices", err);
        addToast({
          type: "error",
          title: "Notice load failed",
          message: "Could not fetch notices",
        });
      } finally {
        setLoadingNotices(false);
      }
    };

    async function fetchStats() {
      setLoading(true);
      setError(null);
      setLoadingActivities(true);
      setActivitiesError(null);

      try {
        const [roomStatsResp, complaintStatsResp, activitiesResp] = await Promise.all([
          staffRoomApi.get("/stats"),
          complaintApi.get("/staff/complaints/stats"),
          staffRoomApi.get("/activities"),
        ]);

        const roomStats = roomStatsResp?.data ?? {};
        const complaintStats = complaintStatsResp?.data ?? {};

        setStatsData({
          totalStudents: roomStats.totalStudents ?? 0,
          availableRooms: roomStats.availableRooms ?? 0,
          newApplications: roomStats.newApplications ?? 0,
          activeComplaints: complaintStats.activeComplaints ?? 0,
        });

        setActivities(activitiesResp.data?.activities ?? []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        if (err.response?.status !== 404) {
          setError("Unable to load dashboard data. Please refresh.");
        }
        setActivitiesError(err.response?.data?.message || "Failed to load activities");
      } finally {
        setLoading(false);
        setLoadingActivities(false);
      }
    }


    fetchStats();
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required");
      return;
    }

    if (
      Number(form.relevancePercentage) < 0 ||
      Number(form.relevancePercentage) > 100
    ) {
      setFormError("Relevance percentage must be between 0 and 100");
      return;
    }

    try {
      const res = await staffRoomApi.post("/notices", {
        title: form.title.trim(),
        type: form.type,
        description: form.description.trim(),
        relevancePercentage: Number(form.relevancePercentage),
      });
      addToast({
        type: "success",
        title: "Notice created",
        message: "Notice was successfully published",
      });
      setForm({
        title: "",
        type: "general",
        description: "",
        relevancePercentage: 0,
      });
      setShowForm(false);
      if (res.data?.notice) {
        setNotices((prev) => [res.data.notice, ...prev]);
      }
    } catch (err) {
      console.error("Create notice error", err);
      const message = err.response?.data?.message || "Could not create notice";
      addToast({ type: "error", title: "Create failed", message });
    }
  };

  const handleEditNotice = async (noticeId) => {
    const formData = editingForm[noticeId];
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Title and description are required",
      });
      return;
    }
    if (
      Number(formData.relevancePercentage) < 0 ||
      Number(formData.relevancePercentage) > 100
    ) {
      addToast({
        type: "error",
        title: "Validation Error",
        message: "Relevance must be 0-100",
      });
      return;
    }

    try {
      const res = await staffRoomApi.put(`/notices/${noticeId}`, formData);
      addToast({
        type: "success",
        title: "Updated",
        message: "Notice updated successfully",
      });
      setNotices((prev) =>
        prev.map((n) => (n._id === noticeId ? res.data.notice : n)),
      );
      setEditingNoticeId(null);
      setEditingForm({});
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update notice";
      addToast({ type: "error", title: "Update failed", message });
    }
  };

  const handleDeleteNotice = async () => {
    const noticeId = deleteNoticeId;
    try {
      await staffRoomApi.delete(`/notices/${noticeId}`);
      addToast({
        type: "success",
        title: "Deleted",
        message: "Notice deleted successfully",
      });
      setNotices((prev) => prev.filter((n) => n._id !== noticeId));
      setShowDeleteConfirm(false);
      setDeleteNoticeId(null);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete notice";
      addToast({ type: "error", title: "Delete failed", message });
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: loading ? "..." : statsData.totalStudents,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Available Rooms",
      value: loading ? "..." : statsData.availableRooms,
      icon: DoorOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
    {
      title: "Active Complaints",
      value: loading ? "..." : statsData.activeComplaints,
      icon: HardHat,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      title: "New Applications",
      value: loading ? "..." : statsData.newApplications,
      icon: FileCheck,
      color: "text-violet-500",
      bg: "bg-violet-100",
    },
  ];

  const formattedNotices = useMemo(
    () =>
      (notices || []).map((notice) => ({
        ...notice,
        createdAtFormatted: new Date(notice.createdAt).toLocaleString(),
        typeStyle: typeStyles[notice.type] || typeStyles.default,
      })),
    [notices],
  );

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-gray-500">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Recent Activities
          </h3>
          <div className="space-y-6">
            {loadingActivities ? (
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading activities...</span>
              </div>
            ) : activitiesError ? (
              <p className="text-sm text-orange-600">{activitiesError}</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No recent activities</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full bg-${activity.iconColor}-50 flex items-center justify-center shrink-0`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-${activity.iconColor}-500`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-400 font-bold uppercase mt-2 block">
                      {new Date(activity.timestamp).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] text-gray-900 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <h3 className="text-xl font-bold mb-2">Notice Board Update</h3>
          <p className="text-gray-500 text-sm mb-6">
            Publish new notices and announcements for all students.
          </p>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#FFB800] text-[#1E3A8A] px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              + Create Notice
            </button>
          ) : (
            <form
              onSubmit={handleCreateNotice}
              className="space-y-4 bg-white p-4 rounded-xl border border-gray-200 shadow-inner"
            >
              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter notice title"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter notice description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Relevance %
                </label>
                <input
                  type="number"
                  value={form.relevancePercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "relevancePercentage",
                      Number(e.target.value),
                    )
                  }
                  min={0}
                  max={100}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="w-full py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save Notice
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold mb-4">
                Latest Published Notices
              </h4>
              {formattedNotices.length > 3 ? (
                <button
                  onClick={() => setShowAllNotices(true)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                >
                  View All
                </button>
              ) : null}
            </div>
            {loadingNotices ? (
              <p className="text-sm text-gray-500">Loading notices...</p>
            ) : formattedNotices.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notices yet. Create your first notice.
              </p>
            ) : (
              <div className="space-y-4">
                {formattedNotices.slice(0, 3).map((notice, idx) => {
                  const style = notice.typeStyle;
                  const isEditing = editingNoticeId === notice._id;
                  return (
                    <div
                      key={notice._id || idx}
                      className={`border ${style.card} rounded-2xl p-4 relative hover:shadow-lg transition-all group ${isEditing ? "ring-2 ring-blue-300 ring-opacity-50" : ""}`}
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingForm[notice._id]?.title || ""}
                            onChange={(e) =>
                              setEditingForm((prev) => ({
                                ...prev,
                                [notice._id]: {
                                  ...(prev[notice._id] || {}),
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                            placeholder="Title"
                          />
                          <select
                            value={editingForm[notice._id]?.type || notice.type}
                            onChange={(e) =>
                              setEditingForm((prev) => ({
                                ...prev,
                                [notice._id]: {
                                  ...(prev[notice._id] || {}),
                                  type: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {typeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </option>
                            ))}
                          </select>
                          <textarea
                            rows={2}
                            value={editingForm[notice._id]?.description || ""}
                            onChange={(e) =>
                              setEditingForm((prev) => ({
                                ...prev,
                                [notice._id]: {
                                  ...(prev[notice._id] || {}),
                                  description: e.target.value,
                                },
                              }))
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Description"
                          />
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                editingForm[notice._id]?.relevancePercentage ||
                                notice.relevancePercentage ||
                                0
                              }
                              onChange={(e) =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  [notice._id]: {
                                    ...(prev[notice._id] || {}),
                                    relevancePercentage: Number(e.target.value),
                                  },
                                }))
                              }
                              className="w-20 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">%</span>
                            <div className="flex gap-1 ml-auto">
                              <button
                                onClick={() => handleEditNotice(notice._id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNoticeId(null);
                                  setEditingForm((prev) => {
                                    const newForm = { ...prev };
                                    delete newForm[notice._id];
                                    return newForm;
                                  });
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`font-bold ${style.title} truncate`}
                              >
                                {notice.title}
                              </h5>
                              <p className="text-xs text-gray-500 truncate">
                                {notice.createdAtFormatted}
                              </p>
                            </div>
                            <span className="text-[11px] font-bold uppercase text-gray-500 ml-2 whitespace-nowrap flex-shrink-0">
                              {notice.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                            {notice.description}
                          </p>
                          <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200">
                            <div
                              className={`${style.progress} h-full transition-all duration-300`}
                              style={{
                                width: `${Math.min(100, Math.max(0, notice.relevancePercentage || 0))}%`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-gray-500">
                              Relevance: {notice.relevancePercentage}%
                            </span>
                            <div className="flex gap-1 opacity-100 transition-all p-1 -m-1">
                              <button
                                onClick={() => {
                                  setEditingNoticeId(notice._id);
                                  setEditingForm((prev) => ({
                                    ...prev,
                                    [notice._id]: {
                                      title: notice.title,
                                      type: notice.type,
                                      description: notice.description,
                                      relevancePercentage:
                                        notice.relevancePercentage || 0,
                                    },
                                  }));
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteNoticeId(notice._id);
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-105"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {showAllNotices && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                      onClick={() => setShowAllNotices(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-10 overflow-y-auto bg-black/40 backdrop-blur-sm">
                      <div className="bg-white rounded-3xl max-w-7xl min-h-[90vh] w-full mx-4 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-900">
                            All Published Notices
                          </h3>
                          <button
                            onClick={() => setShowAllNotices(false)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
                          {formattedNotices.map((notice, idx) => {
                            const style = notice.typeStyle;
                            const isEditing = editingNoticeId === notice._id;
                            return (
                              <div
                                key={notice._id || idx}
                                className={`border ${style.card} rounded-2xl p-4 hover:shadow-lg transition-all group ${isEditing ? "ring-2 ring-blue-300 ring-opacity-50" : ""}`}
                              >
                                {isEditing ? (
                                  <div className="space-y-3">
                                    <input
                                      type="text"
                                      value={
                                        editingForm[notice._id]?.title || ""
                                      }
                                      onChange={(e) =>
                                        setEditingForm((prev) => ({
                                          ...prev,
                                          [notice._id]: {
                                            ...(prev[notice._id] || {}),
                                            title: e.target.value,
                                          },
                                        }))
                                      }
                                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                                      placeholder="Title"
                                    />
                                    <select
                                      value={
                                        editingForm[notice._id]?.type ||
                                        notice.type
                                      }
                                      onChange={(e) =>
                                        setEditingForm((prev) => ({
                                          ...prev,
                                          [notice._id]: {
                                            ...(prev[notice._id] || {}),
                                            type: e.target.value,
                                          },
                                        }))
                                      }
                                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                      {typeOptions.map((t) => (
                                        <option key={t} value={t}>
                                          {t.charAt(0).toUpperCase() +
                                            t.slice(1)}
                                        </option>
                                      ))}
                                    </select>
                                    <textarea
                                      rows={3}
                                      value={
                                        editingForm[notice._id]?.description ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setEditingForm((prev) => ({
                                          ...prev,
                                          [notice._id]: {
                                            ...(prev[notice._id] || {}),
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                      placeholder="Description"
                                    />
                                    <div className="flex gap-2 items-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                          editingForm[notice._id]
                                            ?.relevancePercentage ||
                                          notice.relevancePercentage ||
                                          0
                                        }
                                        onChange={(e) =>
                                          setEditingForm((prev) => ({
                                            ...prev,
                                            [notice._id]: {
                                              ...(prev[notice._id] || {}),
                                              relevancePercentage: Number(
                                                e.target.value,
                                              ),
                                            },
                                          }))
                                        }
                                        className="w-20 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                      />
                                      <span className="text-sm text-gray-500">
                                        %
                                      </span>
                                      <div className="flex gap-1 ml-auto">
                                        <button
                                          onClick={() =>
                                            handleEditNotice(notice._id)
                                          }
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                          <CheckCircle2 size={18} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingNoticeId(null);
                                            setEditingForm((prev) => {
                                              const newForm = { ...prev };
                                              delete newForm[notice._id];
                                              return newForm;
                                            });
                                          }}
                                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                          <X size={18} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h5
                                          className={`font-bold ${style.title} text-lg truncate`}
                                        >
                                          {notice.title}
                                        </h5>
                                        <p className="text-sm text-gray-500 truncate">
                                          {notice.createdAtFormatted}
                                        </p>
                                      </div>
                                      <span className="text-xs font-bold uppercase text-gray-500 px-2 py-1 bg-gray-100 rounded-full ml-2 whitespace-nowrap flex-shrink-0">
                                        {notice.type}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 mb-3 line-clamp-3 leading-relaxed">
                                      {notice.description}
                                    </p>
                                    <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                                      <div
                                        className={`${style.progress} h-full transition-all duration-300`}
                                        style={{
                                          width: `${Math.min(100, Math.max(0, notice.relevancePercentage || 0))}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500">
                                        Relevance: {notice.relevancePercentage}%
                                      </span>
                                      <div className="flex gap-1 opacity-100 transition-all p-1 -m-1">
                                        <button
                                          onClick={() => {
                                            setEditingNoticeId(notice._id);
                                            setEditingForm((prev) => ({
                                              ...prev,
                                              [notice._id]: {
                                                title: notice.title,
                                                type: notice.type,
                                                description: notice.description,
                                                relevancePercentage:
                                                  notice.relevancePercentage ||
                                                  0,
                                              },
                                            }));
                                          }}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                                          title="Edit"
                                        >
                                          <Edit3 size={16} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setDeleteNoticeId(notice._id);
                                            setShowDeleteConfirm(true);
                                          }}
                                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-105"
                                          title="Delete"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {formattedNotices.length === 0 && (
                            <p className="text-center text-gray-500 py-8">
                              No notices available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteNoticeId(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-rose-50 to-red-50 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Delete Notice
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this notice? All data will be
                  permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteNoticeId(null);
                    }}
                    className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteNotice}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
