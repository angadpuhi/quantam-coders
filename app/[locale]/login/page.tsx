"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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
  CheckCircle2,
  Phone,
  Sparkles,
  HeartPulse,
  Building2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";
import { CameraQrScanner } from "@/components/CameraQrScanner";

type LoginRole = "WORKER" | "PROVIDER" | "ADMIN";

function UnifiedLoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const [selectedRole, setSelectedRole] = useState<LoginRole>("WORKER");

  // Worker Form State
  const [workerHealthId, setWorkerHealthId] = useState("");
  const [workerPin, setWorkerPin] = useState("1234");
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Provider / Admin NextAuth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Clean ID lookup (KL-MH-XXXXXX or Phone)
      const res = await fetch(`/api/workers/${encodeURIComponent(query)}`);
      const json = await res.json();

      if (res.ok && json.success && json.data?.worker) {
        const cleanId = json.data.worker.portableHealthId;
        router.push(callbackUrl || `/workers/${encodeURIComponent(cleanId)}`);
        router.refresh();
      } else {
        // Try search by query
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
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Camera QR Scanner Modal */}
      {showQrScanner && (
        <CameraQrScanner
          onScanSuccess={handleQrScanned}
          onClose={() => setShowQrScanner(false)}
        />
      )}

      {/* Main Login Card with Kerala Boat Arch Design */}
      <div className="bg-white border-2 border-kerala-coir-200 rounded-houseboat shadow-xl p-6 sm:p-8 relative overflow-hidden">
        {/* Top Houseboat Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

        {/* Card Top Title */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 mb-3 shadow-xs">
            <Lock className="w-6 h-6 text-kerala-green-800" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Choose your role to access your personalized health services
          </p>
        </div>

        {/* 3 UNIFIED ROLE SELECTION TABS */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-kerala-coir-100 rounded-2xl border border-kerala-coir-200 mb-6">
          {/* 1. Worker Tab */}
          <button
            type="button"
            onClick={() => handleRoleChange("WORKER")}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all min-h-[54px] ${
              selectedRole === "WORKER"
                ? "bg-[#0f3e17] text-white shadow-md ring-2 ring-emerald-400"
                : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4 mb-1" />
            <span className="truncate">Migrant Worker</span>
          </button>

          {/* 2. Provider Tab */}
          <button
            type="button"
            onClick={() => handleRoleChange("PROVIDER")}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all min-h-[54px] ${
              selectedRole === "PROVIDER"
                ? "bg-emerald-800 text-white shadow-md ring-2 ring-emerald-400"
                : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4 mb-1" />
            <span className="truncate">Provider</span>
          </button>

          {/* 3. Admin Tab */}
          <button
            type="button"
            onClick={() => handleRoleChange("ADMIN")}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all min-h-[54px] ${
              selectedRole === "ADMIN"
                ? "bg-amber-800 text-white shadow-md ring-2 ring-amber-400"
                : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-4 h-4 mb-1" />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ROLE FORM 1: MIGRANT WORKER (Health ID + PIN / QR) */}
        {selectedRole === "WORKER" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Password-Free Worker Access</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Guest workers do not require email accounts. Enter your Portable Health ID or scan your card QR code to open your Health Passport.
              </p>
            </div>

            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Portable Health ID or Phone Number
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. KL-MH-829104 or 94371 88201"
                    value={workerHealthId}
                    onChange={(e) => setWorkerHealthId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Security PIN / OTP
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Default demo PIN: 1234
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={workerPin}
                    onChange={(e) => setWorkerPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0f3e17] hover:bg-[#0c2f10] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {loading ? (
                    <span>Opening Passport...</span>
                  ) : (
                    <>
                      <span>Open Health Passport</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrScanner(true)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-bold py-3.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Camera className="w-4 h-4 text-emerald-700 animate-pulse" />
                  <span>Scan Card QR Code</span>
                </button>
              </div>
            </form>

            {/* Quick Demo Worker Selectors */}
            <div className="pt-4 border-t border-kerala-coir-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
                Quick Demo Worker Profiles
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setWorkerHealthId("KL-MH-829104");
                    setWorkerPin("1234");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-300 transition"
                >
                  Bikash Mondal (KL-MH-829104)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkerHealthId("KL-MH-654219");
                    setWorkerPin("1234");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-300 transition"
                >
                  Raju Das (KL-MH-654219)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkerHealthId("KL-MH-773412");
                    setWorkerPin("1234");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-300 transition"
                >
                  Santosh Mohapatra (KL-MH-773412)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROLE FORM 2: HEALTHCARE PROVIDER */}
        {selectedRole === "PROVIDER" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                <span>Doctor &amp; Clinical Staff Portal</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Log in to register workers, log clinical consultations, record diagnostic screenings, and prescribe medications.
              </p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Provider Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="provider@keralahealth.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                {loading ? (
                  <span>Authenticating Provider...</span>
                ) : (
                  <>
                    <span>Sign In to Provider Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-kerala-coir-200 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail("provider@keralahealth.gov.in");
                  setPassword("password123");
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition inline-flex items-center gap-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                <span>Fill Demo Provider Credentials</span>
              </button>
            </div>
          </div>
        )}

        {/* ROLE FORM 3: PUBLIC HEALTH ADMIN */}
        {selectedRole === "ADMIN" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>State Directorate Surveillance Access</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Access aggregated district health telemetry, epidemiological trends, and technical database views.
              </p>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Admin Directorate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@keralahealth.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-700 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                {loading ? (
                  <span>Authenticating Directorate...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-kerala-coir-200 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@keralahealth.gov.in");
                  setPassword("admin123");
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition inline-flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Fill Demo Admin Credentials</span>
              </button>
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 pt-4 border-t border-kerala-coir-200 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-kerala-green-900 hover:text-kerala-green-700 hover:underline"
          >
            ← Return to ArogyaRekha Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-10 px-4 sm:px-6">
      <Suspense
        fallback={
          <div className="text-center text-xs text-slate-400 py-12">
            Loading unified sign in...
          </div>
        }
      >
        <UnifiedLoginForm />
      </Suspense>
    </div>
  );
}
