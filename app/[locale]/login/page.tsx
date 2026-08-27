"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import {
  User,
  Stethoscope,
  ShieldAlert,
  Lock,
  ArrowRight,
  Globe,
  ArrowLeft,
} from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

const roles = [
  {
    key: "worker",
    href: "/login/worker" as const,
    icon: User,
    title: "Worker",
    subtitle: "Migrant Health Passport",
    description:
      "Access your Athidhi Swasthya Passport using your Portable Health ID or registered phone number.",
    accentBg: "bg-[#0f3e17]",
    accentHover: "hover:bg-[#0c2f10]",
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-200",
    iconColor: "text-[#0f3e17]",
    gradientFrom: "from-[#0f3e17]",
    gradientVia: "via-[#1a5c25]",
    gradientTo: "to-[#2d7a3a]",
    ringColor: "hover:ring-emerald-300",
  },
  {
    key: "staff",
    href: "/login/staff" as const,
    icon: Stethoscope,
    title: "Staff",
    subtitle: "Healthcare Provider Portal",
    description:
      "Sign in as an authorized Doctor, Nurse, or Health Camp Staff to manage clinical records and screenings.",
    accentBg: "bg-emerald-800",
    accentHover: "hover:bg-emerald-900",
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-200",
    iconColor: "text-emerald-800",
    gradientFrom: "from-emerald-800",
    gradientVia: "via-emerald-600",
    gradientTo: "to-teal-600",
    ringColor: "hover:ring-emerald-300",
  },
  {
    key: "admin",
    href: "/login/admin" as const,
    icon: ShieldAlert,
    title: "Admin",
    subtitle: "Directorate Surveillance",
    description:
      "State / District Public Health Directorate Surveillance Portal for epidemiological monitoring and analytics.",
    accentBg: "bg-amber-800",
    accentHover: "hover:bg-amber-900",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-200",
    iconColor: "text-amber-800",
    gradientFrom: "from-amber-800",
    gradientVia: "via-amber-600",
    gradientTo: "to-yellow-600",
    ringColor: "hover:ring-amber-300",
  },
];

export default function LoginSelectorPage() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfa] text-[#222222] antialiased selection:bg-[#cfe7d3] selection:text-[#0f3e17]">
      {/* TOP BAR */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
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

      {/* ROLE SELECTOR */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 mb-3 shadow-2xs">
              <Lock className="w-6 h-6 text-kerala-green-800" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Select Your Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Choose your role to access the appropriate health dashboard
            </p>
          </div>

          {/* 3 Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.key}
                  href={role.href}
                  className={`group bg-white border border-[#e4e2dd] rounded-houseboat shadow-sm hover:shadow-md p-5 relative overflow-hidden transition-all duration-200 hover:ring-2 ${role.ringColor} hover:-translate-y-0.5 flex flex-col`}
                >
                  {/* Top Accent Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${role.gradientFrom} ${role.gradientVia} ${role.gradientTo}`}
                  />

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${role.iconBg} ${role.iconColor} border ${role.iconBorder} mb-3 shadow-2xs`}
                  >
                    <Icon className={`w-5 h-5 ${role.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {role.title}
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-500 mb-2">
                    {role.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">
                    {role.description}
                  </p>

                  {/* CTA */}
                  <div
                    className={`mt-4 w-full ${role.accentBg} ${role.accentHover} text-white font-bold py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5`}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
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
