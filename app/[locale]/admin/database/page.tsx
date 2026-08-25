import React from "react";
import { setRequestLocale } from "next-intl/server";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DatabaseTableView } from "@/components/DatabaseTableView";

export const dynamic = "force-dynamic";

export default async function AdminDatabasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 1. Strict Server-Side Auth & Role Guard: Accessible ONLY to ADMIN role
  const session = await getServerAuthSession();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/database`);
  }

  return (
    <div className="py-6 px-4 sm:px-6 bg-slate-950 min-h-screen text-slate-100">
      <DatabaseTableView />
    </div>
  );
}
