// Engine tests — validate the HACCP plan builder and temperature-log generator
// against hand-computed values and verbatim FDA Food Code 2022 critical limits.
// Run: npm test
import { buildPlan } from "../lib/calc/haccp.ts";
import { buildLogSheet } from "../lib/calc/templog.ts";
import { COOK_RULES, COOLING, REHEATING, HOLDING, DATE_MARKING, ctoF, ftoC } from "../lib/data/temps.ts";
import { FOOD_TYPES, getFoodType } from "../lib/data/foodTypes.ts";
import { STATES } from "../lib/data/states.ts";

let pass = 0,
  fail = 0;
function eq(actual: unknown, expected: unknown, msg: string) {
  if (actual === expected) pass++;
  else {
    fail++;
    console.error(`✗ ${msg}\n    expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
function ok(cond: boolean, msg: string) {
  eq(cond, true, msg);
}

// ---- verbatim FDA Food Code 2022 cooking critical limits ----
eq(COOK_RULES.poultry.minTempF, 165, "poultry min = 165°F");
eq(COOK_RULES.poultry.holdSeconds, 1, "poultry hold = 1s");
eq(COOK_RULES["ground-meat"].minTempF, 155, "ground meat min = 155°F");
eq(COOK_RULES["ground-meat"].holdSeconds, 17, "ground meat hold = 17s");
eq(COOK_RULES["beef-whole"].minTempF, 145, "whole-muscle beef min = 145°F");
eq(COOK_RULES.seafood.minTempF, 145, "seafood min = 145°F");
eq(COOK_RULES["eggs-hold"].minTempF, 155, "held eggs min = 155°F");
eq(COOK_RULES["tcs-produce"].minTempF, 135, "hot-held TCS produce min = 135°F");

// ---- holding / cooling / reheating / date-marking constants ----
eq(HOLDING.coldHoldMaxF, 41, "cold hold ≤ 41°F");
eq(HOLDING.hotHoldMinF, 135, "hot hold ≥ 135°F");
eq(COOLING.stage1ToF, 70, "cooling stage 1 target = 70°F");
eq(COOLING.totalHours, 6, "cooling total = 6h");
eq(REHEATING.minTempF, 165, "reheat = 165°F");
eq(DATE_MARKING.maxDays, 7, "RTE date marking = 7 days");

// ---- unit conversions ----
eq(ctoF(74), 165, "74°C ≈ 165°F (poultry)");
eq(ctoF(57), 135, "57°C ≈ 135°F (hot hold)");
eq(ftoC(41), 5, "41°F = 5°C");

// ---- plan builder: same-day chicken cook has 2 CCPs (cooking + hot-holding) ----
const chicken = getFoodType("chicken")!;
const chickenPlan = buildPlan({
  foodName: chicken.name,
  process: chicken.process,
  cookCategory: chicken.cookCategory,
  steps: chicken.steps,
});
eq(chickenPlan.ccpCount, 2, "same-day chicken → 2 CCPs");
const cook = chickenPlan.rows.find((r) => r.step === "cooking")!;
ok(cook.isCcp, "cooking is a CCP");
eq(cook.ccpNumber, 1, "cooking is CCP-1");
ok(cook.criticalLimit.includes("165°F"), "chicken cook limit cites 165°F");
const chickenHold = chickenPlan.rows.find((r) => r.step === "hot-holding")!;
eq(chickenHold.ccpNumber, 2, "hot-holding is CCP-2");
eq(chickenPlan.warnings.length, 0, "chicken plan has no warnings");

// ---- plan builder: complex soup has 4 CCPs (cook, cool, reheat, hot-hold) ----
const soup = getFoodType("soups-sauces")!;
const soupPlan = buildPlan({
  foodName: soup.name,
  process: soup.process,
  cookCategory: soup.cookCategory,
  steps: soup.steps,
});
eq(soupPlan.ccpCount, 4, "complex soup → 4 CCPs");
const cool = soupPlan.rows.find((r) => r.step === "cooling")!;
ok(cool.isCcp, "cooling is a CCP in complex flow");
ok(cool.criticalLimit.includes("135°F") && cool.criticalLimit.includes("70°F"), "cooling limit cites 135→70°F");
// rows must be in canonical process-flow order
const idxCook = soupPlan.rows.findIndex((r) => r.step === "cooking");
const idxCool = soupPlan.rows.findIndex((r) => r.step === "cooling");
const idxReheat = soupPlan.rows.findIndex((r) => r.step === "reheating");
ok(idxCook < idxCool && idxCool < idxReheat, "rows ordered cook → cool → reheat");

// ---- plan builder: no-cook deli salad has 2 CCPs (cold-hold + date-marking), no cook step ----
const deli = getFoodType("deli-salads")!;
const deliPlan = buildPlan({ foodName: deli.name, process: deli.process, steps: deli.steps });
eq(deliPlan.ccpCount, 2, "no-cook deli salad → 2 CCPs");
ok(!deliPlan.rows.some((r) => r.step === "cooking"), "no-cook flow has no cooking step");
const dateMark = deliPlan.rows.find((r) => r.step === "date-marking")!;
ok(dateMark.isCcp && dateMark.criticalLimit.includes("7 days"), "date marking CCP cites 7 days");

// ---- warning when a cook category is missing on a cooking flow ----
const noCat = buildPlan({ foodName: "Mystery", process: "same-day", steps: chicken.steps });
ok(noCat.warnings.length > 0, "missing cook category produces a warning");

// ---- temperature log generator ----
const log = buildLogSheet({
  foodName: "Chicken",
  cookCategory: "poultry",
  points: ["receiving", "cooking", "hot-holding"],
});
eq(log.rows.length, 3, "log sheet has 3 rows");
ok(log.rows[1].target.includes("165°F"), "log cooking target = 165°F");
ok(log.columns.includes("Temp (°F)"), "log has a temperature column");

// ---- data integrity ----
eq(STATES.length, 50, "50 state pages");
eq(new Set(STATES.map((s) => s.slug)).size, 50, "state slugs are unique");
eq(new Set(FOOD_TYPES.map((f) => f.slug)).size, FOOD_TYPES.length, "food-type slugs are unique");
ok(FOOD_TYPES.length >= 9, "at least 9 programmatic food-type pages");

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
