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
  Zap,
  FolderOpen,
  Lock,
  HeartHandshake,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { HealthPassportCenterpiece } from "@/components/HealthPassportCenterpiece";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tSec = await getTranslations({ locale, namespace: "sections" });

  // Fetch real-time aggregate data & all workers for Kerala Health Passport
  let workerCount = 0;
  let facilityCount = 0;
  let visitCount = 0;
  let screeningCount = 0;
  let allWorkers: any[] = [];
  let facilities: any[] = [];

  try {
    const [wCount, fCount, vCount, sCount, workers, facs] = await Promise.all([
      prisma.worker.count(),
      prisma.facility.count(),
      prisma.visit.count(),
      prisma.screening.count(),
      prisma.worker.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          visits: { orderBy: { date: "desc" } },
          screenings: { orderBy: { date: "desc" } },
          treatments: { orderBy: { date: "desc" } },
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
    allWorkers = workers;
    facilities = facs;
  } catch (err) {
    console.error("Database connection issue during home page render:", err);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
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

      {/* SIGNATURE HEALTH PASSPORT HOMEPAGE CENTERPIECE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {t("healthPassportTitle")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-kerala-green-100 text-kerala-green-900 border border-kerala-green-300">
              Interactive Centerpiece
            </span>
          </div>

          <Link
            href="/registry"
            className="text-xs font-semibold text-kerala-green-800 hover:text-kerala-green-950 hover:underline flex items-center gap-1"
          >
            <span>{t("manageRegistryLink")}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Health Passport Component */}
        <HealthPassportCenterpiece workers={allWorkers} />
      </section>

      {/* Quick Navigation Hub Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/quick-actions"
          className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-kerala-green-300 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-kerala-green-50 text-kerala-green-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            {tSec("quickActionsTitle")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {tSec("quickActionsSubtitle")}
          </p>
        </Link>

        <Link
          href="/records"
          className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-emerald-300 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            {tSec("recordsTitle")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {tSec("recordsSubtitle")}
          </p>
        </Link>

        <Link
          href="/privacy"
          className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            {tSec("privacyTitle")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {tSec("privacySubtitle")}
          </p>
        </Link>

        <Link
          href="/schemes"
          className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-amber-300 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            {tSec("schemesTitle")}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {tSec("schemesSubtitle")}
          </p>
        </Link>
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

      {/* Connected Kerala Facilities Section */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-kerala-green-800" />
            <h3 className="text-base font-bold text-slate-900">
              {t("connectedFacilitiesTitle")}
            </h3>
          </div>
          <Link
            href="/registry"
            className="text-xs font-semibold text-kerala-green-800 hover:underline"
          >
            {t("openRegistryButton")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:bg-kerala-coir-50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-800 leading-snug">
                    {facility.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-200 text-slate-700 shrink-0">
                    {facility.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{facility.location}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                <span>{facility._count?.visits || 0} Visits</span>
                <span>{facility._count?.screenings || 0} Screenings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
