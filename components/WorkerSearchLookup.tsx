"use client";

import React, { useState } from "react";
import {
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  Activity,
  Pill,
  Building2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function WorkerSearchLookup() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [workerData, setWorkerData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (term?: string) => {
    const query = (term !== undefined ? term : searchTerm).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // First try fetching full history by identifier (supports ID or portableHealthId)
      const res = await fetch(`/api/workers/${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.worker) {
          setWorkerData(json.data.worker);
          setLoading(false);
          return;
        }
      }

      // If not exact match, search via query parameter
      const listRes = await fetch(`/api/workers?q=${encodeURIComponent(query)}`);
      const listJson = await listRes.json();

      if (listRes.ok && listJson.success && listJson.data?.length > 0) {
        // Fetch full history for first match
        const firstMatch = listJson.data[0];
        const detailRes = await fetch(`/api/workers/${firstMatch.id}`);
        const detailJson = await detailRes.json();
        setWorkerData(detailJson.data.worker);
      } else {
        setWorkerData(null);
        setError(`No worker records found matching "${query}". Verify Portable Health ID or phone number.`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to search workers.");
      setWorkerData(null);
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar - Houseboat Window Arched Layout */}
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-kerala-green-800" />
              <span>Search Worker Health Registry</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Lookup by <strong>Portable Health ID</strong> (e.g. `KL-MH-829104`) or <strong>Mobile Phone Number</strong>
            </p>
          </div>

          {/* Quick Demo Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-500 font-medium">Quick Lookup:</span>
            <button
              type="button"
              onClick={() => quickSearch("KL-MH-829104")}
              className="px-2.5 py-1 rounded-lg bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 hover:bg-kerala-green-100 font-mono text-[11px] font-semibold transition"
            >
              KL-MH-829104
            </button>
            <button
              type="button"
              onClick={() => quickSearch("KL-MH-654219")}
              className="px-2.5 py-1 rounded-lg bg-kerala-blue-50 text-kerala-blue-900 border border-kerala-blue-200 hover:bg-kerala-blue-100 font-mono text-[11px] font-semibold transition"
            >
              KL-MH-654219
            </button>
            <button
              type="button"
              onClick={() => quickSearch("94371 88201")}
              className="px-2.5 py-1 rounded-lg bg-kerala-coir-100 text-kerala-coir-900 border border-kerala-coir-300 hover:bg-kerala-coir-200 font-mono text-[11px] font-semibold transition"
            >
              Phone: 94371 88201
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Portable Health ID (e.g. KL-MH-829104) or Mobile Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-kerala-green-800 hover:bg-kerala-green-900 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-xs transition flex items-center justify-center gap-2"
          >
            {loading ? <span>Searching...</span> : <span>Search Registry</span>}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result: Worker Profile & Visit History */}
      {workerData && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Worker Profile Card - Houseboat Window Arched Geometry */}
          <div className="bg-white border-2 border-kerala-green-700/30 rounded-houseboat p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Top Backwater Coastal Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-kerala-coir-100">
              {/* Identity & Origin */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-extrabold text-slate-900">{workerData.name}</h3>
                  <span className="font-mono text-sm font-bold bg-kerala-green-800 text-white px-3 py-1 rounded-full shadow-xs border border-kerala-green-900">
                    {workerData.portableHealthId}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <span className="font-semibold text-slate-800">{workerData.gender}</span>
                  {workerData.dob && (
                    <>
                      <span>•</span>
                      <span>DOB: {formatDate(workerData.dob)}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    Home State: <strong className="text-kerala-green-900">{workerData.homeState}</strong>
                  </span>
                </div>

                {workerData.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-700 mt-2">
                    <Phone className="w-3.5 h-3.5 text-kerala-green-700" />
                    <span>{workerData.phone}</span>
                  </div>
                )}
              </div>

              {/* Local Worksite / Residence in Kerala */}
              {workerData.currentAddress && (
                <div className="bg-kerala-coir-50 border border-kerala-coir-200 rounded-2xl p-4 max-w-md text-xs">
                  <div className="flex items-center gap-1.5 text-kerala-coir-900 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-kerala-green-800" />
                    <span>Current Worksite / Residence (Kerala)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{workerData.currentAddress}</p>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 py-4 border-b border-kerala-coir-100 text-center">
              <div className="bg-kerala-green-50/70 p-3 rounded-xl border border-kerala-green-100">
                <p className="text-lg font-extrabold text-kerala-green-900">
                  {workerData.visits?.length || 0}
                </p>
                <p className="text-[11px] font-semibold text-kerala-green-800 uppercase tracking-wider">
                  Clinical Visits
                </p>
              </div>
              <div className="bg-kerala-blue-50/70 p-3 rounded-xl border border-kerala-blue-100">
                <p className="text-lg font-extrabold text-kerala-blue-900">
                  {workerData.screenings?.length || 0}
                </p>
                <p className="text-[11px] font-semibold text-kerala-blue-800 uppercase tracking-wider">
                  Screenings
                </p>
              </div>
              <div className="bg-kerala-gold-50/70 p-3 rounded-xl border border-kerala-gold-200">
                <p className="text-lg font-extrabold text-kerala-gold-900">
                  {workerData.treatments?.length || 0}
                </p>
                <p className="text-[11px] font-semibold text-kerala-gold-800 uppercase tracking-wider">
                  Treatments
                </p>
              </div>
            </div>

            {/* Complete Visit History & Timeline */}
            <div className="mt-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-kerala-green-800" />
                <span>Clinical Visit History</span>
              </h4>

              {workerData.visits && workerData.visits.length > 0 ? (
                <div className="space-y-3">
                  {workerData.visits.map((visit: any) => (
                    <div
                      key={visit.id}
                      className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl hover:border-kerala-green-300 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-kerala-green-800" />
                          <span className="text-sm font-bold text-slate-900">
                            {visit.facility?.name || "Healthcare Facility"}
                          </span>
                          <span className="text-[10px] font-bold bg-kerala-green-100 text-kerala-green-900 px-2 py-0.5 rounded">
                            {visit.facility?.type || "PHC"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(visit.date)}</span>
                        </div>
                      </div>

                      {visit.notes && (
                        <p className="text-xs text-slate-700 leading-relaxed">
                          <strong>Clinical Notes:</strong> {visit.notes}
                        </p>
                      )}

                      {/* Associated Treatments for this Visit */}
                      {visit.treatments && visit.treatments.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/50 space-y-1">
                          <p className="text-[11px] font-bold text-kerala-blue-900 flex items-center gap-1">
                            <Pill className="w-3 h-3 text-kerala-blue-700" />
                            Prescriptions & Care:
                          </p>
                          {visit.treatments.map((t: any) => (
                            <div key={t.id} className="text-xs text-slate-700 pl-4">
                              <span>• {t.description}</span>
                              {t.medication && (
                                <span className="font-semibold text-kerala-blue-800 ml-1">
                                  ({t.medication})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  No clinical visits logged yet for this worker.
                </p>
              )}
            </div>

            {/* Health Screenings */}
            {workerData.screenings && workerData.screenings.length > 0 && (
              <div className="mt-6 space-y-3 pt-6 border-t border-kerala-coir-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-kerala-blue-800" />
                  <span>Diagnostic & Health Screenings</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workerData.screenings.map((sc: any) => (
                    <div
                      key={sc.id}
                      className="p-3.5 bg-kerala-blue-50/50 border border-kerala-blue-200/80 rounded-xl text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-kerala-blue-950">{sc.type}</span>
                        <span className="font-bold text-[11px] bg-kerala-blue-100 text-kerala-blue-900 px-2 py-0.5 rounded-full">
                          {sc.result}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 mt-2 text-[11px]">
                        <span>{sc.facility?.name || "Camp Screening"}</span>
                        <span>{formatDate(sc.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
