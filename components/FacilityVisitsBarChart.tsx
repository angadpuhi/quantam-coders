"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Building2, MapPin, BarChart3, Users, Stethoscope } from "lucide-react";

interface FacilityData {
  id: string;
  name: string;
  shortName: string;
  location: string;
  type: string;
  visitCount: number;
  screeningCount: number;
  totalActivity: number;
}

export function FacilityVisitsBarChart({ facilities }: { facilities: FacilityData[] }) {
  const t = useTranslations("common");

  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-2xl">
        <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="text-xs">No facility activity data available.</p>
      </div>
    );
  }

  const maxVisits = Math.max(...facilities.map((f) => f.visitCount), 1);

  return (
    <div className="space-y-4">
      {facilities.map((facility) => {
        const percentage = Math.round((facility.visitCount / maxVisits) * 100);

        const typeBadgeStyle =
          facility.type === "CHC"
            ? "bg-kerala-green-100 text-kerala-green-900 border-kerala-green-300"
            : facility.type === "PHC"
            ? "bg-kerala-blue-100 text-kerala-blue-900 border-kerala-blue-300"
            : facility.type === "Mobile Camp"
            ? "bg-kerala-gold-100 text-kerala-gold-900 border-kerala-gold-300"
            : "bg-slate-100 text-slate-800 border-slate-300";

        return (
          <div
            key={facility.id}
            className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl hover:border-kerala-green-400 transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeBadgeStyle}`}>
                  {facility.type}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{facility.name}</h4>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3 h-3 text-kerala-green-700 shrink-0" />
                <span className="truncate">{facility.location}</span>
              </div>
            </div>

            {/* Visual Bar Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-kerala-green-800" />
                  <span>{t("consultations")}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {facility.visitCount}{" "}
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({facility.screeningCount} {t("screenings").toLowerCase()})
                  </span>
                </span>
              </div>

              {/* Proportional Bar */}
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-kerala-green-800 via-kerala-green-700 to-kerala-blue-800 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(percentage, 8)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
