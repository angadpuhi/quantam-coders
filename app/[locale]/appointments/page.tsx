import React from "react";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AppointmentsFollowUpViewer } from "@/components/AppointmentsFollowUpViewer";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let workers: any[] = [];
  let allVisits: any[] = [];

  try {
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
  } catch (err) {
    console.error("Failed to load appointments data:", err);
  }

  return (
    <div className="py-6 px-4 sm:px-6">
      <AppointmentsFollowUpViewer workers={workers} allVisits={allVisits} />
    </div>
  );
}
