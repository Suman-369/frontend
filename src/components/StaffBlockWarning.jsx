import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

const StaffBlockWarning = ({ onLogout }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50/95 to-red-50/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200 max-w-md w-full mx-4 p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
<h2 className="text-2xl font-bold text-gray-900 mb-3">You Are Blocked by Admin</h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed font-medium">
          You are temporarily blocked by the administrator. Please contact admin for assistance.
        </p>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-red-700 transition-all shadow-lg active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StaffBlockWarning;
