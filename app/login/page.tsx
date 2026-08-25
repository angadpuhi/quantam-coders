"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, ShieldCheck, Stethoscope, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const fillCredentials = (role: "STAFF" | "ADMIN") => {
    if (role === "STAFF") {
      setEmail("staff@keralahealth.gov.in");
      setPassword("staff123");
    } else {
      setEmail("admin@keralahealth.gov.in");
      setPassword("admin123");
    }
    setError(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200 mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Kerala Health Portal Login</h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized access for Facility Healthcare Staff and System Administrators
        </p>
      </div>

      {/* Public Notice */}
      <div className="mb-6 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Public Access Note:</strong> Worker health record lookup by Portable Health ID requires <em>no login</em>. Log in below only for clinical modifications, screenings, or administrative actions.
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@keralahealth.gov.in"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Quick-Fill Roles */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
          Quick Fill Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillCredentials("STAFF")}
            className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-medium text-slate-700 hover:text-emerald-800 transition"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Staff (Dr. Ananya)</span>
          </button>
          <button
            type="button"
            onClick={() => fillCredentials("ADMIN")}
            className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-xs font-medium text-slate-700 hover:text-amber-800 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Directorate Admin</span>
          </button>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-5 text-center">
        <Link href="/" className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline">
          ← Return to Public Worker Lookup
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center animate-pulse">
            <div className="h-10 w-10 bg-emerald-100 rounded-xl mx-auto mb-4" />
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
