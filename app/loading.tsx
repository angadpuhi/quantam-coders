import React from "react";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="rounded-houseboat bg-gradient-to-br from-kerala-green-950/80 via-kerala-green-800/80 to-kerala-blue-900/80 p-8 sm:p-10 text-white relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20" />
          <div className="h-4 bg-white/20 rounded-full w-48" />
        </div>
        <div className="h-8 bg-white/20 rounded-xl w-3/4 max-w-lg mb-3" />
        <div className="h-4 bg-white/10 rounded-lg w-full max-w-xl mb-2" />
        <div className="h-4 bg-white/10 rounded-lg w-2/3 max-w-md" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-kerala-coir-200 rounded-2xl p-5 space-y-3">
            <div className="h-3 bg-slate-200 rounded-full w-24" />
            <div className="h-7 bg-slate-300 rounded-xl w-16" />
            <div className="h-2.5 bg-slate-100 rounded-full w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 space-y-4">
          <div className="h-5 bg-slate-200 rounded-lg w-40" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
        </div>
        <div className="bg-white border border-kerala-coir-200 rounded-houseboat p-6 space-y-4">
          <div className="h-5 bg-slate-200 rounded-lg w-40" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
