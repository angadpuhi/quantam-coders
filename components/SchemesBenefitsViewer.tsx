"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  HeartHandshake,
  Shield,
  Building,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Award,
  PhoneCall,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  FileCheck2,
} from "lucide-react";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";
import {
  matchSchemesForWorker,
  calculateAge,
  WorkerProfileForSchemes,
  MatchedScheme,
} from "@/lib/schemeMatcher";

interface SchemesBenefitsViewerProps {
  workers: WorkerProfileForSchemes[];
}

export function SchemesBenefitsViewer({ workers }: SchemesBenefitsViewerProps) {
  const t = useTranslations("schemesPage");
  const currentLocale = useLocale();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.id || ""
  );

  const selectedWorker =
    workers.find((w) => w.id === selectedWorkerId) ||
    workers[0] || {
      id: "demo",
      name: "Debabrata Das",
      portableHealthId: "KL-MH-829104",
      dob: "1996-04-12",
      gender: "MALE",
      homeState: "West Bengal",
      riskStatus: "GREEN",
    };

  const matchedSchemes: MatchedScheme[] = matchSchemesForWorker(
    selectedWorker,
    currentLocale
  );

  const workerAge = calculateAge(selectedWorker.dob);

  const getSchemeLocalizedName = (s: MatchedScheme) => {
    if (currentLocale === "ml" && s.malayalamName) return s.malayalamName;
    if (currentLocale === "hi" && s.hindiName) return s.hindiName;
    if (currentLocale === "bn" && s.bengaliName) return s.bengaliName;
    if (currentLocale === "or" && s.odiaName) return s.odiaName;
    return s.name;
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
            <Award className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>{t("pageBadge")}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("mainTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t("mainSubtitle")}
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-semibold text-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aawaz ₹25,000 + ₹2L Death</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-semibold text-kerala-gold-200">
              <Building className="w-3.5 h-3.5 text-kerala-gold-400" />
              <span>PM-JAY ₹5 Lakh Cashless</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-xs font-semibold text-blue-200">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
              <span>ESI Sickness Compensation</span>
            </div>
          </div>
        </div>
      </div>

      {/* WORKER SELECTOR BAR FOR ELIGIBILITY SIMULATION (only shown when multiple workers available) */}
      {workers.length > 1 && (
        <div className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <User className="w-4 h-4 text-kerala-green-800" />
            <span>{t("selectWorker")}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {workers.map((w) => {
              const isSelected = w.id === selectedWorker.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-kerala-green-900 text-white shadow-xs ring-2 ring-kerala-gold-400"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{w.name}</span>
                  <span className="font-mono text-[10px] opacity-75">
                    ({w.portableHealthId})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* "YOU MAY BE ELIGIBLE" ALERTS PANEL CENTERPIECE */}
      <section className="space-y-4">
        {/* Panel Header with Worker Profile Summary */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-kerala-coir-50 border-2 border-emerald-300/80 rounded-houseboat p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {t("eligibleAlertsTitle")}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {t("eligibleAlertsDesc")}
            </p>
          </div>

          {/* Active Profile Snapshot Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-white/80 border border-emerald-200 rounded-xl p-2.5">
            <span className="font-bold text-slate-900">{selectedWorker.name}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">{workerAge} yrs</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">{selectedWorker.homeState}</span>
            <span className="text-slate-300">•</span>
            <RiskStatusBadge
              status={selectedWorker.riskStatus || "GREEN"}
              variant="light"
              size="sm"
            />
          </div>
        </div>

        {/* Matched Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedSchemes
            .filter((s) => s.isEligible)
            .map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white border-2 border-kerala-coir-200 hover:border-kerala-green-600 rounded-houseboat p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col justify-between transition group hover:shadow-md"
              >
                {/* Top Accent Gradient Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 ${
                    scheme.id === "aawaz"
                      ? "bg-gradient-to-r from-emerald-600 to-kerala-green-800"
                      : scheme.id === "ayushman-bharat"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                      : scheme.id === "esi"
                      ? "bg-gradient-to-r from-teal-600 to-blue-800"
                      : scheme.id === "kasp"
                      ? "bg-gradient-to-r from-amber-600 to-red-600"
                      : "bg-gradient-to-r from-kerala-gold-600 to-amber-700"
                  }`}
                />

                <div className="space-y-4">
                  {/* Card Header & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>{t("matchedTag")}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {scheme.badge}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-kerala-green-900 transition-colors">
                        {getSchemeLocalizedName(scheme)}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {scheme.authority}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shrink-0 shadow-2xs">
                      {scheme.id === "aawaz" ? (
                        <Shield className="w-5 h-5 text-emerald-700" />
                      ) : scheme.id === "ayushman-bharat" ? (
                        <Building className="w-5 h-5 text-blue-700" />
                      ) : scheme.id === "esi" ? (
                        <HeartHandshake className="w-5 h-5 text-teal-700" />
                      ) : (
                        <Award className="w-5 h-5 text-amber-700" />
                      )}
                    </div>
                  </div>

                  {/* Benefit Coverage Callout */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {t("coverageLabel")}
                    </p>
                    <p className="font-extrabold text-sm sm:text-base text-kerala-green-950 mt-0.5">
                      {scheme.coverageAmount}
                    </p>
                  </div>

                  {/* Eligibility Reason Alert */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{t("eligibilityReason")}</span>
                    </p>
                    <p className="text-emerald-900 text-xs leading-relaxed">
                      {scheme.eligibilityReason}
                    </p>
                  </div>

                  {/* Info Blurb */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {scheme.infoBlurb}
                  </p>

                  {/* Key Benefits Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-800">
                      {t("keyBenefits")}
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How to Claim Steps */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">
                      {t("howToClaim")}{" "}
                    </span>
                    <span>{scheme.howToApply}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-kerala-coir-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{scheme.helpline}</span>
                  </div>

                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition"
                  >
                    <span>{t("viewOfficialPortal")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* DISHA 1056 KERALA EMERGENCY HELPLINE */}
      <div className="bg-gradient-to-br from-[#0c2217] via-[#103022] to-[#0a1e2b] text-white rounded-houseboat p-6 sm:p-8 border border-kerala-gold-500/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <PhoneCall className="w-5 h-5 text-kerala-gold-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              DISHA 1056 Health & Welfare Helpline
            </h3>
          </div>
          <p className="text-xs text-emerald-100 max-w-xl">
            Need help applying for Aawaz, PM-JAY, or finding an empaneled hospital in Kerala? Call toll-free 24x7 in Malayalam, Hindi, Bengali, Odia, or English.
          </p>
        </div>

        <a
          href="tel:1056"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-md text-xs sm:text-sm transition shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 1056 Toll-Free</span>
        </a>
      </div>
    </div>
  );
}
