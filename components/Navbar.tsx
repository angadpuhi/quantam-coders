import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, UserCheck, Languages, PlusCircle, Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Migrant<span className="text-emerald-600">Health</span>
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Kerala Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Digital Health Record Management for Guest Workers
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Languages className="w-4 h-4 mr-1.5 text-emerald-600" />
            <span>Languages: বাংলা | हिन्दी | മലയാളം | ଓଡ଼ିଆ</span>
          </div>

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition"
          >
            Dashboard
          </Link>
          
          <Link
            href="/api/health"
            target="_blank"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition"
          >
            API Status
          </Link>
        </div>
      </div>
    </header>
  );
}
