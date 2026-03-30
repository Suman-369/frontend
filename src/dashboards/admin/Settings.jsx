import React from 'react';
import { Save, BellRing, Lock, Users, Globe, Smartphone, Palette } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system configurations and preferences.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-sm text-sm font-medium w-fit">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 border border-gray-100 bg-white rounded-2xl shadow-sm p-2 h-fit">
          <nav className="space-y-1">
            {[
              { name: 'General', icon: Globe, active: true },
              { name: 'Security', icon: Lock, active: false },
              { name: 'Notifications', icon: BellRing, active: false },
              { name: 'User Permissions', icon: Users, active: false },
              { name: 'Appearance', icon: Palette, active: false },
              { name: 'Integrations', icon: Smartphone, active: false }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-[#1E3A8A]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${item.active ? 'text-[#1E3A8A]' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">General Information</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hostel Name</label>
                  <input
                    type="text"
                    defaultValue="Sunrise Central Hostel"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    defaultValue="admin@sunrisehostel.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 University Drive, College Block"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Disable access for students and staff temporarily.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A8A]"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Public Registration</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Allow new students to sign up automatically.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3A8A]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
