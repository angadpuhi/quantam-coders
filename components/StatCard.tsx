import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  colorClass?: string;
  trend?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass = "bg-emerald-500 text-white",
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
              <span>{description}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
