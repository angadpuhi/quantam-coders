import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { KeralaMotif } from "@/components/KeralaMotif";
import { StatCard } from "@/components/StatCard";
import { WorkerRecordCard } from "@/components/WorkerRecordCard";
import {
  Users,
  Building2,
  Stethoscope,
  Activity,
  UserPlus,
  Search,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  // Parallel server data fetch
  const [workerCount, facilityCount, visitCount, screeningCount, treatmentCount, recentWorkers, facilities] =
    await Promise.all([
      prisma.worker.count(),
      prisma.facility.count(),
      prisma.visit.count(),
      prisma.screening.count(),
      prisma.treatment.count(),
      prisma.worker.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          visits: {
            take: 2,
            orderBy: { date: "desc" },
            include: { facility: true, treatments: true },
          },
          screenings: {
            take: 2,
            orderBy: { date: "desc" },
            include: { facility: true },
          },
          treatments: {
            take: 2,
            orderBy: { date: "desc" },
          },
        },
      }),
      prisma.facility.findMany({
        include: {
          _count: {
            select: { visits: true, screenings: true },
          },
        },
      }),
    ]);

  return (
    <div className="space-y-10">
      {/* Kerala Backwater Coastal Hero Section */}
      <section className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-8 sm:p-12 shadow-xl border border-kerala-gold-600/30">
        {/* Subtle Palm & Banana Leaf Motif Backdrop */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-6 backdrop-blur-xs">
            <HeartPulse className="w-4 h-4 text-kerala-gold-400" />
            <span>{t("heroBadge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="mt-4 text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t("heroDesc")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/registry"
              className="inline-flex items-center gap-2 bg-kerala-gold-500 hover:bg-kerala-gold-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5 text-slate-950" />
              <span>{t("ctaRegister")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-2xl backdrop-blur-xs transition"
            >
              <ShieldCheck className="w-5 h-5 text-kerala-gold-300" />
              <span>{t("ctaStaffPortal")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Aggregate Health Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t("statRegisteredWorkers")}
          value={workerCount}
          description={t("statRegisteredWorkersDesc")}
          icon={Users}
          colorClass="bg-kerala-green-800 text-white"
        />
        <StatCard
          title={t("statHealthFacilities")}
          value={facilityCount}
          description={t("statHealthFacilitiesDesc")}
          icon={Building2}
          colorClass="bg-kerala-blue-800 text-white"
        />
        <StatCard
          title={t("statConsultations")}
          value={visitCount}
          description={t("statConsultationsDesc")}
          icon={Stethoscope}
          colorClass="bg-kerala-green-700 text-white"
        />
        <StatCard
          title={t("statScreenings")}
          value={screeningCount}
          description={t("statScreeningsDesc", { count: treatmentCount })}
          icon={Activity}
          colorClass="bg-kerala-gold-700 text-white"
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Enrolled Profiles */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{t("recentProfilesTitle")}</h2>
              <span className="text-xs bg-kerala-green-100 text-kerala-green-900 font-semibold px-2.5 py-0.5 rounded-full border border-kerala-green-200">
                {t("activeRecordsBadge", { count: workerCount })}
              </span>
            </div>
            <Link
              href="/registry"
              className="text-xs sm:text-sm font-semibold text-kerala-green-900 hover:text-kerala-green-700 flex items-center gap-1 hover:underline"
            >
              <span>{t("manageRegistryLink")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recentWorkers.map((worker) => (
              <WorkerRecordCard key={worker.id} worker={worker as any} />
            ))}
          </div>
        </section>

        {/* Right Column: Connected Facilities & Quick Actions */}
        <section className="lg:col-span-4 space-y-6">
          {/* Quick Registration & Search Promo Card */}
          <div className="bg-gradient-to-br from-kerala-coir-100 to-kerala-coir-50 border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-kerala-green-800" />
              <span>{t("quickRegistryTitle")}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {t("quickRegistryDesc")}
            </p>
            <Link
              href="/registry"
              className="mt-4 block w-full text-center bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              {t("openRegistryButton")}
            </Link>
          </div>

          {/* Connected Public Health Facilities */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-kerala-coir-100 pb-3 mb-4">
              <Building2 className="w-4 h-4 text-kerala-blue-800" />
              <span>{t("connectedFacilitiesTitle")}</span>
            </h3>

            <div className="space-y-3">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-kerala-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{fac.name}</h4>
                    <span className="text-[10px] font-bold bg-kerala-blue-100 text-kerala-blue-900 px-2 py-0.5 rounded">
                      {fac.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{fac.location}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 mt-2 pt-2 border-t border-slate-200">
                    <span>{t("visitsCount", { count: fac._count.visits })}</span>
                    <span>•</span>
                    <span>{t("screeningsCount", { count: fac._count.screenings })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
