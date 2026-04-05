import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Loader2, Users } from 'lucide-react';
import { roomApi } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [viewApp, setViewApp] = useState(null);
  const [noteModal, setNoteModal] = useState({ open: false, app: null, decision: null });
  const [notification, setNotification] = useState({ open: false, type: '', message: '' });
  const [appLoading, setAppLoading] = useState({});
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
      const res = await roomApi.get(`/applications${statusParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login?from=staff');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (app) => {
    setViewApp(app);
  };

  const handleDecision = (app, decision) => {
    setNoteModal({ open: true, app, decision });
  };

  const submitDecision = async () => {
    const { app, decision } = noteModal;
    const appId = app._id;
    setAppLoading(prev => ({ ...prev, [appId]: decision }));
    setNoteModal({ open: false, app: null, decision: null });

    try {
      await roomApi.patch(`/applications/${appId}/decision`, {
        decision,
        staffNote: noteModal.staffNote || '',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic update
      setApplications(prev => 
        prev.map(a => 
          a._id === appId 
            ? { ...a, status: decision }
            : a
        )
      );
      
      setNotification({ open: true, type: 'success', message: `${decision.toUpperCase()}d successfully!` });
    } catch (err) {
      setNotification({ open: true, type: 'error', message: err.response?.data?.message || `Failed to ${decision}` });
      fetchApplications();
    } finally {
      setAppLoading(prev => ({ ...prev, [appId]: null }));
    }
  };

  const closeNotification = () => {
    setNotification({ open: false, type: '', message: '' });
  };



  const filteredApps = applications.filter(app => 
    app.studentDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.studentId.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-orange-50 text-orange-600 border-orange-200',
      approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      rejected: 'bg-red-50 text-red-600 border-red-200',
      cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatAppId = (id) => `APP-${id.slice(-6).toUpperCase()}`;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Applications</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{filteredApps.length} applications</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden flex-1">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Applications</h3>
              <p className="text-gray-500">No applications match your filter</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">App ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Student</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Course/Room</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-indigo-600">{formatAppId(app._id)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{app.studentDetails.name}</div>
                        <div className="text-sm text-gray-500">{app.studentId.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{app.studentDetails.courseStream}</div>
                      <div className="text-sm text-gray-500">Room {app.room.roomNumber}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
<td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          onClick={() => handleView(app)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleDecision(app, 'approved')}
                              disabled={!!appLoading[app._id]}
                              className={`p-2 rounded-lg transition-all ${
                                appLoading[app._id] === 'approved'
                                  ? 'text-emerald-400 bg-emerald-50 animate-pulse cursor-not-allowed'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title="Approve"
                            >
                              {appLoading[app._id] === 'approved' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDecision(app, 'rejected')}
                              disabled={!!appLoading[app._id]}
                              className={`p-2 rounded-lg transition-all ${
                                appLoading[app._id] === 'rejected'
                                  ? 'text-red-400 bg-red-50 animate-pulse cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title="Reject"
                            >
                              {appLoading[app._id] === 'rejected' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle size={18} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-t-3xl text-white">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <p className="text-indigo-100 mt-1">{formatAppId(viewApp._id)}</p>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-semibold text-gray-500">Name:</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewApp.studentDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500">Roll No:</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewApp.studentDetails.rollNo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500">Course:</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewApp.studentDetails.courseStream}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500">Mobile:</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewApp.studentDetails.mobile}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-semibold text-gray-500">Email:</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{viewApp.studentId.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Room Details</h3>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <p className="text-xl font-bold text-gray-900">Room {viewApp.room.roomNumber} ({viewApp.room.block})</p>
                  <p className="text-sm text-gray-600 mt-2">Capacity: {viewApp.room.capacity}, Vacancy: {viewApp.room.vacancy}</p>
                </div>
              </div>
              {viewApp.message && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Message</h3>
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{viewApp.message}</p>
                  </div>
                </div>
              )}
              {viewApp.staffNote && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Staff Note</h3>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-gray-800 italic">{viewApp.staffNote}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setViewApp(null)}
                  className="flex-1 px-8 py-3 text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Note Modal */}
      {noteModal.open && noteModal.app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                {noteModal.decision} Application
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                For {noteModal.app.studentDetails.name} - Room {noteModal.app.room.roomNumber}
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Staff Note (optional)
                </label>
                <textarea
                  rows="3"
                  value={noteModal.staffNote || ''}
                  onChange={(e) => setNoteModal({...noteModal, staffNote: e.target.value})}
                  placeholder="Enter reason or note for this decision..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setNoteModal({ open: false, app: null, decision: null })}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDecision}
                  className={`flex-1 px-6 py-3 text-sm font-bold text-white rounded-xl shadow-lg ${
                    noteModal.decision === 'approved' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {noteModal.decision === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {notification.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className={`relative rounded-3xl p-6 shadow-2xl max-w-md w-full transform transition-all animate-in fade-in-0 zoom-in-95 ${
            notification.type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-400 border-2' 
              : 'bg-red-500 text-white border-red-400 border-2'
          }`}>
            <button
              onClick={closeNotification}
              className="absolute top-3 right-3 p-1.5 bg-white/30 rounded-full transition-all hover:bg-white/40 shadow-lg z-10"
              style={{ minWidth: '28px', minHeight: '28px' }}
            >
              <XCircle size={18} className="text-white drop-shadow-sm" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === 'success' ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{notification.type === 'success' ? 'Success!' : 'Error!'}</h3>
                <p className="text-white/90 mt-1">{notification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <style jsx>{`
        @media (max-width: 768px) {
          table {
            display: block;
          }
          thead {
            display: none;
          }
          tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            padding: 1rem;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          td {
            display: block;
            text-align: right;
            padding: 0.5rem 0;
            position: relative;
            padding-left: 50%;
          }
          td::before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 45%;
            font-weight: 600;
            text-align: left;
            color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
};

export default Application;
