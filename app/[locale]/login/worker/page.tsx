"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  User,
  Lock,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Camera,
  Globe,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { CameraQrScanner } from "@/components/CameraQrScanner";

const languages = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

function WorkerLoginForm() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const [workerHealthId, setWorkerHealthId] = useState("KL-MH-829104");
  const [workerPin, setWorkerPin] = useState("1234");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = workerHealthId.trim();
    const pin = workerPin.trim();

    if (!query) {
      setError("Please enter your Portable Health ID or registered phone number.");
      return;
    }

    if (!pin) {
      setError("Please enter your 4-digit Security PIN.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Authenticate via authentic NextAuth worker session with server-side PIN verification
      const result = await signIn("worker-credentials", {
        redirect: false,
        portableHealthId: query,
        pin,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Read clean worker ID and redirect to their personal passport
      const cleanId = query.toUpperCase().startsWith("KL-MH-") ? query.toUpperCase() : query;
      const targetUrl = callbackUrl || `/workers/${encodeURIComponent(cleanId)}`;
      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate worker.");
      setLoading(false);
    }
  };

  const handleQrScanned = async (scannedId: string) => {
    setShowQrScanner(false);
    setWorkerHealthId(scannedId);
    setLoading(true);
    setError(null);

    // Auto-attempt sign in with demo PIN 1234 on QR scan
    try {
      const result = await signIn("worker-credentials", {
        redirect: false,
        portableHealthId: scannedId,
        pin: "1234",
      });

      if (result?.error) {
        setError(`Scanned Card ${scannedId}: ${result.error}. Please verify your PIN.`);
        setLoading(false);
        return;
      }

      router.push(callbackUrl || `/workers/${encodeURIComponent(scannedId)}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with scanned QR card.");
      setLoading(false);
    }
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

      {/* WORKER LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-md bg-white border border-[#e4e2dd] rounded-houseboat shadow-md p-5 sm:p-7 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0f3e17] via-[#1a5c25] to-[#2d7a3a]" />

          {/* Card Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-[#0f3e17] border border-emerald-200 mb-2 shadow-2xs">
              <User className="w-5 h-5 text-[#0f3e17]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Worker Health Portal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your Athidhi Swasthya Passport using your Portable Health ID
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Worker Login Form */}
          <div className="space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleWorkerSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Portable Health ID or Registered Phone
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
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Verified session tied to your Kerala Health ID.</span>
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    4-Digit Security PIN
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Demo PIN: 1234
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
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
                    <span>Authenticating PIN...</span>
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
                Quick Demo Worker Profiles (PIN: 1234)
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
                  Debabrata (KL-MH-829104)
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

export default function WorkerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] text-xs text-slate-400">
          Loading worker sign in portal...
        </div>
      }
    >
      <WorkerLoginForm />
    </Suspense>
  );
}
