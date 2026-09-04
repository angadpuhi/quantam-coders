import React from "react";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { AppointmentsFollowUpViewer } from "@/components/AppointmentsFollowUpViewer";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 1. Session verification & role check
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/appointments`);
  }

  const role = (session.user as any).role;
  const sessionWorkerId = (session.user as any).workerId;

  let workers: any[] = [];
  let allVisits: any[] = [];

  try {
    if (role === "WORKER") {
      // Worker only loads their OWN profile and appointments
      workers = await prisma.worker.findMany({
        where: { id: sessionWorkerId },
        select: {
          id: true,
          name: true,
          portableHealthId: true,
          homeState: true,
          district: true,
          riskStatus: true,
        },
      });

      allVisits = await prisma.visit.findMany({
        where: { workerId: sessionWorkerId },
        include: {
          facility: true,
          treatments: true,
        },
        orderBy: { date: "desc" },
      });
    } else {
      // Healthcare Provider or Admin: Facility-wide appointments
      workers = await prisma.worker.findMany({
        select: {
          id: true,
          name: true,
          portableHealthId: true,
          homeState: true,
          district: true,
          riskStatus: true,
        },
        orderBy: { createdAt: "desc" },
      });

      allVisits = await prisma.visit.findMany({
        include: {
          facility: true,
          treatments: true,
        },
        orderBy: { date: "desc" },
      });
    }
  } catch (err) {
    console.error("Failed to load appointments data:", err);
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      <AppointmentsFollowUpViewer workers={workers} allVisits={allVisits} />
    </div>
  );
}
