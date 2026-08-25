"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { User, Phone, MapPin, Building, FileText, Activity, Stethoscope, Pill, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";

export interface WorkerWithDetails {
  id: string;
  name: string;
  dob?: Date | string | null;
  gender: string;
  phone?: string | null;
  homeState: string;
  currentAddress?: string | null;
  portableHealthId: string;
  riskStatus?: string | null;
  visits?: Array<{
    id: string;
    date: Date | string;
    notes?: string | null;
    facility?: {
      name: string;
      location: string;
      type: string;
    } | null;
    treatments?: Array<{
      id: string;
      description: string;
      medication?: string | null;
    }>;
  }>;
  screenings?: Array<{
    id: string;
    type: string;
    result: string;
    date: Date | string;
    facility?: {
      name: string;
      location: string;
    } | null;
  }>;
  treatments?: Array<{
    id: string;
    description: string;
    medication?: string | null;
    date: Date | string;
  }>;
}

export function WorkerRecordCard({ worker }: { worker: WorkerWithDetails }) {
  const t = useTranslations("common");

  return (
    <div className="bg-white rounded-houseboat border border-kerala-coir-200 overflow-hidden shadow-xs hover:border-kerala-green-400 transition-all">
      <div className="p-5 sm:p-6">
        {/* Header with Name, Health ID, and Triage Risk Badge */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-kerala-coir-100 pb-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{worker.name}</h3>
              <span className="text-xs bg-kerala-green-50 text-kerala-green-900 font-mono font-bold px-2.5 py-0.5 rounded-full border border-kerala-green-200">
                {worker.portableHealthId}
              </span>
              {/* Color-Coded Triage Risk Badge */}
              <RiskStatusBadge status={worker.riskStatus || "GREEN"} size="sm" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>{worker.gender}</span>
              {worker.dob && (
                <>
                  <span>•</span>
                  <span>DOB: {formatDate(worker.dob)}</span>
                </>
              )}
              <span>•</span>
              <span>Origin: <strong className="text-slate-700">{worker.homeState}</strong></span>
            </div>
          </div>

          {worker.currentAddress && (
            <div className="flex items-center gap-1.5 bg-kerala-coir-50 px-2.5 py-1 rounded-xl border border-kerala-coir-200 text-xs text-slate-600 max-w-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-kerala-green-800 shrink-0" />
              <span className="truncate">{worker.currentAddress}</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 text-xs">
          {worker.phone && (
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">{worker.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-slate-400">Home State:</span>
            <span className="font-medium text-slate-800">{worker.homeState}</span>
          </div>
        </div>

        {/* Recent Screenings */}
        {worker.screenings && worker.screenings.length > 0 && (
          <div className="mb-3 p-3 rounded-2xl bg-kerala-blue-50/50 border border-kerala-blue-200/60 text-xs">
            <div className="font-semibold text-kerala-blue-950 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-kerala-blue-800" />
              {t("healthScreenings")}
            </div>
            <div className="space-y-1">
              {worker.screenings.map((sc) => (
                <div key={sc.id} className="flex justify-between items-center text-kerala-blue-900">
                  <span>{sc.type}</span>
                  <span className="font-semibold bg-kerala-blue-100 px-2 py-0.5 rounded text-[11px]">
                    {sc.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Footer & Link to Worker Detail Page */}
        <div className="pt-3 border-t border-kerala-coir-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Stethoscope className="w-3.5 h-3.5 text-kerala-green-800" />
              {worker.visits?.length || 0} {t("visits")}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Activity className="w-3.5 h-3.5 text-kerala-blue-800" />
              {worker.screenings?.length || 0} {t("screenings")}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Pill className="w-3.5 h-3.5 text-kerala-gold-700" />
              {worker.treatments?.length || 0} {t("treatments")}
            </span>
          </div>

          <Link
            href={`/workers/${encodeURIComponent(worker.portableHealthId || worker.id)}`}
            className="font-bold text-kerala-green-900 hover:text-kerala-green-700 flex items-center gap-1 hover:underline"
          >
            <span>{t("viewProfileAndAdd")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
