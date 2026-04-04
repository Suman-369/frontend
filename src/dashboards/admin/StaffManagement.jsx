import React, { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Shield, ShieldAlert, Mail, Edit, UserX, CheckCircle2, XCircle, Loader2, Loader } from 'lucide-react';
import { authApi } from '../../lib/api.js';

const AdminStaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  // Removed showMenu state - using direct buttons
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('active');
  const [toasts, setToasts] = useState([]);

  // Toast utils
  const addToast = (type, title, message) => {
    const id = Date.now();
    const toast = { id, type, title, message };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.get('/users?role=staff');
      setStaff(response.data.users || []);
    } catch (err) {
      console.error('Fetch staff error:', err);
      setError('Failed to load staff data');
      addToast('error', 'Error', 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId) => {
    try {
      setUpdating(true);
      const response = await authApi.put(`/users/${userId}/status`, { status });
      const updatedUser = response.data.user;
      setStaff(prev => prev.map(u => u._id === userId ? updatedUser : u));
      addToast('success', 'Success', 'Availability status updated');
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Update status error:', err);
      addToast('error', 'Error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      setUpdating(true);
      const response = await authApi.put(`/users/${userId}/block`);
      const updatedUser = response.data.user;
      setStaff(prev => prev.map(u => u._id === userId ? updatedUser : u));
      addToast('success', 'Success', response.data.message);
    } catch (err) {
      console.error('Toggle block error:', err);
      addToast('error', 'Error', err.response?.data?.message || 'Failed to toggle block');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getBlockedBadge = (isBlocked) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
      isBlocked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {isBlocked ? 'Blocked' : 'Active'}
    </span>
  );

  if (loading) {
    return (
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-500 mt-1">Loading staff data...</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Toasts */}
      {toasts.map(toast => (
        <div key={toast.id} className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl min-w-[320px] animate-in slide-in-from-right fade-in ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-start gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <div>
              <h4 className="font-semibold">{toast.title}</h4>
              <p className="text-sm mt-1">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="ml-auto text-white/80 hover:text-white p-1 -m-1">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage {staff.length} staff members
            {error && <span className="text-red-500 ml-2">({error})</span>}
          </p>
        </div>
        <button 
          className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-sm text-sm font-medium w-fit disabled:opacity-50"
          disabled={updating}
          onClick={fetchStaff}
        >
          <Loader className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tl-xl rounded-bl-xl">Staff Member</th>
                <th scope="col" className="px-6 py-4 font-semibold">Availability</th>
                <th scope="col" className="px-6 py-4 font-semibold">Blocked</th>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tr-xl rounded-br-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((user) => (
                <tr key={user._id} className="bg-white hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-4 text-white font-bold text-sm shadow-lg">
                        {user.fullname.firstName.charAt(0)}{user.fullname.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.fullname.firstName} {user.fullname.lastName}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.availabilityStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getBlockedBadge(user.isBlocked)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => {
                          setStatus(user.availabilityStatus);
                          setSelectedUser(user);
                          setShowStatusModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all group disabled:opacity-50"
                        disabled={updating}
                        title="Edit Status"
                      >
                        <Edit className="w-3 h-3 group-hover:scale-110" />
                        Status
                      </button>
                      <button
                        onClick={() => handleToggleBlock(user._id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 group"
                        title="Block/Unblock"
                        disabled={updating}
                      >
                        {updating ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserX className={`w-3 h-3 ${user.isBlocked ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-red-600 group-hover:text-red-700'}`} />
                        )}
                          {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500 space-y-2">
                      <UserPlus className="w-12 h-12 mx-auto text-gray-300" />
                      <p className="text-lg font-medium text-gray-900">No staff members</p>
                      <p className="text-sm">Create staff accounts to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" 
            onClick={() => setShowStatusModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Update Availability</h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Staff: {selectedUser.fullname.firstName} {selectedUser.fullname.lastName}
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={updating}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedUser._id)}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Update Status'
                    )}
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

export default AdminStaffManagement;
