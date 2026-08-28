/**
 * MAFFETONE (MAF 180) LONGEVITY & AEROBIC ENGINE
 * Based on Dr. Phil Maffetone's Maximum Aerobic Function principles.
 */

export type MafCategory = 
  | "A_RECOVERY"      // Major illness, surgery, medication (-10 bpm)
  | "B_INCONSISTENT"  // Injured, frequent colds, inconsistent training (-5 bpm)
  | "C_CONSISTENT"    // Training consistently for up to 2 years without major issues (0 bpm)
  | "D_ADVANCED";     // Training for 2+ years with clear competitive progress (+5 bpm)

export interface MafAssessmentQuestions {
  hasMajorIllnessOrMedication: boolean; // Category A (-10)
  hasInjuryOrFrequentColds: boolean;    // Category B (-5)
  hasConsistentTraining2Years: boolean; // Category C (0)
  hasContinuousProgress2Years: boolean; // Category D (+5)
}

export interface MafProfile {
  age: number;
  category: MafCategory;
  mafMaxHeartRate: number;      // 180 - age + modifier
  mafAerobicZoneLow: number;    // MAF max - 10 bpm
  mafAerobicZoneHigh: number;   // MAF max
  fatBurningEfficiencyPct: number;
  description: string;
  recommendations: string[];
  assessedAt: string;          // ISO Date
  nextReassessmentDate: string; // ISO Date (3 or 6 months later)
}

export interface MafTestSession {
  date: string;
  distanceKm: number;
  timeMinutes: number;
  avgHeartRate: number;
  paceMinPerKm: number;
  notes?: string;
}

/**
 * Determine MAF Category from simple step-by-step diagnostic questions
 */
export function determineMafCategoryFromAnswers(answers: MafAssessmentQuestions): MafCategory {
  if (answers.hasMajorIllnessOrMedication) {
    return "A_RECOVERY";
  }
  if (answers.hasInjuryOrFrequentColds) {
    return "B_INCONSISTENT";
  }
  if (answers.hasContinuousProgress2Years) {
    return "D_ADVANCED";
  }
  // Standard consistent or beginner without illness
  return "C_CONSISTENT";
}

export function calculateMafHeartRate(
  age: number, 
  category: MafCategory,
  assessmentDate: Date = new Date()
): MafProfile {
  let modifier = 0;
  let desc = "";
  let monthsUntilReassessment = 6;

  switch (category) {
    case "A_RECOVERY":
      modifier = -10;
      desc = "Kategori A: Rekonvalesens etter sykdom, operasjon eller medisinering. Skånsom oppstart.";
      monthsUntilReassessment = 3; // Re-evaluate sooner as recovery improves
      break;
    case "B_INCONSISTENT":
      modifier = -5;
      desc = "Kategori B: Ujevn trening, nylig skade eller tilbakevendende forkjølelser/allergi.";
      monthsUntilReassessment = 3; // Re-evaluate in 3 months if injury-free
      break;
    case "C_CONSISTENT":
      modifier = 0;
      desc = "Kategori C: Regelmessig trening i opptil 2 år uten store skader eller avbrudd.";
      monthsUntilReassessment = 6;
      break;
    case "D_ADVANCED":
      modifier = +5;
      desc = "Kategori D: Kontinuerlig trening i mer enn 2 år med jevn fremgang uten skader.";
      monthsUntilReassessment = 6;
      break;
  }

  const mafMax = Math.max(80, Math.min(180 - age + modifier, 195));
  const zoneLow = mafMax - 10;

  const nextDate = new Date(assessmentDate);
  nextDate.setMonth(nextDate.getMonth() + monthsUntilReassessment);

  return {
    age,
    category,
    mafMaxHeartRate: mafMax,
    mafAerobicZoneLow: zoneLow,
    mafAerobicZoneHigh: mafMax,
    fatBurningEfficiencyPct: 85,
    description: desc,
    recommendations: [
      `Hold pulsen strengt mellom ${zoneLow} og ${mafMax} slag/min under all aerob trening.`,
      "Varm opp rolig i 12-15 minutter før du når din MAF-puls.",
      "Kjøl ned rolig i 10-15 minutter etter økten for å unngå stresshormon-opphopning.",
      "Gjennomfør en månedlig MAF-test (samme distanse og puls) for å spore aerob forbedring uten melkesyre.",
      `Neste MAF-reevaluering anbefales om ${monthsUntilReassessment} måneder (${nextDate.toISOString().split("T")[0]}) for å vurdere formoppgradering.`
    ],
    assessedAt: assessmentDate.toISOString().split("T")[0],
    nextReassessmentDate: nextDate.toISOString().split("T")[0]
  };
}
