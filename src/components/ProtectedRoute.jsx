import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userString = localStorage.getItem('user');
  const role = localStorage.getItem('role');

  if (!userString || !role) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // If user is logged in but trying to access an unauthorized route
      // Redirect to their own dashboard
      const redirectMap = {
        student: '/student',
        staff: '/staff',
        admin: '/admin',
      };
      const redirectPath = redirectMap[user.role] || '/login';
      return <Navigate to={redirectPath} replace />;
    }
  } catch (err) {
    // Invalid JSON or corrupted user data
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
