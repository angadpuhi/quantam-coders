import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Building2,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Globe,
  Sparkles,
  QrCode,
  AlertTriangle,
  Zap,
  FolderOpen,
  Lock,
  HeartHandshake,
  HeartPulse,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { WorkerRecordCard } from "@/components/WorkerRecordCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tSec = await getTranslations({ locale, namespace: "sections" });

  // Fetch real-time aggregate data for Kerala Health Dashboard
  let workerCount = 0;
  let facilityCount = 0;
  let visitCount = 0;
  let screeningCount = 0;
  let recentWorkers: any[] = [];
  let facilities: any[] = [];

  try {
    const [wCount, fCount, vCount, sCount, workers, facs] = await Promise.all([
      prisma.worker.count(),
      prisma.facility.count(),
      prisma.visit.count(),
      prisma.screening.count(),
      prisma.worker.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          visits: { take: 1, orderBy: { date: "desc" } },
          screenings: { take: 2, orderBy: { date: "desc" } },
          treatments: { take: 1, orderBy: { date: "desc" } },
        },
      }),
      prisma.facility.findMany({
        take: 4,
        include: {
          _count: {
            select: { visits: true, screenings: true },
          },
        },
      }),
    ]);

    workerCount = wCount;
    facilityCount = fCount;
    visitCount = vCount;
    screeningCount = sCount;
    recentWorkers = workers;
    facilities = facs;
  } catch (err) {
    console.error("Database connection issue during home page render:", err);
  }

  return (
    <div className="space-y-8">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <KeralaPalmIcon className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t("heroDesc")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/registry"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-transform active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>{t("ctaRegister")}</span>
            </Link>

            <Link
              href="/quick-actions"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm backdrop-blur-xs transition"
            >
              <Zap className="w-4 h-4 text-kerala-gold-400" />
              <span>{tSec("quickActionsTitle")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* HEALTH PASSPORT CARD + RISK BADGE SCAFFOLD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Health Passport Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 via-kerala-green-950 to-slate-900 border-2 border-kerala-gold-500/50 rounded-houseboat p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-kerala-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kerala-gold-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    {t("healthPassportTitle")}
                  </h2>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active ID
                  </span>
                </div>
                <p className="text-xs text-kerala-gold-300">
                  {t("healthPassportSubtitle")} • Kerala State Health Department
                </p>
              </div>
            </div>

            {/* Risk Assessment Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t("riskBadgeLow")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="text-slate-400 text-[10px] uppercase">Format</p>
              <p className="font-mono font-bold text-white mt-0.5">KL-MH-XXXXXX</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="text-slate-400 text-[10px] uppercase">Coverage</p>
              <p className="font-semibold text-white mt-0.5">All 14 Districts</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="text-slate-400 text-[10px] uppercase">Awaaz Linkage</p>
              <p className="font-semibold text-emerald-300 mt-0.5">₹25,000 Enrolled</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="text-slate-400 text-[10px] uppercase">DPDP Status</p>
              <p className="font-semibold text-white mt-0.5">Consent Protected</p>
            </div>
          </div>
        </div>

        {/* Right: Quick Sections Hub */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {t("quickNavTitle")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/quick-actions"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-kerala-green-50 border border-slate-200 hover:border-kerala-green-200 transition text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-kerala-green-800 shrink-0" />
                <span className="truncate">{tSec("quickActionsTitle")}</span>
              </Link>

              <Link
                href="/records"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">{tSec("recordsTitle")}</span>
              </Link>

              <Link
                href="/privacy"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="truncate">{tSec("privacyTitle")}</span>
              </Link>

              <Link
                href="/schemes"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition text-xs font-semibold text-slate-800 flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="truncate">{tSec("schemesTitle")}</span>
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-kerala-coir-100 flex items-center justify-between text-xs">
            <Link
              href="/registry"
              className="font-semibold text-kerala-green-800 hover:underline flex items-center gap-1"
            >
              <span>{t("openRegistryButton")}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Aggregate Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workers */}
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t("statRegisteredWorkers")}</span>
            <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {workerCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{t("statRegisteredWorkersDesc")}</p>
        </div>

        {/* Facilities */}
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t("statHealthFacilities")}</span>
            <div className="p-2 rounded-xl bg-kerala-blue-50 text-kerala-blue-800">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {facilityCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{t("statHealthFacilitiesDesc")}</p>
        </div>

        {/* Clinical Visits */}
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t("statConsultations")}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {visitCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{t("statConsultationsDesc")}</p>
        </div>

        {/* Screenings */}
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t("statScreenings")}</span>
            <div className="p-2 rounded-xl bg-kerala-gold-50 text-kerala-gold-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {screeningCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {t("statScreeningsDesc", { count: 5 })}
          </p>
        </div>
      </div>

      {/* Main Grid: Enrolled Workers & Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enrolled Workers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t("recentProfilesTitle")}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-kerala-green-100 text-kerala-green-900">
                {t("activeRecordsBadge", { count: workerCount })}
              </span>
            </div>
            <Link
              href="/registry"
              className="text-xs font-semibold text-kerala-green-800 hover:text-kerala-green-950 hover:underline"
            >
              {t("manageRegistryLink")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentWorkers.map((worker) => (
              <WorkerRecordCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Connected Facilities */}
        <div className="space-y-4">
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-kerala-green-800" />
              <h3 className="text-sm font-bold text-slate-900">
                {t("connectedFacilitiesTitle")}
              </h3>
            </div>

            <div className="space-y-3">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-kerala-coir-50 transition"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-slate-800 leading-snug">
                      {facility.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-200 text-slate-700 shrink-0">
                      {facility.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{facility.location}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-kerala-coir-100 text-center">
              <Link
                href="/registry"
                className="text-xs font-semibold text-kerala-green-800 hover:underline"
              >
                {t("openRegistryButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
