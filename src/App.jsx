import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentPage from "./dashboards/Students/StudentDashboard.jsx";
import MyRoom from "./dashboards/Students/MyRoom.jsx";
import Vacancy from "./dashboards/Students/Vacancy.jsx";
import Complaints from "./dashboards/Students/Complaints.jsx";
import DashboardHome from "./dashboards/Students/DashboardHome.jsx";

// Staff Dashboard Imports
import StaffDashboard from "./dashboards/Staff/DashBoard.jsx";
import StaffDashboardHome from "./dashboards/Staff/DashboardHome.jsx";
import StaffComplain from "./dashboards/Staff/Complain.jsx";
import StaffComplaintDetail from "./dashboards/Staff/ComplaintDetail.jsx";
import StaffManageRoom from "./dashboards/Staff/ManageRoom.jsx";
import StaffReports from "./dashboards/Staff/Reports.jsx";
import StaffApplication from "./dashboards/Staff/Application.jsx";
import StaffMyTasks from "./dashboards/Staff/MyTasks.jsx";

// Admin Dashboard Imports
import AdminDashboard from "./dashboards/admin/Dashboard.jsx";
import AdminDashboardHome from "./dashboards/admin/DashboardHome.jsx";
import AdminReports from "./dashboards/admin/Reports.jsx";
import AdminSettings from "./dashboards/admin/Settings.jsx";
import AdminStaffManagement from "./dashboards/admin/StaffManagement.jsx";
import AdminWorkAssign from "./dashboards/admin/WorkAssign.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/success" element={<AuthSuccess />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student" element={<StudentPage />}>
                <Route index element={<DashboardHome />} />
                <Route path="myroom" element={<MyRoom />} />
                <Route path="vacancy" element={<Vacancy />} />
                <Route path="complaints" element={<Complaints />} />
              </Route>
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
              <Route path="/staff" element={<StaffDashboard />}>
                <Route index element={<StaffDashboardHome />} />
                <Route path="complaints" element={<StaffComplain />} />
                <Route
                  path="complaints/:id"
                  element={<StaffComplaintDetail />}
                />
                <Route path="manage-rooms" element={<StaffManageRoom />} />
                <Route path="reports" element={<StaffReports />} />
                <Route path="applications" element={<StaffApplication />} />
                <Route path="tasks" element={<StaffMyTasks />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminDashboardHome />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route
                  path="staff-management"
                  element={<AdminStaffManagement />}
                />
                <Route path="work-assign" element={<AdminWorkAssign />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
