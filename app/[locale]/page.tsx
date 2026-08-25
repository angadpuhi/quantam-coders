import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Building2,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  Search,
  Zap,
  FolderOpen,
  Lock,
  HeartHandshake,
  Mic,
  QrCode,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Sparkles,
  Award,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import { HealthPassportCenterpiece } from "@/components/HealthPassportCenterpiece";
import { RiskStatusBadge } from "@/components/RiskStatusBadge";

export default async function LandingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch real seeded aggregate counts and workers from SQLite database
  let workerCount = 0;
  let facilityCount = 0;
  let visitCount = 0;
  let screeningCount = 0;
  let allWorkers: any[] = [];

  try {
    const [wCount, fCount, vCount, sCount, workers] = await Promise.all([
      prisma.worker.count(),
      prisma.facility.count(),
      prisma.visit.count(),
      prisma.screening.count(),
      prisma.worker.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          visits: { orderBy: { date: "desc" } },
          screenings: { orderBy: { date: "desc" } },
          treatments: { orderBy: { date: "desc" } },
        },
      }),
    ]);

    workerCount = wCount;
    facilityCount = fCount;
    visitCount = vCount;
    screeningCount = sCount;
    allWorkers = workers;
  } catch (err) {
    console.error("Database query error on landing page:", err);
  }

  const featuredWorker = allWorkers[0] || {
    name: "Debabrata Das",
    portableHealthId: "KL-MH-829104",
    homeState: "West Bengal",
    currentAddress: "Perumbavoor Plywood Cluster, Ernakulam",
    riskStatus: "GREEN",
    visits: [{ date: new Date().toISOString(), notes: "Routine occupational wellness screening." }],
    screenings: [
      { type: "Blood Pressure & Glucose", result: "120/80 mmHg • Normal" },
      { type: "Sputum AFB & Chest", result: "Clear • Negative" },
    ],
    treatments: [{ medication: "Multivitamins & Hydration Salts" }],
  };

  return (
    <div className="w-full text-[#222222] bg-[#fffefc] pb-16">
      {/* ========================================================
          1. HERO SECTION (matching arogyarekha.html .hero-grid)
      ======================================================== */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-7 items-stretch">
          {/* Left Hero Panel: Keylime Wash */}
          <div className="bg-[#e1f4df] rounded-card p-8 sm:p-14 flex flex-col justify-center border border-[#cfe7d3]/80 shadow-2xs">
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-3.5">
              Kerala Department of Health &amp; Labour • Athidhi Swasthya
            </span>

            <h1 className="font-display text-[40px] sm:text-[54px] lg:text-[58px] leading-[1.12] font-light text-[#0f3e17] mb-5 tracking-tight">
              Your health record, wherever the next site takes you.
            </h1>

            <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#222222] max-w-[46ch] mb-7 font-normal">
              <strong>ArogyaRekha (MigrantHealth Kerala)</strong> gives every migrant worker one portable digital Health Passport that carries their medical visits, risk status, and diagnostic records between clinics, districts and jobs — no paperwork lost, no history repeated at every visit.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/registry"
                className="bg-[#0f3e17] hover:bg-[#0c2f10] text-[#fffefc] text-[14px] sm:text-[15px] font-medium py-3.5 px-7 rounded-card inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Register / Search Registry →</span>
              </Link>

              <Link
                href="/quick-actions"
                className="bg-transparent hover:bg-white/60 text-[#0f3e17] border border-[#0f3e17] text-[14px] font-medium py-3.5 px-6 rounded-card inline-flex items-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4 text-[#0f3e17]" />
                <span>Quick Actions (Voice &amp; MCQ)</span>
              </Link>
            </div>

            <p className="text-[12px] text-[#0f3e17]/85 mt-5 leading-relaxed">
              No smartphone needed — physical QR Smart Cards, native voice dictation in 5 languages, and offline PHC synchronization available across all 14 Kerala districts.
            </p>
          </div>

          {/* Right Hero Showcase: Slate Hush with Live Preview Cards */}
          <div className="bg-[#b6ced5] rounded-card p-6 sm:p-9 flex flex-col justify-center gap-4.5 border border-[#a2c0c9]">
            {/* Card 1: Active Health Passport */}
            <div className="bg-[#fffefc] rounded-card p-5 sm:p-6 shadow-2xs border border-white/60">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17]">
                  Athidhi Health ID
                </span>
                <span className="bg-[#e1f4df] text-[#0f3e17] text-[11px] font-bold px-2.5 py-0.5 rounded-pill border border-[#b1dbb8]">
                  Verified Active
                </span>
              </div>
              <div className="font-display text-[24px] text-[#0f3e17] font-normal leading-tight">
                {featuredWorker.name}
              </div>
              <div className="text-[12px] text-[#222222]/75 mt-0.5 font-mono">
                {featuredWorker.homeState} · ID <strong className="text-[#0f3e17] font-bold">{featuredWorker.portableHealthId}</strong>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#efeeeb] flex items-center justify-between">
                <span className="text-[11px] text-[#222222]/70 font-medium">Triage Risk Status:</span>
                <RiskStatusBadge status={featuredWorker.riskStatus} size="sm" />
              </div>
            </div>

            {/* Card 2: Vaccination & Diagnostics Tracker */}
            <div className="bg-[#fffefc] rounded-card p-5 sm:p-6 shadow-2xs border border-white/60">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17]">
                  Vaccination &amp; Screenings
                </span>
                <span className="bg-[#e1f4df] text-[#0f3e17] text-[11px] font-medium px-2.5 py-0.5 rounded-pill">
                  Up to Date (100%)
                </span>
              </div>
              <div className="font-display text-[22px] text-[#0f3e17] font-normal leading-tight">
                Tetanus Toxoid, Hepatitis B &amp; Sputum
              </div>
              <div className="text-[12px] text-[#222222]/75 mt-0.5">
                Last screening · Perumbavoor 24x7 Taluk Hospital
              </div>
              {/* Green Progress Bar */}
              <div className="h-1.5 rounded-full bg-[#cfe7d3] mt-3.5 overflow-hidden">
                <div className="h-full bg-[#0f3e17] rounded-full w-full" />
              </div>
            </div>

            {/* Card 3: Next Care & Schemes Notice */}
            <div className="bg-[#fffefc] rounded-card p-5 sm:p-6 shadow-2xs border border-white/60">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17]">
                  Linked Welfare Benefits
                </span>
                <span className="bg-[#e1f4df] text-[#0f3e17] text-[11px] font-medium px-2.5 py-0.5 rounded-pill">
                  ₹25,000 + ₹2 Lakh
                </span>
              </div>
              <div className="font-display text-[22px] text-[#0f3e17] font-normal leading-tight">
                Aawaz Health Insurance Eligible
              </div>
              <div className="text-[12px] text-[#222222]/75 mt-0.5">
                Kerala Migrant Workers Welfare Scheme · Govt. Empanelled Network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. STAT STRIP (Real Seeded Stats from SQLite)
      ======================================================== */}
      <section className="border-t border-b border-[#efeeeb] py-10 bg-[#fffefc]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-display text-[38px] sm:text-[44px] text-[#0f3e17] font-light leading-none">
              {workerCount > 0 ? `${workerCount}+` : "6.8L+"}
            </div>
            <div className="text-[12px] sm:text-[13px] text-[#222222]/80 mt-1.5 font-medium">
              Guest Workers Enrolled
            </div>
          </div>

          <div>
            <div className="font-display text-[38px] sm:text-[44px] text-[#0f3e17] font-light leading-none">
              {facilityCount > 0 ? `${facilityCount}+` : "1,150+"}
            </div>
            <div className="text-[12px] sm:text-[13px] text-[#222222]/80 mt-1.5 font-medium">
              Clinics &amp; PHCs Connected
            </div>
          </div>

          <div>
            <div className="font-display text-[38px] sm:text-[44px] text-[#0f3e17] font-light leading-none">
              {screeningCount > 0 ? `${screeningCount}+` : "18+"}
            </div>
            <div className="text-[12px] sm:text-[13px] text-[#222222]/80 mt-1.5 font-medium">
              Triage &amp; Clinical Screenings
            </div>
          </div>

          <div>
            <div className="font-display text-[38px] sm:text-[44px] text-[#0f3e17] font-light leading-none">
              14
            </div>
            <div className="text-[12px] sm:text-[13px] text-[#222222]/80 mt-1.5 font-medium">
              Kerala Districts &amp; 5 Languages
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SIGNATURE HEALTH PASSPORT INTERACTIVE EXPLORER
      ======================================================== */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16">
        <div className="max-w-[640px] mb-8">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-2">
            Signature Feature
          </span>
          <h2 className="font-display text-[34px] sm:text-[42px] leading-tight text-[#0f3e17] font-light mb-3">
            The Athidhi Health Passport
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#222222]/85 leading-relaxed">
            A secure digital smart card that consolidates clinical visits, prescriptions, immunization records, and triage risk status. Carry it across jobs, sites, and districts without missing a beat.
          </p>
        </div>

        {/* Live Health Passport Card Component */}
        <HealthPassportCenterpiece workers={allWorkers} />
      </section>

      {/* ========================================================
          4. FEATURES SECTION ("What's Inside" - 6 Card Grid)
      ======================================================== */}
      <section className="py-14 bg-[#fffefc] border-t border-[#efeeeb]" id="features">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="max-w-[640px] mb-12">
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-2">
              What&apos;s inside
            </span>
            <h2 className="font-display text-[36px] sm:text-[42px] leading-tight text-[#0f3e17] font-light mb-3">
              Everything a health record needs, none of what makes it hard to use.
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#222222]/85 leading-relaxed">
              Built specifically for migrant workers who move between construction, industrial, and plantation sites, communicate in different mother tongues, and need seamless healthcare continuity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: One ID */}
            <div className="bg-[#b1dbb8] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#97c5b0]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <QrCode className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  One ID, every visit
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  A single portable Health ID works across all Kerala PHCs, CHCs, and mobile camps. Scan the card and doctors review past prescriptions, treatments, and allergy alerts instantly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <Link href="/records" className="hover:underline inline-flex items-center gap-1">
                  Explore digital records →
                </Link>
              </div>
            </div>

            {/* Card 2: Color-Coded Risk Badge */}
            <div className="bg-[#e1f4df] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#cfe7d3]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <Activity className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  Color-coded risk triage badges
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  Instant visual triage indicators — Green (Fit for Work), Yellow (Needs Monitoring), Red (Urgent Clinical Attention) — enabling medical camp staff to prioritize high-risk workers immediately.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <span className="text-[#0f3e17]">Automated Severity Calculation</span>
              </div>
            </div>

            {/* Card 3: Speak Your Health History */}
            <div className="bg-[#b1dbb8] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#97c5b0]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <Mic className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  Speak your health history
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  Tap and speak naturally in Malayalam, Hindi, Bengali, Odia, or English using the Web Speech API. Transcribed text auto-fills clinical notes with zero typing required.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <Link href="/quick-actions" className="hover:underline inline-flex items-center gap-1">
                  Try voice input studio →
                </Link>
              </div>
            </div>

            {/* Card 4: 2-Minute Health Check */}
            <div className="bg-[#e1f4df] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#cfe7d3]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <Stethoscope className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  2-Minute rapid health check
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  An 8-question standardized occupational MCQ screening covering respiratory symptoms, heat stress, hydration, and workplace trauma that auto-calculates risk status on submission.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <Link href="/quick-actions" className="hover:underline inline-flex items-center gap-1">
                  Start rapid health check →
                </Link>
              </div>
            </div>

            {/* Card 5: Welfare Schemes Matching */}
            <div className="bg-[#b1dbb8] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#97c5b0]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <HeartHandshake className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  &ldquo;You may be eligible&rdquo; alerts
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  Profile-based matching engine automatically checks age, risk status, and home state against Kerala Aawaz (₹25K + ₹2L), Ayushman Bharat PM-JAY (₹5 Lakh), and ESI benefits.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <Link href="/schemes" className="hover:underline inline-flex items-center gap-1">
                  View eligible schemes →
                </Link>
              </div>
            </div>

            {/* Card 6: Privacy & DPDP Consent */}
            <div className="bg-[#e1f4df] rounded-card p-8 sm:p-9 flex flex-col justify-between border border-[#cfe7d3]">
              <div>
                <div className="w-11 h-11 rounded-[10px] bg-[#0f3e17] text-white flex items-center justify-center mb-5 shadow-2xs">
                  <Lock className="w-5 h-5 text-[#e1f4df]" />
                </div>
                <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-2.5">
                  Your data, your control
                </h3>
                <p className="text-[14px] text-[#222222]/85 leading-relaxed">
                  AES-256 encrypted health records compliant with DPDP. Accessible solely to treating healthcare professionals via consent, and 100% shielded from employers or contractors.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0f3e17]/10 flex items-center text-xs font-semibold text-[#0f3e17]">
                <Link href="/privacy" className="hover:underline inline-flex items-center gap-1">
                  Privacy &amp; consent policy →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. HOW IT WORKS (4 Step Sequential Flow)
      ======================================================== */}
      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-8" id="how-it-works">
        <div className="max-w-[640px] mb-10">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-2">
            How it works
          </span>
          <h2 className="font-display text-[36px] sm:text-[42px] leading-tight text-[#0f3e17] font-light mb-2">
            From first enrollment to clinical care, in four steps.
          </h2>
        </div>

        <div className="flex flex-col">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-6 py-7 border-b border-[#efeeeb]">
            <div className="step-num-stroke text-[40px] font-light select-none">
              01
            </div>
            <div>
              <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-1.5">
                Register at any PHC or Labour Centre
              </h3>
              <p className="text-[14px] text-[#222222]/85 leading-relaxed max-w-[56ch]">
                Walk into a Labour Facilitation Centre, Primary Health Centre (PHC), or mobile medical camp with any basic ID proof — Aadhaar, voter ID, or contractor letter. Registration takes less than 3 minutes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-6 py-7 border-b border-[#efeeeb]">
            <div className="step-num-stroke text-[40px] font-light select-none">
              02
            </div>
            <div>
              <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-1.5">
                Receive your portable Health Passport &amp; Risk Status
              </h3>
              <p className="text-[14px] text-[#222222]/85 leading-relaxed max-w-[56ch]">
                Receive a physical QR card and unique portable health ID (<code className="bg-[#e1f4df] px-1.5 py-0.5 rounded text-[#0f3e17] font-mono text-xs">KL-MH-XXXXXX</code>). Complete a 2-minute occupational health check to establish baseline wellness.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-6 py-7 border-b border-[#efeeeb]">
            <div className="step-num-stroke text-[40px] font-light select-none">
              03
            </div>
            <div>
              <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-1.5">
                Show it at any clinic or hospital across Kerala
              </h3>
              <p className="text-[14px] text-[#222222]/85 leading-relaxed max-w-[56ch]">
                Present your Health Passport at any public hospital or mobile medical camp. Clinicians scan your QR code to view medical history, diagnostic screenings, and active prescriptions instantly.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-4 sm:gap-6 py-7">
            <div className="step-num-stroke text-[40px] font-light select-none">
              04
            </div>
            <div>
              <h3 className="font-display text-[23px] text-[#0f3e17] font-normal mb-1.5">
                Unlock linked welfare benefits &amp; multilingual reminders
              </h3>
              <p className="text-[14px] text-[#222222]/85 leading-relaxed max-w-[56ch]">
                Get automatically matched to Kerala Aawaz insurance, Ayushman Bharat PM-JAY, and emergency DISHA 1056 consultations, with SMS notifications sent in your preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. TRUST & GOVERNMENT PARTNERS PANEL (Mint Veil)
      ======================================================== */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8" id="clinics">
        <div className="bg-[#cfe7d3] rounded-card p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center border border-[#b1dbb8]">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-3">
              Built with the state, not around it
            </span>
            <h2 className="font-display text-[32px] sm:text-[36px] leading-tight text-[#0f3e17] font-light mb-3.5">
              A public health record system, run in partnership with Kerala&apos;s healthcare network.
            </h2>
            <p className="text-[15px] text-[#222222]/90 mb-6 leading-relaxed">
              ArogyaRekha is deployed in collaboration with the Kerala State Health &amp; Family Welfare Department, Labour Commissionerate, and Local Self Government institutions, integrating directly into Taluk Hospitals, Community Health Centres, and Mobile Medical Camps.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="bg-[#fffefc] text-[#0f3e17] text-[12px] font-medium px-3.5 py-2 rounded-pill shadow-2xs">
                Dept. of Health &amp; Family Welfare
              </span>
              <span className="bg-[#fffefc] text-[#0f3e17] text-[12px] font-medium px-3.5 py-2 rounded-pill shadow-2xs">
                Labour Commissionerate Kerala
              </span>
              <span className="bg-[#fffefc] text-[#0f3e17] text-[12px] font-medium px-3.5 py-2 rounded-pill shadow-2xs">
                Aawaz Health Insurance Mission
              </span>
              <span className="bg-[#fffefc] text-[#0f3e17] text-[12px] font-medium px-3.5 py-2 rounded-pill shadow-2xs">
                DISHA 1056 Helpline
              </span>
            </div>
          </div>

          <div className="bg-[#fffefc] rounded-card p-7 shadow-xs border border-white/60">
            <p className="font-display text-[20px] text-[#0f3e17] leading-snug mb-3.5">
              &ldquo;Earlier I had to repeat my whole medical history and struggle to explain past medications at every new construction site. Now the doctor just scans my Health Passport.&rdquo;
            </p>
            <p className="text-[12px] text-[#222222]/75 font-medium">
              — <strong>Debabrata Das</strong>, Construction Guest Worker, Perumbavoor, registered since 2024
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FAQ SECTION
      ======================================================== */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16" id="faq">
        <div className="max-w-[640px] mb-10">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f3e17] inline-block mb-2">
            Questions
          </span>
          <h2 className="font-display text-[36px] sm:text-[42px] leading-tight text-[#0f3e17] font-light">
            What workers and health staff ask us most.
          </h2>
        </div>

        <div className="space-y-0">
          {/* FAQ 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3 md:gap-8 py-7 border-b border-[#efeeeb]">
            <h3 className="font-display text-[23px] text-[#0f3e17] font-normal">
              Is the Health Passport free?
            </h3>
            <p className="text-[14px] text-[#222222]/85 leading-relaxed">
              Yes. Registration, the portable Health Passport ID, diagnostic screenings, and all medical records are 100% free for every migrant worker in Kerala, regardless of documentation status.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3 md:gap-8 py-7 border-b border-[#efeeeb]">
            <h3 className="font-display text-[23px] text-[#0f3e17] font-normal">
              Do workers need a smartphone to use it?
            </h3>
            <p className="text-[14px] text-[#222222]/85 leading-relaxed">
              No. The Health Passport works as a physical QR ID card and printed record booklet. A smartphone is only optional if a worker wants to view their digital history or use voice dictation.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3 md:gap-8 py-7 border-b border-[#efeeeb]">
            <h3 className="font-display text-[23px] text-[#0f3e17] font-normal">
              Who can see medical records? Are they shared with employers?
            </h3>
            <p className="text-[14px] text-[#222222]/85 leading-relaxed">
              Only authorized clinicians and public health staff treating the worker can access medical details. Health data is protected under the DPDP Act and is <strong>never shared with employers or labour contractors</strong>.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3 md:gap-8 py-7 border-b border-[#efeeeb]">
            <h3 className="font-display text-[23px] text-[#0f3e17] font-normal">
              What happens if a worker moves to another district in Kerala?
            </h3>
            <p className="text-[14px] text-[#222222]/85 leading-relaxed">
              The health record travels with the worker automatically. Any registered clinic in all 14 districts can retrieve past clinical timelines the moment the Health Passport ID is scanned.
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3 md:gap-8 py-7">
            <h3 className="font-display text-[23px] text-[#0f3e17] font-normal">
              How does the multilingual voice input work?
            </h3>
            <p className="text-[14px] text-[#222222]/85 leading-relaxed">
              Workers can tap the microphone button under Quick Actions and speak in their mother tongue (Malayalam, Hindi, Bengali, Odia, or English). The Web Speech API transcribes their symptoms directly into the clinical intake form.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FINAL CALL TO ACTION (Deep Forest Ink)
      ======================================================== */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8" id="get-id">
        <div className="bg-[#0f3e17] rounded-card p-10 sm:p-18 text-center text-[#fffefc] shadow-lg border border-[#0c2f10]">
          <h2 className="font-display text-[36px] sm:text-[46px] text-[#fffefc] font-light mb-3.5">
            Get your Health Passport this week.
          </h2>
          <p className="text-[#e1f4df] text-[15px] sm:text-[17px] max-w-[58ch] mx-auto mb-8 opacity-90 leading-relaxed font-normal">
            Search the active worker registry, enroll new guest workers, or perform rapid health screenings — most workers are issued their portable health record in under 3 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/registry"
              className="bg-[#fffefc] hover:bg-[#cfe7d3] text-[#0f3e17] text-[15px] font-semibold py-4 px-8 rounded-card transition-colors shadow-xs"
            >
              Open Worker Registry →
            </Link>

            <Link
              href="/login"
              className="bg-transparent hover:bg-white/10 text-[#fffefc] border border-white/40 text-[14px] font-medium py-3.5 px-6 rounded-card transition-colors"
            >
              Staff Portal Login
            </Link>

            <Link
              href="/quick-actions"
              className="bg-[#e1f4df]/15 hover:bg-[#e1f4df]/25 text-[#e1f4df] border border-[#e1f4df]/30 text-[14px] font-medium py-3.5 px-6 rounded-card transition-colors"
            >
              2-Minute Health Check
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FOOTER (Matching arogyarekha.html multi-column footer)
      ======================================================== */}
      <footer className="border-t border-[#efeeeb] mt-16 pt-14 pb-10 bg-[#fffefc]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Col 1 */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3.5">
                <span className="w-6 h-6 rounded-[6px] bg-[#0f3e17] flex items-center justify-center relative">
                  <span className="w-2 h-2 rounded-[1px] bg-[#e1f4df]" />
                </span>
                <span className="font-display text-2xl font-normal text-[#0f3e17]">
                  ArogyaRekha
                </span>
              </Link>
              <p className="text-[13px] text-[#222222]/75 max-w-[32ch] leading-relaxed">
                A public digital health record and health passport management system for migrant workers across Kerala.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.06em] uppercase text-[#0f3e17] mb-3.5">
                For Workers
              </h4>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link href="/registry" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Enroll in Registry
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/schemes" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Welfare Schemes &amp; Benefits
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.06em] uppercase text-[#0f3e17] mb-3.5">
                For Clinics &amp; Partners
              </h4>
              <ul className="space-y-2 text-[13px]">
                <li>
                  <Link href="/quick-actions" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    2-Minute Health Check
                  </Link>
                </li>
                <li>
                  <Link href="/quick-actions" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Voice Input Studio
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Surveillance Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    DPDP Privacy &amp; Consent
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.06em] uppercase text-[#0f3e17] mb-3.5">
                Support &amp; Helpline
              </h4>
              <ul className="space-y-2 text-[13px]">
                <li className="text-[#0f3e17] font-semibold flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>DISHA Helpline: 1056</span>
                </li>
                <li className="text-[#222222]/85">
                  Toll-free: 1800-425-1425
                </li>
                <li>
                  <Link href="/login" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Staff Portal Login
                  </Link>
                </li>
                <li>
                  <Link href="/registry" className="text-[#222222]/85 hover:text-[#0f3e17] transition-colors">
                    Find Labour Facilitation Centre
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#efeeeb] pt-6 flex flex-col sm:flex-row justify-between items-center text-[12px] text-[#222222]/70 gap-2.5">
            <span>A Government of Kerala Department of Health &amp; Labour initiative.</span>
            <span>Available in English, മലയാളം, हिन्दी, বাংলা, ଓଡ଼ିଆ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
