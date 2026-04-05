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

const inputClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-neutral-900 placeholder:text-gray-400 focus:border-[#5D3891] focus:outline-none focus:ring-2 focus:ring-[#5D3891]/20";

const labelClass = "mb-2 block text-xs font-semibold text-gray-500";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
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

    if (!email || !firstName || !lastName || !password) {
      const msg = "All fields are required.";
      showAlert({
        variant: "info",
        title: "Missing details",
        description: msg,
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/register", {
        email,
        password,
        role,
        fullname: {
          firstName,
          lastName,
        },
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      if (data.token) localStorage.setItem("token", data.token);

      showAlert({
        variant: "success",
        title: "Registration successful",
        description: "Account created. Redirecting in 2 seconds...",
      });

      setTimeout(() => {
        hideAlert();
        goToRedirect(data.redirectTo);
      }, 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
      showAlert({
        variant: "destructive",
        title: "Registration error",
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
        Create your account
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Join us — enter your details and choose how you will use Hostel
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-email" className={labelClass}>
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className={labelClass}>
              First name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              placeholder="First name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="last-name" className={labelClass}>
              Last name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              placeholder="Last name"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className={labelClass}>
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter your password"
            className={inputClass}
          />
        </div>

        <fieldset className="space-y-3 pt-1">
          <legend className="mb-2 block text-xs font-semibold text-gray-500">
            Register as
          </legend>
          <p className="sr-only">Choose Staff or Student</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3 transition has-[:checked]:border-[#5D3891] has-[:checked]:bg-[#5D3891]/5">
              <input
                type="radio"
                name="role"
                value="staff"
                checked={role === "staff"}
                onChange={() => setRole("staff")}
                className="h-4 w-4 shrink-0 border-gray-300 text-[#5D3891] focus:ring-2 focus:ring-[#5D3891]/30"
              />
              <span className="text-sm font-medium text-neutral-800">
                Staff
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3 transition has-[:checked]:border-[#5D3891] has-[:checked]:bg-[#5D3891]/5">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="h-4 w-4 shrink-0 border-gray-300 text-[#5D3891] focus:ring-2 focus:ring-[#5D3891]/30"
              />
              <span className="text-sm font-medium text-neutral-800">
                Student
              </span>
            </label>
          </div>
        </fieldset>

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
          className={`mt-2 w-full rounded-2xl py-3.5 text-sm font-semibold text-white transition ${primary} ${loading ? "opacity-70" : ""}`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <DividerWithText>Or continue with</DividerWithText>
      <SocialButtons onGoogleClick={handleGoogleLogin} />

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#5D3891] underline underline-offset-2 hover:text-[#4d2f7a]"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
