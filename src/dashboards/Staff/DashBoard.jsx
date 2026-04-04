import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { authApi } from "../../lib/api.js"
import StaffBlockWarning from '../../components/StaffBlockWarning.jsx';
import {
  LayoutDashboard,
  DoorOpen,
  AlertCircle,
  FileText,
  ClipboardList,
  CheckSquare,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft
} from 'lucide-react';

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingBlocked, setCheckingBlocked] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkBlockedStatus();
  }, []);

  const checkBlockedStatus = async () => {
    try {
      setCheckingBlocked(true);
      const response = await authApi.get('/me');
      setIsBlocked(response.data.user.isBlocked);
    } catch (err) {
      console.error('Check blocked error:', err);
      // On 403 blocked, show warning but keep login state
      if (err.response?.status === 403) {
        setIsBlocked(true);
      } else if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
        return;
      }
    } finally {
      setCheckingBlocked(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.post('/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/staff', icon: LayoutDashboard },
    { name: 'Complaints', path: '/staff/complaints', icon: AlertCircle },
    { name: 'Manage Rooms', path: '/staff/manage-rooms', icon: DoorOpen },
    { name: 'Reports', path: '/staff/reports', icon: FileText },
    { name: 'Applications', path: '/staff/applications', icon: ClipboardList },
    { name: 'Tasks', path: '/staff/tasks', icon: CheckSquare },
  ];

  const settingLinks = [
    { name: 'Profile', path: '#', icon: User },
    { name: 'Settings', path: '#', icon: Settings },
    { name: 'Logout', path: '#', icon: LogOut },
  ];

  return (
    <div className="h-screen bg-[#F0F2F5] flex font-sans text-gray-800">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full ${isCollapsed ? 'w-20' : 'w-72'} bg-[#1E3A8A] shadow-xl lg:shadow-none z-50 transform transition-all duration-300 ease-in-out flex flex-col border-r border-[#1E3A8A] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo Section */}
        <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4 lg:px-6'} border-b border-blue-900/50 shadow-[0_1px_0_rgba(255,255,255,0.05)] transition-all`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FFB800] to-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-sm transition-all">
                <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">
                Staff<span className="text-[#FFB800]">Portal</span>
              </h1>
            </div>
          )}
          <div className="flex items-center">
            {!isCollapsed && (
              <button onClick={toggleSidebar} className="lg:hidden p-2 text-blue-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <X size={20} />
              </button>
            )}
            <button onClick={toggleCollapse} className="hidden lg:flex p-1.5 text-blue-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors shrink-0" title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
              {isCollapsed ? <PanelLeft size={24} className="text-[#FFB800]" /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'} mb-3`}>
                 {!isCollapsed ? (
                    <p className="text-[11px] font-bold text-blue-300 uppercase tracking-widest whitespace-nowrap">Menu</p>
                 ) : (
                    <div className="h-[16px]"></div>
                 )}
              </div>
              <nav className="space-y-2">
                {sidebarLinks.map((link, idx) => {
                  const Icon = link.icon;
                  // Handle exact match for Dashboard, prefix match for others to keep active state when inside nested routes
                  const isActive = link.path === '/staff' 
                    ? location.pathname === '/staff' 
                    : location.pathname.startsWith(link.path);
                    
                  return (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                      title={isCollapsed ? link.name : ""}
                      className={`flex items-center ${isCollapsed ? 'justify-center w-12 h-12 mx-auto rounded-xl' : 'px-3 py-2.5 rounded-xl'} text-sm font-medium transition-all relative group ${isActive ? 'bg-white/15 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
                    >
                      <Icon className={`w-[18px] h-[18px] transition-colors ${!isCollapsed && 'mr-3'} ${isActive ? 'text-[#FFB800]' : 'text-blue-300 group-hover:text-white'}`} />
                      {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FFB800] rounded-r-full shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
                      )}
                      {isActive && isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB800] rounded-r-full shadow-[0_0_8px_rgba(255,184,0,0.4)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA] lg:rounded-l-[2.5rem] lg:shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-10 py-6 sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-md">
          <div className="flex items-center flex-1">
            <button onClick={toggleSidebar} className="mr-4 lg:hidden text-gray-500 hover:text-gray-900 transition-colors">
              <Menu size={24} />
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="mr-4 p-2 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-xl transition-all flex items-center gap-2"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-semibold">Home</span>
            </button>
          </div>

          <div className="flex items-center space-x-5 lg:space-x-7">
            <button className="relative text-gray-400 hover:text-gray-800 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#FAFAFA]"></span>
            </button>
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=60" // different avatar for staff
                alt="Staff User"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full shadow-sm object-cover cursor-pointer ring-2 ring-transparent hover:ring-[#FFB800] transition-all"
              />

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-lg py-2 z-50 border border-gray-100 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all animate-in fade-in zoom-in-95 duration-200">
                    {settingLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            if (link.name === 'Logout') {
                              handleLogout();
                            }
                          }}
                          className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                        >
                          <Icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                          {link.name}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 pb-10 pt-4 relative">
          <Outlet />
          {isBlocked && !checkingBlocked && (
            <StaffBlockWarning onLogout={handleLogout} />
          )}
          {checkingBlocked && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
