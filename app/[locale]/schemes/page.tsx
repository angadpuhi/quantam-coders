import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { KeralaMotif } from "@/components/KeralaMotif";
import {
  HeartHandshake,
  Shield,
  Building,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function SchemesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sections" });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>State & Central Welfare Benefits</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("schemesTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t("schemesSubtitle")}
          </p>
        </div>
      </div>

      {/* Schemes Grid (Scaffold) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Awaaz Scheme */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-kerala-green-800" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 border border-emerald-200 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("awaazSchemeTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("awaazSchemeDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free for enrolled workers</span>
            </div>
          </div>
        </div>

        {/* 2. PM-JAY Scheme */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-kerala-blue-800" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 border border-blue-200 shadow-2xs">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("pmjaySchemeTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("pmjaySchemeDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>₹5 Lakh annual coverage</span>
            </div>
          </div>
        </div>

        {/* 3. Labour Welfare Board */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 to-kerala-gold-600" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 border border-amber-200 shadow-2xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("welfareBoardTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("welfareBoardDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Labour Welfare Linkage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
