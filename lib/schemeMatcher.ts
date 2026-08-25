import schemesData from "@/data/schemes.json";

export interface Scheme {
  id: string;
  name: string;
  malayalamName?: string;
  hindiName?: string;
  bengaliName?: string;
  odiaName?: string;
  authority: string;
  badge: string;
  coverageAmount: string;
  infoBlurb: string;
  minAge: number;
  maxAge: number;
  eligibleStates: string[];
  eligibleRisk: string[];
  benefits: string[];
  howToApply: string;
  helpline: string;
  portalUrl: string;
}

export interface MatchedScheme extends Scheme {
  isEligible: boolean;
  matchScore: number;
  eligibilityReason: string;
  matchTags: string[];
}

export interface WorkerProfileForSchemes {
  id: string;
  name: string;
  portableHealthId: string;
  dob?: string | Date | null;
  gender?: string | null;
  homeState?: string | null;
  riskStatus?: string | null; // "GREEN" | "YELLOW" | "RED"
}

export function calculateAge(dob?: string | Date | null): number {
  if (!dob) return 28; // Default adult worker age if not specified
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function matchSchemesForWorker(
  worker: WorkerProfileForSchemes,
  locale: string = "en"
): MatchedScheme[] {
  const age = calculateAge(worker.dob);
  const risk = (worker.riskStatus || "GREEN").toUpperCase();
  const homeState = worker.homeState || "West Bengal";

  const allSchemes: Scheme[] = schemesData as Scheme[];

  return allSchemes.map((scheme) => {
    let isEligible = true;
    const matchTags: string[] = [];
    let reasonParts: string[] = [];
    let matchScore = 0;

    // 1. Age criteria
    if (age >= scheme.minAge && age <= scheme.maxAge) {
      matchScore += 20;
      matchTags.push(`Age: ${age} yrs`);
    } else {
      isEligible = false;
    }

    // 2. State criteria
    if (scheme.eligibleStates.includes("ALL") || scheme.eligibleStates.includes(homeState)) {
      matchScore += 30;
      matchTags.push(`Home State: ${homeState}`);
    } else {
      isEligible = false;
    }

    // 3. Health Risk criteria
    if (scheme.eligibleRisk.includes("ALL")) {
      matchScore += 20;
    } else if (scheme.eligibleRisk.includes(risk)) {
      matchScore += 40;
      matchTags.push(`Priority: ${risk} Risk Triage`);
      reasonParts.push(`Flagged for clinical priority under ${risk} risk status`);
    } else {
      isEligible = false;
    }

    // Generate tailored, human-readable eligibility explanation
    let eligibilityReason = "";
    if (scheme.id === "aawaz") {
      eligibilityReason = `Automatically eligible as an active guest worker in Kerala (${age} yrs) with verified Portable ID ${worker.portableHealthId}.`;
      matchTags.push("Universal Kerala Coverage");
    } else if (scheme.id === "ayushman-bharat") {
      eligibilityReason = `Matched based on your domicile in ${homeState} with full portability across all empaneled hospitals nationwide.`;
      matchTags.push("Pan-India Portability");
    } else if (scheme.id === "esi") {
      eligibilityReason = `Matched for organized & factory sector guest workers in Kerala with sickness wage compensation rights.`;
      matchTags.push("Social Security");
    } else if (scheme.id === "kasp") {
      if (risk === "YELLOW" || risk === "RED") {
        eligibilityReason = `High-priority match: Your clinical risk is ${risk}, qualifying you for tertiary care referral at Kerala Medical Colleges.`;
      } else {
        eligibilityReason = `Eligible for emergency critical care and state health protection at Kerala CHCs and District Hospitals.`;
      }
      matchTags.push("Critical Care Cover");
    } else if (scheme.id === "kmwwb") {
      eligibilityReason = `Matched based on age (${age} yrs) and registration under the Kerala Inter-State Migrant Workers Welfare Board.`;
      matchTags.push("Grants & Pension");
    }

    return {
      ...scheme,
      isEligible,
      matchScore,
      eligibilityReason,
      matchTags,
    };
  });
}
