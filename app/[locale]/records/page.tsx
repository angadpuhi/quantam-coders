import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getServerAuthSession } from "@/lib/auth";
import { KeralaMotif } from "@/components/KeralaMotif";
import {
  FileText,
  Pill,
  Syringe,
  Microscope,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sections" });

  const session = await getServerAuthSession();
  const role = (session?.user as any)?.role;
  const sessionHealthId = (session?.user as any)?.portableHealthId;
  const isWorker = role === "WORKER";

  // If worker, target links go to their own passport, otherwise to the staff registry
  const targetLink = isWorker && sessionHealthId
    ? `/workers/${encodeURIComponent(sessionHealthId)}`
    : "/registry";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <FolderOpen className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>Health Document Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("recordsTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {t("recordsSubtitle")}
          </p>
        </div>
      </div>

      {/* Record Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Prescriptions */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 to-emerald-600" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 border border-emerald-200 shadow-2xs">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("prescriptionsTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("prescriptionsDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <Link
              href={targetLink as any}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <span>{isWorker ? "View My Prescriptions" : "View Active Regimens"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 2. Vaccinations */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 to-kerala-blue-800" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4 border border-blue-200 shadow-2xs">
              <Syringe className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("vaccinationsTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("vaccinationsDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <Link
              href={targetLink as any}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 transition"
            >
              <span>{isWorker ? "View My Immunizations" : "Immunization Records"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 3. Lab Reports */}
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 to-kerala-gold-600" />
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 border border-amber-200 shadow-2xs">
              <Microscope className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t("labReportsTitle")}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("labReportsDesc")}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-kerala-coir-100">
            <Link
              href={targetLink as any}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition"
            >
              <span>{isWorker ? "View My Lab Reports" : "Diagnostic Archives"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
