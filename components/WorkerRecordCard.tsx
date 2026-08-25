import React from "react";
import { User, Phone, MapPin, Building, FileText, Syringe, HeartPulse, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface WorkerWithDetails {
  id: string;
  healthId: string;
  awaazId?: string | null;
  fullName: string;
  gender: string;
  bloodGroup?: string | null;
  phone?: string | null;
  stateOfOrigin: string;
  nativeLanguage: string;
  keralaDistrict: string;
  currentEmployer?: string | null;
  occupation?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  allergies?: string | null;
  chronicConditions?: string | null;
  healthRecords?: Array<{
    id: string;
    facilityName: string;
    doctorName: string;
    visitDate: Date | string;
    visitType: string;
    diagnosis: string;
  }>;
  vaccinations?: Array<{
    id: string;
    vaccineName: string;
    doseNumber: number;
    administeredDate: Date | string;
  }>;
}

export function WorkerRecordCard({ worker }: { worker: WorkerWithDetails }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-colors">
      <div className="p-5">
        {/* Header with Health ID and Name */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{worker.fullName}</h3>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-mono font-medium px-2 py-0.5 rounded border border-emerald-200">
                {worker.healthId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>{worker.gender}</span>
              <span>•</span>
              <span>Blood Group: <strong className="text-slate-700">{worker.bloodGroup || "Unknown"}</strong></span>
              {worker.awaazId && (
                <>
                  <span>•</span>
                  <span>Awaaz ID: <span className="font-mono text-slate-700">{worker.awaazId}</span></span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{worker.keralaDistrict}, Kerala</span>
          </div>
        </div>

        {/* Demographics & Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-slate-400">Origin:</span>
            <span className="font-medium text-slate-800">{worker.stateOfOrigin} ({worker.nativeLanguage})</span>
          </div>
          {worker.phone && (
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">{worker.phone}</span>
            </div>
          )}
          {worker.occupation && (
            <div className="flex items-center gap-2 text-slate-600">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">{worker.occupation} {worker.currentEmployer ? `(${worker.currentEmployer})` : ""}</span>
            </div>
          )}
        </div>

        {/* Medical Flags */}
        {(worker.allergies || worker.chronicConditions) && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              {worker.allergies && <div><strong>Allergies:</strong> {worker.allergies}</div>}
              {worker.chronicConditions && <div><strong>Chronic Conditions:</strong> {worker.chronicConditions}</div>}
            </div>
          </div>
        )}

        {/* Health Records & Vaccinations count */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              {worker.healthRecords?.length || 0} Clinical Visits
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Syringe className="w-3.5 h-3.5 text-teal-600" />
              {worker.vaccinations?.length || 0} Vaccinations
            </span>
          </div>

          {worker.emergencyContactPhone && (
            <span className="text-slate-500">
              Emergency: <strong className="text-slate-700">{worker.emergencyContactName || "Contact"}</strong> ({worker.emergencyContactPhone})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
