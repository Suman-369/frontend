import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { complaintApi } from "../../lib/api";
import {
  Loader2,
  Download,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
  User,
  CalendarDays,
  FileText,
  MessageSquare,
  Paperclip,
  X,
  Info,
} from "lucide-react";
import { jsPDF } from "jspdf";

/* ─────────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────────── */
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
  const addToast = ({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
    return id;
  };
  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
  const updateToast = (id, updates) =>
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  return { toasts, addToast, removeToast, updateToast };
};

/* ─────────────────────────────────────────────
   PRIORITY / STATUS BADGE CONFIG
───────────────────────────────────────────── */
const PRIORITY_CONFIG = {
  high: {
    label: "High",
    classes: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  },
  medium: {
    label: "Medium",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  low: {
    label: "Low",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
};

const STATUS_CONFIG = {
  open: {
    label: "Open",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500 animate-pulse",
  },
  resolved: {
    label: "Resolved",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    classes: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
    dot: "bg-gray-400",
  },
};

const Badge = ({ config, value }) => {
  const cfg = config[value?.toLowerCase()] || {
    label: value,
    classes: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}
    >
      {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label || value}
    </span>
  );
};

/* ─────────────────────────────────────────────
   DETAIL ROW
───────────────────────────────────────────── */
const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-800">{children}</div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────── */
const SectionCard = ({ title, icon: Icon, children, accent = "slate" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div
      className={`px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5 bg-${accent}-50`}
    >
      <Icon className={`w-4 h-4 text-${accent}-600`} />
      <h3 className={`text-sm font-semibold text-${accent}-800`}>{title}</h3>
    </div>
    <div className="px-5 py-1">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast, updateToast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const response = await complaintApi.get(`/staff/complaints/${id}`);
        setComplaint(response.data.complaint);
        // single success toast
        addToast({
          type: "success",
          title: "Loaded",
          message: "Complaint details successfully.",
          duration: 3000,
        });
      } catch (err) {
        const msg =
          err.response?.data?.message || "Could not load complaint details";
        setError(msg);
        addToast({ type: "error", title: "Failed to load", message: msg });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ── helpers ── */
  const loadImageAsDataUrl = async (url) => {
    try {
      // Try a fetch + canvas conversion pipeline, keep PNG to preserve transparency and avoid black artifacts.
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) return null;
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.src = objectUrl;
      const loaded = await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error("Image load failed"));
      });
      URL.revokeObjectURL(objectUrl);
      if (!loaded || !img.naturalWidth || !img.naturalHeight) return null;

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      // White background to avoid dark artifacts for transparent/alpha images when PDF renders.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      return { dataUrl, w: img.naturalWidth, h: img.naturalHeight };
    } catch {
      return null;
    }
  };

  const downloadPdf = async () => {
    if (pdfLoading) return;
    const toastId = addToast({
      type: "loading",
      title: "Generating PDF…",
      message: "Please wait while the document is prepared.",
      duration: 0,
    });
    setPdfLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const PW = pdf.internal.pageSize.getWidth(); // 595
      const PH = pdf.internal.pageSize.getHeight(); // 842
      const M = 40; // margin
      const CW = PW - M * 2;
      let y = M;

      const setFont = (style, size, color = [15, 23, 42]) => {
        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
      };
      const drawLine = (yPos, color = [226, 232, 240]) => {
        pdf.setDrawColor(...color);
        pdf.setLineWidth(0.5);
        pdf.line(M, yPos, PW - M, yPos);
      };
      const addPageIfNeeded = (needed) => {
        if (y + needed > PH - M) {
          pdf.addPage();
          y = M;
        }
      };
      const writeWrapped = (text, x, maxW, lineH) => {
        const lines = pdf.splitTextToSize(String(text || "—"), maxW);
        lines.forEach((line) => {
          addPageIfNeeded(lineH);
          pdf.text(line, x, y);
          y += lineH;
        });
        return lines.length;
      };

      /* ── Header ── */
      setFont("bold", 20);
      pdf.text("Complaint Report", M, y);
      setFont("normal", 9, [100, 116, 139]);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, PW - M, y, {
        align: "right",
      });
      y += 6;
      drawLine(y);
      y += 16;

      /* Complaint ID + Title */
      setFont("bold", 13);
      pdf.text(`Student: ${studentName} — ${complaint.title}`, M, y);
      y += 18;

      /* Status / Priority / Category pills (text) */
      setFont("normal", 9, [100, 116, 139]);
      pdf.text(
        `Status: ${complaint.status || "—"}   |   Priority: ${complaint.priority || "—"}   |   Category: ${complaint.category || "—"}`,
        M,
        y,
      );
      y += 14;
      drawLine(y);
      y += 20;

      /* ── Section helper ── */
      const section = (title) => {
        addPageIfNeeded(26);
        setFont("bold", 11, [79, 70, 229]);
        pdf.text(title, M, y);
        y += 6;
        drawLine(y, [199, 210, 254]);
        y += 14;
      };

      /* ── Row helper ── */
      const row = (label, value) => {
        addPageIfNeeded(28);
        setFont("bold", 9, [100, 116, 139]);
        pdf.text(label.toUpperCase(), M, y);
        y += 12;
        setFont("normal", 10, [31, 41, 55]);
        writeWrapped(value, M, CW, 14);
        y += 6;
      };

      /* ── Complaint Details ── */
      section("Complaint Details");
      row("Description", complaint.description);
      row("Submitted By", studentName);
      row(
        "Created At",
        new Date(complaint.createdAt).toLocaleString("en-IN", {
          dateStyle: "long",
          timeStyle: "short",
        }),
      );
      row("Category", complaint.category);
      row("Priority", complaint.priority);
      row("Status", complaint.status);
      y += 4;

      /* ── Attachments ── */
      if (complaint.attachmentUrls?.length > 0) {
        section("Attachments");
        for (let i = 0; i < complaint.attachmentUrls.length; i++) {
          const result = await loadImageAsDataUrl(complaint.attachmentUrls[i]);
          if (result) {
            const maxW = CW;
            const maxH = 220;
            const ratio = result.w / result.h;
            let imgW = maxW;
            let imgH = imgW / ratio;
            if (imgH > maxH) {
              imgH = maxH;
              imgW = imgH * ratio;
            }
            addPageIfNeeded(imgH + 12);
            pdf.addImage(result.dataUrl, "PNG", M, y, imgW, imgH);
            y += imgH + 12;
          } else {
            setFont("italic", 9, [156, 163, 175]);
            pdf.text(`[Image ${i + 1} could not be loaded]`, M, y);
            y += 16;
          }
        }
        y += 4;
      }

      /* ── Staff Note ── */
      if (complaint.staffNote) {
        section("Staff Note");
        setFont("normal", 10, [120, 53, 15]);
        writeWrapped(complaint.staffNote, M, CW, 14);
        y += 4;
      }

      /* ── Footer on every page ── */
      const pageCount = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        pdf.setPage(p);
        setFont("normal", 8, [148, 163, 184]);
        drawLine(PH - 28, [226, 232, 240]);
        pdf.text(`Complaint #${complaint.id}`, M, PH - 16);
        pdf.text(`Page ${p} of ${pageCount}`, PW - M, PH - 16, {
          align: "right",
        });
      }

      pdf.save(`complaint-${complaint.id}.pdf`);
      removeToast(toastId);
      addToast({
        type: "success",
        title: "PDF Downloaded",
        message: `complaint-${complaint.id}.pdf saved successfully.`,
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      removeToast(toastId);
      addToast({
        type: "error",
        title: "Download Failed",
        message: "Could not generate PDF. Please try again.",
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const studentName = complaint?.student?.fullname
    ? `${complaint.student.fullname.firstName || ""} ${complaint.student.fullname.lastName || ""}`.trim()
    : complaint?.student?.email || "N/A";

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Loading complaint…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-rose-100 shadow-md p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Unable to Load
          </h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <>
      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Slide-in animation */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out both; }
      `}</style>

      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* ── Top Bar ── */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Complaints
            </button>

            <button
              onClick={downloadPdf}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {pdfLoading ? "Generating…" : "Download PDF"}
            </button>
          </div>

          {/* ── Page Header ── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1"></div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {complaint.title}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Submitted{" "}
              {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* ── Printable Card ── */}
          <div
            id="complaint-detail-card"
            className="space-y-4 bg-slate-50 p-1 rounded-3xl"
          >
            {/* Status Strip */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  Status
                </span>
                <Badge config={STATUS_CONFIG} value={complaint.status} />
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  Priority
                </span>
                <Badge config={PRIORITY_CONFIG} value={complaint.priority} />
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  Category
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {complaint.category}
                </span>
              </div>
            </div>

            {/* Details + Attachments side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Left — Complaint Details */}
              <SectionCard title="Complaint Details" icon={FileText}>
                <DetailRow icon={FileText} label="Description">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {complaint.description}
                  </p>
                </DetailRow>
                <DetailRow icon={User} label="Submitted By">
                  {studentName}
                </DetailRow>
                <DetailRow icon={CalendarDays} label="Created At">
                  {new Date(complaint.createdAt).toLocaleString("en-IN", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </DetailRow>
                <DetailRow icon={Tag} label="Category">
                  {complaint.category}
                </DetailRow>
                <DetailRow icon={Clock} label="Priority">
                  <Badge config={PRIORITY_CONFIG} value={complaint.priority} />
                </DetailRow>
              </SectionCard>

              {/* Right — Attachments */}
              {complaint.attachmentUrls?.length > 0 && (
                <SectionCard
                  title="Attachments"
                  icon={Paperclip}
                  accent="slate"
                >
                  <div className="py-4 flex flex-col gap-3">
                    {complaint.attachmentUrls.map((url, i) => (
                      <div
                        key={i}
                        className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm aspect-video bg-gray-50"
                      >
                        <img
                          src={url}
                          alt={`Attachment ${i + 1}`}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* Staff Note — full width below */}
            {complaint.staffNote && (
              <SectionCard
                title="Staff Note"
                icon={MessageSquare}
                accent="amber"
              >
                <div className="py-4">
                  <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">
                    {complaint.staffNote}
                  </p>
                </div>
              </SectionCard>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Complaint ID: #{complaint.id} · Last updated{" "}
            {new Date(
              complaint.updatedAt || complaint.createdAt,
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetail;
