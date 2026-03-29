import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentPage from "./dashboards/StudentPage";
import StaffPage from "./dashboards/StaffPage";
import AdminPage from "./dashboards/AdminPage";
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
