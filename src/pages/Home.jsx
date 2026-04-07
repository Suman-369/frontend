import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  Users,
  GraduationCap,
  Star,
  Palette,
  Megaphone,
  Code2,
  BarChart3,
  Briefcase,
  ArrowUp,
  Sparkles,
} from "lucide-react";

/** Lucide no longer ships brand icons; simple inline SVGs for footer links. */
function IconFacebook(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function IconTwitter(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}
function IconLinkedin(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconInstagram(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Hostels", href: "#courses" },
  { label: "Wardens", href: "#mentors" },
  { label: "About", href: "#about" },
];

const categories = [
  {
    title: "Room Allotment",
    count: "Single, Double & Triple Rooms",
    icon: Palette,
    iconBg: "bg-sky-100 text-sky-600",
    active: false,
  },
  {
    title: "Mess & Dining",
    count: "Breakfast, Lunch & Dinner",
    icon: Megaphone,
    iconBg: "bg-white text-white",
    active: true,
  },
  {
    title: "Wi-Fi & Laundry",
    count: "24/7 High-Speed Internet",
    icon: Code2,
    iconBg: "bg-violet-100 text-violet-600",
    active: false,
  },
  {
    title: "Fee & Payments",
    count: "Online Payment Portal",
    icon: BarChart3,
    iconBg: "bg-emerald-100 text-emerald-600",
    active: false,
  },
  {
    title: "Complaints & Support",
    count: "24/7 Warden Helpdesk",
    icon: Briefcase,
    iconBg: "bg-amber-100 text-amber-600",
    active: false,
  },
  {
    title: "Security & CCTV",
    count: "Round-the-Clock Surveillance",
    icon: Sparkles,
    iconBg: "bg-rose-100 text-rose-600",
    active: false,
  },
];

const courses = [
  {
    tag: "Boys Hostel",
    title: "Block A – Standard Double Rooms",
    students: "120",
    rating: "4.8",
    price: "₹8,500/mo",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
  },
  {
    tag: "Girls Hostel",
    title: "Block B – Premium Single Rooms",
    students: "96",
    rating: "4.9",
    price: "₹11,000/mo",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  },
  {
    tag: "Boys Hostel",
    title: "Block C – Triple Sharing Rooms",
    students: "180",
    rating: "4.6",
    price: "₹6,200/mo",
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80",
  },
  {
    tag: "Girls Hostel",
    title: "Block D – AC Double Rooms",
    students: "110",
    rating: "4.9",
    price: "₹13,500/mo",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  },
  {
    tag: "International",
    title: "Block E – International Student Wing",
    students: "48",
    rating: "4.8",
    price: "₹15,000/mo",
    image:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&q=80",
  },
  {
    tag: "PG Hostel",
    title: "Block F – Postgraduate Residency",
    students: "72",
    rating: "4.7",
    price: "₹10,000/mo",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
];

const testimonials = [
  {
    quote:
      "The hostel management system made check-in so smooth. Room allocation was done within minutes and the warden was always available.",
    name: "Priya Sharma",
    role: "B.Tech 3rd Year",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    featured: false,
  },
  {
    quote:
      "From mess menus to fee payments, everything is managed through one portal. I never have to run around offices anymore—it's a huge relief.",
    name: "Arjun Mehta",
    role: "M.Sc 1st Year",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    featured: true,
  },
  {
    quote:
      "Raising a maintenance complaint took less than two minutes. The staff resolved it the very next day. Really impressed with the response time.",
    name: "Sneha Dutta",
    role: "MBA 2nd Year",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80",
    featured: false,
  },
];

const footerLinks = {
  Links: ["Home", "Hostels", "Wardens", "Pricing"],
  Community: ["Notice Board", "Events", "Alumni", "Partners"],
  Resources: ["Help Center", "Terms", "Privacy", "Careers"],
};

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-indigo-600"
          >
            HMS
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <Link
                to={`/${user.role === 'staff' ? 'staff' : user.role === 'admin' ? 'admin' : 'student'}`}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-4 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 text-sm font-medium text-slate-700"
              >
                <img
                  src="https://i.pravatar.cc/150?img=33"
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-slate-700 hover:text-indigo-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-slate-100" />
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="text-left text-base font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Install App
                </button>
              )}
              {user ? (
                <Link
                  to={`/${user.role === 'staff' ? 'staff' : user.role === 'admin' ? 'admin' : 'student'}`}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-base font-medium text-slate-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src="https://i.pravatar.cc/150?img=33"
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-base font-medium text-slate-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Getting <span className="text-indigo-600">Quality</span> Hostels
              Is Now More <span className="text-indigo-600">Easy</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Manage room allotments, mess schedules, fee payments, and
              complaints—all from one smart platform built for college students
              and hostel staff.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="relative order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-[min(90vw,420px)] w-[min(90vw,420px)] sm:h-[400px] sm:w-[400px]">
              <div className="absolute -right-4 -top-6 h-32 w-32 rounded-full bg-indigo-200/60 blur-2xl" />
              <div className="absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-violet-200/50 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/80" />
              <div className="absolute left-1/2 top-1/2 z-10 h-[min(75vw,340px)] w-[min(75vw,340px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-[320px] sm:w-[320px]">
                <img
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"
                  alt="College hostel building"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-14 max-w-7xl rounded-2xl bg-indigo-50/80 px-4 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col items-stretch justify-between gap-8 sm:flex-row sm:items-center sm:gap-6 lg:justify-around">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                  20+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Hostel Blocks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                  50+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Wardens & Staff
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                  3,000+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Students Housed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Services */}
      <section
        id="mentors"
        className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Explore hostel services
              </h2>
              <p className="mt-2 max-w-lg text-slate-500">
                Everything you need for a comfortable stay—from room booking to
                mess, laundry, and beyond.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 self-start rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:self-auto"
            >
              All Services
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.active;
              return (
                <div
                  key={cat.title}
                  className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 shadow-sm transition ${
                    isActive
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                      : "border-slate-100 bg-white hover:border-indigo-100"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isActive ? "bg-white/20 text-white" : cat.iconBg
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        isActive ? "text-indigo-100" : "text-slate-500"
                      }`}
                    >
                      {cat.count}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hostel Blocks */}
      <section
        id="courses"
        className="scroll-mt-24 bg-slate-50/80 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Available hostel blocks
              </h2>
              <p className="mt-2 text-slate-500">
                Browse blocks and room types that best suit your needs.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto"
            >
              See All Blocks
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={course.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                    {course.tag}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {course.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <span>{course.students} seats</span>
                    <span className="flex items-center gap-1 font-medium text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </span>
                    <span className="font-bold text-slate-900">
                      {course.price}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mx-auto mb-12 max-w-3xl text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            What our residents are saying about us
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                  t.featured
                    ? "border-indigo-600 bg-indigo-600 text-white md:scale-[1.02] md:shadow-lg"
                    : "border-slate-100 bg-white"
                }`}
              >
                <p
                  className={`flex-1 text-sm leading-relaxed ${
                    t.featured ? "text-indigo-50" : "text-slate-600"
                  }`}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        t.featured ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {t.name}
                    </p>
                    <p
                      className={`text-xs ${
                        t.featured ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        t.featured
                          ? "fill-amber-300 text-amber-300"
                          : "fill-amber-400 text-amber-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-slate-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Subscribe for Updates
          </h2>
          <p className="mt-2 text-slate-500">
            Get notified about room availability, mess menus, and hostel
            announcements.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your college email"
              className="min-h-12 flex-1 rounded-xl border border-slate-200 px-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="scroll-mt-24 border-t border-slate-100 bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <p className="text-xl font-bold text-indigo-600">HMS</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
                Hostel Management System — simplifying student accommodation
                for colleges across the country.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="Facebook"
                >
                  <IconFacebook />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="Twitter"
                >
                  <IconTwitter />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="LinkedIn"
                >
                  <IconLinkedin />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  aria-label="Instagram"
                >
                  <IconInstagram />
                </a>
              </div>
            </div>
            {Object.entries(footerLinks).map(([heading, items]) => (
              <div key={heading}>
                <h3 className="font-semibold text-slate-900">{heading}</h3>
                <ul className="mt-4 space-y-2">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 transition hover:text-indigo-600"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} HMS – Hostel Management System. All rights reserved.
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;