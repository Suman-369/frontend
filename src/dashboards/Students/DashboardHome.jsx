import React, { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  CheckCircle2,
  FileText,
  Building,
  Coffee,
  Wrench,
  Droplets,
  CalendarDays,
  Mail,
  MoreVertical,
  Activity,
} from "lucide-react";
import { studentRoomApi } from "../../lib/api.js";

const NOTICE_COLORS = {
  general: {
    bg: "bg-[#F4F2FF]",
    border: "border-violet-100",
    text: "text-violet-600",
    progressFill: "bg-violet-500",
    progressBg: "bg-violet-200",
  },
  event: {
    bg: "bg-[#FFF3EC]",
    border: "border-orange-100",
    text: "text-orange-500",
    progressFill: "bg-orange-500",
    progressBg: "bg-orange-200",
  },
  maintenance: {
    bg: "bg-[#EAF6FF]",
    border: "border-blue-100",
    text: "text-blue-500",
    progressFill: "bg-blue-500",
    progressBg: "bg-blue-200",
  },
  academic: {
    bg: "bg-[#ECFDF5]",
    border: "border-emerald-100",
    text: "text-emerald-600",
    progressFill: "bg-emerald-500",
    progressBg: "bg-emerald-200",
  },
};

const DashboardHome = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllNotices, setShowAllNotices] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await studentRoomApi.get("/notices?limit=10");
        setNotices(res.data?.notices || []);
      } catch (err) {
        console.error("Unable to fetch notices", err);
        setError("Unable to load latest notices. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const displayedNotices = useMemo(() => {
    const noticesSlice = showAllNotices ? notices : (notices || []).slice(0, 3);
    return (noticesSlice || []).map((notice) => {
      const type = notice.type || "general";
      const style = NOTICE_COLORS[type] || NOTICE_COLORS.general;
      const progress = Number.isFinite(Number(notice.relevancePercentage))
        ? Number(notice.relevancePercentage)
        : 0;
      return {
        ...notice,
        createdAtLabel: notice.createdAt
          ? new Date(notice.createdAt).toLocaleDateString()
          : "Unknown",
        style,
        progress,
        subtitle: type.charAt(0).toUpperCase() + type.slice(1) + " Notice",
      };
    });
  }, [notices, showAllNotices]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Latest Published Notices
        </h2>
        {showAllNotices ? (
          <button
            onClick={() => setShowAllNotices(false)}
            className="text-sm font-semibold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Show Less
          </button>
        ) : notices.length > 3 ? (
          <button
            onClick={() => setShowAllNotices(true)}
            className="text-sm font-semibold text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
          >
            View All
          </button>
        ) : null}
      </div>

      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div
        className={`grid ${showAllNotices ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-4"} gap-6 mb-10`}
      >
        <div
          className={`${showAllNotices ? "col-span-1" : "xl:col-span-3"} grid grid-cols-1 md:grid-cols-3 ${showAllNotices ? "xl:grid-cols-4" : ""} gap-6`}
        >
          {loading ? (
            <div className="col-span-full px-4 py-10 rounded-2xl border border-gray-200 bg-white text-center">
              <p className="text-sm text-gray-500">Loading notices...</p>
            </div>
          ) : displayedNotices.length === 0 ? (
            <div className="col-span-full px-4 py-10 rounded-2xl border border-gray-200 bg-white text-center">
              <p className="text-sm text-gray-500">No notices available yet.</p>
            </div>
          ) : (
            displayedNotices.map((card, idx) => (
              <div
                key={idx}
                className={`${card.style.bg} ${card.style.border} rounded-3xl p-6 transition-all hover:-translate-y-1 duration-300 relative overflow-hidden group border shadow-sm`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[11px] font-bold text-gray-500 bg-white/70 px-2.5 py-1 rounded-lg backdrop-blur-md uppercase tracking-wide">
                    {card.createdAtLabel}
                  </span>
                  <div
                    className={`p-2.5 rounded-xl ${card.style.bg} ${card.style.text} shadow-sm`}
                  >
                    <Megaphone className="w-4 h-4" />
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-1.5 ${card.style.text}`}>
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {card.subtitle}
                </p>
                <p className="text-xs text-gray-500 font-medium mb-12 leading-relaxed opacity-80">
                  {card.description}
                </p>

                <div className="absolute w-full bottom-0 left-0 px-6 pb-6">
                  <div className="flex justify-between text-[11px] font-bold mb-2.5 uppercase tracking-wide">
                    <span className="text-gray-500">Relevance</span>
                    <span className={card.style.text}>{card.progress}%</span>
                  </div>
                  <div
                    className={`w-full h-1.5 border border-white/20 ${card.style.progressBg} rounded-full overflow-hidden`}
                  >
                    <div
                      className={`h-full ${card.style.progressFill} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${Math.min(100, Math.max(0, card.progress))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!showAllNotices && (
          <div className="bg-[#FFF4E5] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_12px_rgba(255,184,0,0.04)] relative overflow-hidden border border-yellow-100/50">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-yellow-200/50 rounded-full animate-pulse" />
              <div className="w-full h-full bg-yellow-100 rounded-full relative z-10 flex items-center justify-center shadow-inner border border-yellow-200">
                <Activity className="w-10 h-10 text-[#FFB800]" />
              </div>
              <div className="absolute -right-1 -top-1 bg-white rounded-full p-1.5 shadow-md z-20">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <h3 className="text-gray-900 font-bold mb-3 text-lg tracking-tight z-10 leading-snug">
              Upcoming Health
              <br />
              Checkup Camp
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-6 z-10">
              All students must attend the campus drive.
            </p>
            <button className="bg-[#FFB800] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-yellow-500 transition-all shadow-[0_4px_14px_0_rgba(255,184,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,184,0,0.25)] hover:-translate-y-0.5 z-10 w-full active:scale-95">
              Register Now
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-[#EEF8F3]/60 rounded-3xl p-6 lg:p-8 flex flex-col border border-emerald-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Hostel Facilities
            </h2>
          </div>
          <div className="flex flex-col gap-3.5 flex-1 justify-between">
            {[
              {
                title: "Food & Mess",
                count: "18 Options",
                icon: Coffee,
                iconColor: "text-purple-500",
                iconBg: "bg-purple-100",
              },
              {
                title: "Maintenance",
                count: "24/7 Support",
                icon: Wrench,
                iconColor: "text-orange-500",
                iconBg: "bg-orange-100",
              },
              {
                title: "Laundry",
                count: "12 Machines",
                icon: Droplets,
                iconColor: "text-blue-500",
                iconBg: "bg-blue-100",
              },
              {
                title: "Events",
                count: "Upcoming Fest",
                icon: CalendarDays,
                iconColor: "text-emerald-500",
                iconBg: "bg-emerald-100",
              },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/90 hover:bg-white backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer shadow-sm hover:shadow-md border border-white hover:border-emerald-100 group"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-semibold">
                      {cat.count}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${cat.iconBg} ${cat.iconColor} shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-2 bg-[#F3F8FF]/60 rounded-3xl p-6 lg:p-8 border border-sky-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Hostel Staff & Contacts
            </h2>
            <a
              href="#"
              className="text-sm font-semibold text-gray-400 hover:text-gray-800 transition-colors"
            >
              View All Directory
            </a>
          </div>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-separate border-spacing-y-3 min-w-[600px]">
              <tbody>
                {[
                  {
                    name: "Dr. A. Sharma",
                    role: "Chief Warden",
                    stat1: "Block A",
                    stat2: "Mon-Fri",
                    avatar: "https://i.pravatar.cc/150?img=11",
                  },
                  {
                    name: "Ravi Kumar",
                    role: "Security Head",
                    stat1: "Main Gate",
                    stat2: "Night Shift",
                    avatar: "https://i.pravatar.cc/150?img=12",
                  },
                  {
                    name: "Sunita Devi",
                    role: "Maintenance",
                    stat1: "All Blocks",
                    stat2: "Day Shift",
                    avatar: "https://i.pravatar.cc/150?img=5",
                  },
                  {
                    name: "Vikram Singh",
                    role: "Mess Incharge",
                    stat1: "Cafeteria",
                    stat2: "Full Day",
                    avatar: "https://i.pravatar.cc/150?img=14",
                  },
                ].map((person, idx) => (
                  <tr key={idx} className="group cursor-pointer">
                    <td className="bg-white py-4 pl-5 rounded-l-2xl shadow-sm border-y border-l border-white group-hover:border-sky-100 group-hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-11 h-11 rounded-full object-cover group-hover:scale-105 transition-transform shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
                            {person.name}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white py-4 shadow-sm border-y border-white group-hover:border-sky-100 transition-all">
                      <span className="text-sm font-semibold text-gray-500">
                        {person.role}
                      </span>
                    </td>
                    <td className="bg-white py-4 shadow-sm border-y border-white group-hover:border-sky-100 transition-all">
                      <span className="text-sm font-semibold text-gray-500">
                        {person.stat1}
                      </span>
                    </td>
                    <td className="bg-white py-4 shadow-sm border-y border-white group-hover:border-sky-100 transition-all">
                      <span className="text-sm font-semibold text-gray-500">
                        {person.stat2}
                      </span>
                    </td>
                    <td className="bg-white py-4 pr-5 rounded-r-2xl shadow-sm border-y border-r border-white group-hover:border-sky-100 transition-all text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button className="bg-[#FFB800] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-[0_4px_10px_rgba(255,184,0,0.25)] hover:bg-yellow-500 hover:shadow-[0_6px_14px_rgba(255,184,0,0.3)] transition-all active:scale-95">
                          Reach Out
                        </button>
                        <button className="p-2 border-2 border-gray-100 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95">
                          <Mail className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
