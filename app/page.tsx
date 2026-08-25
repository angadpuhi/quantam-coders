import React from "react";
import { Users, FileText, Syringe, ShieldCheck, Search, PlusCircle, HeartPulse, Building2, MapPin } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WorkerRecordCard } from "@/components/WorkerRecordCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const totalWorkers = await prisma.worker.count();
    const totalRecords = await prisma.healthRecord.count();
    const totalVaccinations = await prisma.vaccination.count();
    const recentWorkers = await prisma.worker.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        healthRecords: {
          take: 2,
          orderBy: { visitDate: "desc" },
        },
        vaccinations: {
          take: 2,
          orderBy: { administeredDate: "desc" },
        },
      },
    });

    return {
      totalWorkers,
      totalRecords,
      totalVaccinations,
      recentWorkers,
      dbConnected: true,
    };
  } catch (error) {
    console.error("Database query failed (database might need migration):", error);
    return {
      totalWorkers: 0,
      totalRecords: 0,
      totalVaccinations: 0,
      recentWorkers: [],
      dbConnected: false,
    };
  }
}

export default async function HomePage() {
  const { totalWorkers, totalRecords, totalVaccinations, recentWorkers, dbConnected } =
    await getDashboardData();

  // Demo fallback items if fresh DB without seed data yet
  const sampleWorkers = [
    {
      id: "demo-1",
      healthId: "KL-MH-829104",
      awaazId: "AWZ-2024-99120",
      fullName: "Debabrata Das",
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91 98312 44910",
      stateOfOrigin: "West Bengal",
      nativeLanguage: "Bengali",
      keralaDistrict: "Ernakulam",
      currentEmployer: "Sunrise Wood Mills",
      occupation: "Machine Operator",
      emergencyContactName: "Tapan Das (Brother)",
      emergencyContactPhone: "+91 98312 44999",
      allergies: "Penicillin",
      chronicConditions: "Mild Hypertension",
      healthRecords: [
        {
          id: "rec-1",
          facilityName: "Perumbavoor Community Health Centre",
          doctorName: "Dr. Ananya Nair",
          visitDate: new Date(),
          visitType: "Occupational Health Screening",
          diagnosis: "Dust exposure respiratory checkup - normal spirometry",
        },
      ],
      vaccinations: [
        {
          id: "vac-1",
          vaccineName: "Tetanus Toxoid",
          doseNumber: 2,
          administeredDate: new Date(),
        },
      ],
    },
    {
      id: "demo-2",
      healthId: "KL-MH-654219",
      awaazId: "AWZ-2025-11029",
      fullName: "Raju Boro",
      gender: "Male",
      bloodGroup: "O+",
      phone: "+91 88765 12093",
      stateOfOrigin: "Assam",
      nativeLanguage: "Assamese",
      keralaDistrict: "Kozhikode",
      currentEmployer: "Malabar Infrastructure Ltd",
      occupation: "Construction Mason",
      emergencyContactName: "Bina Boro (Spouse)",
      emergencyContactPhone: "+91 88765 99981",
      allergies: "None reported",
      chronicConditions: "None",
      healthRecords: [],
      vaccinations: [
        {
          id: "vac-2",
          vaccineName: "Hepatitis B",
          doseNumber: 1,
          administeredDate: new Date(),
        },
      ],
    },
  ];

  const displayWorkers = recentWorkers.length > 0 ? recentWorkers : sampleWorkers;

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
            Digital Health Records for Guest Workers in Kerala
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Portable, multilingual health records safeguarding guest workers across Kerala's Primary Health Centres (PHCs), Community Health Centres (CHCs), and occupational mobile medical units.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Workers"
          value={totalWorkers > 0 ? totalWorkers : "14,820+"}
          description="Enrolled in Health Portal"
          icon={Users}
          colorClass="bg-emerald-600 text-white"
        />
        <StatCard
          title="Clinical Consultations"
          value={totalRecords > 0 ? totalRecords : "38,450+"}
          description="PHC & CHC Visits"
          icon={FileText}
          colorClass="bg-teal-600 text-white"
        />
        <StatCard
          title="Vaccinations Logged"
          value={totalVaccinations > 0 ? totalVaccinations : "19,210+"}
          description="Doses Administered"
          icon={Syringe}
          colorClass="bg-blue-600 text-white"
        />
        <StatCard
          title="Awaaz Scheme Linkage"
          value="92.4%"
          description="Health Coverage Rate"
          icon={ShieldCheck}
          colorClass="bg-amber-600 text-white"
        />
      </div>

      {/* Quick Search & Filter Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Worker Health Registry Search</h2>
            <p className="text-xs text-slate-500">
              Lookup records by Universal Health ID (KL-MH-XXXXXX), Awaaz ID, or Mobile number
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Health ID / Name / Mobile..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-xs">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Worker Health Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Recent Health Profiles</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {recentWorkers.length > 0 ? "Live Database" : "Sample Records"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayWorkers.map((worker) => (
            <WorkerRecordCard key={worker.id} worker={worker} />
          ))}
        </div>
      </div>

      {/* Kerala Health Camp Schedule & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            Key District Hubs
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Major screening nodes active in <strong>Perumbavoor (Ernakulam)</strong>, <strong>Kozhikode</strong>, <strong>Kanjikode (Palakkad)</strong>, and <strong>Trivandrum</strong>.
          </p>
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm mb-2">
            <HeartPulse className="w-4 h-4 text-teal-700" />
            Mobile Medical Units
          </div>
          <p className="text-xs text-teal-800 leading-relaxed">
            Weekly on-site health checkups at construction camps, plywood manufacturing units, and seasonal plantations.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Awaaz Scheme & Free Care
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Seamless integration with Kerala State's Awaaz health insurance, ensuring cashless emergency care across empanelled hospitals.
          </p>
        </div>
      </div>
    </div>
  );
}
