"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  ShieldCheck,
  Pill,
  Syringe,
  Microscope,
  Calendar,
  Building2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  User,
  Activity,
  HeartPulse,
  Printer,
  Share2,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Award,
  Lock,
  Maximize2,
  X,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";

interface HealthPassportProps {
  workers: any[];
}

export function HealthPassportCenterpiece({ workers }: HealthPassportProps) {
  const t = useTranslations("healthPassport");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<
    "prescriptions" | "vaccinations" | "labReports" | "visits"
  >("prescriptions");
  const [copied, setCopied] = useState(false);
  const [showEnlargedQr, setShowEnlargedQr] = useState(false);

  const selectedWorker =
    workers.find((w) => w.id === selectedWorkerId) || workers[0];

  if (!selectedWorker) {
    return null;
  }

  // Filter records
  const treatments = selectedWorker.treatments || [];
  const allScreenings = selectedWorker.screenings || [];
  const vaccinations = allScreenings.filter(
    (s: any) =>
      s.type.toLowerCase().includes("vaccin") ||
      s.type.toLowerCase().includes("tetanus") ||
      s.type.toLowerCase().includes("covid") ||
      s.type.toLowerCase().includes("hepatitis")
  );
  const labReports = allScreenings.filter(
    (s: any) =>
      !s.type.toLowerCase().includes("vaccin") &&
      !s.type.toLowerCase().includes("tetanus") &&
      !s.type.toLowerCase().includes("covid") &&
      !s.type.toLowerCase().includes("hepatitis")
  );
  const visits = selectedWorker.visits || [];

  const handleCopyId = () => {
    if (selectedWorker?.portableHealthId) {
      navigator.clipboard.writeText(selectedWorker.portableHealthId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper avatar initials
  const initials = selectedWorker.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const getRiskDotColor = (riskStatus?: string) => {
    const s = (riskStatus || "GREEN").toUpperCase();
    if (s === "RED") return "bg-red-500 ring-2 ring-red-400";
    if (s === "YELLOW") return "bg-amber-400 ring-2 ring-amber-300";
    return "bg-emerald-400 ring-2 ring-emerald-300";
  };

  return (
    <div className="w-full space-y-4">
      {/* Worker Selector Bar (Mobile Single-Row Scroll) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-kerala-coir-50 border border-kerala-coir-300 rounded-2xl p-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <User className="w-4 h-4 text-kerala-green-800" />
          <span>{t("switchWorker")}</span>
        </div>

        {/* Worker Switcher Chips with Triage Status Indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {workers.map((worker) => {
            const isSelected = worker.id === selectedWorker.id;
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

      {/* SIGNATURE HEALTH PASSPORT MAIN CARD */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-[#0c2217] via-[#103022] to-[#0a1e2b] text-white border-2 border-kerala-gold-500/60 shadow-2xl">
        {/* Watermark Motif */}
        <div className="absolute inset-0 pointer-events-none text-emerald-400 opacity-15">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Decorative Gold Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Passport Header Ribbon */}
        <div className="relative z-10 bg-gradient-to-r from-kerala-gold-600/30 via-kerala-gold-500/20 to-kerala-gold-600/30 border-b border-kerala-gold-400/40 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-kerala-gold-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <KeralaPalmIcon className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-kerala-gold-300 uppercase block">
                {t("passportIssuer")}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>{t("passportTitle")}</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50">
                  {t("verifiedCard")}
                </span>
              </h2>
            </div>
          </div>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-kerala-gold-400/50 text-xs font-semibold text-kerala-gold-200 self-start sm:self-auto shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-kerala-gold-400 shrink-0" />
            <span className="italic tracking-tight text-[11px] sm:text-xs">
              &ldquo;{t("tagline")}&rdquo;
            </span>
          </div>
        </div>

        {/* Passport Identity Deck (Photo, Name, ID, QR, Triage Risk Badge) */}
        <div className="relative z-10 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-white/10">
          {/* Worker Photo & Identifiers (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            {/* Photo Avatar Placeholder with Kerala Teak Border */}
            <div className="relative shrink-0">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 border-2 border-kerala-gold-400 p-1 shadow-lg flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="w-full h-full rounded-xl bg-slate-900/80 flex flex-col items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-kerala-green-800/80 border border-kerala-gold-400/60 flex items-center justify-center text-kerala-gold-300 font-extrabold text-base shadow-inner">
                    {initials}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 mt-1.5 tracking-wider uppercase">
                    {selectedWorker.gender || "Worker"}
                  </span>
                  {/* Verified Emblem */}
                  <div className="absolute bottom-1 right-1 bg-kerala-gold-500 text-slate-950 p-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Worker Details */}
            <div className="space-y-2.5 flex-1 min-w-0 w-full">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {selectedWorker.name}
                </h1>
                <p className="text-xs text-kerala-gold-300 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-kerala-gold-400 shrink-0" />
                  <span>{selectedWorker.homeState}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-200 truncate">
                    {selectedWorker.currentAddress || "Kerala Resident"}
                  </span>
                </p>
              </div>

              {/* Health ID Tag & Copy Button */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-kerala-gold-400/60 shadow-inner">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Health ID
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-kerala-gold-300 tracking-wider">
                    {selectedWorker.portableHealthId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    title="Copy Portable Health ID"
                    className="text-slate-400 hover:text-white transition p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Awaaz Scheme Tag */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300">
                  <Award className="w-3 h-3 text-kerala-gold-400" />
                  <span>{t("awaazEnrolled")}</span>
                </div>
              </div>

              {/* Demographics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300 text-left">
                {selectedWorker.dob && (
                  <div>
                    <span className="text-slate-400">{t("dob")} </span>
                    <span className="font-semibold text-white">
                      {new Date(selectedWorker.dob).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedWorker.phone && (
                  <div>
                    <span className="text-slate-400">{t("phone")} </span>
                    <span className="font-semibold text-white">
                      {selectedWorker.phone}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Security: </span>
                  <span className="font-semibold text-emerald-300">
                    {t("dpdpProtected")}
                  </span>
                </div>
              </div>

              {/* Clickable Privacy & Trust Badge */}
              <div className="pt-2">
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-semibold shadow-xs transition group"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-emerald-300">Your Data, Your Control</span>
                  <span className="text-[10px] text-slate-300 hidden md:inline">• DPDP Protected • Never Shared with Employers</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400 ml-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* Color-Coded Triage Risk Badge & Live Scannable QR Code (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 w-full">
            {/* Prominent Color-Coded Triage Badge */}
            <div className="w-full flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t("riskStatus")}
              </span>
              <RiskStatusBadge
                status={selectedWorker.riskStatus || "GREEN"}
                variant="dark"
                size="lg"
                className="w-full justify-center text-center py-2.5 shadow-md"
              />
            </div>

            {/* REAL SCANNABLE QR CODE FROM qrcode.react */}
            <div className="flex items-center gap-3 w-full justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase text-kerala-gold-300 tracking-wider">
                  Portable Health QR
                </p>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Scan to verify worker records instantly
                </p>
                <button
                  type="button"
                  onClick={() => setShowEnlargedQr(true)}
                  className="text-[10px] font-bold text-kerala-gold-400 hover:text-white underline mt-1 inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge for Camp Scanning</span>
                </button>
              </div>

              {/* Scannable SVG QR Code */}
              <div
                onClick={() => setShowEnlargedQr(true)}
                className="p-2 bg-white rounded-xl shadow-lg border-2 border-kerala-gold-400 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title="Click to enlarge QR code"
              >
                <QRCodeSVG
                  value={selectedWorker.portableHealthId}
                  size={68}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE / TABBED RECORD VIEWER LOWER DECK */}
        <div className="relative z-10 bg-slate-950/70 backdrop-blur-md p-4 sm:p-8">
          {/* Interactive Navigation Tabs (Mobile 4-Column Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-3 border-b border-white/10">
            {/* 1. Prescriptions Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("prescriptions")}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                activeTab === "prescriptions"
                  ? "bg-kerala-gold-500 text-slate-950 shadow-md ring-2 ring-kerala-gold-300"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Pill className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t("tabPrescriptions")}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] shrink-0 ${
                  activeTab === "prescriptions"
                    ? "bg-slate-950 text-kerala-gold-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {treatments.length}
              </span>
            </button>

            {/* 2. Vaccinations Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("vaccinations")}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                activeTab === "vaccinations"
                  ? "bg-kerala-gold-500 text-slate-950 shadow-md ring-2 ring-kerala-gold-300"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Syringe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t("tabVaccinations")}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] shrink-0 ${
                  activeTab === "vaccinations"
                    ? "bg-slate-950 text-kerala-gold-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {vaccinations.length}
              </span>
            </button>

            {/* 3. Lab Reports Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("labReports")}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                activeTab === "labReports"
                  ? "bg-kerala-gold-500 text-slate-950 shadow-md ring-2 ring-kerala-gold-300"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Microscope className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t("tabLabReports")}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] shrink-0 ${
                  activeTab === "labReports"
                    ? "bg-slate-950 text-kerala-gold-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {labReports.length}
              </span>
            </button>

            {/* 4. Clinical Visits Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("visits")}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                activeTab === "visits"
                  ? "bg-kerala-gold-500 text-slate-950 shadow-md ring-2 ring-kerala-gold-300"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t("tabVisits")}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] shrink-0 ${
                  activeTab === "visits"
                    ? "bg-slate-950 text-kerala-gold-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {visits.length}
              </span>
            </button>
          </div>

          {/* Scrollable Records Container */}
          <div className="mt-4 max-h-64 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* TAB 1: PRESCRIPTIONS */}
            {activeTab === "prescriptions" && (
              <>
                {treatments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <Pill className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    {t("noPrescriptions")}
                  </div>
                ) : (
                  treatments.map((treatment: any) => (
                    <div
                      key={treatment.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-kerala-gold-400/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {treatment.medication || "Prescription Item"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                            Active
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {treatment.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right text-[11px] text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Clock className="w-3 h-3 text-kerala-gold-400" />
                          <span>
                            {new Date(treatment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* TAB 2: VACCINATIONS */}
            {activeTab === "vaccinations" && (
              <>
                {vaccinations.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <Syringe className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    {t("noVaccinations")}
                  </div>
                ) : (
                  vaccinations.map((vac: any) => (
                    <div
                      key={vac.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {vac.type.replace("Vaccination: ", "")}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                            Immunized
                          </span>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px]">
                          {vac.result}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right text-[11px] text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          <span>
                            {new Date(vac.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* TAB 3: LAB REPORTS */}
            {activeTab === "labReports" && (
              <>
                {labReports.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <Microscope className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    {t("noLabReports")}
                  </div>
                ) : (
                  labReports.map((lab: any) => (
                    <div
                      key={lab.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {lab.type}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                            Diagnostic Valid
                          </span>
                        </div>
                        <p className="text-emerald-300 font-semibold text-[12px]">
                          Result: {lab.result}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right text-[11px] text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>
                            {new Date(lab.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* TAB 4: CLINICAL VISITS */}
            {activeTab === "visits" && (
              <>
                {visits.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    {t("noVisits")}
                  </div>
                ) : (
                  visits.map((visit: any) => (
                    <div
                      key={visit.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            Clinical Assessment & Doctor Consultation
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                            Consultation Logged
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {visit.notes || "Routine physical checkup completed."}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right text-[11px] text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        <div className="flex items-center sm:justify-end gap-1">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>
                            {new Date(visit.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Bottom Card Actions (Large Mobile Touch Targets) */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Link
                href={`/workers/${selectedWorker.portableHealthId}` as any}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 text-slate-950 text-xs font-bold px-4 py-3 rounded-xl shadow-md transition min-h-[44px]"
              >
                <span>{t("viewFullProfile")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl border border-white/15 transition min-h-[44px]"
              >
                <Printer className="w-3.5 h-3.5 text-kerala-gold-400" />
                <span>{t("printPassport")}</span>
              </button>

              <Link
                href="/privacy"
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl border border-white/15 transition min-h-[44px]"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("shareConsent")}</span>
              </Link>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-end gap-1.5 pt-2 sm:pt-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kerala DHS Digital Health Authority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged QR Modal for Mobile / Health Camp Scanning */}
      {showEnlargedQr && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fffefc] rounded-houseboat p-6 sm:p-8 max-w-sm w-full text-slate-950 text-center shadow-2xl border-4 border-[#0f3e17] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f3e17]">
                  Athidhi Health ID QR
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEnlargedQr(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-[#cfe7d3] shadow-inner inline-block mx-auto">
              <QRCodeSVG
                value={selectedWorker.portableHealthId}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {selectedWorker.name}
              </h3>
              <p className="font-mono text-sm font-bold text-[#0f3e17] mt-0.5">
                {selectedWorker.portableHealthId}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Health camp doctors &amp; PHC staff can scan this QR code with any camera to access full clinical history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowEnlargedQr(false)}
              className="w-full bg-[#0f3e17] hover:bg-[#0c2f10] text-white font-bold py-3 px-4 rounded-xl text-xs transition"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
