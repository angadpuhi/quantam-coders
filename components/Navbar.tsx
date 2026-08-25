"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Activity,
  LogOut,
  LogIn,
  Shield,
  Menu,
  X,
  Zap,
  FolderOpen,
  Lock,
  HeartHandshake,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "ml", label: "മലയാളം" },
    { code: "hi", label: "हिन्दी" },
    { code: "bn", label: "বাংলা" },
    { code: "or", label: "ଓଡ଼ିଆ" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Utility Bar matching ArogyaRekha design */}
      <div className="bg-[#0f3e17] text-[#fffefc] text-xs border-b border-[#0c2f10]/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Choose language">
            <span className="text-[11px] font-semibold text-[#b1dbb8] mr-1 hidden sm:inline">
              Languages:
            </span>
            {languages.map((lang) => {
              const isCurrent = currentLocale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`px-2.5 py-0.5 rounded-pill text-[11px] transition font-medium tracking-wide ${
                    isCurrent
                      ? "bg-[#fffefc] text-[#0f3e17] font-semibold shadow-2xs"
                      : "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#cfe7d3]">
            <PhoneCall className="w-3 h-3 text-[#b1dbb8]" />
            <span>Kerala DISHA Helpline: <strong>1056</strong> / 1800-425-1425</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="bg-[#fffefc]/95 backdrop-blur-md border-b border-[#efeeeb] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo matching ArogyaRekha visual identity */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-hidden"
            >
              <span
                className="w-7 h-7 rounded-[7px] bg-[#0f3e17] flex items-center justify-center relative shadow-2xs group-hover:bg-[#0c2f10] transition-colors shrink-0"
                aria-hidden="true"
              >
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#e1f4df]" />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-normal tracking-tight text-[#0f3e17] leading-none">
                  ArogyaRekha
                </span>
                <span className="text-[10px] text-[#222222]/70 font-medium tracking-wider uppercase mt-0.5">
                  MigrantHealth Kerala
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7 text-[14px] text-[#222222]">
              <Link
                href="/#features"
                className="hover:text-[#0f3e17] transition-colors py-1.5"
              >
                What&apos;s inside
              </Link>
              <Link
                href="/#how-it-works"
                className="hover:text-[#0f3e17] transition-colors py-1.5"
              >
                How it works
              </Link>
              <Link
                href="/quick-actions"
                className={`hover:text-[#0f3e17] transition-colors py-1.5 ${
                  isActive("/quick-actions") ? "text-[#0f3e17] font-semibold" : ""
                }`}
              >
                {t("quickActions")}
              </Link>
              <Link
                href="/records"
                className={`hover:text-[#0f3e17] transition-colors py-1.5 ${
                  isActive("/records") ? "text-[#0f3e17] font-semibold" : ""
                }`}
              >
                {t("records")}
              </Link>
              <Link
                href="/schemes"
                className={`hover:text-[#0f3e17] transition-colors py-1.5 ${
                  isActive("/schemes") ? "text-[#0f3e17] font-semibold" : ""
                }`}
              >
                {t("schemes")}
              </Link>
              <Link
                href="/privacy"
                className={`hover:text-[#0f3e17] transition-colors py-1.5 ${
                  isActive("/privacy") ? "text-[#0f3e17] font-semibold" : ""
                }`}
              >
                {t("privacy")}
              </Link>
              <Link
                href="/registry"
                className={`hover:text-[#0f3e17] transition-colors py-1.5 ${
                  isActive("/registry") ? "text-[#0f3e17] font-semibold" : ""
                }`}
              >
                {t("registerSearch")}
              </Link>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-3">
              {/* Staff Login / Session */}
              {status === "authenticated" && session ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-[#0f3e17] leading-tight">
                      {session.user?.name || "Staff Member"}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                      <Shield className="w-2.5 h-2.5 text-[#0f3e17]" />
                      {(session.user as any)?.role || "STAFF"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title={t("signOut")}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 p-2 rounded-card border border-[#efeeeb] transition"
                  >
                    <LogOut className="w-4 h-4 text-slate-600 hover:text-red-600" />
                    <span className="hidden md:inline">{t("signOut")}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 border border-[#0f3e17] text-[#0f3e17] hover:bg-[#e1f4df]/60 font-medium px-3.5 py-2 rounded-card text-xs transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t("staffLogin")}</span>
                </Link>
              )}

              {/* Main Primary CTA Button */}
              <Link
                href="/registry"
                className="bg-[#0f3e17] hover:bg-[#0c2f10] text-[#fffefc] text-xs sm:text-[13px] font-medium px-4 py-2.5 rounded-card inline-flex items-center gap-2 shadow-xs transition"
              >
                <span>Get Health ID →</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-card text-[#222222] hover:bg-slate-100 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#efeeeb] bg-[#fffefc] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium"
              >
                What&apos;s inside
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium"
              >
                How it works
              </Link>
              <Link
                href="/quick-actions"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t("quickActions")}</span>
              </Link>
              <Link
                href="/records"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{t("records")}</span>
              </Link>
              <Link
                href="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{t("schemes")}</span>
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t("privacy")}</span>
              </Link>
              <Link
                href="/registry"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t("registerSearch")}</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-nav bg-slate-50 hover:bg-[#e1f4df] text-[#0f3e17] font-medium flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{t("surveillance")}</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#efeeeb] flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-card border border-[#0f3e17] text-[#0f3e17] text-xs font-semibold"
              >
                {t("staffLogin")}
              </Link>
              <Link
                href="/registry"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-card bg-[#0f3e17] text-[#fffefc] text-xs font-semibold"
              >
                Get Health ID →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
