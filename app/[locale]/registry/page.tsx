"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  UserPlus,
  Search,
  Users,
  ShieldCheck,
  Building,
  HeartHandshake,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";
import { WorkerRegistrationForm } from "@/components/WorkerRegistrationForm";
import { WorkerSearchLookup } from "@/components/WorkerSearchLookup";

import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function RegistryPage() {
  const t = useTranslations("registry");
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"search" | "register">("search");

  const role = session?.user?.role === "STAFF" ? "PROVIDER" : session?.user?.role;
  const isStaff = role === "PROVIDER" || role === "ADMIN";

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center text-sm text-slate-400">
        Loading...
      </div>
    );
  }

  if (!session || !isStaff) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-700 border border-red-200 mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Restricted to Health Staff</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          The Worker Registry (search and registration) is only accessible to signed-in
          Providers and Admins. Workers can view their own record from the Worker Health
          Portal login.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[#0f3e17] text-white text-sm font-bold shadow-xs"
        >
          <LogIn className="w-4 h-4" />
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Kerala Backwater Coastal Themed Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        {/* Subtle Coconut Palm & Banana Leaf Motif Overlay */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t("heroDesc")}
          </p>

          {/* Key Info Badges */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 text-emerald-100">
              ✓ {t("chipDistricts")}
            </span>
            <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 text-emerald-100">
              ✓ {t("chipFacilities")}
            </span>
            <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 text-emerald-100">
              ✓ {t("chipAwaaz")}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Houseboat Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kerala-coir-200 pb-2">
        <div className="flex space-x-2 p-1.5 bg-kerala-coir-100 rounded-2xl border border-kerala-coir-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "search"
                ? "bg-white text-kerala-green-900 shadow-sm border border-kerala-coir-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Search className="w-4 h-4 text-kerala-green-800" />
            <span>{t("tabSearch")}</span>
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "register"
                ? "bg-kerala-green-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t("tabRegister")}</span>
          </button>
        </div>

        {/* Staff Quick Status */}
        {!session && (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Staff member?</span>
            <Link
              href="/login"
              className="font-bold text-kerala-green-900 hover:underline flex items-center gap-1"
            >
              <span>{t("staffLoginPrompt")}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === "search" ? (
          <WorkerSearchLookup />
        ) : (
          <WorkerRegistrationForm />
        )}
      </div>
    </div>
  );
}
