"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  Stethoscope,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Globe,
  ArrowLeft,
} from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

function StaffLoginForm() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const [email, setEmail] = useState("provider@keralahealth.gov.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetUrl = callbackUrl || "/registry";

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl: targetUrl,
      });

      if (result?.error) {
        setError("Invalid email address or password. Please verify credentials.");
      } else if (result?.ok) {
        router.push(targetUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected login error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfa] text-[#222222] antialiased selection:bg-[#cfe7d3] selection:text-[#0f3e17]">
      {/* TOP BAR */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 group text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0f3e17] transition-colors focus:outline-hidden"
        >
          <ArrowLeft className="w-4 h-4 text-[#0f3e17] transition-transform group-hover:-translate-x-1" />
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-md bg-[#0f3e17] flex items-center justify-center shadow-2xs"
              aria-hidden="true"
            >
              <span className="w-2 h-2 rounded-[1.5px] bg-[#e1f4df]" />
            </span>
            <span className="font-display text-lg tracking-tight text-[#0f3e17] leading-none">
              ArogyaRekha
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 bg-white border border-[#e4e2dd] rounded-lg px-2.5 py-1 text-xs shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={currentLocale}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            aria-label="Select Language"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* STAFF LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-md bg-white border border-[#e4e2dd] rounded-houseboat shadow-md p-5 sm:p-7 relative overflow-hidden">
          {/* Top Accent Line - Emerald */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-600" />

          {/* Card Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 mb-2 shadow-2xs">
              <Stethoscope className="w-5 h-5 text-emerald-800" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Staff Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized Doctors, Nurses, and Health Camp Staff
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Staff Login Form */}
          <div className="space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Provider Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="provider@keralahealth.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Authorized Doctors, Nurses, and Health Camp Staff.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 min-h-[42px]"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Provider Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-kerala-coir-200 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail("provider@keralahealth.gov.in");
                  setPassword("password123");
                }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition inline-flex items-center gap-1"
              >
                <Stethoscope className="w-3 h-3 text-emerald-700" />
                <span>Fill Demo Provider Credentials</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400 border-t border-[#e4e2dd]/60">
        <p>
          Government of Kerala • Department of Health and Family Welfare • DISHA 1056
        </p>
      </footer>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] text-xs text-slate-400">
          Loading staff sign in portal...
        </div>
      }
    >
      <StaffLoginForm />
    </Suspense>
  );
}
