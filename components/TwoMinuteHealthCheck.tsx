"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Stethoscope,
  Sparkles,
  ArrowRight,
  RefreshCw,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Zap,
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Flame,
  Thermometer,
  Wind,
  Droplets,
  Pill,
} from "lucide-react";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";

interface WorkerOption {
  id: string;
  name: string;
  portableHealthId: string;
  riskStatus?: string;
  homeState: string;
}

interface Question {
  id: string;
  title: string;
  category: string;
  icon: any;
  options: {
    label: string;
    description: string;
    points: number;
    severity: "GREEN" | "YELLOW" | "RED";
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "q1_respiratory",
    category: "Respiratory & Airway",
    title: "1. Cough, Breathlessness & Respiratory Symptoms",
    icon: Wind,
    options: [
      {
        label: "No cough or shortness of breath",
        description: "Breathing normally, lungs feel clear and comfortable.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Mild dry throat tickle (< 1 week)",
        description: "Occasional dry cough, no chest tightness or phlegm.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Persistent cough with phlegm (> 2 weeks)",
        description: "Continuous cough from dust or mill work. Screening advised.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Coughing up blood (Hemoptysis) or severe gasping",
        description: "Immediate emergency attention required. Acute respiratory distress.",
        points: 5,
        severity: "RED",
      },
    ],
  },
  {
    id: "q2_fever",
    category: "Fever & Infection",
    title: "2. Body Temperature & Fever History",
    icon: Thermometer,
    options: [
      {
        label: "Normal body temperature (No fever)",
        description: "No chills or abnormal sweating in the past 14 days.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Mild low-grade fever past 1-2 days",
        description: "Mild body ache, resolving with rest.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "High fever (>101°F) with shivering & joint pains",
        description: "Acute febrile illness (possible Malaria, Dengue, or Viral).",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Prolonged recurring fever with evening night sweats",
        description: "Chronic evening fever spikes for over 2 weeks. Urgent evaluation.",
        points: 4,
        severity: "RED",
      },
    ],
  },
  {
    id: "q3_chest",
    category: "Cardiovascular & Chest",
    title: "3. Chest Tightness, Pain or Palpitations",
    icon: HeartPulse,
    options: [
      {
        label: "No chest discomfort",
        description: "Heart rate normal, comfortable breathing throughout shifts.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Slight breathlessness on heavy physical lifting",
        description: "Recovers quickly after brief pause.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Frequent chest tightness or rapid racing pulse",
        description: "Occurs during regular shifts at worksite.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Acute squeezing chest pain radiating to arm / jaw",
        description: "Emergency cardiac red flag. Immediate medical evaluation.",
        points: 5,
        severity: "RED",
      },
    ],
  },
  {
    id: "q4_heat",
    category: "Heat & Hydration",
    title: "4. Heat Strain, Dehydration & Muscle Exhaustion",
    icon: Flame,
    options: [
      {
        label: "Adequate hydration & energetic",
        description: "Drinks sufficient water, urine is pale/normal.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Mild thirst and normal workday fatigue",
        description: "Standard tiredness after long shifts.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Severe dizziness, dark urine & painful muscle cramps",
        description: "Moderate heat exhaustion. Electrolyte recovery needed.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Fainting (Syncope), disorientation or nausea from heat",
        description: "Severe heat stroke risk. Immediate cooling protocol.",
        points: 4,
        severity: "RED",
      },
    ],
  },
  {
    id: "q5_chronic",
    category: "Chronic Conditions",
    title: "5. Chronic Medical History (BP, Diabetes, Asthma)",
    icon: Pill,
    options: [
      {
        label: "No diagnosed chronic medical conditions",
        description: "No history of hypertension, diabetes, or asthma.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Known BP / Diabetes on regular daily medication",
        description: "Prescription medications taken regularly as directed.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Known BP / Diabetes with missed doses (> 1 week)",
        description: "Ran out of medicines; requires prescription refill.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Severe chronic complications (swollen legs, vision blur)",
        description: "Uncontrolled chronic disease requiring doctor review.",
        points: 4,
        severity: "RED",
      },
    ],
  },
  {
    id: "q6_injury",
    category: "Workplace Trauma & Skin",
    title: "6. Worksite Injury, Chemical Contact or Wounds",
    icon: ShieldCheck,
    options: [
      {
        label: "No injuries, rashes or open wounds",
        description: "Skin is intact, no recent occupational trauma.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Minor superficial scratch or dust irritation",
        description: "Healing well, no signs of pus or redness.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Persistent chemical dermatitis rash or swollen joint",
        description: "Inflamed area from glue, cement or timber solvents.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Deep cut / laceration or infected draining wound",
        description: "Requires surgical dressing, tetanus booster, and antibiotics.",
        points: 4,
        severity: "RED",
      },
    ],
  },
  {
    id: "q7_gi",
    category: "Gastrointestinal & Water",
    title: "7. Digestion, Stomach Distress & Water-borne Symptoms",
    icon: Droplets,
    options: [
      {
        label: "Normal digestion & healthy appetite",
        description: "No diarrhea, stomach pain, or nausea.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Mild indigestion or slight stomach upset",
        description: "Tolerating food and fluids well.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Watery loose stools or vomiting (>= 3 times/day)",
        description: "Acute gastroenteritis. Oral rehydration required.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Severe bloody diarrhea with high fever & severe dehydration",
        description: "Acute dysentery or infectious colitis. Urgent doctor care.",
        points: 4,
        severity: "RED",
      },
    ],
  },
  {
    id: "q8_weight",
    category: "General Health & Fatigue",
    title: "8. Unexplained Weight Loss & Chronic Lethargy",
    icon: Activity,
    options: [
      {
        label: "Stable weight & healthy appetite",
        description: "No significant changes in body weight or stamina.",
        points: 0,
        severity: "GREEN",
      },
      {
        label: "Mild tiredness after shift overtime",
        description: "Recovers with good sleep.",
        points: 1,
        severity: "GREEN",
      },
      {
        label: "Noticeable unintentional weight loss over past month",
        description: "Weakness during regular work shifts.",
        points: 3,
        severity: "YELLOW",
      },
      {
        label: "Severe weight loss (>5 kg) and extreme exhaustion",
        description: "High suspicion for chronic infection or wasting illness.",
        points: 4,
        severity: "RED",
      },
    ],
  },
];

export function TwoMinuteHealthCheck({ workers }: { workers: WorkerOption[] }) {
  const t = useTranslations("sections");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.id || ""
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [customNotes, setCustomNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedWorker =
    workers.find(
      (w) => w.id === selectedWorkerId || w.portableHealthId === selectedWorkerId
    ) || workers[0];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleQuickFillNormal = () => {
    const normalState: Record<string, number> = {};
    for (const q of QUESTIONS) {
      normalState[q.id] = 0; // First option is always 0 points (normal/green)
    }
    setSelectedAnswers(normalState);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) {
      setError("Please select a worker for this health check.");
      return;
    }

    if (answeredCount < QUESTIONS.length) {
      setError(`Please answer all ${QUESTIONS.length} screening questions before submitting.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Build answers payload with scores and metadata
      const formattedAnswers: Record<string, any> = {};
      for (const q of QUESTIONS) {
        const selectedIdx = selectedAnswers[q.id] || 0;
        const opt = q.options[selectedIdx];
        formattedAnswers[q.id] = {
          title: q.title,
          category: q.category,
          selected: opt.label,
          score: opt.points,
          severity: opt.severity,
        };
      }

      const res = await fetch("/api/health-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: selectedWorker.id,
          answers: formattedAnswers,
          notes: customNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit health check.");
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedAnswers({});
    setCustomNotes("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Result Card Modal / View */}
      {result ? (
        <div className="bg-white border-2 border-kerala-green-600 rounded-houseboat p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-800">
                <CheckCircle2 className="w-6 h-6 text-kerala-green-700" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Health Check & Triage Evaluation Completed
                </h3>
                <p className="text-xs text-slate-500">
                  Worker: <strong>{result.worker?.name || selectedWorker?.name}</strong> •{" "}
                  <span className="font-mono text-kerala-green-900 font-bold">
                    {result.worker?.portableHealthId || selectedWorker?.portableHealthId}
                  </span>
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Severity Score: {result.totalScore} pts
            </span>
          </div>

          {/* Color-Coded Triage Output Banner */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Assigned Occupational Health Status
              </span>
              <div>
                <RiskStatusBadge
                  status={result.riskStatus}
                  variant="light"
                  size="lg"
                  className="shadow-sm"
                />
              </div>
              <p className="text-xs text-slate-600 max-w-md pt-1 leading-relaxed">
                {result.riskStatus === "RED" &&
                  "High severity score or critical symptom reported. Immediate clinical evaluation and doctor consult requested."}
                {result.riskStatus === "YELLOW" &&
                  "Moderate risk symptoms identified. Patient flagged for non-emergency follow-up and monitoring at clinic."}
                {result.riskStatus === "GREEN" &&
                  "Worker vitals and symptom screening are within safe parameters. Cleared for regular duties."}
              </p>
            </div>

            {/* Doctor Consultation Flag Notification */}
            {result.flaggedForDoctor ? (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-3 max-w-sm shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-amber-900">
                    Flagged for Doctor Consultation
                  </p>
                  <p className="text-amber-800 leading-snug">
                    This checkup has been recorded in the worker&apos;s digital passport and flagged for medical officer review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-start gap-3 max-w-sm shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-emerald-900">
                    Fit for Regular Occupational Duty
                  </p>
                  <p className="text-emerald-800 leading-snug">
                    No critical respiratory or systemic red flags reported. Standard workplace precautions advised.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Screen Another Worker</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/workers/${encodeURIComponent(
                  result.worker?.portableHealthId || selectedWorker?.portableHealthId
                )}`}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                <span>View Full Worker Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition"
              >
                <span>Open Health Passport</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* MCQ Form Container */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Worker Selector Header Card */}
          <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
                  1. Select Enrolled Worker to Screen
                </label>
                <p className="text-xs text-slate-500">
                  Choose an existing guest worker or select from the active register.
                </p>
              </div>

              {/* Quick Fill Button */}
              <button
                type="button"
                onClick={handleQuickFillNormal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick-Fill All &ldquo;Normal / Negative&rdquo;</span>
              </button>
            </div>

            {/* Worker Selection Dropdown / Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              {workers.map((w) => {
                const isSelected = w.id === selectedWorker?.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWorkerId(w.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? "bg-kerala-green-900 text-white border-kerala-green-900 ring-2 ring-kerala-gold-400"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold truncate">{w.name}</p>
                      <p
                        className={`font-mono text-[10px] ${
                          isSelected ? "text-kerala-gold-300" : "text-slate-500"
                        }`}
                      >
                        {w.portableHealthId}
                      </p>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        w.riskStatus === "RED"
                          ? "bg-red-500"
                          : w.riskStatus === "YELLOW"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white border border-kerala-coir-200 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-800">
                Screening Progress: {answeredCount} of {QUESTIONS.length} Questions Answered
              </span>
              <span className="text-kerala-green-800 font-extrabold font-mono">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kerala-green-700 to-kerala-gold-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4">
            {QUESTIONS.map((q, qIndex) => {
              const IconComp = q.icon;
              const selectedOptIdx = selectedAnswers[q.id];
              const isAnswered = selectedOptIdx !== undefined;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-houseboat border transition-all ${
                    isAnswered
                      ? "bg-white border-kerala-green-300/80 shadow-xs"
                      : "bg-white/95 border-kerala-coir-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-900 border border-kerala-green-200">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-kerala-green-800 tracking-wider">
                          {q.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {q.title}
                        </h4>
                      </div>
                    </div>

                    {isAnswered && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                        Answered
                      </span>
                    )}
                  </div>

                  {/* 4 Options per Question */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOptIdx === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                            isSelected
                              ? opt.severity === "RED"
                                ? "bg-red-50/90 border-red-500 ring-2 ring-red-300 text-red-950"
                                : opt.severity === "YELLOW"
                                ? "bg-amber-50/90 border-amber-500 ring-2 ring-amber-300 text-amber-950"
                                : "bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300 text-emerald-950"
                              : "bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100/80"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold leading-snug">
                                {opt.label}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 ${
                                  opt.severity === "RED"
                                    ? "bg-red-100 text-red-800"
                                    : opt.severity === "YELLOW"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {opt.points > 0 ? `+${opt.points} pts` : "0 pts"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {opt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Health Worker Notes */}
          <div className="bg-white border border-kerala-coir-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Optional Health Camp / Clinical Staff Notes:
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Worker screened at Perumbavoor Industrial Mobile Camp. Advised N95 respirator and scheduled for spirometry follow-up."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-kerala-green-700 focus:outline-hidden"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Submit Bar */}
          <div className="bg-kerala-green-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-kerala-gold-500/40">
            <div>
              <p className="text-xs font-bold text-kerala-gold-300 uppercase tracking-wider">
                Automated Triage & Risk Assignment
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Calculates severity score, assigns Green/Yellow/Red, and flags for medical follow-up.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-kerala-gold-500 to-kerala-gold-600 hover:from-kerala-gold-600 hover:to-kerala-gold-700 disabled:opacity-50 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Calculating Triage Score...</span>
              ) : (
                <>
                  <span>Complete Health Check & Update Risk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
