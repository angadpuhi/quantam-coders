"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldCheck, Activity } from "lucide-react";

export type RiskLevel = "GREEN" | "YELLOW" | "RED" | string;

interface RiskStatusBadgeProps {
  status?: RiskLevel | null;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskStatusBadge({
  status = "GREEN",
  variant = "light",
  size = "md",
  className = "",
}: RiskStatusBadgeProps) {
  const normalizedStatus = (status || "GREEN").toUpperCase();

  const isGreen = normalizedStatus === "GREEN" || normalizedStatus === "STABLE";
  const isYellow = normalizedStatus === "YELLOW" || normalizedStatus === "MONITORING";
  const isRed = normalizedStatus === "RED" || normalizedStatus === "URGENT";

  // Size styles
  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px] gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
    lg: "px-4 py-2.5 text-sm gap-2.5 font-extrabold",
  }[size];

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  }[size];

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  if (isRed) {
    return (
      <div
        className={`inline-flex items-center rounded-xl font-bold uppercase tracking-wider transition-all shadow-sm ${
          variant === "dark"
            ? "bg-red-950/95 border-2 border-red-500 text-red-200 ring-2 ring-red-500/30"
            : "bg-red-50 border-2 border-red-500 text-red-900 ring-2 ring-red-200"
        } ${sizeClasses} ${className}`}
      >
        <span className="relative flex shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80`} />
          <span className={`relative inline-flex rounded-full ${dotSizes} bg-red-600`} />
        </span>
        <AlertOctagon className={`${iconSizes} text-red-500 shrink-0`} />
        <span className="truncate">Red • Urgent (Clinical Attention)</span>
      </div>
    );
  }

  if (isYellow) {
    return (
      <div
        className={`inline-flex items-center rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs ${
          variant === "dark"
            ? "bg-amber-950/90 border-2 border-amber-400 text-amber-200 ring-2 ring-amber-400/20"
            : "bg-amber-50 border-2 border-amber-400 text-amber-950 ring-2 ring-amber-200/60"
        } ${sizeClasses} ${className}`}
      >
        <span className="relative flex shrink-0">
          <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75`} />
          <span className={`relative inline-flex rounded-full ${dotSizes} bg-amber-500`} />
        </span>
        <AlertTriangle className={`${iconSizes} text-amber-500 shrink-0`} />
        <span className="truncate">Yellow • Needs Monitoring</span>
      </div>
    );
  }

  // Default: GREEN (Stable)
  return (
    <div
      className={`inline-flex items-center rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs ${
        variant === "dark"
          ? "bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/20"
          : "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200/60"
      } ${sizeClasses} ${className}`}
    >
      <span className="relative flex shrink-0">
        <span className={`animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60`} />
        <span className={`relative inline-flex rounded-full ${dotSizes} bg-emerald-500`} />
      </span>
      <ShieldCheck className={`${iconSizes} text-emerald-600 shrink-0`} />
      <span className="truncate">Green • Stable (Fit for Work)</span>
    </div>
  );
}
