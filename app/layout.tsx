import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "MigrantHealth | Kerala Digital Health Record Management System",
  description:
    "A unified digital health record and screening management system for migrant/guest workers in Kerala.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <p>
              MigrantHealth Kerala • Digital Health Record Management System for Guest Workers
            </p>
            <p className="mt-1 text-slate-400">
              Public Worker Lookup enabled • Role-Based Access Control for Facility Staff & Directorate Admins
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
