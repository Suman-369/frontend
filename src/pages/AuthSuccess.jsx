import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userParam = searchParams.get("user");
    const tokenParam = searchParams.get("token");
    if (userParam) {
      try {
        const user = JSON.parse(userParam);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        localStorage.setItem("token", tokenParam);
        document.cookie = `token=${tokenParam}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=None; Secure; domain=localhost;`;

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "staff") {
          navigate("/staff");
        } else {
          navigate("/student");
        }
      } catch (err) {
        console.error("Failed to parse user data from Auth callback", err);
        navigate("/login");
      }
    } else {
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-600 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-[#5D3891] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
