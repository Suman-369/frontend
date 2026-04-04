import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Loader2,
  ClipboardList,
  Play,
  Check,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import { reportApi } from "../../lib/api.js";

/* ─── Priority helpers ─── */
const PRIORITY_META = {
  high:   { label: "HIGH",   dot: "bg-red-500",    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",    Icon: ChevronUp },
  medium: { label: "MEDIUM", dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", Icon: Minus },
  low:    { label: "LOW",    dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", Icon: ChevronDown },
};

const STATUS_META = {
  pending:     { label: "Pending",     cls: "bg-orange-50 text-orange-700 ring-1 ring-orange-200" },
  "in-progress": { label: "In Progress", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  completed:   { label: "Completed",   cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const isOverdue = (t) =>
  t.status === "pending" && new Date(t.deadline) < new Date();

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, iconCls, value, label, accent, alert }) => (
  <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${accent} flex-1 min-w-0 relative`}>
    {alert && (
      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
    )}
    <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconCls}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Main Component ─── */
const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [sortField, setSortField] = useState("deadline");
  const [sortDir, setSortDir] = useState("asc");
  const navigate = useNavigate();

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter(isOverdue).length,
  };

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await reportApi.get("/tasks/staff");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await reportApi.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("Update status error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const sorted = [...tasks].sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === "deadline") { av = new Date(av); bv = new Date(bv); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) =>
    sortField !== field ? (
      <span className="opacity-30 ml-1 text-xs">↕</span>
    ) : sortDir === "asc" ? (
      <span className="ml-1 text-xs text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-xs text-blue-600">↓</span>
    );

  /* Loading skeleton */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-xl">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <p className="text-sm font-semibold text-gray-500 tracking-wide">Loading your tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/staff")}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-sm font-semibold shadow-none hover:shadow-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <div className="w-px h-8 bg-gray-200" />

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                My Assigned Tasks
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">Tasks assigned to you by admin</p>
            </div>
          </div>

          <button
            onClick={fetchTasks}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Stats Bar (single compact row) ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <StatCard
            icon={ListTodo}
            iconCls="bg-blue-100 text-blue-600"
            value={stats.total}
            label="Total Tasks"
            accent="bg-white border-gray-200"
          />
          <StatCard
            icon={Clock}
            iconCls="bg-orange-100 text-orange-600"
            value={stats.pending}
            label="Pending"
            accent="bg-white border-gray-200"
          />
          <StatCard
            icon={AlertTriangle}
            iconCls="bg-red-100 text-red-600"
            value={stats.overdue}
            label="Overdue"
            accent="bg-white border-gray-200"
            alert={stats.overdue > 0}
          />
          <StatCard
            icon={CheckCircle2}
            iconCls="bg-emerald-100 text-emerald-600"
            value={tasks.filter((t) => t.status === "completed").length}
            label="Completed"
            accent="bg-white border-gray-200"
          />
        </div>

        {/* ── Tasks Table ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">Active Tasks</h2>
              <p className="text-xs text-gray-400 mt-0.5">Click a status button to update progress</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-24 px-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks assigned yet</h3>
              <p className="text-gray-500 text-sm mb-6">You'll see your tasks here once an admin assigns them.</p>
              <button
                onClick={fetchTasks}
                className="px-5 py-2 bg-[#1E3A8A] text-white rounded-xl font-semibold text-sm hover:bg-[#1e40af] transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th
                      className="text-left px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort("title")}
                    >
                      Task <SortIcon field="title" />
                    </th>
                    <th
                      className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort("priority")}
                    >
                      Priority <SortIcon field="priority" />
                    </th>
                    <th
                      className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort("deadline")}
                    >
                      Due Date <SortIcon field="deadline" />
                    </th>
                    <th
                      className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-800 transition-colors whitespace-nowrap"
                      onClick={() => toggleSort("status")}
                    >
                      Status <SortIcon field="status" />
                    </th>
                    <th className="text-right px-6 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {sorted.map((task, i) => {
                    const pMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                    const sMeta = STATUS_META[task.status] || { label: task.status, cls: "bg-gray-100 text-gray-600" };
                    const overdue = isOverdue(task);
                    const PIcon = pMeta.Icon;

                    return (
                      <tr
                        key={task._id}
                        className={`group transition-colors hover:bg-blue-50/40 ${overdue ? "bg-red-50/30" : ""}`}
                      >
                        {/* Task name + description */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${pMeta.dot}`}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate leading-snug">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${pMeta.badge}`}
                          >
                            <PIcon className="w-3 h-3" />
                            {pMeta.label}
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1.5 ${overdue ? "text-red-600" : "text-gray-600"}`}>
                            {overdue && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
                            <span className="text-sm font-medium">{fmt(task.deadline)}</span>
                          </div>
                          {overdue && (
                            <p className="text-red-500 text-xs font-semibold mt-0.5">Overdue</p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${sMeta.cls}`}>
                            {sMeta.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {task.status === "pending" && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, "in-progress")}
                              disabled={updatingId === task._id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === task._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                              Start
                            </button>
                          )}
                          {task.status === "in-progress" && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, "completed")}
                              disabled={updatingId === task._id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === task._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Complete
                            </button>
                          )}
                          {task.status === "completed" && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              Done
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyTasks;