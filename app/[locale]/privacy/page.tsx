import React from "react";
import { setRequestLocale } from "next-intl/server";
import { PrivacyConsentManager } from "@/components/PrivacyConsentManager";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyConsentManager />;
}
