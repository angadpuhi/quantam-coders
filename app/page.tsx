import React from "react";
import { Users, Building2, Stethoscope, Activity, Pill, HeartPulse, Search, MapPin } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WorkerRecordCard } from "@/components/WorkerRecordCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const totalWorkers = await prisma.worker.count();
    const totalFacilities = await prisma.facility.count();
    const totalVisits = await prisma.visit.count();
    const totalScreenings = await prisma.screening.count();
    const totalTreatments = await prisma.treatment.count();

    const recentWorkers = await prisma.worker.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        visits: {
          include: {
            facility: true,
            treatments: true,
          },
          orderBy: { date: "desc" },
        },
        screenings: {
          include: {
            facility: true,
          },
          orderBy: { date: "desc" },
        },
        treatments: {
          orderBy: { date: "desc" },
        },
      },
    });

    const facilities = await prisma.facility.findMany({
      include: {
        _count: {
          select: { visits: true, screenings: true },
        },
      },
    });

    return {
      totalWorkers,
      totalFacilities,
      totalVisits,
      totalScreenings,
      totalTreatments,
      recentWorkers,
      facilities,
      dbConnected: true,
    };
  } catch (error) {
    console.error("Database query failed:", error);
    return {
      totalWorkers: 0,
      totalFacilities: 0,
      totalVisits: 0,
      totalScreenings: 0,
      totalTreatments: 0,
      recentWorkers: [],
      facilities: [],
      dbConnected: false,
    };
  }
}

export default async function HomePage() {
  const {
    totalWorkers,
    totalFacilities,
    totalVisits,
    totalScreenings,
    totalTreatments,
    recentWorkers,
    facilities,
  } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-xs font-semibold text-emerald-200 mb-4 backdrop-blur-xs">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            Kerala Public Health Initiative
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Digital Health Records for Guest Workers
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Portable health record management connecting guest workers (*Athidhi Thozhilalikal*) with Primary Health Centres (PHCs), Community Health Centres (CHCs), and mobile medical screening camps across Kerala.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Workers"
          value={totalWorkers}
          description="Portable Health IDs Issued"
          icon={Users}
          colorClass="bg-emerald-600 text-white"
        />
        <StatCard
          title="Health Facilities"
          value={totalFacilities}
          description="PHCs, CHCs & Mobile Units"
          icon={Building2}
          colorClass="bg-teal-600 text-white"
        />
        <StatCard
          title="Clinical Visits"
          value={totalVisits}
          description="Medical Consultations"
          icon={Stethoscope}
          colorClass="bg-blue-600 text-white"
        />
        <StatCard
          title="Screenings & Tests"
          value={totalScreenings}
          description={`${totalTreatments} Treatments Prescribed`}
          icon={Activity}
          colorClass="bg-amber-600 text-white"
        />
      </div>

      {/* Quick Search & Registry Lookup */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Worker Registry & Portable Health ID Lookup</h2>
            <p className="text-xs text-slate-500">
              Instant retrieval across facilities by Portable Health ID (e.g. KL-MH-829104), Name, or Mobile
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Portable Health ID / Name..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-xs">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Worker Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Enrolled Workers & Portable Records</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {recentWorkers.length} Active Records
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentWorkers.map((worker) => (
            <WorkerRecordCard key={worker.id} worker={worker} />
          ))}
        </div>
      </div>

      {/* Network of Facilities */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <span>Connected Health Facilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilities.map((fac) => (
            <div key={fac.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="inline-block text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded mb-2">
                {fac.type}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{fac.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {fac.location}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                <span>{fac._count.visits} Visits</span>
                <span>{fac._count.screenings} Screenings</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
