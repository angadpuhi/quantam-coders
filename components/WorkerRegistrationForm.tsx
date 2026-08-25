"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UserPlus,
  CreditCard,
  User,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building,
  ArrowRight,
  LogIn,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const TOP_MIGRANT_STATES = [
  "West Bengal",
  "Assam",
  "Bihar",
  "Odisha",
  "Uttar Pradesh",
  "Jharkhand",
  "Tamil Nadu",
];

export function WorkerRegistrationForm({ onWorkerCreated }: { onWorkerCreated?: (worker: any) => void }) {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [homeState, setHomeState] = useState("West Bengal");
  const [currentAddress, setCurrentAddress] = useState("");
  const [customHealthId, setCustomHealthId] = useState("");
  const [autoGenerateId, setAutoGenerateId] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdWorker, setCreatedWorker] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        gender,
        homeState: homeState.trim(),
        phone: phone.trim() || null,
        currentAddress: currentAddress.trim() || null,
        dob: dob ? dob : null,
      };

      if (!autoGenerateId && customHealthId.trim()) {
        payload.portableHealthId = customHealthId.trim().toUpperCase();
      }

      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          throw new Error("Facility Staff login is required to register new workers. Please sign in.");
        }
        throw new Error(data.error || "Failed to register worker.");
      }

      setCreatedWorker(data.data);
      if (onWorkerCreated) onWorkerCreated(data.data);

      // Reset form fields
      setName("");
      setDob("");
      setPhone("");
      setCurrentAddress("");
      setCustomHealthId("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (createdWorker?.portableHealthId) {
      navigator.clipboard.writeText(createdWorker.portableHealthId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white/95 border border-kerala-coir-200/90 rounded-houseboat shadow-sm p-6 sm:p-8 backdrop-blur-xs relative overflow-hidden">
      {/* Decorative Warm Accent Bar reminiscent of houseboat teak wood */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-kerala-green-800 via-kerala-blue-800 to-kerala-gold-600" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-kerala-coir-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-kerala-green-50 text-kerala-green-800 border border-kerala-green-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Register Migrant Guest Worker
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Enroll a new worker to generate a permanent Portable Health ID (*Athidhi Swasthya Card*)
          </p>
        </div>

        {!session && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Staff login required to save</span>
            <Link
              href="/login"
              className="font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 ml-1"
            >
              Sign In <LogIn className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Success Notification & Portable Health Card */}
      {createdWorker && (
        <div className="mb-8 p-5 bg-gradient-to-br from-kerala-green-900 via-kerala-green-800 to-kerala-blue-900 text-white rounded-2xl shadow-md border border-kerala-gold-400/40 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-kerala-gold-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-kerala-gold-300">
                  Worker Enrolled Successfully
                </span>
              </div>
              <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                Kerala Portable Health Record
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xl font-bold tracking-tight text-white">{createdWorker.name}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 mt-1">
                  <span>{createdWorker.gender}</span>
                  <span>•</span>
                  <span>Origin: {createdWorker.homeState}</span>
                  {createdWorker.phone && (
                    <>
                      <span>•</span>
                      <span>Phone: {createdWorker.phone}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-black/30 border border-kerala-gold-400/50 rounded-xl p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-kerala-gold-300">Portable Health ID</p>
                  <p className="font-mono text-lg font-extrabold text-white tracking-wider">
                    {createdWorker.portableHealthId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs"
                  title="Copy Health ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {createdWorker.currentAddress && (
              <p className="text-xs text-emerald-200 mt-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-kerala-gold-400 shrink-0" />
                <span>Local Address: {createdWorker.currentAddress}</span>
              </p>
            )}

            {/* Direct Link to Profile */}
            <div className="mt-4 pt-3 border-t border-white/15 flex justify-end">
              <Link
                href={`/workers/${encodeURIComponent(createdWorker.portableHealthId)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-kerala-gold-500 hover:bg-kerala-gold-400 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-xs transition"
              >
                <span>Open Full Profile & Log Clinical Visits</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Registration Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Subhash Chandra Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Contact / Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Home State */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Home State of Origin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. West Bengal, Assam, Bihar"
              value={homeState}
              onChange={(e) => setHomeState(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
            />
            {/* Quick State Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-500">Quick select:</span>
              {TOP_MIGRANT_STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setHomeState(st)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    homeState === st
                      ? "bg-kerala-green-800 text-white border-kerala-green-800"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-kerala-green-50 hover:text-kerala-green-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Address in Kerala */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Current Worksite / Residential Address in Kerala
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              placeholder="e.g. Shed No. 12, Plywood Industrial Cluster, Rayonpuram, Perumbavoor, Ernakulam"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-kerala-coir-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Portable Health ID Configuration */}
        <div className="p-4 bg-kerala-coir-50/80 border border-kerala-coir-200 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-kerala-gold-700" />
                <span className="text-xs font-bold text-slate-900">Portable Health ID Assignment</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Automatically generate a standard Kerala Health ID (`KL-MH-XXXXXX`) or specify an existing health card.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerateId}
                onChange={(e) => setAutoGenerateId(e.target.checked)}
                className="w-4 h-4 text-kerala-green-700 rounded border-slate-300 focus:ring-kerala-green-700"
              />
              <span>Auto-generate Health ID</span>
            </label>
          </div>

          {!autoGenerateId && (
            <div className="mt-3 pt-3 border-t border-kerala-coir-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom / Pre-issued Portable Health ID
              </label>
              <input
                type="text"
                placeholder="e.g. KL-MH-998822"
                value={customHealthId}
                onChange={(e) => setCustomHealthId(e.target.value)}
                className="w-full max-w-sm px-3 py-2 text-sm bg-white border border-kerala-coir-300 rounded-lg font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-kerala-green-700"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-kerala-green-800 via-kerala-green-700 to-kerala-blue-800 hover:from-kerala-green-900 hover:to-kerala-blue-900 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
          >
            {loading ? (
              <span>Registering Worker...</span>
            ) : (
              <>
                <span>Complete Registration & Issue Health Card</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
