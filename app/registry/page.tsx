"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  UserPlus,
  Search,
  Activity,
  Stethoscope,
  ShieldCheck,
  Building2,
  HeartPulse,
  Sparkles,
  LogIn,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";
import { WorkerRegistrationForm } from "@/components/WorkerRegistrationForm";
import { WorkerSearchLookup } from "@/components/WorkerSearchLookup";
import Link from "next/link";

export default function WorkerRegistryPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"search" | "register">("search");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Kerala Coastal & Backwater Themed Hero Header */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        {/* Subtle Palm & Banana Leaf Motif Overlay */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Decorative Golden Ambient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <HeartPulse className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>Kerala State Guest Worker Health Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Worker Registration & Health Registry
          </h1>

          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Unified digital health records for guest workers (*Athidhi Thozhilalikal*). Issue portable health identifiers, track continuous clinical visits across districts, and monitor occupational health.
          </p>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-6 pt-5 border-t border-white/15 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-kerala-gold-400 animate-pulse" />
              <span>14 Districts Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-kerala-gold-300" />
              <span>PHCs, CHCs & Mobile Camps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-kerala-gold-300" />
              <span>Awaaz Insurance Linkage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Reminiscent of Houseboat Deck Woodwork */}
      <div className="flex items-center justify-between border-b border-kerala-coir-200 pb-1">
        <div className="flex space-x-2 sm:space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "search"
                ? "bg-kerala-green-800 text-white shadow-md shadow-kerala-green-900/20"
                : "bg-white text-slate-700 hover:bg-kerala-green-50 hover:text-kerala-green-900 border border-slate-200"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & View Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "register"
                ? "bg-kerala-green-800 text-white shadow-md shadow-kerala-green-900/20"
                : "bg-white text-slate-700 hover:bg-kerala-green-50 hover:text-kerala-green-900 border border-slate-200"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Worker</span>
          </button>
        </div>

        {!session && (
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1.5 text-xs text-kerala-green-800 font-semibold bg-kerala-green-50 hover:bg-kerala-green-100 border border-kerala-green-200 px-3 py-2 rounded-xl transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Facility Staff Login</span>
          </Link>
        )}
      </div>

      {/* Active Tab Content */}
      <div className="transition-all duration-200">
        {activeTab === "search" ? (
          <WorkerSearchLookup />
        ) : (
          <WorkerRegistrationForm
            onWorkerCreated={(worker) => {
              // Optionally stay or offer tab switch
            }}
          />
        )}
      </div>
    </div>
  );
}
