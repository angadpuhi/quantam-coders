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
  Lock,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Syringe,
  Microscope,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { StatCard } from "@/components/StatCard";

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
      <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 space-y-6">
        <div className="h-44 bg-slate-200 animate-pulse rounded-houseboat" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white border border-red-200 rounded-houseboat p-8 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Surveillance Data Unavailable</h2>
          <p className="text-sm text-slate-600 mt-2">{error || "Unable to fetch aggregated records."}</p>
          <button
            type="button"
            onClick={fetchStats}
            className="mt-5 inline-flex items-center gap-2 bg-kerala-green-800 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-kerala-green-900 transition min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const {
    metrics,
    screeningTotalsByType,
    screeningTrends,
    districtStats,
    conditionStats,
    stateDistribution,
    surveillanceMonth,
  } = statsData;

  // Max count for trend bar calculation
  const maxTrendVolume = Math.max(
    ...screeningTrends.map((t: any) => Math.max(t.screenings, t.visits, 1)),
    5
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
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
                <span>Kerala Health Directorate Public Health Telemetry</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Migrant Health Surveillance &amp; Telemetry
              </h1>

              <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
                Aggregated, anonymized public health intelligence across Kerala&apos;s 14 districts for epidemiological monitoring, occupational disease vigilance, and welfare scheme outreach.
              </p>
            </div>

            {/* Live Surveillance Period Badge */}
            <div className="bg-black/40 border border-kerala-gold-400/50 rounded-2xl p-4 sm:p-5 backdrop-blur-xs text-left md:text-right shrink-0">
              <div className="flex items-center md:justify-end gap-2 text-xs font-bold text-kerala-gold-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Surveillance Period</span>
              </div>
              <p className="text-lg font-extrabold text-white mt-1">{surveillanceMonth}</p>
              <button
                type="button"
                onClick={fetchStats}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Telemetry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DPDP Act 2023 Compliance & Anonymization Notice + Database Inspector CTA */}
      <div className="p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-extrabold text-emerald-300 uppercase tracking-wider">
              DPDP Act 2023 Compliant • Aggregated &amp; Anonymized Telemetry Only
            </p>
            <p className="text-emerald-100/90 leading-relaxed">
              In compliance with patient privacy, individual worker identities and clinical notes are restricted to treating Healthcare Providers. Admin views display epidemiological aggregates only.
            </p>
          </div>
        </div>

        <Link
          href="/admin/database"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition shadow-xs shrink-0 self-start sm:self-auto min-h-[44px]"
        >
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>Database View (Admin)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 PRIMARY AGGREGATE STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Workers"
          value={metrics.totalWorkers}
          description="Enrolled across all Kerala facilities"
          icon={Users}
          colorClass="bg-kerala-green-800 text-white"
        />
        <StatCard
          title="Pending Follow-ups"
          value={metrics.pendingFollowUpsCount}
          description="Yellow & Red risk cases under monitoring"
          icon={AlertTriangle}
          colorClass="bg-amber-600 text-white"
        />
        <StatCard
          title="Diagnostic Screenings"
          value={metrics.totalScreenings}
          description="Total TB, BP, Spirometry & Lab tests"
          icon={Activity}
          colorClass="bg-kerala-blue-800 text-white"
        />
        <StatCard
          title="Clinical Interventions"
          value={metrics.totalVisits}
          description="Total doctor consultations logged"
          icon={Stethoscope}
          colorClass="bg-kerala-gold-700 text-white"
        />
      </div>

      {/* SCREENING TRENDS OVER TIME (Visual Bar Chart) */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <TrendingUp className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Screening &amp; Consultation Trends Over Time
              </h2>
              <p className="text-xs text-slate-500">
                Monthly diagnostic screening and clinical encounter volume (past 6 months)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-kerala-green-800" />
              <span className="text-slate-700">Screenings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-kerala-gold-500" />
              <span className="text-slate-700">Consultations</span>
            </div>
          </div>
        </div>

        {/* Proportional Trend Chart Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 pt-2">
          {screeningTrends.map((trend: any) => {
            const screeningHeight = Math.max(Math.round((trend.screenings / maxTrendVolume) * 120), 12);
            const visitHeight = Math.max(Math.round((trend.visits / maxTrendVolume) * 120), 8);

            return (
              <div
                key={trend.label}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-between text-center hover:border-emerald-400 transition-colors min-h-[190px]"
              >
                <span className="font-bold text-xs text-slate-900">{trend.label}</span>

                {/* Bars */}
                <div className="w-full flex items-end justify-center gap-2 h-28 my-2">
                  <div
                    style={{ height: `${screeningHeight}px` }}
                    className="w-4 bg-kerala-green-800 hover:bg-kerala-green-900 rounded-t-md transition-all relative group"
                    title={`Screenings: ${trend.screenings}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-800 bg-white px-1 rounded shadow-xs transition">
                      {trend.screenings}
                    </span>
                  </div>
                  <div
                    style={{ height: `${visitHeight}px` }}
                    className="w-4 bg-kerala-gold-500 hover:bg-kerala-gold-600 rounded-t-md transition-all relative group"
                    title={`Visits: ${trend.visits}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-800 bg-white px-1 rounded shadow-xs transition">
                      {trend.visits}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  <span className="font-bold text-emerald-800">{trend.screenings} sc</span>
                  <span className="mx-1">•</span>
                  <span className="font-bold text-amber-700">{trend.visits} vi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISTRICT-LEVEL STATISTICS & SCREENING TOTALS BY TYPE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District-Level Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-kerala-coir-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-coir-100 text-kerala-coir-900 border border-kerala-coir-300">
                <MapPin className="w-5 h-5 text-kerala-green-800" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  District-Level Telemetry
                </h2>
                <p className="text-xs text-slate-500">
                  Worker enrollment &amp; triage risk distribution across Kerala districts
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded-full">
              {districtStats.length} Active Districts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 font-bold">District</th>
                  <th className="pb-2.5 font-bold text-center">Enrolled</th>
                  <th className="pb-2.5 font-bold text-center">Share</th>
                  <th className="pb-2.5 font-bold text-center">Risk Breakdown (G / Y / R)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districtStats.map((item: any) => (
                  <tr key={item.district} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>{item.district}</span>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-slate-800">
                      {item.totalWorkers}
                    </td>
                    <td className="py-3 text-center font-mono text-slate-500">
                      {item.percentage}%
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold" title="Green (Stable)">
                          {item.greenCount} G
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold" title="Yellow (Needs Monitoring)">
                          {item.yellowCount} Y
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 font-bold" title="Red (Urgent Triage)">
                          {item.redCount} R
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Screening Totals by Type (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-kerala-coir-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-blue-50 text-kerala-blue-800 border border-kerala-blue-200">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Screening Totals by Type
                </h2>
                <p className="text-xs text-slate-500">
                  Aggregated test distribution
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {screeningTotalsByType.map((sc: any) => (
              <div key={sc.type} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span className="truncate max-w-[240px]">{sc.type}</span>
                  <span className="font-mono font-bold text-kerala-green-900 shrink-0">
                    {sc.count} ({sc.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${Math.max(sc.percentage, 8)}%` }}
                    className="bg-gradient-to-r from-kerala-green-800 to-kerala-blue-800 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AGGREGATED DISEASE / HEALTH CONDITION PREVALENCE */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Activity className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Aggregated Disease &amp; Occupational Condition Statistics
              </h2>
              <p className="text-xs text-slate-500">
                Anonymized clinical indicator prevalence &amp; public health advisory recommendations
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Directorate Health Alert
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {conditionStats.map((cond: any) => (
            <div
              key={cond.condition}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-kerala-green-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cond.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {cond.condition}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  {cond.status}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1 text-xs">
                <div>
                  <span className="text-slate-400">Flagged Cases: </span>
                  <span className="font-mono font-bold text-slate-900">{cond.flaggedCases}</span>
                </div>
                <span>•</span>
                <div>
                  <span className="text-slate-400">Prevalence: </span>
                  <span className="font-mono font-bold text-emerald-800">{cond.surveillanceRate}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                <strong>Advisory:</strong> {cond.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATE OF ORIGIN DISTRIBUTION */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-kerala-coir-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-kerala-coir-100 text-kerala-coir-900 border border-kerala-coir-300">
              <MapPin className="w-5 h-5 text-kerala-green-800" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Guest Worker Native State of Origin
              </h2>
              <p className="text-xs text-slate-500">
                Linguistic and geographical origin distribution
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {stateDistribution.map((st: any) => (
            <div
              key={st.state}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1"
            >
              <p className="font-bold text-xs text-slate-900 truncate">{st.state}</p>
              <p className="font-mono text-base font-extrabold text-kerala-green-900">
                {st.count} <span className="text-xs text-slate-400 font-normal">({st.percentage}%)</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
