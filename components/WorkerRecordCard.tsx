import React from "react";
import { User, Phone, MapPin, Building, FileText, Activity, Stethoscope, Pill } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface WorkerWithDetails {
  id: string;
  name: string;
  dob?: Date | string | null;
  gender: string;
  phone?: string | null;
  homeState: string;
  currentAddress?: string | null;
  portableHealthId: string;
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
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-colors">
      <div className="p-5">
        {/* Header with Portable Health ID and Name */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{worker.name}</h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-mono font-semibold px-2.5 py-0.5 rounded border border-emerald-200">
                {worker.portableHealthId}
              </span>
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
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs text-slate-600 max-w-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
          <div className="mb-3 p-3 rounded-lg bg-teal-50/60 border border-teal-100 text-xs">
            <div className="font-semibold text-teal-900 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-700" />
              Health Screenings:
            </div>
            <div className="space-y-1">
              {worker.screenings.map((sc) => (
                <div key={sc.id} className="flex justify-between items-center text-teal-800">
                  <span>{sc.type}</span>
                  <span className="font-semibold bg-teal-100/80 px-2 py-0.5 rounded text-[11px]">
                    {sc.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              {worker.visits?.length || 0} Visits
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              {worker.screenings?.length || 0} Screenings
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Pill className="w-3.5 h-3.5 text-blue-600" />
              {worker.treatments?.length || 0} Treatments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
