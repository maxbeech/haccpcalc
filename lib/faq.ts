// Clean, citable Q&A used both as on-page FAQ sections and as FAQPage JSON-LD
// for GEO (AI discoverability). Answers are short, factual and sourced.

export interface QA {
  q: string;
  a: string;
}

export const HOME_FAQ: QA[] = [
  {
    q: "What is a HACCP plan?",
    a: "HACCP (Hazard Analysis and Critical Control Points) is a preventive food safety system. A HACCP plan documents the seven principles: hazard analysis, critical control points (CCPs), critical limits, monitoring, corrective actions, verification, and record-keeping. HACCPCalc builds this plan from your food type and process steps.",
  },
  {
    q: "What are the FDA Food Code minimum cooking temperatures?",
    a: "Per the FDA Food Code 2022: poultry 165°F for 1 second; ground meat 155°F for 17 seconds; whole-muscle beef, pork, fish and eggs (immediate service) 145°F for 15 seconds; and TCS fruits/vegetables held hot at 135°F. Reheating for hot holding requires 165°F for 15 seconds.",
  },
  {
    q: "What is the temperature danger zone?",
    a: "The temperature danger zone is 41°F to 135°F — the range where pathogens multiply fastest. TCS (time/temperature control for safety) food should not stay in this range for more than four cumulative hours. Cold food is held at or below 41°F and hot food at or above 135°F.",
  },
  {
    q: "What are the seven HACCP principles?",
    a: "1) Conduct a hazard analysis. 2) Determine the critical control points. 3) Establish critical limits. 4) Establish monitoring procedures. 5) Establish corrective actions. 6) Establish verification procedures. 7) Establish record-keeping and documentation procedures.",
  },
  {
    q: "What is a critical control point (CCP)?",
    a: "A critical control point is a step where control can be applied to prevent, eliminate or reduce a food safety hazard to an acceptable level — for example cooking, cooling or hot holding. If control is lost at a CCP, the food can become unsafe, so each CCP has a measurable critical limit and a monitoring procedure.",
  },
  {
    q: "How do I cool cooked food safely?",
    a: "The FDA Food Code two-stage cooling rule (§3-501.14): cool from 135°F to 70°F within 2 hours, then from 70°F to 41°F within an additional 4 hours — 6 hours total. If 70°F is not reached within the first 2 hours, reheat to 165°F and restart cooling once.",
  },
  {
    q: "Is HACCPCalc a substitute for my health inspector?",
    a: "No. HACCPCalc produces a planning draft using the FDA Food Code 2022 model code. States and local jurisdictions adopt the Food Code with amendments, so always confirm your plan, critical limits and permit requirements with your local regulatory authority and, where required, a certified food protection manager.",
  },
];

export const COOK_FAQ: QA[] = [
  {
    q: "Why does poultry need a higher temperature than steak?",
    a: "Poultry frequently carries Salmonella and Campylobacter throughout the meat, so it must reach 165°F. A whole-muscle steak only carries surface bacteria, which are destroyed at 145°F once the exterior is seared, so its safe minimum is lower.",
  },
  {
    q: "Why is ground beef cooked hotter than a whole steak?",
    a: "Grinding mixes surface bacteria like E. coli O157:H7 throughout the meat, so there is no safe rare center. Ground meat must reach 155°F for 17 seconds, versus 145°F for an intact cut.",
  },
];
