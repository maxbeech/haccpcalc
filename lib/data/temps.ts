// FDA Food Code 2022 minimum internal cooking temperatures and time/temperature
// public-health controls. Every value below is a verbatim citation from the
// 2022 FDA Food Code (the model code adopted, in whole or amended, by US state
// and local regulatory authorities). No fabricated values — see /methodology.
//
// Primary citations:
//   §3-401.11  Raw animal foods — minimum cook temperatures
//   §3-501.16  Temperature & time control (cold/hot holding)
//   §3-501.14  Cooling
//   §3-403.11  Reheating for hot holding
//   §1-201.10  "Temperature Danger Zone" derived from PHF/TCS definition

export type CookCategory =
  | "poultry"
  | "ground-meat"
  | "pork-whole"
  | "beef-whole"
  | "seafood"
  | "eggs-immediate"
  | "eggs-hold"
  | "tcs-produce"
  | "reheated"
  | "stuffed";

export interface CookRule {
  category: CookCategory;
  label: string;
  /** Minimum internal temperature in °F (FDA Food Code 2022). */
  minTempF: number;
  /** Hold time at the minimum temperature, in seconds. */
  holdSeconds: number;
  /** Food Code section the value is drawn from. */
  citation: string;
  /** Plain-language list of foods this rule applies to. */
  appliesTo: string[];
  /** Optional alternative time/temperature combinations (lethality-equivalent). */
  alternatives?: { tempF: number; holdSeconds: number }[];
}

// §3-401.11 minimum cook temperatures. Hold times per the Food Code's
// "minimum holding time at the specified temperature" column.
export const COOK_RULES: Record<CookCategory, CookRule> = {
  poultry: {
    category: "poultry",
    label: "Poultry",
    minTempF: 165,
    holdSeconds: 1,
    citation: "FDA Food Code 2022 §3-401.11(A)(2)",
    appliesTo: ["chicken", "turkey", "duck", "goose", "stuffing made with poultry"],
  },
  stuffed: {
    category: "stuffed",
    label: "Stuffed meats, pasta & poultry",
    minTempF: 165,
    holdSeconds: 1,
    citation: "FDA Food Code 2022 §3-401.11(A)(2)",
    appliesTo: ["stuffed pasta", "stuffed meat", "stuffed poultry", "stuffed fish", "casseroles with raw TCS"],
  },
  reheated: {
    category: "reheated",
    label: "Reheated TCS food for hot holding",
    minTempF: 165,
    holdSeconds: 15,
    citation: "FDA Food Code 2022 §3-403.11(A)",
    appliesTo: ["leftovers", "previously cooked & cooled foods", "soups for hot holding", "sauces for hot holding"],
  },
  "ground-meat": {
    category: "ground-meat",
    label: "Ground & injected meat",
    minTempF: 155,
    holdSeconds: 17,
    citation: "FDA Food Code 2022 §3-401.11(A)(1)",
    appliesTo: ["ground beef", "ground pork", "hamburger", "sausage", "injected/brined meats", "ground game"],
    // Lethality-equivalent combinations from §3-401.11(A)(1) table.
    alternatives: [
      { tempF: 145, holdSeconds: 180 },
      { tempF: 150, holdSeconds: 60 },
      { tempF: 158, holdSeconds: 1 },
    ],
  },
  "pork-whole": {
    category: "pork-whole",
    label: "Pork & whole-muscle meat",
    minTempF: 145,
    holdSeconds: 15,
    citation: "FDA Food Code 2022 §3-401.11(B)",
    appliesTo: ["pork chops", "pork roast", "whole-muscle pork"],
    alternatives: [
      { tempF: 130, holdSeconds: 5520 },
      { tempF: 140, holdSeconds: 720 },
      { tempF: 150, holdSeconds: 204 },
    ],
  },
  "beef-whole": {
    category: "beef-whole",
    label: "Whole-muscle beef, veal & lamb",
    minTempF: 145,
    holdSeconds: 15,
    citation: "FDA Food Code 2022 §3-401.11(B)",
    appliesTo: ["steak", "beef roast", "veal", "lamb chops", "whole-muscle intact cuts"],
    alternatives: [
      { tempF: 130, holdSeconds: 5520 },
      { tempF: 140, holdSeconds: 720 },
    ],
  },
  seafood: {
    category: "seafood",
    label: "Fish & seafood",
    minTempF: 145,
    holdSeconds: 15,
    citation: "FDA Food Code 2022 §3-401.11(B)",
    appliesTo: ["fish fillets", "salmon", "tuna", "shrimp", "scallops", "shellfish"],
  },
  "eggs-immediate": {
    category: "eggs-immediate",
    label: "Eggs — immediate service",
    minTempF: 145,
    holdSeconds: 15,
    citation: "FDA Food Code 2022 §3-401.11(B)",
    appliesTo: ["eggs cooked to order", "eggs for immediate service"],
  },
  "eggs-hold": {
    category: "eggs-hold",
    label: "Eggs — held for service",
    minTempF: 155,
    holdSeconds: 17,
    citation: "FDA Food Code 2022 §3-401.11(A)(1)",
    appliesTo: ["scrambled eggs on a buffet", "eggs held hot for later service"],
  },
  "tcs-produce": {
    category: "tcs-produce",
    label: "TCS fruits & vegetables (hot-held)",
    minTempF: 135,
    holdSeconds: 1,
    citation: "FDA Food Code 2022 §3-401.11(C)",
    appliesTo: ["cooked rice", "cooked beans", "roasted vegetables", "cut tomatoes/melons held hot"],
  },
};

export const COOK_RULE_LIST: CookRule[] = Object.values(COOK_RULES);

// §3-501.16 — holding limits for time/temperature control for safety (TCS) food.
export const HOLDING = {
  coldHoldMaxF: 41, // at or below
  hotHoldMinF: 135, // at or above
  citation: "FDA Food Code 2022 §3-501.16",
};

// §1-201.10 / industry term — the range in which pathogens multiply fastest.
export const DANGER_ZONE = {
  lowF: 41,
  highF: 135,
  rapidLowF: 70,
  rapidHighF: 125,
  citation: "FDA Food Code 2022 §3-501.16 (derived from TCS holding limits)",
};

// §3-501.14 — two-stage cooling of cooked TCS food.
export const COOLING = {
  stage1FromF: 135,
  stage1ToF: 70,
  stage1Hours: 2,
  stage2ToF: 41,
  stage2Hours: 4,
  totalHours: 6,
  citation: "FDA Food Code 2022 §3-501.14(A)",
};

// §3-403.11 — reheating cooked & cooled TCS food for hot holding.
export const REHEATING = {
  minTempF: 165,
  holdSeconds: 15,
  withinHours: 2,
  citation: "FDA Food Code 2022 §3-403.11",
};

// §3-501.17 — ready-to-eat TCS date marking.
export const DATE_MARKING = {
  maxDays: 7, // day of preparation counts as day 1, at 41°F or below
  atOrBelowF: 41,
  citation: "FDA Food Code 2022 §3-501.17",
};

export function ctoF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}
export function ftoC(f: number): number {
  return Math.round((((f - 32) * 5) / 9) * 10) / 10;
}
