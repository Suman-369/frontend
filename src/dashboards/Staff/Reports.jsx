import React, { useState, useEffect } from 'react';
import { Download, Filter, BarChart3, PieChart, FileText, Upload, Loader2, Calendar, TrendingUp } from 'lucide-react';
import { reportApi } from '../../lib/api.js';

const SERVICE_TYPES = [
  { value: 'complaints', label: 'Complaints & Maintenance' },
  { value: 'rooms', label: 'Room Occupancy' },
  { value: 'occupancy', label: 'Occupancy Report' },
  { value: 'maintenance', label: 'Maintenance Log' },
  { value: 'finance', label: 'Fee Defaults' }
];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [serviceType, setServiceType] = useState('complaints');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState('');

  // Fetch reports
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportApi.get('/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      setMessage('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await reportApi.post('/reports/generate', { serviceType, month, year });
      setReports([res.data.report, ...reports]);
      setMessage('Report generated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPdfPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (reportId) => {
    if (!pdfFile) return setMessage('Select PDF first');
    setUploading(true);
    try {
      const base64 = pdfPreview.split(',')[1]; // Remove data: URL prefix
      const res = await reportApi.post(`/reports/${reportId}/upload-pdf`, { 
        fileBase64: base64, 
        fileName: pdfFile.name 
      });
      setSelectedReport(res.data.report);
      setMessage('PDF uploaded!');
      setPdfFile(null);
      setPdfPreview('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 space-y-6">
      {/* Compact Stats - TOP hero section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
          <BarChart3 className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{reports.reduce((sum, r) => sum + r.stats.total, 0)}</p>
          <p className="text-xs text-blue-100">Total Incidents</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg flex flex-col items-center">
          <PieChart className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">
            {(() => {
              const totalInc = reports.reduce((sum, r) => sum + r.stats.total, 0);
              const resolvedInc = reports.reduce((sum, r) => sum + r.stats.resolved, 0);
              return totalInc > 0 ? Math.round((resolvedInc / totalInc) * 100) : 0;
            })() }%
          </p>
          <p className="text-xs text-emerald-100">Resolution Rate</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg flex flex-col items-center md:col-span-2">
          <FileText className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{reports.length}</p>
          <p className="text-xs text-purple-100">Reports</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Monthly Service Reports</h1>
          <p className="text-lg text-gray-600 mt-1">Generate analytics over complaints, rooms & upload official PDFs</p>
        </div>
        <button 
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
        >
          <FileText size={20} />
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Refresh Reports'}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-800 text-sm font-medium">
          {message}
          <button onClick={() => setMessage('')} className="ml-4 text-blue-600 hover:text-blue-800">×</button>
        </div>
      )}

      {/* Generate Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          Generate New Monthly Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
            <select 
              value={serviceType} 
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <input 
              type="number" 
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min={2020} max={2030}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="mt-8 w-full md:w-auto flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-2xl"
        >
          {generating ? <Loader2 className="w-6 h-6 animate-spin" /> : <BarChart3 size={24} />}
          Generate Report
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-6 md:p-8 border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Upload PDF Report</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all cursor-pointer bg-white">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <p className="font-semibold text-gray-900 mb-1">Click to select PDF</p>
              <p className="text-sm text-gray-500">{pdfFile?.name || 'No file selected'}</p>
            </label>
          </div>
          {pdfPreview && (
            <div className="space-y-4">
              <iframe src={pdfPreview} className="w-full h-64 border rounded-xl shadow-lg" />
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleUpload(selectedReport?._id)}
                  disabled={uploading || !selectedReport}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload size={20} />}
                  Upload & Save
                </button>
                <select 
                  onChange={(e) => {
                    const report = reports.find(r => r._id === e.target.value);
                    setSelectedReport(report);
                  }}
                  className="flex-1 p-3 border border-gray-200 rounded-xl"
                >
                  <option value="">Select Report</option>
                  {reports.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.serviceType} - {new Date(0, r.month-1).toLocaleString('default', { month: 'short' })} {r.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reports List Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-blue-600" />
            Your Generated Reports
          </h3>
          <p className="text-gray-600 mt-1">Download previously generated monthly reports</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const filename = `report-${report.serviceType}-${monthNames[report.month - 1]}-${report.year}.pdf`;
                return (
                  <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {report.serviceType.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {monthNames[report.month - 1]} {report.year}
                    </td>
                    <td className="px-6 py-4">
                      {report.pdfUrl ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          PDF Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          No PDF
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.pdfUrl ? (
                        <button
                          onClick={async () => {
                            try {
                              const response = await reportApi.get(`/${report._id}/pdf`, {
                                responseType: 'blob',
                                headers: { 'Accept': 'application/pdf' }
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
                              setMessage(`Download failed: ${err.response?.data?.message || err.message}`);
                            }
                          }}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-500 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">
                          Upload PDF first
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No reports yet</p>
                    <p className="text-sm">Generate your first monthly report above</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

