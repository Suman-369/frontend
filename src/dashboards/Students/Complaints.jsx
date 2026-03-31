import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintApi } from '../../lib/api';
import { AlertCircle, CheckCircle2, Clock, Send, FileWarning, Loader2 } from 'lucide-react';

const getCategoryLabel = (category) => {
  const labels = {
    room: 'Room Maintenance',
    service: 'Service Issue',
    facility: 'Facility Problem',
    other: 'Other'
  };
  return labels[category] || category;
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'orange', icon: Clock };
    case 'in_progress':
      return { label: 'In Progress', color: 'blue', icon: Clock };
    case 'resolved':
      return { label: 'Resolved', color: 'emerald', icon: CheckCircle2 };
    case 'rejected':
      return { label: 'Rejected', color: 'red', icon: AlertCircle };
    default:
      return { label: status, color: 'gray', icon: AlertCircle };
  }
};

const Complaints = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'room',
    priority: 'medium',
    otherCategory: ''
  });
  const [complaints, setComplaints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintApi.get('/student/complaints');
      setComplaints(response.data.complaints || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = {
        title: formData.title || formData.otherCategory || 'Issue',
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      };

await complaintApi.post('/student/complaints', submitData);
      // Success toast like Application.jsx
      if (typeof window !== 'undefined') {
        const toast = document.createElement('div');
        toast.innerHTML = `
          <div class="fixed top-4 right-4 z-[9999] bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl max-w-md animate-in slide-in-from-right fade-in">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h3 class="font-bold text-lg">Success!</h3>
                <p>Complaint submitted successfully!</p>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.remove();
        }, 4000);
      }
      setFormData({
        title: '',
        description: '',
        category: 'room',
        priority: 'medium',
        otherCategory: ''
      });
      setShowOtherInput(false);
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value, otherCategory: '' });
    setShowOtherInput(value === 'other');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Complaints Helpdesk</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="xl:col-span-1 bg-[#EEF8F3]/60 rounded-3xl p-6 lg:p-8 flex flex-col border border-emerald-50 h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-emerald-100 pb-4">
            <div className="p-3 bg-emerald-100/50 rounded-xl text-emerald-600">
              <FileWarning className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Register New<br/>Complaint</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Category</label>
              <select 
                value={formData.category} 
                onChange={handleCategoryChange}
                className="w-full bg-white border-none rounded-2xl py-3 px-4 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm transition-all cursor-pointer"
              >
                <option value="room">Room Maintenance</option>
                <option value="service">Service Issue</option>
                <option value="facility">Facility Problem</option>
                <option value="other">Other</option>
              </select>
            </div>

            {showOtherInput && (
              <div>
                <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Other Category</label>
                <input
                  type="text"
                  placeholder="Specify category..."
                  value={formData.otherCategory}
                  onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })}
                  className="w-full bg-white border border-transparent rounded-2xl py-3 px-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-100 outline-none shadow-sm transition-all placeholder-gray-400"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
              <select 
                value={formData.priority} 
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-white border-none rounded-2xl py-3 px-4 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none shadow-sm transition-all cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5 ml-1">Description</label>
              <textarea 
                rows="4"
                placeholder="Describe your issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-transparent rounded-2xl py-3 px-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-100 outline-none shadow-sm transition-all resize-none placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-500 text-white rounded-2xl py-3.5 mt-2 flex items-center justify-center gap-2 font-bold hover:bg-emerald-600 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Complaint
                </>
              )}
            </button>
          </form>
        </div>

        {/* Complaints History */}
        <div className="xl:col-span-2 bg-[#F3F8FF]/60 rounded-3xl p-6 lg:p-8 border border-sky-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">My Past Complaints</h2>
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg shadow-sm">
              Total: {complaints.length}
            </span>
          </div>
          
          <div className="flex flex-col gap-4">
            {complaints.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No complaints yet. Use the form above to register your first complaint.
              </div>
            ) : (
              complaints.map((comp) => {
                const statusConfig = getStatusConfig(comp.status);
                return (
                  <div key={comp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:border-sky-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl mt-1 shadow-inner ${statusConfig.color === 'orange' || statusConfig.color === 'blue' ? `bg-${statusConfig.color}-100 text-${statusConfig.color}-500` : `bg-${statusConfig.color}-100 text-${statusConfig.color}-500`}`}>
                        <statusConfig.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase">{comp.id.slice(-6)}</span>
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {getCategoryLabel(comp.category)}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${comp.priority === 'high' ? 'text-red-600 bg-red-50' : comp.priority === 'medium' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'}`}>
                            {comp.priority.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-blue-600 transition-colors">
                          {comp.title}
                        </h4>
                        <p className="text-xs font-semibold text-gray-400 mt-2">
                          {new Date(comp.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
{comp.staffNote && (
                          <p className="text-xs font-semibold text-amber-800 mt-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-lg ring-2 ring-amber-100/50">
                            📢 Staff Notice: {comp.staffNote}
                          </p>
                        )}
                      </div>

                    </div>
                    <div className="flex justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                      <span className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center min-w-[100px] shadow-sm ${statusConfig.color === 'orange' || statusConfig.color === 'blue' ? `bg-${statusConfig.color}-50 text-${statusConfig.color}-600 border-${statusConfig.color}-100` : `bg-${statusConfig.color}-50 text-${statusConfig.color}-600 border-${statusConfig.color}-100`}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaints;

