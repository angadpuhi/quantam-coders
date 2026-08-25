"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  KeyRound,
  FileCheck,
  EyeOff,
  Clock,
  ArrowRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Building2,
  Ban,
  Sparkles,
  FileText,
  UserX,
  ExternalLink,
} from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";

interface ConsentItem {
  id: string;
  facility: string;
  doctor: string;
  role: string;
  scope: string;
  expires: string;
  status: "ACTIVE" | "REVOKED";
}

const INITIAL_CONSENTS: ConsentItem[] = [
  {
    id: "c1",
    facility: "Perumbavoor Community Health Centre",
    doctor: "Dr. Ananya Nair",
    role: "Medical Officer",
    scope: "Full Medical History & Spirometry Records",
    expires: "Valid for 30 days (Auto-expires)",
    status: "ACTIVE",
  },
  {
    id: "c2",
    facility: "Mobile Medical Unit - Industrial Belt",
    doctor: "Triage Nursing Staff",
    role: "Camp Coordinator",
    scope: "Emergency Triage & Screening Vitals",
    expires: "24-Hour Temporary Camp Pass",
    status: "ACTIVE",
  },
  {
    id: "c3",
    facility: "Kozhikode Beach General Hospital",
    doctor: "Clinical Pathology Lab",
    role: "Diagnostic Unit",
    scope: "Diagnostic Lab Reports & Malaria RDT",
    expires: "Single Consultation Visit",
    status: "ACTIVE",
  },
];

const ACCESS_LOGS = [
  {
    id: "l1",
    time: "Today, 10:42 AM",
    actor: "Dr. Ananya Nair (Perumbavoor CHC)",
    action: "Accessed Clinical Consultation & Spirometry Records via QR Code Scan",
    ip: "172.20.10.12 (Kerala State DHS Network)",
  },
  {
    id: "l2",
    time: "2026-08-10, 04:15 PM",
    actor: "Mobile Camp Nurse (Ernakulam Mobile Unit)",
    action: "Recorded 2-Minute Health Triage Screening & Prescribed Inhaler",
    ip: "Mobile Medical Van Camp Terminal",
  },
  {
    id: "l3",
    time: "2026-07-02, 11:30 AM",
    actor: "Kozhikode GH Medical Officer",
    action: "Verified Tetanus Toxoid Booster & Recorded BP 118/78 mmHg",
    ip: "DHS Hospital Management System",
  },
];

export function PrivacyConsentManager() {
  const t = useTranslations("privacyPage");
  const [consents, setConsents] = useState<ConsentItem[]>(INITIAL_CONSENTS);
  const [grantSuccess, setGrantSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleRevoke = (id: string) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "REVOKED" } : c))
    );
  };

  const handleGrantTemporary = () => {
    const newConsent: ConsentItem = {
      id: `c_${Date.now()}`,
      facility: "Kerala State On-Call Emergency Doctor",
      doctor: "DISHA 1056 Tele-Health Officer",
      role: "Emergency Clinical Response",
      scope: "Full Health Passport Access (24 Hours)",
      expires: "Expires in 24 Hours",
      status: "ACTIVE",
    };
    setConsents([newConsent, ...consents]);
    setGrantSuccess(true);
    setTimeout(() => setGrantSuccess(false), 4000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 1000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>{t("pageBadge")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("mainTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t("mainSubtitle")}
          </p>

          {/* Quick Trust Chips */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-semibold text-emerald-200">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-semibold text-kerala-gold-200">
              <UserCheck className="w-3.5 h-3.5 text-kerala-gold-400" />
              <span>Doctor-Only Access</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-500/40 backdrop-blur-xs font-semibold text-red-200">
              <Ban className="w-3.5 h-3.5 text-red-400" />
              <span>Never Shared with Employers</span>
            </div>
          </div>
        </div>
      </div>

      {/* THREE CORE PRIVACY PILLARS IN PLAIN LANGUAGE */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Encrypted */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 border border-emerald-200 shadow-2xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("pillar1Title")}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t("pillar1Desc")}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government of Kerala Cloud</span>
            </div>
          </div>

          {/* Pillar 2: Doctor-Only via Consent */}
          <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-blue-800 to-blue-600" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 border border-blue-200 shadow-2xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("pillar2Title")}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t("pillar2Desc")}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-blue-800 font-bold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Granular Time-Bound Keys</span>
            </div>
          </div>

          {/* Pillar 3: Never Shared with Employers */}
          <div className="bg-white border-2 border-red-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition bg-gradient-to-b from-white to-red-50/20">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-600" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mb-4 border border-red-200 shadow-2xs">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t("pillar3Title")}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t("pillar3Desc")}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-red-100 flex items-center gap-1.5 text-[11px] text-red-800 font-bold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>100% Employer-Blind Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE CONSENT MANAGEMENT MODULE */}
      <section className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kerala-coir-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-kerala-green-800" />
              <h2 className="text-lg font-bold text-slate-900">
                {t("consentManagerTitle")}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t("consentManagerSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGrantTemporary}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-green-800 to-kerala-green-700 hover:from-kerala-green-900 hover:to-kerala-green-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-kerala-gold-300" />
            <span>{t("grantConsentBtn")}</span>
          </button>
        </div>

        {grantSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Temporary 24-hour emergency consent granted to Kerala State Tele-health Doctor!
            </span>
          </div>
        )}

        {/* Consents List */}
        <div className="space-y-3">
          {consents.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                item.status === "ACTIVE"
                  ? "bg-slate-50 border-slate-200 hover:border-kerala-green-300"
                  : "bg-slate-100/50 border-slate-200 opacity-60"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.facility}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      item.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.status === "ACTIVE" ? t("activeStatus") : t("revokedStatus")}
                  </span>
                </div>
                <p className="text-slate-600">
                  Doctor / Unit: <strong>{item.doctor}</strong> ({item.role})
                </p>
                <p className="text-[11px] text-slate-500">
                  Scope: {item.scope} • <span className="italic text-slate-600">{item.expires}</span>
                </p>
              </div>

              {item.status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => handleRevoke(item.id)}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-bold text-xs transition"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{t("revokeBtn")}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ACCESS LOGS & TRANSPARENCY TRAIL */}
      <section className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-kerala-coir-100 pb-3">
          <Clock className="w-5 h-5 text-kerala-blue-800" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t("accessLogTitle")}
            </h2>
            <p className="text-xs text-slate-500">{t("accessLogDesc")}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {ACCESS_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="font-bold text-slate-900">{log.actor}</p>
                <p className="text-slate-600 mt-0.5">{log.action}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{log.ip}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DATA PORTABILITY & DOWNLOAD MY RECORD */}
      <div className="bg-gradient-to-br from-[#0c2217] via-[#103022] to-[#0a1e2b] text-white rounded-houseboat p-6 sm:p-8 border border-kerala-gold-500/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Download className="w-5 h-5 text-kerala-gold-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t("exportDataTitle")}
            </h3>
          </div>
          <p className="text-xs text-emerald-100 max-w-xl">
            {t("exportDataDesc")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-md text-xs sm:text-sm transition shrink-0"
        >
          {downloading ? (
            <span>Generating Export...</span>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>{t("downloadBtn")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
