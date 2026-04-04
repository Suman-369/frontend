import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Download,
  Filter,
  FileText,
  Calendar,
  ChevronRight,
  Loader2,
  User,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { reportApi } from "../../lib/api.js";
import * as XLSX from 'xlsx';

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SERVICE_TYPES = [
  { id: "complaints", label: "Complaints" },
  { id: "rooms", label: "Rooms" },
  { id: "occupancy", label: "Occupancy" },
  { id: "maintenance", label: "Maintenance" },
  { id: "finance", label: "Finance" },
];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeService, setActiveService] = useState("");
  const [filters, setFilters] = useState({
    serviceType: "",
    year: "",
    month: "",
    search: "",
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.serviceType)
        params.append("serviceType", filters.serviceType);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      // Search handled client-side
      const res = await reportApi.get("/reports/admin", { params });
      setReports(res.data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [filters.serviceType, filters.year, filters.month]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = () => {
    setFilters({ serviceType: "", year: "", month: "", search: "" });
    setActiveService("");
  };

  const displayedReports = useMemo(() => {
    return reports.filter(
      (report) =>
        !filters.search ||
        (report.generatedBy?.name || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase()),
    );
  }, [reports, filters.search]);

  const exportAll = useCallback(() => {
    const data = displayedReports.map((report) => ({
      Staff: report.generatedBy?.name || "N/A",
      Service: capitalize(report.serviceType),
      Period: `${monthNames[report.month - 1]} ${report.year}`,
      Stats: `${report.stats?.total || 0} / ${report.stats?.resolved || 0} (${Math.round(
        ((report.stats?.resolved || 0) / Math.max(report.stats?.total || 1, 1)) * 100
      )}%)`,
      "PDF URL": report.pdfUrl || "None",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, `hostel-reports-${new Date().toISOString().split("T")[0]}.xlsx`);
  }, [displayedReports]);

const downloadReport = useCallback(async (report, filename) => {
    try {
      const response = await reportApi.get(`/${report._id}/pdf`, { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Download failed: ${err.response?.data?.message || err.message}`);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border mb-6 pb-4">
        <div className="flex flex-wrap items-center gap-3 -mx-2 md:-mx-1 md:flex-nowrap md:gap-2 overflow-x-auto pb-3 scrollbar-none">
          <select
            value={filters.serviceType}
            onChange={(e) => handleFilterChange("serviceType", e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white flex-shrink-0 whitespace-nowrap min-w-[140px]"
          >
            <option value="">All Services</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Year"
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white flex-shrink-0"
            min="2020"
            max="2030"
          />
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            className="w-40 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white flex-shrink-0"
          >
            <option value="">All Months</option>
            {monthNames.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
          <div className="flex-1 min-w-[180px] max-w-xs">
            <input
              type="text"
              placeholder="Search staff..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <button
            onClick={exportAll}
            className="flex items-center px-10 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm text-sm font-semibold transition-all flex-shrink-0"
          >
            <Download className="w-4 h-4 mr-1" />
            Export All
          </button>
          <button
            onClick={resetFilters}
            className="px-10 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex-shrink-0 whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 pb-2 -mx-1">
        <button
          onClick={() => {
            setActiveService("");
            handleFilterChange("serviceType", "");
          }}
          className={`px-6 py-3 text-sm font-semibold whitespace-nowrap rounded-t-2xl transition-all border-b-3 ${
            !activeService
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-600 hover:border-gray-300"
          }`}
        >
          All Services
        </button>
        {SERVICE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setActiveService(type.id);
              handleFilterChange("serviceType", type.id);
            }}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap rounded-t-2xl transition-all border-b-3 flex-shrink-0 ${
              activeService === type.id
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold rounded-tl-xl rounded-bl-xl"
                >
                  Staff
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Service
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Period
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Stats
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  PDF Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold rounded-tr-xl rounded-br-xl text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-500 font-medium">
                      Loading reports...
                    </p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-4 text-orange-500" />
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                      onClick={fetchReports}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : displayedReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="text-xl font-semibold mb-1">
                      No reports match your filters
                    </p>
                    <p className="text-sm">
                      {filters.serviceType &&
                        `Service: ${capitalize(filters.serviceType)}`}{" "}
                      {filters.year && `• Year: ${filters.year}`}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedReports.map((report) => (
                  <tr
                    key={report._id}
                    className="bg-white hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mr-3 text-white shadow-sm group-hover:scale-105 transition-transform">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm leading-tight">
                            {report.generatedBy?.name || "Unknown Staff"}
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-medium">
                            {report.generatedBy?.role || "staff"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                        {capitalize(report.serviceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {monthNames[report.month - 1]} {report.year}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          {report.stats?.total || 0}
                        </span>
                        <span className="text-xs text-gray-500">total</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(((report.stats?.resolved || 0) / Math.max(report.stats?.total || 1, 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {report.pdfUrl ? (
                        <div className="flex items-center text-green-700 text-sm font-medium">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          Ready
                        </div>
                      ) : (
                        <div className="flex items-center text-orange-600 text-sm font-medium">
                          <AlertCircle className="w-5 h-5 mr-1" />
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {report.pdfUrl ? (
                          <button
                            onClick={() => downloadReport(report, `report-${report.serviceType}-${report.month}-${report.year}.pdf`)}
                            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all group"
                          >
                          <Download className="w-4 h-4 group-hover:-translate-y-px transition-transform" />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-500 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">
                          No PDF
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
