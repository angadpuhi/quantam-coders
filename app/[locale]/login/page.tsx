"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  User,
  Stethoscope,
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Camera,
  Globe,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { CameraQrScanner } from "@/components/CameraQrScanner";

type LoginRole = "WORKER" | "PROVIDER" | "ADMIN";

const languages = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

function StandaloneLoginForm() {
  const t = useTranslations("login");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const [selectedRole, setSelectedRole] = useState<LoginRole>("WORKER");

  // Worker Form State
  const [workerHealthId, setWorkerHealthId] = useState("KL-MH-829104");
  const [workerPin, setWorkerPin] = useState("1234");
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Provider / Admin NextAuth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Switch role and reset errors
  const handleRoleChange = (role: LoginRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === "PROVIDER") {
      setEmail("provider@keralahealth.gov.in");
      setPassword("password123");
    } else if (role === "ADMIN") {
      setEmail("admin@keralahealth.gov.in");
      setPassword("admin123");
    } else {
      setWorkerHealthId("KL-MH-829104");
      setWorkerPin("1234");
    }
  };

  // Handle Worker Login (via Health ID / OTP)
  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = workerHealthId.trim();
    if (!query) {
      setError("Please enter your Portable Health ID or registered phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Direct lookup by ID
      const res = await fetch(`/api/workers/${encodeURIComponent(query)}`);
      const json = await res.json();

      if (res.ok && json.success && json.data?.worker) {
        const cleanId = json.data.worker.portableHealthId;
        router.push(callbackUrl || `/workers/${encodeURIComponent(cleanId)}`);
        router.refresh();
      } else {
        // Search query fallback
        const listRes = await fetch(`/api/workers?q=${encodeURIComponent(query)}`);
        const listJson = await listRes.json();
        if (listRes.ok && listJson.success && listJson.data?.length > 0) {
          const cleanId = listJson.data[0].portableHealthId;
          router.push(callbackUrl || `/workers/${encodeURIComponent(cleanId)}`);
          router.refresh();
        } else {
          setError(`No worker record found for "${query}". Please check the Health ID or register at a health camp.`);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify worker Health ID.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Provider / Admin Login (NextAuth Credentials)
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const targetUrl =
      callbackUrl || (selectedRole === "ADMIN" ? "/admin" : "/registry");

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

  const handleQrScanned = (scannedId: string) => {
    setShowQrScanner(false);
    setWorkerHealthId(scannedId);
    router.push(`/workers/${encodeURIComponent(scannedId)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfa] text-[#222222] antialiased selection:bg-[#cfe7d3] selection:text-[#0f3e17]">
      {/* Camera QR Scanner Modal */}
      {showQrScanner && (
        <CameraQrScanner
          onScanSuccess={handleQrScanned}
          onClose={() => setShowQrScanner(false)}
        />
      )}

      {/* MINIMAL TOP BAR: Back Link / Logo on Left + Compact Language Dropdown on Right */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
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

        {/* Compact Language Selector Dropdown */}
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

      {/* CENTERED STANDALONE SIGN-IN CARD */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-md bg-white border border-[#e4e2dd] rounded-houseboat shadow-md p-5 sm:p-7 relative overflow-hidden">
          {/* Top Houseboat Wood Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

          {/* Card Header (Tightened Vertical Spacing) */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 mb-2 shadow-2xs">
              <Lock className="w-5 h-5 text-kerala-green-800" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your role to access your personalized health dashboard
            </p>
          </div>

          {/* 3 ROLE TABS (Tightened Layout) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-kerala-coir-100/90 rounded-xl border border-kerala-coir-200 mb-4">
            {/* Worker Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange("WORKER")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "WORKER"
                  ? "bg-[#0f3e17] text-white shadow-xs"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Worker</span>
            </button>

            {/* Provider Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange("PROVIDER")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "PROVIDER"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Provider</span>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange("ADMIN")}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === "ADMIN"
                  ? "bg-amber-800 text-white shadow-xs"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Admin</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* ROLE FORM 1: MIGRANT WORKER */}
          {selectedRole === "WORKER" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <form onSubmit={handleWorkerSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Portable Health ID or Phone Number
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. KL-MH-829104 or 94371 88201"
                      value={workerHealthId}
                      onChange={(e) => setWorkerHealthId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 transition"
                    />
                  </div>
                  {/* Subtle Helper Text under input (replaces full highlighted box) */}
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Password-free access. Enter your Health ID or registered phone.</span>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Security PIN / OTP
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Demo PIN: 1234
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      maxLength={6}
                      value={workerPin}
                      onChange={(e) => setWorkerPin(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0f3e17] hover:bg-[#0c2f10] text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 min-h-[42px]"
                  >
                    {loading ? (
                      <span>Opening...</span>
                    ) : (
                      <>
                        <span>Open Passport</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQrScanner(true)}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 min-h-[42px]"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Scan Card QR</span>
                  </button>
                </div>
              </form>

              {/* Quick Demo Worker Profile Selectors */}
              <div className="pt-3 border-t border-kerala-coir-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
                  Quick Demo Worker Profiles
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkerHealthId("KL-MH-829104");
                      setWorkerPin("1234");
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-medium border border-slate-200 transition"
                  >
                    Bikash (KL-MH-829104)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkerHealthId("KL-MH-654219");
                      setWorkerPin("1234");
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-medium border border-slate-200 transition"
                  >
                    Raju (KL-MH-654219)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkerHealthId("KL-MH-773412");
                      setWorkerPin("1234");
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-medium border border-slate-200 transition"
                  >
                    Santosh (KL-MH-773412)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ROLE FORM 2: HEALTHCARE PROVIDER */}
          {selectedRole === "PROVIDER" && (
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
          )}

          {/* ROLE FORM 3: ADMIN */}
          {selectedRole === "ADMIN" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Admin Directorate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@keralahealth.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-700 transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    State / District Public Health Directorate Surveillance Portal.
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
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-700 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 min-h-[42px]"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Admin Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-kerala-coir-200 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@keralahealth.gov.in");
                    setPassword("admin123");
                  }}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition inline-flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-700" />
                  <span>Fill Demo Admin Credentials</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400 border-t border-[#e4e2dd]/60">
        <p>
          Government of Kerala • Department of Health and Family Welfare • DISHA 1056
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] text-xs text-slate-400">
          Loading sign in portal...
        </div>
      }
    >
      <StandaloneLoginForm />
    </Suspense>
  );
}
