import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, InfoIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import AuthLayout, {
  BrandMark,
  DividerWithText,
  SocialButtons,
} from "../components/auth/AuthLayout";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import hostelHero from "../assets/hostel.jpg";
import api from "../lib/api";

const BASE_URL = import.meta.env.VITE_AUTH_API_URL;

const primary =
  "bg-[#5D3891] hover:bg-[#4d2f7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5D3891]";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    variant: "default",
    title: "",
    description: "",
  });

  const showAlert = ({ variant, title, description }) => {
    setAlert({ visible: true, variant, title, description });
  };

  const hideAlert = () => setAlert((prev) => ({ ...prev, visible: false }));

  const goToRedirect = (redirectTo) => {
    if (!redirectTo) {
      navigate("/");
      return;
    }

    if (redirectTo.includes("/student")) navigate("/student");
    else if (redirectTo.includes("/staff")) navigate("/staff");
    else if (redirectTo.includes("/admin")) navigate("/admin");
    else navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      const msg = "Please provide both email and password.";
      showAlert({
        variant: "info",
        title: "Missing credentials",
        description: msg,
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/login", { email, password });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      if (data.token) {
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=None; Secure;`;
      }

      showAlert({
        variant: "success",
        title: "Login successful",
        description: "Welcome back! Redirecting in 2 seconds...",
      });

      setTimeout(() => {
        hideAlert();
        goToRedirect(data.redirectTo);
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      showAlert({
        variant: "destructive",
        title: "Login failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/google`;
  };

  return (
    <AuthLayout heroImage={hostelHero} fullWidth>
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex shrink-0 rounded-full p-2 text-neutral-600 transition hover:bg-gray-100 hover:text-neutral-900"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <BrandMark className="min-w-0 shrink-0" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Login to your account
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Welcome back! Enter your details to log in to your account
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-semibold text-gray-500"
          >
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-gray-400 focus:border-[#5D3891] focus:outline-none focus:ring-2 focus:ring-[#5D3891]/20"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-xs font-semibold text-gray-500"
          >
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your Password"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-gray-400 focus:border-[#5D3891] focus:outline-none focus:ring-2 focus:ring-[#5D3891]/20"
          />
        </div>

        {alert.visible && (
          <Alert variant={alert.variant} className="mt-4">
            {alert.variant === "success" && (
              <CheckCircle2 className="h-4 w-4 text-white" />
            )}
            {alert.variant === "info" && (
              <InfoIcon className="h-4 w-4 text-white" />
            )}
            {alert.variant === "destructive" && (
              <AlertTriangle className="h-4 w-4 text-white" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
            <AlertAction>
              <Button 
                variant="outline" 
                size="xs" 
                onClick={hideAlert} 
                className="opacity-100 visible flex bg-white text-gray-900 border-gray-200 hover:bg-gray-100 shadow-sm"
              >
                Dismiss
              </Button>
            </AlertAction>
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition ${primary} ${loading ? "opacity-70" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <DividerWithText>Or continue with</DividerWithText>
      <SocialButtons onGoogleClick={handleGoogleLogin} />

      <p className="mt-8 text-center text-sm text-gray-500">
        New here?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#5D3891] underline underline-offset-2 hover:text-[#4d2f7a]"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
