import React from "react";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SchemesBenefitsViewer } from "@/components/SchemesBenefitsViewer";

export default async function SchemesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let workers: any[] = [];
  try {
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
  } catch (err) {
    console.error("Failed to load workers for schemes:", err);
  }

  return <SchemesBenefitsViewer workers={workers} />;
}
