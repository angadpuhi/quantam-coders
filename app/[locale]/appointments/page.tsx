import React from "react";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppointmentsFollowUpViewer } from "@/components/AppointmentsFollowUpViewer";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/appointments`);
  }

  const role = session.user.role === "STAFF" ? "PROVIDER" : session.user.role;
  const isWorker = role === "WORKER";
  const workerId = (session.user as any).workerId as string | null;

  let workers: any[] = [];
  let allVisits: any[] = [];

  try {
    workers = await prisma.worker.findMany({
      where: isWorker ? { id: workerId ?? "__none__" } : undefined,
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
      where: isWorker ? { workerId: workerId ?? "__none__" } : undefined,
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
