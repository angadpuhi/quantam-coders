"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  Building2,
  KeyRound,
  CheckCircle,
  HelpCircle,
  Globe,
  UserCheck,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";

function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email address or password. Please verify credentials.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected login error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: "PROVIDER" | "ADMIN") => {
    if (role === "PROVIDER") {
      setEmail("provider@keralahealth.gov.in");
      setPassword("password123");
    } else {
      setEmail("admin@keralahealth.gov.in");
      setPassword("admin123");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Houseboat-window Curved Card */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat shadow-md p-6 sm:p-8 relative overflow-hidden">
        {/* Top Houseboat Wood Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 mb-3 shadow-xs">
            <Lock className="w-6 h-6 text-kerala-green-800" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Healthcare Provider &amp; Admin Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access clinical entry portal, health camp registries, and public health telemetry.
          </p>
        </div>

        {/* Public Access Helper Notice */}
        <div className="mb-6 p-3 bg-kerala-coir-50 border border-kerala-coir-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-kerala-gold-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Guest workers do not require login to view their Health Passport or check scheme eligibility. Login is restricted to authorized Healthcare Providers and Public Health Directorate staff.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t("emailLabel")}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="provider@keralahealth.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-kerala-green-800 to-kerala-green-700 hover:from-kerala-green-900 hover:to-kerala-green-800 text-white font-semibold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            {loading ? (
              <span>{t("authenticatingButton")}</span>
            ) : (
              <>
                <span>Sign In as Provider / Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-kerala-coir-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Demo Access Quick-Fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("PROVIDER")}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 transition text-left flex items-center gap-1.5 min-h-[44px]"
            >
              <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">Provider Demo</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials("ADMIN")}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition text-left flex items-center gap-1.5 min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="truncate">Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Return to Public Worker Lookup */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-kerala-green-900 hover:text-kerala-green-700 hover:underline"
          >
            {t("returnLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-8 px-4">
      <Suspense fallback={<div className="text-center text-xs text-slate-400 py-12">Loading portal login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
