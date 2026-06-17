// Temperature-log generator. Given a food type and the monitoring points that
// apply, it produces a printable log sheet definition: rows (one per CCP/check
// point) with the required temperature target, suggested check interval and a
// corrective-action prompt. Targets are pulled from the same Food Code data as
// the HACCP engine so the two never drift apart.

import { COOK_RULES, CookCategory, HOLDING, COOLING, REHEATING } from "../data/temps";

export type LogPointId =
  | "receiving"
  | "cooking"
  | "cooling-2h"
  | "cooling-6h"
  | "hot-holding"
  | "cold-holding"
  | "reheating"
  | "cold-storage";

export interface LogRow {
  id: LogPointId;
  label: string;
  target: string;
  /** Suggested monitoring frequency in plain language. */
  interval: string;
  correctiveAction: string;
}

export interface LogSheet {
  title: string;
  rows: LogRow[];
  columns: string[];
  citation: string;
}

const FIXED: Record<Exclude<LogPointId, "cooking">, Omit<LogRow, "id">> = {
  receiving: {
    label: "Receiving",
    target: `≤ ${HOLDING.coldHoldMaxF}°F (frozen: solid)`,
    interval: "Every delivery",
    correctiveAction: "Reject if > 41°F",
  },
  "cold-storage": {
    label: "Cold storage units",
    target: `≤ ${HOLDING.coldHoldMaxF}°F`,
    interval: "Every 4 hours",
    correctiveAction: "Move product; repair unit",
  },
  "cooling-2h": {
    label: `Cooling — 2 hour check`,
    target: `≤ ${COOLING.stage1ToF}°F by 2h`,
    interval: "At 2 hours",
    correctiveAction: "Reheat to 165°F & restart, or discard",
  },
  "cooling-6h": {
    label: `Cooling — 6 hour check`,
    target: `≤ ${COOLING.stage2ToF}°F by 6h`,
    interval: "At 6 hours",
    correctiveAction: "Discard if not ≤ 41°F",
  },
  "hot-holding": {
    label: "Hot holding",
    target: `≥ ${HOLDING.hotHoldMinF}°F`,
    interval: "Every 4 hours",
    correctiveAction: "Reheat to 165°F if ≤4h; else discard",
  },
  "cold-holding": {
    label: "Cold holding",
    target: `≤ ${HOLDING.coldHoldMaxF}°F`,
    interval: "Every 4 hours",
    correctiveAction: "Chill if ≤4h; else discard",
  },
  reheating: {
    label: "Reheating",
    target: `≥ ${REHEATING.minTempF}°F within ${REHEATING.withinHours}h`,
    interval: "Every batch",
    correctiveAction: "Keep heating to 165°F; discard after 2h",
  },
};

export function buildLogSheet(opts: {
  foodName: string;
  cookCategory?: CookCategory;
  points: LogPointId[];
}): LogSheet {
  const rows: LogRow[] = opts.points.map((id) => {
    if (id === "cooking") {
      const r = opts.cookCategory ? COOK_RULES[opts.cookCategory] : undefined;
      return {
        id,
        label: "Cooking",
        target: r ? `≥ ${r.minTempF}°F for ${r.holdSeconds}s` : "FDA Food Code minimum",
        interval: "Every batch",
        correctiveAction: "Continue cooking to minimum temp",
      };
    }
    return { id, ...FIXED[id] };
  });
  return {
    title: `${opts.foodName} — Food Safety Temperature Log`,
    rows,
    columns: ["Date", "Time", "Food item", "Temp (°F)", "Corrective action", "Initials"],
    citation: "FDA Food Code 2022 §3-401.11, §3-501.14, §3-501.16, §3-403.11",
  };
}
