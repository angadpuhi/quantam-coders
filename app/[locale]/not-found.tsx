import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, Home, ArrowLeft, HeartPulse, UserPlus } from "lucide-react";
import { KeralaMotif } from "@/components/KeralaMotif";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-8 shadow-sm relative overflow-hidden">
        {/* Top Kerala Coastal Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200 mb-4">
          <HeartPulse className="w-8 h-8 text-kerala-green-800" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-1">{t("pageNotFound")}</h2>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
          {t("pageNotFoundDesc")}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-kerala-green-800 hover:bg-kerala-green-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>{t("goHome")}</span>
          </Link>

          <Link
            href="/registry"
            className="inline-flex items-center gap-2 bg-kerala-coir-100 hover:bg-kerala-coir-200 text-kerala-coir-900 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition border border-kerala-coir-300"
          >
            <Search className="w-4 h-4" />
            <span>{t("searchRegistry")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
