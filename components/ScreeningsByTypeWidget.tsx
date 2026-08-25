"use client";

import React from "react";
import { Activity, ShieldAlert, CheckCircle2, HeartPulse, Stethoscope } from "lucide-react";

interface ScreeningStat {
  type: string;
  count: number;
  percentage: number;
}

export function ScreeningsByTypeWidget({
  screenings,
  monthName,
}: {
  screenings: ScreeningStat[];
  monthName: string;
}) {
  if (!screenings || screenings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl">
        <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="text-xs">No screening logs recorded this month.</p>
      </div>
    );
  }

  // Get color gradient for each screening category
  const getBarColor = (index: number) => {
    const colors = [
      "from-kerala-blue-800 to-kerala-blue-600",
      "from-kerala-green-800 to-kerala-green-600",
      "from-kerala-gold-700 to-kerala-gold-500",
      "from-teal-800 to-teal-600",
      "from-emerald-800 to-emerald-600",
      "from-amber-800 to-amber-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      {screenings.map((item, index) => (
        <div
          key={item.type}
          className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-2 hover:border-kerala-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-kerala-blue-800 shrink-0" />
              <span className="font-bold text-slate-900 leading-tight">{item.type}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 font-mono">
              <span className="font-extrabold text-sm text-slate-900">{item.count}</span>
              <span className="text-[11px] font-semibold text-kerala-blue-900 bg-kerala-blue-100 px-2 py-0.5 rounded-full">
                {item.percentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getBarColor(index)} rounded-full transition-all duration-700`}
              style={{ width: `${Math.max(item.percentage, 10)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
