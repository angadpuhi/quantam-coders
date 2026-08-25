"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error("Application error caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="bg-white border-2 border-red-200 rounded-houseboat p-8 shadow-sm relative overflow-hidden">
        {/* Top Teak / Coastal Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-600 to-kerala-gold-600" />

        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">{t("errorOccurred")}</h1>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {t("errorDesc")}
        </p>

        {error?.message && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs font-mono text-slate-700 max-h-24 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t("tryAgain")}</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            <span>{t("returnDashboard")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
