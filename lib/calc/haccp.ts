// HACCP plan engine. Given a food's process category and the process steps it
// passes through, it derives a 7-principle HACCP plan: hazard analysis, the
// Critical Control Points (CCPs), critical limits drawn verbatim from the FDA
// Food Code 2022 (see lib/data/temps.ts), monitoring procedures, corrective
// actions, verification and record-keeping. All limits are real code values —
// nothing is invented (No-Fallbacks rule).

import {
  COOK_RULES,
  CookCategory,
  COOLING,
  REHEATING,
  HOLDING,
  DATE_MARKING,
} from "../data/temps";

export type ProcessCategory =
  // FDA process-approach categories (Annex 4, "Food Establishment Plan Review").
  | "no-cook" // Process 1: receive → store → prepare → hold → serve (RTE, no cook step)
  | "same-day" // Process 2: receive → store → prepare → COOK → hold → serve
  | "complex"; // Process 3: receive → store → prepare → cook → COOL → reheat → hot-hold → serve

export type StepId =
  | "receiving"
  | "cold-storage"
  | "frozen-storage"
  | "thawing"
  | "preparation"
  | "cooking"
  | "cooling"
  | "reheating"
  | "hot-holding"
  | "cold-holding"
  | "date-marking"
  | "service";

export interface HaccpInput {
  foodName: string;
  process: ProcessCategory;
  cookCategory?: CookCategory; // required when a cooking step is present
  steps: StepId[];
}

export interface CcpRow {
  step: StepId;
  stepLabel: string;
  /** Is this step a Critical Control Point (the only place a hazard is controlled)? */
  isCcp: boolean;
  ccpNumber?: number; // CCP-1, CCP-2, … assigned in flow order
  hazard: string;
  hazardType: "biological" | "chemical" | "physical";
  criticalLimit: string;
  monitoring: string;
  correctiveAction: string;
  citation: string;
}

export interface HaccpPlan {
  foodName: string;
  process: ProcessCategory;
  processLabel: string;
  rows: CcpRow[];
  ccpCount: number;
  verification: string[];
  recordkeeping: string[];
  warnings: string[];
}

const STEP_LABELS: Record<StepId, string> = {
  receiving: "Receiving",
  "cold-storage": "Cold storage",
  "frozen-storage": "Frozen storage",
  thawing: "Thawing",
  preparation: "Preparation",
  cooking: "Cooking",
  cooling: "Cooling",
  reheating: "Reheating",
  "hot-holding": "Hot holding",
  "cold-holding": "Cold holding",
  "date-marking": "Date marking",
  service: "Service",
};

const PROCESS_LABELS: Record<ProcessCategory, string> = {
  "no-cook": "Process 1 — No cook (ready-to-eat)",
  "same-day": "Process 2 — Same-day cook & serve",
  complex: "Process 3 — Complex (cook, cool & reheat)",
};

// The FDA process approach designates the CCP steps by process category. These
// are the steps where loss of control would result in an unacceptable health
// risk and where control is essential (FDA Food Code 2022, Annex 4).
const CCP_STEPS: Record<ProcessCategory, StepId[]> = {
  "no-cook": ["cold-holding", "date-marking"],
  "same-day": ["cooking", "hot-holding"],
  complex: ["cooking", "cooling", "reheating", "hot-holding"],
};

function cookLimit(cat: CookCategory): { limit: string; citation: string } {
  const r = COOK_RULES[cat];
  const alt = r.alternatives?.length
    ? ` (or lethality-equivalent: ${r.alternatives
        .map((a) => `${a.tempF}°F for ${a.holdSeconds}s`)
        .join(", ")})`
    : "";
  return {
    limit: `Internal temperature ≥ ${r.minTempF}°F held ${r.holdSeconds}s${alt}`,
    citation: r.citation,
  };
}

export function buildPlan(input: HaccpInput): HaccpPlan {
  const warnings: string[] = [];
  const ccpSteps = CCP_STEPS[input.process];
  const orderedSteps = orderSteps(input.steps);

  if (
    (input.process === "same-day" || input.process === "complex") &&
    orderedSteps.includes("cooking") &&
    !input.cookCategory
  ) {
    warnings.push("Select a food category so the cooking critical limit can be set from the Food Code.");
  }
  if (input.process !== "no-cook" && !orderedSteps.includes("cooking")) {
    warnings.push("This process category normally includes a cooking step — add it to control biological hazards.");
  }

  let ccpCounter = 0;
  const rows: CcpRow[] = orderedSteps.map((step) => {
    const isCcp = ccpSteps.includes(step);
    const ccpNumber = isCcp ? ++ccpCounter : undefined;
    return { ...stepRow(step, input), isCcp, ccpNumber };
  });

  return {
    foodName: input.foodName,
    process: input.process,
    processLabel: PROCESS_LABELS[input.process],
    rows,
    ccpCount: ccpCounter,
    verification: VERIFICATION,
    recordkeeping: RECORDKEEPING,
    warnings,
  };
}

// Canonical process-flow order so steps always read top-to-bottom correctly.
const STEP_ORDER: StepId[] = [
  "receiving",
  "frozen-storage",
  "cold-storage",
  "thawing",
  "preparation",
  "cooking",
  "cooling",
  "cold-holding",
  "date-marking",
  "reheating",
  "hot-holding",
  "service",
];

function orderSteps(steps: StepId[]): StepId[] {
  const set = new Set(steps);
  return STEP_ORDER.filter((s) => set.has(s));
}

function stepRow(step: StepId, input: HaccpInput): Omit<CcpRow, "isCcp" | "ccpNumber"> {
  const label = STEP_LABELS[step];
  switch (step) {
    case "receiving":
      return {
        step,
        stepLabel: label,
        hazard: "Pathogen growth / spoilage on TCS food delivered above 41°F; receiving adulterated product.",
        hazardType: "biological",
        criticalLimit: `Cold TCS received at ≤ ${HOLDING.coldHoldMaxF}°F; frozen received frozen solid; no signs of thawing/refreezing.`,
        monitoring: "Probe-check the temperature of each TCS delivery on arrival; inspect packaging and dates.",
        correctiveAction: "Reject deliveries above 41°F or with damaged/expired packaging; log the rejection.",
        citation: "FDA Food Code 2022 §3-202.11",
      };
    case "cold-storage":
      return {
        step,
        stepLabel: label,
        hazard: "Pathogen multiplication when TCS food is held in the 41–135°F danger zone.",
        hazardType: "biological",
        criticalLimit: `Walk-in / reach-in maintains TCS food at ≤ ${HOLDING.coldHoldMaxF}°F.`,
        monitoring: "Record air temperature of each cold unit at least every 4 hours; probe product as needed.",
        correctiveAction: "If above 41°F, move product to a working unit, assess time/temperature abuse, discard if out of control > 4h.",
        citation: "FDA Food Code 2022 §3-501.16(A)(2)",
      };
    case "frozen-storage":
      return {
        step,
        stepLabel: label,
        hazard: "Quality loss and pathogen growth if product partially thaws.",
        hazardType: "biological",
        criticalLimit: "Freezer holds product frozen solid (0°F / −18°C recommended).",
        monitoring: "Record freezer temperature each shift; verify product is frozen solid.",
        correctiveAction: "Repair/replace unit; evaluate any thawed product for time/temperature abuse.",
        citation: "FDA Food Code 2022 §3-501.11",
      };
    case "thawing":
      return {
        step,
        stepLabel: label,
        hazard: "Surface pathogen growth if food thaws in the danger zone.",
        hazardType: "biological",
        criticalLimit: "Thaw under refrigeration (≤41°F), under running water ≤70°F, in the microwave, or as part of cooking.",
        monitoring: "Verify the approved thaw method is used; probe-check surface temperature.",
        correctiveAction: "Move to refrigeration or cook immediately; discard if held >4h in the danger zone.",
        citation: "FDA Food Code 2022 §3-501.13",
      };
    case "preparation":
      return {
        step,
        stepLabel: label,
        hazard: "Cross-contamination from raw to ready-to-eat foods; bare-hand contact; physical contaminants.",
        hazardType: "biological",
        criticalLimit: "Separate boards/utensils for raw vs RTE; no bare-hand contact with RTE; ≤4h cumulative room-temp exposure.",
        monitoring: "Observe handwashing, glove use, and separation; track room-temperature time.",
        correctiveAction: "Re-train staff; discard cross-contaminated RTE food; correct on the spot.",
        citation: "FDA Food Code 2022 §3-302.11, §3-301.11",
      };
    case "cooking": {
      const cat = input.cookCategory;
      if (cat) {
        const { limit, citation } = cookLimit(cat);
        return {
          step,
          stepLabel: label,
          hazard: "Survival of vegetative pathogens (Salmonella, E. coli O157:H7, Campylobacter) if undercooked.",
          hazardType: "biological",
          criticalLimit: limit,
          monitoring: "Probe the thickest part of each batch with a calibrated thermometer; record the reading.",
          correctiveAction: "Continue cooking until the minimum internal temperature is reached; re-check before service.",
          citation,
        };
      }
      return {
        step,
        stepLabel: label,
        hazard: "Survival of vegetative pathogens if undercooked.",
        hazardType: "biological",
        criticalLimit: "Cook to the FDA Food Code minimum for the food type (select a food category to set the exact limit).",
        monitoring: "Probe the thickest part of each batch with a calibrated thermometer; record the reading.",
        correctiveAction: "Continue cooking until the minimum internal temperature is reached; re-check before service.",
        citation: "FDA Food Code 2022 §3-401.11",
      };
    }
    case "cooling":
      return {
        step,
        stepLabel: label,
        hazard: "Spore-forming pathogen growth & toxin formation (C. perfringens, B. cereus) during slow cooling.",
        hazardType: "biological",
        criticalLimit: `Cool ${COOLING.stage1FromF}°F→${COOLING.stage1ToF}°F within ${COOLING.stage1Hours}h, then →${COOLING.stage2ToF}°F within ${COOLING.stage2Hours}h (≤${COOLING.totalHours}h total).`,
        monitoring: "Probe and time-stamp product temperature at start, the 2-hour mark, and the 6-hour mark.",
        correctiveAction: "If 70°F not reached by 2h, reheat to 165°F and restart cooling once; if 41°F not reached by 6h, discard.",
        citation: COOLING.citation,
      };
    case "cold-holding":
      return {
        step,
        stepLabel: label,
        hazard: "Pathogen multiplication on RTE/TCS food held in the danger zone.",
        hazardType: "biological",
        criticalLimit: `Hold cold TCS food at ≤ ${HOLDING.coldHoldMaxF}°F.`,
        monitoring: `Probe-check held product at least every 4 hours; record temperature.`,
        correctiveAction: "If >41°F, determine duration; rapidly chill if ≤4h, discard if >4h or unknown.",
        citation: "FDA Food Code 2022 §3-501.16(A)(2)",
      };
    case "date-marking":
      return {
        step,
        stepLabel: label,
        hazard: "Listeria monocytogenes growth on RTE/TCS food stored too long.",
        hazardType: "biological",
        criticalLimit: `RTE TCS food date-marked and used within ${DATE_MARKING.maxDays} days at ≤ ${DATE_MARKING.atOrBelowF}°F (prep day = day 1).`,
        monitoring: "Verify every RTE TCS container carries a discard date; FIFO rotation check each shift.",
        correctiveAction: "Discard any product past its 7-day date or missing a date mark.",
        citation: DATE_MARKING.citation,
      };
    case "reheating":
      return {
        step,
        stepLabel: label,
        hazard: "Survival/regrowth of pathogens when previously cooked & cooled food is reheated for hot holding.",
        hazardType: "biological",
        criticalLimit: `Reheat to ≥ ${REHEATING.minTempF}°F for ${REHEATING.holdSeconds}s within ${REHEATING.withinHours}h.`,
        monitoring: "Probe each batch after reheating; record temperature and time.",
        correctiveAction: "Continue reheating until 165°F is reached; discard if not at 165°F within 2 hours.",
        citation: REHEATING.citation,
      };
    case "hot-holding":
      return {
        step,
        stepLabel: label,
        hazard: "Pathogen growth & toxin formation on hot-held TCS food below 135°F.",
        hazardType: "biological",
        criticalLimit: `Hold hot TCS food at ≥ ${HOLDING.hotHoldMinF}°F.`,
        monitoring: "Probe-check held product at least every 4 hours; record temperature.",
        correctiveAction: "Reheat to 165°F if ≤4h below 135°F; discard if >4h or duration unknown.",
        citation: "FDA Food Code 2022 §3-501.16(A)(1)",
      };
    case "service":
      return {
        step,
        stepLabel: label,
        hazard: "Contamination at the point of service; time/temperature abuse on the line.",
        hazardType: "biological",
        criticalLimit: "Serve immediately or maintain ≤41°F / ≥135°F; use clean utensils; apply 4-hour rule if time-controlled.",
        monitoring: "Line checks each service period; verify hold temperatures and time markers.",
        correctiveAction: "Discard abused food; correct hold equipment; re-train staff.",
        citation: "FDA Food Code 2022 §3-501.19",
      };
  }
}

const VERIFICATION = [
  "Calibrate probe thermometers at least daily (ice-point 32°F or boiling-point method); log each calibration.",
  "Person-in-charge reviews monitoring logs daily and signs off.",
  "Conduct periodic internal record audits and an annual reassessment of the HACCP plan.",
  "Confirm corrective actions were completed and effective.",
];

const RECORDKEEPING = [
  "Temperature logs for each CCP (cooking, cooling, reheating, hot/cold holding).",
  "Receiving logs with delivery temperatures and rejected-product records.",
  "Thermometer calibration log.",
  "Corrective-action log describing the deviation, action taken, and disposition.",
  "Signed daily manager review of all logs.",
];

export { STEP_LABELS, PROCESS_LABELS, CCP_STEPS, STEP_ORDER };
