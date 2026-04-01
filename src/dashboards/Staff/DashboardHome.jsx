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
  const { toasts, addToast, removeToast } = useToast();

  const typeOptions = ["general", "event", "maintenance", "academic"];

  useEffect(() => {
    const fetchNotices = async () => {
      setLoadingNotices(true);
      try {
        const res = await staffRoomApi.get("/notices?limit=8");
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

      try {
        const [roomStatsResp, complaintStatsResp] = await Promise.all([
          staffRoomApi.get("/stats"),
          complaintApi.get("/staff/complaints/stats"),
        ]);

        const roomStats = roomStatsResp?.data ?? {};
        const complaintStats = complaintStatsResp?.data ?? {};

        setStatsData({
          totalStudents: roomStats.totalStudents ?? 0,
          availableRooms: roomStats.availableRooms ?? 0,
          newApplications: roomStats.newApplications ?? 0,
          activeComplaints: complaintStats.activeComplaints ?? 0,
        });
      } catch (err) {
        console.error("Error fetching staff dashboard stats", err);
        setError("Unable to load dashboard stats. Please refresh.");
      } finally {
        setLoading(false);
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Welcome back, Staff member! Here is today's summary.
          </p>
        </div>
        <button className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm">
          Generate Report
        </button>
      </div>

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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Student Room Assignment
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Room 304 assigned to Rahul Khanna.
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">
                    2 hours ago
                  </span>
                </div>
              </div>
            ))}
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
            <h4 className="text-lg font-semibold mb-4">
              Latest Published Notices
            </h4>
            {loadingNotices ? (
              <p className="text-sm text-gray-500">Loading notices...</p>
            ) : formattedNotices.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notices yet. Create your first notice.
              </p>
            ) : (
              <div className="space-y-4">
                {formattedNotices.slice(0, 4).map((notice, idx) => {
                  const style = notice.typeStyle;
                  return (
                    <div
                      key={idx}
                      className={`border ${style.card} rounded-2xl p-3`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h5 className={`font-bold ${style.title}`}>
                            {notice.title}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {notice.createdAtFormatted}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold uppercase text-gray-500">
                          {notice.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {notice.description}
                      </p>
                      <div className="h-2 w-full rounded-full overflow-hidden">
                        <div
                          className={`${style.progress} h-full`}
                          style={{
                            width: `${Math.min(100, Math.max(0, notice.relevancePercentage || 0))}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Relevance: {notice.relevancePercentage}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
