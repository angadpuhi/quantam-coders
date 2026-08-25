import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { KeralaMotif } from "@/components/KeralaMotif";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  KeyRound,
  FileCheck,
  EyeOff,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sections" });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>Digital Personal Data Protection (DPDP)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("privacyTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t("privacySubtitle")}
          </p>
        </div>
      </div>

      {/* Privacy & Consent Feature Grid (Scaffold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Active Doctor & Facility Consents */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-emerald-600 to-teal-600" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 border border-emerald-200 shadow-2xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t("consentManagerTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("consentManagerDesc")}
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Perumbavoor CHC Medical Staff</p>
                  <p className="text-[11px] text-slate-500">Full clinical history • Valid for 30 days</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Time-bound granular consent</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-slate-900 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Manage Consents</span>
            </button>
          </div>
        </div>

        {/* 2. Health Data Encryption & Ownership */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-blue-800 via-blue-600 to-indigo-600" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 border border-blue-200 shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t("dataSecurityTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("dataSecurityDesc")}
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero unconsented third-party data sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Audited clinical access log tracking</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">ISO 27001 / DPDP Compliant</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 transition"
            >
              <span>Audit Access Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
