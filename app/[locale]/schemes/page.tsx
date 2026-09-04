import React from "react";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { SchemesBenefitsViewer } from "@/components/SchemesBenefitsViewer";

export default async function SchemesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerAuthSession();
  const role = (session?.user as any)?.role;
  const sessionWorkerId = (session?.user as any)?.workerId;

  let workers: any[] = [];
  try {
    if (role === "WORKER" && sessionWorkerId) {
      // Worker only sees themselves for scheme matching
      workers = await prisma.worker.findMany({
        where: { id: sessionWorkerId },
        select: {
          id: true,
          name: true,
          portableHealthId: true,
          dob: true,
          gender: true,
          homeState: true,
          riskStatus: true,
        },
      });
    } else {
      // Healthcare Provider / Admin: Full worker pool
      workers = await prisma.worker.findMany({
        select: {
          id: true,
          name: true,
          portableHealthId: true,
          dob: true,
          gender: true,
          homeState: true,
          riskStatus: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.error("Failed to load workers for schemes:", err);
  }

  return <SchemesBenefitsViewer workers={workers} />;
}
