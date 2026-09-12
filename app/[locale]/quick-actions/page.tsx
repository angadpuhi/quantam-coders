import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KeralaMotif, KeralaPalmIcon } from "@/components/KeralaMotif";
import { TwoMinuteHealthCheck } from "@/components/TwoMinuteHealthCheck";
import { VoiceInputWidget } from "@/components/VoiceInputWidget";
import {
  Mic,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Activity,
  PhoneCall,
  Languages,
  Stethoscope,
  ShieldAlert,
  Clock,
} from "lucide-react";

export default async function QuickActionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sections" });
  const tVoice = await getTranslations({ locale, namespace: "voiceInput" });

  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/quick-actions`);
  }
  const role = session.user.role === "STAFF" ? "PROVIDER" : session.user.role;
  const isWorker = role === "WORKER";
  const workerId = (session.user as any).workerId as string | null;

  let workers: any[] = [];
  try {
    workers = await prisma.worker.findMany({
      where: isWorker ? { id: workerId ?? "__none__" } : undefined,
      select: {
        id: true,
        name: true,
        portableHealthId: true,
        riskStatus: true,
        homeState: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching workers for QuickActions:", err);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Kerala Backwater Coastal Hero Banner */}
      <div className="relative overflow-hidden rounded-houseboat bg-gradient-to-br from-kerala-green-950 via-kerala-green-800 to-kerala-blue-900 text-white p-6 sm:p-10 shadow-lg border border-kerala-gold-600/30">
        <div className="absolute inset-0 pointer-events-none text-emerald-300 opacity-20">
          <KeralaMotif className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-kerala-gold-400/40 text-xs font-semibold text-kerala-gold-200 mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-kerala-gold-400" />
            <span>AI Voice & Rapid Triage Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t("quickActionsTitle")}
          </h1>

          <p className="mt-3 text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {t("quickActionsSubtitle")}
          </p>
        </div>
      </div>

      {/* 1. "SPEAK YOUR HEALTH HISTORY" FULL VOICE INPUT SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {tVoice("title")}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Web Speech API
            </span>
          </div>
        </div>

        <VoiceInputWidget mode="full" workers={workers} />
      </section>

      {/* 2. 2-MINUTE HEALTH CHECK MCQ FORM SECTION */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              2-Minute Rapid Health & Triage Screening
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Auto-Risk Update
            </span>
          </div>
        </div>

        <TwoMinuteHealthCheck workers={workers} />
      </section>
    </div>
  );
}
