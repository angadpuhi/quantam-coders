import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MigrantHealth | Kerala Digital Health Record Management System",
  description:
    "Multilingual digital health record management system for migrant workers (Athidhi Thozhilalikal) across Kerala Public Health facilities.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </main>
            <footer className="border-t border-kerala-coir-200 bg-white/70 py-6 mt-12 text-center text-xs text-slate-500">
              <p>
                MigrantHealth Kerala • Digital Health Record Management System for Guest Workers
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Public Worker Lookup enabled • Role-Based Access Control for Facility Staff & Directorate Admins
              </p>
            </footer>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
