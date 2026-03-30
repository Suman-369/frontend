import React, { useState } from 'react';
import { UserPlus, MoreVertical, Shield, ShieldAlert, Mail } from 'lucide-react';

const AdminStaffManagement = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff members and assign their roles.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-sm text-sm font-medium w-fit">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tl-xl rounded-bl-xl">Staff Member</th>
                <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold rounded-tr-xl rounded-br-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'John Doe', email: 'john@example.com', role: 'Warden', status: 'Active' },
                { name: 'Alice Smith', email: 'alice@example.com', role: 'Security', status: 'Active' },
                { name: 'Robert Brown', email: 'robert@example.com', role: 'Plumber', status: 'Inactive' },
                { name: 'Jane Wilson', email: 'jane@example.com', role: 'Cleaning Staff', status: 'Active' },
              ].map((staff, idx) => (
                <tr key={idx} className="bg-white hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600 font-bold">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {staff.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {staff.role === 'Warden' || staff.role === 'Security' ? (
                        <ShieldAlert className="w-4 h-4 text-indigo-500 mr-2" />
                      ) : (
                        <Shield className="w-4 h-4 text-emerald-500 mr-2" />
                      )}
                      <span className="font-medium text-gray-700">{staff.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffManagement;
