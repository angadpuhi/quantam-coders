import React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SahaayakTerminal } from "@/components/SahaayakTerminal";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArogyaRekha / MigrantHealth — Digital Health Records for Migrant Workers in Kerala",
  description:
    "Multilingual digital health record and health passport management system for guest workers (Athidhi Thozhilalikal) across Kerala Public Health facilities.",
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

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#fffefc] text-[#222222] font-sans flex flex-col antialiased selection:bg-[#cfe7d3] selection:text-[#0f3e17]">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1 w-full pb-20 md:pb-0">
              {children}
            </main>
            {/* Mobile Bottom Navigation Bar */}
            <BottomNav />
            {/* Global SAHAAYAK Command-Line Help Terminal */}
            <SahaayakTerminal />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
