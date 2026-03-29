import React from "react";

/** Small geometric mark matching the template style */
export function BrandMark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        className="h-8 w-8 shrink-0 text-neutral-900"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M16 2L19.09 11.26L28 12L19.09 12.74L16 22L12.91 12.74L4 12L12.91 11.26L16 2Z"
          fill="currentColor"
        />
        <path
          d="M16 10L17.45 14.55L22 16L17.45 17.45L16 22L14.55 17.45L10 16L14.55 14.55L16 10Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-neutral-900">
        Hostel
      </span>
    </div>
  );
}

const defaultHeroSrc = "/auth-hero.png";

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.heroImage] — URL from import (e.g. hostel.jpg) or public path; defaults to template image
 * @param {boolean} [props.fullWidth] — span full viewport width (no max-width card, no side gutters)
 */
export default function AuthLayout({ children, heroImage, fullWidth = false }) {
  const src = heroImage ?? defaultHeroSrc;

  if (fullWidth) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-gray-100 font-sans lg:flex-row">
        {/* Image column */}
        <div className="relative flex w-full shrink-0 flex-col justify-center bg-neutral-200 lg:w-1/2 lg:min-h-screen">
          <div className="relative h-48 w-full sm:h-56 lg:absolute lg:inset-0 lg:h-full">
            <div className="absolute inset-0 p-0 lg:p-6">
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover object-center lg:rounded-3xl lg:shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="flex w-full flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:min-h-screen lg:w-1/2 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 font-sans sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] lg:flex lg:min-h-[min(640px,90vh)]">
        {/* Image column */}
        <div className="relative flex w-full shrink-0 flex-col justify-center bg-[#f3efe8] lg:w-[min(44%,480px)]">
          <div className="relative h-52 w-full sm:h-64 lg:h-full lg:min-h-[560px]">
            <div className="absolute inset-0 p-4 sm:p-5 lg:p-8">
              <img
                src={src}
                alt=""
                className="h-full w-full rounded-3xl object-cover object-center shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-16">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function DividerWithText({ children }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-gray-400">{children}</span>
      </div>
    </div>
  );
}

export function SocialButtons({ onGoogleClick }) {
  const handleGoogle = () => {
    if (onGoogleClick) {
      onGoogleClick();
      return;
    }

    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-gray-100 px-4 py-3.5 text-sm font-medium text-neutral-800 transition hover:bg-gray-200/90"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
