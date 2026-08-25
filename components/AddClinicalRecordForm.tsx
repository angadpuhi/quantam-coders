"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Stethoscope,
  Activity,
  Pill,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  PlusCircle,
  LogIn,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface AddClinicalRecordFormProps {
  workerId: string;
  portableHealthId: string;
  workerName: string;
  onRecordAdded?: () => void;
  onClose?: () => void;
}

const COMMON_SCREENING_TYPES = [
  "Tuberculosis Screening (Mantoux & Sputum)",
  "Malaria Rapid Diagnostic Test (RDT)",
  "Blood Pressure & Hypertension Check",
  "Occupational Spirometry (Lung Function)",
  "Random Blood Sugar (Diabetes Screening)",
  "Hepatitis B Surface Antigen (HBsAg)",
  "Dermatological / Occupational Skin Check",
];

const COMMON_SCREENING_RESULTS = [
  "Normal / Within Limits",
  "Negative",
  "Positive",
  "Elevated / Stage 1",
  "Elevated / Stage 2",
  "Borderline / Requires Follow-up",
  "Under Review",
];

export function AddClinicalRecordForm({
  workerId,
  portableHealthId,
  workerName,
  onRecordAdded,
  onClose,
}: AddClinicalRecordFormProps) {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"visit" | "screening" | "treatment">("visit");
  const [facilities, setFacilities] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);

  // Common Form States
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);

  // Visit States
  const [visitNotes, setVisitNotes] = useState("");

  // Screening States
  const [screeningType, setScreeningType] = useState(COMMON_SCREENING_TYPES[0]);
  const [customScreeningType, setCustomScreeningType] = useState("");
  const [screeningResult, setScreeningResult] = useState(COMMON_SCREENING_RESULTS[0]);
  const [customScreeningResult, setCustomScreeningResult] = useState("");

  // Treatment States
  const [treatmentDescription, setTreatmentDescription] = useState("");
  const [medication, setMedication] = useState("");

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await fetch("/api/facilities");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setFacilities(json.data);
          // Set default facility (prefer user's facility if logged in, else first)
          if (session?.user?.facilityId) {
            setSelectedFacilityId(session.user.facilityId);
          } else {
            setSelectedFacilityId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load facilities:", err);
      } finally {
        setLoadingFacilities(false);
      }
    }
    loadFacilities();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      let endpoint = "";
      let payload: Record<string, any> = {};

      if (activeTab === "visit") {
        endpoint = "/api/visits";
        payload = {
          workerId,
          portableHealthId,
          facilityId: selectedFacilityId,
          date: recordDate,
          notes: visitNotes.trim() || "Routine medical consultation.",
        };
      } else if (activeTab === "screening") {
        endpoint = "/api/screenings";
        const finalType = screeningType === "Custom" ? customScreeningType.trim() : screeningType;
        const finalResult = screeningResult === "Custom" ? customScreeningResult.trim() : screeningResult;

        if (!finalType || !finalResult) {
          throw new Error("Please specify both the screening test type and result.");
        }

        payload = {
          workerId,
          portableHealthId,
          facilityId: selectedFacilityId,
          type: finalType,
          result: finalResult,
          date: recordDate,
        };
      } else if (activeTab === "treatment") {
        endpoint = "/api/treatments";
        if (!treatmentDescription.trim()) {
          throw new Error("Please provide a diagnosis or treatment description.");
        }

        payload = {
          workerId,
          portableHealthId,
          description: treatmentDescription.trim(),
          medication: medication.trim() || null,
          date: recordDate,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 401) {
          throw new Error("Staff authentication required. Please sign in to record medical data.");
        }
        throw new Error(json.error || "Failed to record clinical entry.");
      }

      setSuccessMessage(
        activeTab === "visit"
          ? "Clinical visit recorded successfully!"
          : activeTab === "screening"
          ? "Diagnostic screening test logged successfully!"
          : "Treatment & medication plan added successfully!"
      );

      // Reset tab specific inputs
      setVisitNotes("");
      setTreatmentDescription("");
      setMedication("");

      if (onRecordAdded) {
        onRecordAdded();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-kerala-coir-200 rounded-houseboat shadow-md p-6 sm:p-8 relative overflow-hidden">
      {/* Top Houseboat Wood Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-kerala-coir-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-kerala-gold-700 bg-kerala-gold-50 px-2.5 py-0.5 rounded-full border border-kerala-gold-200">
              Clinical Entry Form
            </span>
            <span className="font-mono text-xs font-semibold text-kerala-green-900 bg-kerala-green-50 px-2 py-0.5 rounded border border-kerala-green-200">
              {portableHealthId}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Add Medical Record for <span className="text-kerala-green-900">{workerName}</span>
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title="Close Form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Auth Status Notification */}
      {!session && (
        <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Staff login required to save clinical updates.</span>
          </div>
          <Link
            href="/login"
            className="font-semibold text-kerala-green-900 hover:underline flex items-center gap-1 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Record Type Tabs - Styled with Kerala Coastal Palette */}
      <div className="flex space-x-2 my-5 p-1 bg-kerala-coir-50 rounded-2xl border border-kerala-coir-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab("visit");
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "visit"
              ? "bg-kerala-green-800 text-white shadow-xs"
              : "text-slate-700 hover:text-kerala-green-900 hover:bg-white/60"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Clinical Visit</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("screening");
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "screening"
              ? "bg-kerala-blue-800 text-white shadow-xs"
              : "text-slate-700 hover:text-kerala-blue-900 hover:bg-white/60"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Health Screening</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("treatment");
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "treatment"
              ? "bg-kerala-gold-700 text-white shadow-xs"
              : "text-slate-700 hover:text-kerala-gold-900 hover:bg-white/60"
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Treatment Plan</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 p-3.5 bg-kerala-green-50 border border-kerala-green-200 rounded-xl text-xs text-kerala-green-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-kerala-green-700 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Facility & Date Fields (Required for Visit and Screening) */}
        {activeTab !== "treatment" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Healthcare Facility / Medical Camp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  disabled={loadingFacilities || facilities.length === 0}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700"
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Date of Consultation / Screening <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Clinical Visit Fields */}
        {activeTab === "visit" && (
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Clinical Assessment & Doctor's Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Worker presented with mild respiratory symptoms following night shift at plywood mill. Normal chest auscultation, BP 120/80. Prescribed antihistamine and advised N95 respirator mask."
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              className="w-full p-3 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700"
            />
          </div>
        )}

        {/* Tab 2: Health Screening Fields */}
        {activeTab === "screening" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Screening / Diagnostic Test Type <span className="text-red-500">*</span>
              </label>
              <select
                value={screeningType}
                onChange={(e) => setScreeningType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-blue-700"
              >
                {COMMON_SCREENING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="Custom">Other Diagnostic Test (Enter Below)</option>
              </select>

              {screeningType === "Custom" && (
                <input
                  type="text"
                  placeholder="Specify custom test name..."
                  value={customScreeningType}
                  onChange={(e) => setCustomScreeningType(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-sm bg-white border border-kerala-coir-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-kerala-blue-700"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Test Result / Findings <span className="text-red-500">*</span>
              </label>
              <select
                value={screeningResult}
                onChange={(e) => setScreeningResult(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-blue-700"
              >
                {COMMON_SCREENING_RESULTS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Custom">Other Result Value</option>
              </select>

              {screeningResult === "Custom" && (
                <input
                  type="text"
                  placeholder="e.g. 110 mg/dL, Reactive, Clear"
                  value={customScreeningResult}
                  onChange={(e) => setCustomScreeningResult(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-sm bg-white border border-kerala-coir-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-kerala-blue-700"
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Treatment Plan Fields */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Treatment Description / Diagnosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Heat exhaustion thermal recovery protocol & electrolyte replenishment"
                value={treatmentDescription}
                onChange={(e) => setTreatmentDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-gold-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Prescribed Medication & Dosage
              </label>
              <input
                type="text"
                placeholder="e.g. ORS sachets x 3 days, Paracetamol 500mg SOS, Multivitamin tab 1 OD"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-gold-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Date Prescribed <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-gold-700"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-kerala-coir-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm text-white shadow-xs transition flex items-center gap-2 ${
              activeTab === "visit"
                ? "bg-kerala-green-800 hover:bg-kerala-green-900"
                : activeTab === "screening"
                ? "bg-kerala-blue-800 hover:bg-kerala-blue-900"
                : "bg-kerala-gold-700 hover:bg-kerala-gold-800"
            }`}
          >
            {submitting ? (
              <span>Saving Entry...</span>
            ) : (
              <>
                <span>
                  {activeTab === "visit"
                    ? "Log Clinical Visit"
                    : activeTab === "screening"
                    ? "Log Screening Record"
                    : "Add Treatment Plan"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
