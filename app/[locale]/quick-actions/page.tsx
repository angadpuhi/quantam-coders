import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { TwoMinuteHealthCheck } from "@/components/TwoMinuteHealthCheck";
import {
  Mic,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Activity,
  PhoneCall,
  Languages,
  Stethoscope,
  ShieldAlert,
  Clock,
} from "lucide-react";

export default async function QuickActionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sections" });

  let workers: any[] = [];
  try {
    workers = await prisma.worker.findMany({
      select: {
        id: true,
        name: true,
        portableHealthId: true,
        riskStatus: true,
        homeState: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching workers for QuickActions:", err);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>2-Minute Rapid Triage Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("quickActionsTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t("quickActionsSubtitle")}
          </p>
        </div>
      </div>

      {/* 2-MINUTE HEALTH CHECK MCQ FORM CENTERPIECE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              2-Minute Rapid Health & Triage Screening
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Auto-Risk Update
            </span>
          </div>
        </div>

        <TwoMinuteHealthCheck workers={workers} />
      </section>

      {/* Additional Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* 1. Multilingual Voice Input Card */}
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

        {/* 2. Emergency Health Camp & Triage Helpline */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-600 to-kerala-gold-600" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mb-4 border border-red-200 shadow-2xs">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">DISHA 1056 Health Helpline</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              24x7 Kerala Government Tele-health & Medical Assistance. Call toll-free for immediate medical triage, ambulance dispatch, and clinic directions.
            </p>
            <div className="mt-4 p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-red-700">Toll-Free Health Hotline</p>
                <p className="font-mono text-base font-extrabold text-red-950">1056 / 0471-2552056</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold">24x7 Live</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Kerala Health Dept</span>
            <a
              href="tel:1056"
              className="inline-flex items-center gap-1.5 bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-red-800 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
