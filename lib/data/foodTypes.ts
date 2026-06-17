// Food categories powering the programmatic /haccp-plan-template/[food-type]
// pages and the plan builder's defaults. Each maps to an FDA process category
// and (where cooked) a CookCategory whose critical limit comes from the Food Code.

import { CookCategory } from "./temps";
import { ProcessCategory, StepId } from "../calc/haccp";

export interface FoodType {
  slug: string;
  name: string;
  /** Plural/keyword form used in titles, e.g. "chicken & poultry". */
  keyword: string;
  process: ProcessCategory;
  cookCategory?: CookCategory;
  steps: StepId[];
  /** One-paragraph intro for the SEO page. */
  summary: string;
  examples: string[];
}

const COOK_FLOW: StepId[] = [
  "receiving",
  "cold-storage",
  "thawing",
  "preparation",
  "cooking",
  "hot-holding",
  "service",
];

const COMPLEX_FLOW: StepId[] = [
  "receiving",
  "cold-storage",
  "preparation",
  "cooking",
  "cooling",
  "cold-holding",
  "date-marking",
  "reheating",
  "hot-holding",
  "service",
];

const RTE_FLOW: StepId[] = [
  "receiving",
  "cold-storage",
  "preparation",
  "cold-holding",
  "date-marking",
  "service",
];

export const FOOD_TYPES: FoodType[] = [
  {
    slug: "chicken",
    name: "Chicken & poultry",
    keyword: "chicken",
    process: "same-day",
    cookCategory: "poultry",
    steps: COOK_FLOW,
    summary:
      "Poultry must reach 165°F for 1 second — the highest minimum cook temperature in the Food Code — because it commonly carries Salmonella and Campylobacter. Cooking is the critical control point on a same-day cook-and-serve flow.",
    examples: ["rotisserie chicken", "grilled chicken breast", "chicken wings", "turkey"],
  },
  {
    slug: "ground-beef",
    name: "Ground beef & burgers",
    keyword: "ground beef",
    process: "same-day",
    cookCategory: "ground-meat",
    steps: COOK_FLOW,
    summary:
      "Grinding spreads surface bacteria like E. coli O157:H7 throughout the meat, so ground beef must hit 155°F for 17 seconds — hotter than a whole steak. Cooking is the CCP.",
    examples: ["hamburgers", "meatballs", "meatloaf", "taco meat"],
  },
  {
    slug: "seafood",
    name: "Fish & seafood",
    keyword: "seafood",
    process: "same-day",
    cookCategory: "seafood",
    steps: COOK_FLOW,
    summary:
      "Finfish and shellfish are cooked to 145°F for 15 seconds. Receiving temperature control and cross-contamination prevention matter as much as the cook step for seafood.",
    examples: ["salmon fillet", "fried shrimp", "fish tacos", "scallops"],
  },
  {
    slug: "pork",
    name: "Pork & whole-muscle meat",
    keyword: "pork",
    process: "same-day",
    cookCategory: "pork-whole",
    steps: COOK_FLOW,
    summary:
      "Whole-muscle pork, beef, veal and lamb cook to 145°F for 15 seconds. The 2022 Food Code also allows lethality-equivalent lower temperatures held longer (e.g. 130°F for 112 minutes).",
    examples: ["pork chops", "pork roast", "bacon", "ham steak"],
  },
  {
    slug: "beef-steak",
    name: "Beef steak & roasts",
    keyword: "steak",
    process: "same-day",
    cookCategory: "beef-whole",
    steps: COOK_FLOW,
    summary:
      "Intact whole-muscle beef cooks to 145°F for 15 seconds. Because pathogens stay on the surface of intact cuts, a seared exterior plus this internal temperature controls the biological hazard.",
    examples: ["ribeye", "sirloin", "prime rib", "beef roast"],
  },
  {
    slug: "eggs",
    name: "Eggs & egg dishes",
    keyword: "eggs",
    process: "same-day",
    cookCategory: "eggs-immediate",
    steps: COOK_FLOW,
    summary:
      "Eggs cooked to order reach 145°F for 15 seconds; eggs held for later service (a buffet) must hit 155°F for 17 seconds. Salmonella is the hazard of concern.",
    examples: ["fried eggs", "scrambled eggs", "omelets", "quiche"],
  },
  {
    slug: "soups-sauces",
    name: "Soups, stocks & sauces",
    keyword: "soups and sauces",
    process: "complex",
    cookCategory: "tcs-produce",
    steps: COMPLEX_FLOW,
    summary:
      "Batch-cooked soups and sauces are classic complex (Process 3) foods: they are cooked, cooled, cold-held, then reheated. Cooling and reheating are the high-risk CCPs where C. perfringens grows if control is lost.",
    examples: ["chicken stock", "marinara", "chili", "gravy"],
  },
  {
    slug: "rice-grains",
    name: "Cooked rice & grains",
    keyword: "cooked rice",
    process: "complex",
    cookCategory: "tcs-produce",
    steps: COMPLEX_FLOW,
    summary:
      "Cooked rice and pasta support Bacillus cereus, whose spores survive cooking and germinate during slow cooling. The cooling CCP (135°F→70°F in 2h, →41°F in 6h total) is the make-or-break step.",
    examples: ["fried rice", "rice pilaf", "cooked pasta", "quinoa"],
  },
  {
    slug: "deli-salads",
    name: "Deli & RTE salads",
    keyword: "deli salads",
    process: "no-cook",
    steps: RTE_FLOW,
    summary:
      "Chicken salad, potato salad and cut leafy greens are no-cook (Process 1) ready-to-eat TCS foods. With no kill step, cold holding (≤41°F) and 7-day date marking are the critical control points against Listeria.",
    examples: ["chicken salad", "potato salad", "cut leafy greens", "pasta salad"],
  },
  {
    slug: "cut-produce",
    name: "Cut fruits & vegetables",
    keyword: "cut produce",
    process: "no-cook",
    steps: RTE_FLOW,
    summary:
      "Cut melons, cut tomatoes and cut leafy greens become TCS foods once cut. Cold holding and date marking control pathogen growth on these no-cook RTE items.",
    examples: ["cut melon", "sliced tomatoes", "salad greens", "fruit cups"],
  },
  {
    slug: "dairy",
    name: "Dairy & cheese",
    keyword: "dairy",
    process: "no-cook",
    steps: RTE_FLOW,
    summary:
      "Soft cheeses and milk-based RTE items are TCS foods held cold. Receiving temperature, cold holding (≤41°F) and date marking are the controls; pasteurization status should be verified at receiving.",
    examples: ["soft cheese", "milk", "yogurt", "cream-based dips"],
  },
  {
    slug: "deli-meats",
    name: "Sliced deli meats",
    keyword: "deli meats",
    process: "no-cook",
    steps: RTE_FLOW,
    summary:
      "Sliced ready-to-eat deli meats are a top Listeria vehicle. As no-cook RTE TCS food, cold holding at ≤41°F and strict 7-day date marking are the critical control points.",
    examples: ["sliced turkey", "ham", "roast beef", "salami"],
  },
];

export function getFoodType(slug: string): FoodType | undefined {
  return FOOD_TYPES.find((f) => f.slug === slug);
}
