"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Calendar,
  Clock,
  Building2,
  PhoneCall,
  User,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  PlusCircle,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";
import { formatDate } from "@/lib/utils";

interface AppointmentsViewerProps {
  workers: any[];
  allVisits: any[];
}

export function AppointmentsFollowUpViewer({ workers, allVisits }: AppointmentsViewerProps) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.id || ""
  );
  const [filterMode, setFilterMode] = useState<"all" | "upcoming" | "past">("all");

  const selectedWorker =
    workers.find((w) => w.id === selectedWorkerId) || workers[0];

  const now = new Date();

  // Extract all visits for selected worker
  const workerVisits = selectedWorker
    ? allVisits.filter((v) => v.workerId === selectedWorker.id)
    : allVisits;

  // Separate into upcoming and past
  const upcomingVisits = workerVisits.filter((v) => new Date(v.date) >= now);
  const pastVisits = workerVisits.filter((v) => new Date(v.date) < now);

  // If worker is YELLOW or RED risk, add a flagged follow-up advisory if no upcoming visit is scheduled
  const isFlaggedForFollowUp =
    selectedWorker && (selectedWorker.riskStatus === "YELLOW" || selectedWorker.riskStatus === "RED");

  const getFilteredList = () => {
    if (filterMode === "upcoming") return upcomingVisits;
    if (filterMode === "past") return pastVisits;
    return workerVisits;
  };

  const displayedVisits = getFilteredList();

  const getRiskDotColor = (riskStatus?: string) => {
    const s = (riskStatus || "GREEN").toUpperCase();
    if (s === "RED") return "bg-red-500 ring-2 ring-red-400";
    if (s === "YELLOW") return "bg-amber-400 ring-2 ring-amber-300";
    return "bg-emerald-400 ring-2 ring-emerald-300";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Kerala Coastal Hero Header */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <Calendar className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>Health Camp &amp; Clinic Follow-ups</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Appointments &amp; Clinical Follow-ups
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Track scheduled medical consultations, specialist referral follow-ups, and review past clinical visits across all Kerala health facilities.
          </p>
        </div>
      </div>

      {/* Worker Selector Bar (Mobile Single-Row Scroll) — only shown when multiple workers are present (clinical/staff view) */}
      {workers.length > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-kerala-coir-50 border border-kerala-coir-300 rounded-2xl p-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-kerala-green-800" />
            <span>Worker Schedule:</span>
          </div>

          {/* Worker Switcher Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {workers.map((worker) => {
              const isSelected = worker.id === selectedWorker?.id;
              return (
                <button
                  key={worker.id}
                  type="button"
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shadow-2xs min-h-[40px] ${
                    isSelected
                      ? "bg-gradient-to-r from-kerala-green-900 to-kerala-green-800 text-white ring-2 ring-kerala-gold-400"
                      : "bg-white text-slate-700 hover:bg-kerala-coir-100/80 border border-kerala-coir-200"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${getRiskDotColor(
                      worker.riskStatus
                    )}`}
                  />
                  <span>{worker.name}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected ? "text-kerala-gold-200" : "text-slate-400"
                    }`}
                  >
                    ({worker.portableHealthId.substring(6)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Worker Snapshot Banner */}
      {selectedWorker && (
        <div className="bg-white border-2 border-kerala-green-800/30 rounded-houseboat p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                {selectedWorker.name}
              </h2>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                {selectedWorker.portableHealthId}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{selectedWorker.district || "Ernakulam"} District, Kerala</span>
              <span>•</span>
              <span>Origin: {selectedWorker.homeState}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RiskStatusBadge
              status={selectedWorker.riskStatus || "GREEN"}
              variant="light"
              size="md"
            />
          </div>
        </div>
      )}

      {/* Flagged Clinical Follow-up Alert (if Yellow/Red) */}
      {isFlaggedForFollowUp && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-amber-900">
                Clinical Follow-up Recommended ({selectedWorker.riskStatus === "RED" ? "Urgent Red Triage" : "Yellow Monitoring"})
              </p>
              <p className="text-amber-800 leading-relaxed">
                {selectedWorker.riskStatus === "RED"
                  ? "Worker has acute respiratory / symptom indicators requiring priority evaluation by a medical officer at the nearest CHC."
                  : "Worker has borderline vitals / recovery protocol requiring scheduled BP & blood glucose monitoring."}
              </p>
            </div>
          </div>

          <a
            href="tel:1056"
            className="inline-flex items-center justify-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition shrink-0 min-h-[44px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Book via DISHA 1056</span>
          </a>
        </div>
      )}

      {/* Filter Tabs (All / Upcoming / Past) */}
      <div className="flex items-center gap-2 border-b border-kerala-coir-200 pb-2">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[40px] ${
            filterMode === "all"
              ? "bg-kerala-green-800 text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Appointments ({workerVisits.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode("upcoming")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[40px] ${
            filterMode === "upcoming"
              ? "bg-kerala-green-800 text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Upcoming / Scheduled ({upcomingVisits.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode("past")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition min-h-[40px] ${
            filterMode === "past"
              ? "bg-kerala-green-800 text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Completed Visits ({pastVisits.length})
        </button>
      </div>

      {/* APPOINTMENT / VISIT CARDS LIST (Mobile-First Single Column) */}
      <div className="space-y-4">
        {displayedVisits.length === 0 ? (
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No appointments found in this view
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {filterMode === "upcoming"
                ? "No future visits currently scheduled. You can call DISHA 1056 or visit your nearest Primary Health Centre to book a follow-up checkup."
                : "No past visit history recorded for this profile."}
            </p>
            <div className="pt-2">
              <a
                href="tel:1056"
                className="inline-flex items-center gap-2 bg-[#0f3e17] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs hover:bg-[#0c2f10] transition min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call DISHA 1056 to Schedule</span>
              </a>
            </div>
          </div>
        ) : (
          displayedVisits.map((visit: any) => {
            const isFuture = new Date(visit.date) >= now;
            return (
              <div
                key={visit.id}
                className={`bg-white border-2 rounded-houseboat p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all space-y-3 ${
                  isFuture
                    ? "border-emerald-500/60 hover:border-emerald-600 shadow-md"
                    : "border-kerala-coir-200 hover:border-kerala-green-400"
                }`}
              >
                {/* Top Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 ${
                        isFuture
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isFuture ? (
                        <>
                          <Clock className="w-3 h-3 text-emerald-700 animate-pulse" />
                          <span>Upcoming Scheduled Appointment</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          <span>Completed Consultation</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono font-bold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{formatDate(visit.date)}</span>
                  </div>
                </div>

                {/* Facility & Doctor Notes */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-kerala-green-800 shrink-0" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      {visit.facility?.name || "Kerala Health Facility"}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200">
                      {visit.facility?.type || "PHC"}
                    </span>
                  </div>

                  {visit.facility?.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 pl-6">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{visit.facility.location}</span>
                    </p>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-700">Clinical Focus / Assessment Notes:</p>
                    <p className="text-slate-800 leading-relaxed">
                      {visit.notes || "Routine health screening & occupational physical evaluation."}
                    </p>
                  </div>
                </div>

                {/* Attached Treatments / Prescriptions */}
                {visit.treatments && visit.treatments.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                    <p className="font-bold text-kerala-blue-900">Prescription Orders:</p>
                    {visit.treatments.map((tItem: any) => (
                      <div key={tItem.id} className="pl-3 text-slate-700">
                        <span>• {tItem.description}</span>
                        {tItem.medication && (
                          <span className="font-bold text-kerala-blue-800 ml-1">
                            — Rx: {tItem.medication}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <a
                      href="tel:1056"
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition min-h-[44px] flex-1 sm:flex-none"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Facility / 1056</span>
                    </a>

                    <Link
                      href={`/workers/${selectedWorker.portableHealthId}` as any}
                      className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 transition min-h-[44px] flex-1 sm:flex-none"
                    >
                      <span>View Health Passport</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    No booking fees • Free Government Service
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DISHA 1056 Helpline Banner */}
      <div className="bg-gradient-to-br from-[#0c2217] via-[#103022] to-[#0a1e2b] text-white rounded-houseboat p-6 sm:p-8 border border-kerala-gold-500/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <PhoneCall className="w-5 h-5 text-kerala-gold-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              Need to reschedule or schedule a health camp visit?
            </h3>
          </div>
          <p className="text-xs text-emerald-100 max-w-xl">
            Call Kerala DISHA 1056 toll-free (24x7). Multi-lingual assistance in Malayalam, Hindi, Bengali, Odia, and English.
          </p>
        </div>

        <a
          href="tel:1056"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-md text-xs sm:text-sm transition shrink-0 min-h-[48px]"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 1056 Toll-Free</span>
        </a>
      </div>
    </div>
  );
}
