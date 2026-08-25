"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";
import {
  HeartPulse,
  Search,
  Activity,
  LogOut,
  LogIn,
  Shield,
  Stethoscope,
  Menu,
  X,
  Zap,
  FolderOpen,
  Lock,
  HeartHandshake,
  Home,
} from "lucide-react";
import { KeralaPalmIcon } from "@/components/KeralaMotif";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("nav");
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/", label: t("home"), icon: Home, exact: true },
    { href: "/quick-actions", label: t("quickActions"), icon: Zap },
    { href: "/records", label: t("records"), icon: FolderOpen },
    { href: "/privacy", label: t("privacy"), icon: Lock },
    { href: "/schemes", label: t("schemes"), icon: HeartHandshake },
    { href: "/registry", label: t("registerSearch"), icon: Search },
    { href: "/admin", label: t("surveillance"), icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-kerala-coir-200 shadow-xs">
      {/* Top Gold / Houseboat Wood Accent Strip */}
      <div className="h-1 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-kerala-green-900 text-white flex items-center justify-center shadow-xs group-hover:bg-kerala-green-950 transition-colors border border-kerala-gold-500/40 relative overflow-hidden">
              <KeralaPalmIcon className="w-5 h-5 text-kerala-gold-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  {t("brand")}
                  <span className="text-kerala-green-800">{t("brandAccent")}</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-kerala-gold-100 text-kerala-gold-900 border border-kerala-gold-300 uppercase tracking-wider">
                  {t("keralaBadge")}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                {t("subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-kerala-green-900 text-white shadow-xs"
                      : "text-slate-700 hover:text-kerala-green-900 hover:bg-kerala-coir-100/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-kerala-gold-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Switcher & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Working Language Switcher Dropdown */}
            <LanguageSwitcher />

            {/* User Session or Staff Login */}
            {status === "authenticated" && session ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {session.user?.name || "Staff Member"}
                  </span>
                  <span className="text-[10px] font-semibold text-kerala-gold-800 flex items-center justify-end gap-1">
                    <Shield className="w-2.5 h-2.5 text-kerala-gold-700" />
                    {(session.user as any)?.role || "STAFF"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title={t("signOut")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 p-2 rounded-xl border border-slate-200 transition"
                >
                  <LogOut className="w-4 h-4 text-slate-600 hover:text-red-600" />
                  <span className="hidden sm:inline">{t("signOut")}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 bg-kerala-green-850 hover:bg-kerala-green-950 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition border border-kerala-green-900"
              >
                <LogIn className="w-3.5 h-3.5 text-kerala-gold-400" />
                <span className="hidden sm:inline">{t("staffLogin")}</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-kerala-coir-200 bg-white/95 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-kerala-green-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-kerala-coir-100/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-kerala-gold-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
