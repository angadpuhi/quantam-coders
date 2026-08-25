"use client";

import React, { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  Activity,
  Pill,
  Building2,
  AlertCircle,
  PlusCircle,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";
import { AddClinicalRecordForm } from "@/components/AddClinicalRecordForm";
import { formatDate } from "@/lib/utils";

export default function WorkerDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = useTranslations("workerDetail");
  const resolvedParams = use(params);
  const workerIdentifier = resolvedParams.id;

  const [workerData, setWorkerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/workers/${encodeURIComponent(workerIdentifier)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Worker profile not found.");
      }

      setWorkerData(json.data.worker);
    } catch (err: any) {
      setError(err.message || "Failed to load worker profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerDetails();
  }, [workerIdentifier]);

  const handleCopyHealthId = () => {
    if (workerData?.portableHealthId) {
      navigator.clipboard.writeText(workerData.portableHealthId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-6">
        <div className="h-40 bg-slate-200 animate-pulse rounded-houseboat" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-24 bg-slate-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !workerData) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white border border-red-200 rounded-houseboat p-8 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">{t("notFoundTitle")}</h2>
          <p className="text-sm text-slate-600 mt-2">{error || t("notFoundDesc")}</p>
          <div className="mt-6">
            <Link
              href="/registry"
              className="inline-flex items-center gap-2 bg-kerala-green-800 hover:bg-kerala-green-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("returnToRegistry")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/registry"
          className="inline-flex items-center gap-2 text-xs font-semibold text-kerala-green-900 hover:text-kerala-green-700 bg-kerala-green-50 hover:bg-kerala-green-100 border border-kerala-green-200 px-3.5 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("backButton")}</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? t("hideRecordButton") : t("addRecordButton")}</span>
        </button>
      </div>

      {/* Kerala Coastal Hero Header - Worker Identity */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-8 shadow-lg border border-kerala-gold-600/30">
        {/* Subtle Palm & Banana Leaf Motif Overlay */}
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-kerala-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-3 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-kerala-gold-400" />
                <span>{t("verifiedProfileBadge")}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {workerData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 mt-2">
                <span className="font-semibold">{workerData.gender}</span>
                {workerData.dob && (
                  <>
                    <span>•</span>
                    <span>{t("dobLabel")} {formatDate(workerData.dob)}</span>
                  </>
                )}
                <span>•</span>
                <span>
                  {t("originLabel")} <strong>{workerData.homeState}</strong>
                </span>
                {workerData.phone && (
                  <>
                    <span>•</span>
                    <span>{t("phoneLabel")} {workerData.phone}</span>
                  </>
                )}
              </div>
            </div>

            {/* Portable Health ID Card Badge */}
            <div className="bg-black/40 border border-kerala-gold-400/60 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-xs min-w-[240px]">
              <div>
                <p className="text-[10px] uppercase font-bold text-kerala-gold-300 tracking-wider">
                  {t("portableIdLabel")}
                </p>
                <p className="font-mono text-xl font-extrabold text-white tracking-wide mt-0.5">
                  {workerData.portableHealthId}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyHealthId}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title="Copy Health ID"
              >
                {copied ? <Check className="w-4 h-4 text-kerala-gold-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Current Address */}
          {workerData.currentAddress && (
            <div className="mt-5 pt-4 border-t border-white/15 text-xs text-emerald-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-kerala-gold-400 shrink-0" />
              <span>{t("currentAddressLabel")} {workerData.currentAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible / Integrated Add Clinical Record Form */}
      {showAddForm && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <AddClinicalRecordForm
            workerId={workerData.id}
            portableHealthId={workerData.portableHealthId}
            workerName={workerData.name}
            onRecordAdded={() => {
              fetchWorkerDetails();
            }}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Clinical Metrics Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-2xl font-extrabold text-kerala-green-900">
            {workerData.visits?.length || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            {t("consultationsCount")}
          </p>
        </div>
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-2xl font-extrabold text-kerala-blue-900">
            {workerData.screenings?.length || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            {t("screeningsCount")}
          </p>
        </div>
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 text-center shadow-xs">
          <p className="text-2xl font-extrabold text-kerala-gold-800">
            {workerData.treatments?.length || 0}
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            {t("treatmentsCount")}
          </p>
        </div>
      </div>

      {/* Detailed Clinical Sections - Houseboat Window Cards */}
      <div className="space-y-6">
        {/* 1. Clinical Visits Timeline */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-800 border border-kerala-green-200">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t("consultationHistoryTitle")}</h2>
                <p className="text-xs text-slate-500">
                  {t("consultationHistoryDesc")}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-kerala-green-50 text-kerala-green-900 px-2.5 py-1 rounded-full">
              {t("visitsLoggedBadge", { count: workerData.visits?.length || 0 })}
            </span>
          </div>

          {workerData.visits && workerData.visits.length > 0 ? (
            <div className="space-y-4">
              {workerData.visits.map((visit: any) => (
                <div
                  key={visit.id}
                  className="p-5 bg-slate-50/90 border border-slate-200 rounded-2xl hover:border-kerala-green-400 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
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

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">{t("doctorNotesLabel")}</strong> {visit.notes}
                  </p>

                  {/* Attached Treatments */}
                  {visit.treatments && visit.treatments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                      <p className="text-xs font-bold text-kerala-blue-900 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-kerala-blue-700" />
                        {t("prescriptionsOrdersLabel")}
                      </p>
                      {visit.treatments.map((tItem: any) => (
                        <div key={tItem.id} className="text-xs text-slate-700 pl-4">
                          <span>• {tItem.description}</span>
                          {tItem.medication && (
                            <span className="font-semibold text-kerala-blue-800 ml-1">
                              — Rx: {tItem.medication}
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
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl">
              <Stethoscope className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">{t("noVisitsRecorded")}</p>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-3 text-xs font-bold text-kerala-green-800 hover:underline"
              >
                {t("recordFirstVisitButton")}
              </button>
            </div>
          )}
        </div>

        {/* 2. Diagnostic & Health Screenings */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-blue-50 text-kerala-blue-800 border border-kerala-blue-200">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t("screeningsTitle")}</h2>
                <p className="text-xs text-slate-500">
                  {t("screeningsDesc")}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-kerala-blue-50 text-kerala-blue-900 px-2.5 py-1 rounded-full">
              {t("screeningsBadge", { count: workerData.screenings?.length || 0 })}
            </span>
          </div>

          {workerData.screenings && workerData.screenings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workerData.screenings.map((sc: any) => (
                <div
                  key={sc.id}
                  className="p-4 bg-kerala-blue-50/40 border border-kerala-blue-200/80 rounded-2xl"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-bold text-kerala-blue-950">{sc.type}</span>
                    <span className="text-xs font-bold bg-kerala-blue-100 text-kerala-blue-900 px-2.5 py-0.5 rounded-full border border-kerala-blue-200">
                      {sc.result}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 mt-3 pt-2 border-t border-kerala-blue-100 text-xs">
                    <span className="truncate">{sc.facility?.name || "Mobile Health Camp"}</span>
                    <span>{formatDate(sc.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl">
              <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">{t("noScreeningsRecorded")}</p>
            </div>
          )}
        </div>

        {/* 3. Treatment Plans & Prescriptions */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-kerala-coir-100 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-gold-50 text-kerala-gold-800 border border-kerala-gold-200">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t("treatmentHistoryTitle")}</h2>
                <p className="text-xs text-slate-500">
                  {t("treatmentHistoryDesc")}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-kerala-gold-50 text-kerala-gold-900 px-2.5 py-1 rounded-full">
              {t("treatmentsBadge", { count: workerData.treatments?.length || 0 })}
            </span>
          </div>

          {workerData.treatments && workerData.treatments.length > 0 ? (
            <div className="space-y-3">
              {workerData.treatments.map((tr: any) => (
                <div
                  key={tr.id}
                  className="p-4 bg-kerala-gold-50/30 border border-kerala-gold-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{tr.description}</p>
                    {tr.medication && (
                      <p className="text-xs text-kerala-blue-900 font-semibold mt-0.5">
                        Rx: {tr.medication}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 shrink-0">
                    <span>{t("prescribedOn", { date: formatDate(tr.date) })}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl">
              <Pill className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium">{t("noTreatmentsRecorded")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
