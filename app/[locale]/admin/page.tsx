"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Users,
  Building2,
  Stethoscope,
  Activity,
  Pill,
  BarChart3,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";
import { StatCard } from "@/components/StatCard";
import { FacilityVisitsBarChart } from "@/components/FacilityVisitsBarChart";
import { ScreeningsByTypeWidget } from "@/components/ScreeningsByTypeWidget";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [statsData, setStatsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load surveillance statistics.");
      }

      setStatsData(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-6">
        <div className="h-44 bg-slate-200 animate-pulse rounded-houseboat" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="bg-white border border-red-200 rounded-houseboat p-8 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Surveillance Data Unavailable</h2>
          <p className="text-sm text-slate-600 mt-2">{error || "Unable to fetch aggregated records."}</p>
          <button
            type="button"
            onClick={fetchStats}
            className="mt-5 inline-flex items-center gap-2 bg-kerala-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-kerala-green-900 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { metrics, facilityVisitsChart, screeningsByType, stateDistribution, recentScreenings, surveillanceMonth } =
    statsData;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        {/* Subtle Palm & Banana Leaf Motif Overlay */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
                <HeartPulse className="w-3.5 h-3.5 text-kerala-gold-400" />
                <span>{t("heroBadge")}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t("heroTitle")}
              </h1>

              <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
                {t("heroDesc")}
              </p>
            </div>

            {/* Live Surveillance Badge */}
            <div className="bg-black/30 border border-kerala-gold-400/50 rounded-2xl p-4 sm:p-5 backdrop-blur-xs text-right shrink-0">
              <div className="flex items-center justify-end gap-2 text-xs font-bold text-kerala-gold-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("surveillancePeriod")}</span>
              </div>
              <p className="text-lg font-extrabold text-white mt-1">{surveillanceMonth}</p>
              <button
                type="button"
                onClick={fetchStats}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t("refreshButton")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("statWorkers")}
          value={metrics.totalWorkers}
          description={t("statWorkersDesc")}
          icon={Users}
          colorClass="bg-kerala-green-800 text-white"
        />
        <StatCard
          title={t("statScreeningsMonth")}
          value={metrics.screeningsThisMonth}
          description={t("statScreeningsDesc", { total: metrics.totalScreenings })}
          icon={Activity}
          colorClass="bg-kerala-blue-800 text-white"
        />
        <StatCard
          title={t("statVisitsMonth")}
          value={metrics.visitsThisMonth}
          description={t("statVisitsDesc", { total: metrics.totalVisits })}
          icon={Stethoscope}
          colorClass="bg-kerala-green-700 text-white"
        />
        <StatCard
          title={t("statTreatments")}
          value={metrics.totalTreatments}
          description={t("statTreatmentsDesc")}
          icon={Pill}
          colorClass="bg-kerala-gold-700 text-white"
        />
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Bar Chart of Visits Per Facility */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-800 border border-kerala-green-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t("visitsChartTitle")}</h2>
                  <p className="text-xs text-slate-500">
                    {t("visitsChartDesc")}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-kerala-green-50 text-kerala-green-900 px-2.5 py-1 rounded-full">
                {t("facilitiesActiveBadge", { count: facilityVisitsChart.length })}
              </span>
            </div>

            {/* Interactive Proportional Bar Chart */}
            <FacilityVisitsBarChart facilities={facilityVisitsChart} />
          </div>

          {/* Demographic Distribution by Home State */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-kerala-coir-100 text-kerala-coir-900 border border-kerala-coir-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t("stateDistributionTitle")}</h2>
                  <p className="text-xs text-slate-500">
                    {t("stateDistributionDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {stateDistribution.map((item: any) => (
                <div key={item.state} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-kerala-green-700" />
                    <span>{item.state}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-slate-900">{t("workersCount", { count: item.count })}</span>
                    <span className="text-slate-500 font-semibold w-12 text-right">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Screenings by Type This Month & Recent Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Screenings by Type This Month Widget */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-kerala-blue-50 text-kerala-blue-800 border border-kerala-blue-200">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{t("screeningsByTypeTitle")}</h2>
                  <p className="text-xs text-slate-500">{t("screeningsByTypeDesc")}</p>
                </div>
              </div>
            </div>

            <ScreeningsByTypeWidget screenings={screeningsByType} monthName={surveillanceMonth} />
          </div>

          {/* Recent Surveillance Screening Logs */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-kerala-green-800" />
                <span>{t("liveLogsTitle")}</span>
              </h3>
              <Link
                href="/registry"
                className="text-xs font-semibold text-kerala-green-800 hover:underline flex items-center gap-1"
              >
                <span>{t("registryLink")}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentScreenings.map((sc: any) => (
                <div
                  key={sc.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 hover:border-kerala-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-bold text-slate-900">{sc.worker?.name}</span>
                    <span className="text-[10px] font-bold bg-kerala-blue-100 text-kerala-blue-900 px-2 py-0.5 rounded-full">
                      {sc.result}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{sc.type}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>{sc.facility?.name}</span>
                    <span>{formatDate(sc.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
