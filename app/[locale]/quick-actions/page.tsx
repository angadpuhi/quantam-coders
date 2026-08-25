import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { KeralaMotif } from "@/components/KeralaMotif";
import {
  Mic,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Activity,
  PhoneCall,
  Languages,
  Stethoscope,
} from "lucide-react";

export default async function QuickActionsPage({
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
            <Sparkles className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>AI & Voice Assisted Care</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("quickActionsTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t("quickActionsSubtitle")}
          </p>
        </div>
      </div>

      {/* Quick Action Cards Grid (Scaffold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Voice Input Card */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-emerald-600 to-teal-600" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-kerala-green-50 text-kerala-green-800 flex items-center justify-center mb-4 border border-kerala-green-200 shadow-2xs">
              <Mic className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t("voiceInputTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("voiceInputDesc")}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">മലയാളം</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">हिन्दी</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">বাংলা</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">ଓଡ଼ିଆ</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Voice Recognition Ready</span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-kerala-green-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-kerala-green-900 transition"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Voice Check</span>
            </button>
          </div>
        </div>

        {/* 2. Health Check & Symptom Assessment Card */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-blue-800 via-blue-600 to-indigo-600" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-kerala-blue-50 text-kerala-blue-800 flex items-center justify-center mb-4 border border-kerala-blue-200 shadow-2xs">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t("healthCheckTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("healthCheckDesc")}
            </p>
            <div className="mt-4 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Occupational respiratory & spirometry symptom review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Fever, malaria & vector-borne illness triage</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Digital Triage Protocol</span>
            <Link
              href="/registry"
              className="inline-flex items-center gap-1.5 bg-kerala-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-kerala-blue-900 transition"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
