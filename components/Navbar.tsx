"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Activity, Languages, LogIn, LogOut, ShieldAlert, User, Stethoscope, UserPlus } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-kerala-coir-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-kerala-green-800 text-white shadow-md shadow-kerala-green-900/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Migrant<span className="text-kerala-green-800">Health</span>
                </span>
                <span className="text-xs bg-kerala-green-100 text-kerala-green-900 font-semibold px-2 py-0.5 rounded-full border border-kerala-green-200">
                  Kerala
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Digital Health Record System
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation & Auth */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center text-xs font-medium text-slate-600 bg-kerala-coir-50 px-2.5 py-1.5 rounded-lg border border-kerala-coir-200">
            <Languages className="w-4 h-4 mr-1.5 text-kerala-green-800" />
            <span>বাংলা | हिन्दी | മലയാളം | ଓଡ଼ିଆ</span>
          </div>

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-slate-700 hover:text-kerala-green-800 px-2.5 py-1.5 rounded-md hover:bg-kerala-green-50 transition"
          >
            Overview
          </Link>

          <Link
            href="/registry"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-kerala-green-900 bg-kerala-green-50 border border-kerala-green-200 px-3 py-1.5 rounded-lg hover:bg-kerala-green-100 transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-kerala-green-800" />
            <span>Register & Search</span>
          </Link>

          {/* Auth State Button */}
          {status === "loading" ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
          ) : session?.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                {session.user.role === "ADMIN" ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Stethoscope className="w-3.5 h-3.5 text-kerala-green-800" />
                )}
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-800 leading-tight max-w-[120px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      session.user.role === "ADMIN" ? "text-amber-700" : "text-kerala-green-800"
                    }`}
                  >
                    {session.user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg shadow-xs transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
