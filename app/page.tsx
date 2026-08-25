import React from "react";
import Link from "next/link";
import { Users, Building2, Stethoscope, Activity, Pill, HeartPulse, Search, MapPin, UserPlus, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WorkerRecordCard } from "@/components/WorkerRecordCard";
import { KeralaMotif } from "@/components/KeralaMotif";
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
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        {/* Subtle Palm & Banana Leaf Motif Overlay */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <HeartPulse className="w-3.5 h-3.5 text-kerala-gold-400" />
            Kerala Public Health Initiative
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Digital Health Records for Guest Workers in Kerala
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Portable, multilingual health records safeguarding guest workers across Kerala's Primary Health Centres (PHCs), Community Health Centres (CHCs), and occupational mobile medical units.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/registry"
              className="bg-kerala-gold-500 hover:bg-kerala-gold-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Register & Search Registry</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-2.5 rounded-xl text-sm transition backdrop-blur-xs"
            >
              Facility Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Workers"
          value={totalWorkers}
          description="Portable Health IDs Issued"
          icon={Users}
          colorClass="bg-kerala-green-800 text-white"
        />
        <StatCard
          title="Health Facilities"
          value={totalFacilities}
          description="PHCs, CHCs & Mobile Units"
          icon={Building2}
          colorClass="bg-kerala-blue-800 text-white"
        />
        <StatCard
          title="Clinical Consultations"
          value={totalVisits}
          description="Medical Checkups Logged"
          icon={Stethoscope}
          colorClass="bg-kerala-green-700 text-white"
        />
        <StatCard
          title="Screenings & Tests"
          value={totalScreenings}
          description={`${totalTreatments} Treatments Prescribed`}
          icon={Activity}
          colorClass="bg-kerala-gold-700 text-white"
        />
      </div>

      {/* Quick Registry CTA Card - Houseboat Window Layout */}
      <div className="bg-white rounded-houseboat border border-kerala-coir-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Worker Registration & Health Lookup</h2>
            <p className="text-xs text-slate-600 mt-1">
              Search by Portable Health ID (`KL-MH-XXXXXX`), phone number, or register a new guest worker.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/registry"
              className="bg-kerala-green-800 hover:bg-kerala-green-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-xs flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Open Staff Registry</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Worker Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Enrolled Workers & Portable Records</span>
            <span className="text-xs font-normal text-slate-500 bg-kerala-coir-100 px-2.5 py-0.5 rounded-full">
              {recentWorkers.length} Active Records
            </span>
          </h2>
          <Link
            href="/registry"
            className="text-xs font-semibold text-kerala-green-800 hover:underline flex items-center gap-1"
          >
            <span>Search & Manage Registry</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentWorkers.map((worker) => (
            <WorkerRecordCard key={worker.id} worker={worker} />
          ))}
        </div>
      </div>

      {/* Network of Connected Facilities */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-kerala-green-800" />
          <span>Connected Kerala Health Facilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilities.map((fac) => (
            <div key={fac.id} className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-xs">
              <span className="inline-block text-[11px] font-bold px-2 py-0.5 bg-kerala-green-50 text-kerala-green-900 rounded mb-2">
                {fac.type}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{fac.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-kerala-green-700 shrink-0" />
                {fac.location}
              </p>
              <div className="mt-3 pt-3 border-t border-kerala-coir-100 flex justify-between text-xs text-slate-600">
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
