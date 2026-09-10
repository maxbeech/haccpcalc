// Long-form guide content for /guides/[slug]. Each post is a small set of
// sections rendered as an article with FAQ-style headings — citable, static,
// and targeting long-tail food-safety search queries.

import type { QA } from "@/lib/faq";

export interface Section {
  heading: string;
  body: string[];
}

export interface PostTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface PostLink {
  text: string;
  href: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: Section[];
  table?: PostTable;
  faq?: QA[];
  relatedLinks?: PostLink[];
  sources?: PostLink[];
}

export const POSTS: Post[] = [
  {
    slug: "7-haccp-principles",
    title: "The 7 HACCP Principles, Explained",
    description:
      "A plain-language walkthrough of the seven HACCP principles, with the FDA Food Code values you need for each one.",
    updated: "2026-06-17",
    sections: [
      {
        heading: "1. Conduct a hazard analysis",
        body: [
          "List the biological, chemical and physical hazards that are reasonably likely to occur at each step of your process flow, from receiving to service.",
          "For most foodservice operations the dominant hazards are biological: vegetative pathogens (Salmonella, E. coli O157:H7, Campylobacter) and spore-formers (Clostridium perfringens, Bacillus cereus).",
        ],
      },
      {
        heading: "2. Determine the critical control points",
        body: [
          "A CCP is the last step where you can control a hazard. Cooking, cooling, reheating and hot/cold holding are the usual CCPs. For a no-cook ready-to-eat food, cold holding and date marking become the CCPs because there is no kill step.",
        ],
      },
      {
        heading: "3. Establish critical limits",
        body: [
          "A critical limit is a measurable boundary — almost always a temperature and time. Poultry: 165°F for 1 second. Ground meat: 155°F for 17 seconds. Whole-muscle meat, fish and eggs (immediate service): 145°F for 15 seconds. Cooling: 135°F→70°F in 2 hours, then →41°F within 6 hours total.",
        ],
      },
      {
        heading: "4. Establish monitoring procedures",
        body: [
          "Decide what you measure, how, how often and who does it. Probe the thickest part of each batch with a calibrated thermometer and record the reading on a temperature log.",
        ],
      },
      {
        heading: "5. Establish corrective actions",
        body: [
          "Define in advance what happens when a limit is missed: continue cooking to temperature, rapidly chill, reheat to 165°F, or discard. Corrective actions are logged.",
        ],
      },
      {
        heading: "6. Establish verification procedures",
        body: [
          "Verification confirms the system works: calibrate thermometers daily, review logs, and reassess the plan at least annually or when the menu changes.",
        ],
      },
      {
        heading: "7. Establish record-keeping",
        body: [
          "Keep temperature logs, receiving logs, calibration logs and corrective-action records. Records are what demonstrate compliance to an inspector.",
        ],
      },
    ],
  },
  {
    slug: "temperature-danger-zone",
    title: "The Temperature Danger Zone (41°F–135°F)",
    description:
      "What the temperature danger zone is, the four-hour rule, and how to keep TCS food out of it.",
    updated: "2026-06-17",
    sections: [
      {
        heading: "What is the danger zone?",
        body: [
          "The temperature danger zone is 41°F to 135°F. Within this range, bacteria on time/temperature control for safety (TCS) food multiply rapidly, and between 70°F and 125°F they double in as little as 20 minutes.",
        ],
      },
      {
        heading: "The four-hour rule",
        body: [
          "TCS food should not spend more than four cumulative hours in the danger zone. After four hours it must be discarded — you cannot make it safe by reheating, because some toxins are heat-stable.",
        ],
      },
      {
        heading: "Staying out of the zone",
        body: [
          "Hold cold food at or below 41°F and hot food at or above 135°F. Cool cooked food quickly using the two-stage rule, and reheat for hot holding to 165°F within two hours.",
        ],
      },
    ],
  },
  {
    slug: "haccp-vs-servsafe",
    title: "HACCP vs ServSafe: What's the Difference?",
    description:
      "HACCP is a food safety system; ServSafe is a certification program. Here's how they relate.",
    updated: "2026-06-17",
    sections: [
      {
        heading: "HACCP is a system",
        body: [
          "HACCP (Hazard Analysis and Critical Control Points) is a preventive food safety management system built around seven principles. A HACCP plan is a document specific to your menu and process flow.",
        ],
      },
      {
        heading: "ServSafe is a certification",
        body: [
          "ServSafe is a training and certification program run by the National Restaurant Association. Many states require at least one certified food protection manager on staff; ServSafe is one accredited way to meet that requirement.",
          "They are complementary: ServSafe teaches the principles, and a HACCP plan applies them to your specific operation. HACCPCalc helps you build the plan; it does not provide certification.",
        ],
      },
    ],
  },
  {
    slug: "food-cooling-rule",
    title: "The FDA Two-Stage Cooling Rule",
    description:
      "Cool cooked TCS food from 135°F to 70°F in 2 hours, then to 41°F within 6 hours total — here's how and why.",
    updated: "2026-06-17",
    sections: [
      {
        heading: "The rule",
        body: [
          "FDA Food Code §3-501.14: cool cooked TCS food from 135°F to 70°F within 2 hours, then from 70°F to 41°F within a further 4 hours — a maximum of 6 hours total.",
          "If the food does not reach 70°F within the first 2 hours, reheat it to 165°F and begin cooling again, one time only. If it never reaches 41°F within 6 hours, discard it.",
        ],
      },
      {
        heading: "How to cool fast",
        body: [
          "Divide large batches into shallow pans, use ice baths or ice paddles, leave product uncovered while cooling in the walk-in, and stir frequently. Soups, stocks, chili, rice and large roasts are the highest-risk items.",
        ],
      },
    ],
  },
];

const WEEK2_POSTS: Post[] = [
  {
    slug: "haccp-plan-template",
    title: "How to Use a HACCP Plan Template (Restaurant Quick-Start)",
    description:
      "A HACCP plan template gives your food safety system a starting framework. What each section must contain, a 4-step restaurant build process, and how to adapt it to your kitchen.",
    updated: "2026-07-21",
    sections: [
      {
        heading: "What a HACCP plan template contains",
        body: [
          "A complete template has seven sections, one for each HACCP principle: a hazard analysis worksheet, a CCP determination record, a critical limits table, a monitoring log, a corrective action log, a verification schedule, and a record-keeping index. Some templates add a process flow diagram at the front.",
          "HACCPCalc generates all seven sections from your menu input, so you can start with a pre-filled template rather than a blank page.",
        ],
      },
      {
        heading: "Step 1: Map your process flow",
        body: [
          "List every step each menu category goes through, from receiving to service. Typical steps are: receive → store → thaw → prep → cook → hold → serve. High-risk items like raw proteins and ready-to-eat foods need their own flow diagram.",
        ],
      },
      {
        heading: "Step 2: Identify hazards and CCPs",
        body: [
          "At each step, ask: what biological, chemical or physical hazard could occur here? Then apply the CCP decision tree. Cooking is almost always a CCP for raw proteins. Cold holding is a CCP for ready-to-eat items. Receiving is a CCP if you accept raw shellfish.",
        ],
      },
      {
        heading: "Step 3: Set critical limits and monitoring",
        body: [
          "Set a measurable limit for each CCP — a temperature, time, or pH. Assign a monitoring task, a frequency, and a responsible employee. Record every reading. Without logs, you cannot prove the system is working during an inspection.",
        ],
      },
      {
        heading: "Step 4: Define corrective actions and verify",
        body: [
          "Write down what happens when a limit is missed — recook, rapidly chill, or discard — before the situation arises. Verify the system monthly by reviewing logs and calibrating thermometers. Reassess the full plan at least annually.",
        ],
      },
      {
        heading: "How to adapt it to your kitchen",
        body: [
          "Fill in your specific menu items, process steps, and CCPs. A generic template lists cooking as a CCP — your version should name the dish, the required internal temperature, and who checks it with which thermometer.",
          "Review the hazard analysis for each item. A raw chicken marinade has different hazards from a shelf-stable vinegar dressing. Do not copy a template blindly; adapt the hazard column to your actual ingredients and process.",
        ],
      },
      {
        heading: "Update whenever the menu changes",
        body: [
          "The plan is a living document. Any time a new menu item, supplier, or process step is added, revisit the hazard analysis and CCP table. Inspectors check that the written plan matches what is actually happening in the kitchen.",
        ],
      },
    ],
  },
  {
    slug: "food-safety-plan-template",
    title: "Food Safety Plan Template for Small Kitchens",
    description:
      "A food safety plan template covers hazards, CCPs and monitoring procedures. Here's what a simple, compliant plan looks like for small food businesses.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "Who needs a food safety plan?",
        body: [
          "The FDA Food Safety Modernization Act (FSMA) Preventive Controls for Human Food rule requires a written food safety plan for most food facilities. Small businesses (fewer than 500 FTE) had a later compliance deadline but are now covered. Restaurants regulated by the local health department follow state and local codes rather than FSMA, but a written plan is still required or strongly expected.",
        ],
      },
      {
        heading: "What the template should include",
        body: [
          "At minimum: a hazard analysis (biological, chemical, physical and allergen hazards for each process step), preventive controls for each significant hazard, monitoring procedures, corrective actions, verification activities, and a recall plan.",
          "For a restaurant HACCP plan the structure is similar: process flow diagrams, CCP identification, critical limits, monitoring logs, corrective actions, and record-keeping.",
        ],
      },
      {
        heading: "Simplifying for small operations",
        body: [
          "A small kitchen with a limited menu may have only two or three CCPs. Focus your plan on the highest-risk items: raw proteins that are cooked and served hot, ready-to-eat items held cold, and any foods that are cooled and reheated. A simple one-page template per process category is easier to follow than a 40-page manual.",
        ],
      },
    ],
  },
  {
    slug: "critical-control-point-examples",
    title: "Critical Control Points: 6 Real-World Examples",
    description:
      "Six concrete critical control point examples from common foodservice operations, with the critical limits, monitoring methods, and corrective actions.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "1. Cooking raw poultry",
        body: [
          "CCP: cooking. Critical limit: internal temperature ≥ 165°F for at least 1 second (FDA Food Code). Monitor: probe every batch with a calibrated thermometer. Corrective action: continue cooking until limit is met.",
        ],
      },
      {
        heading: "2. Cooling cooked proteins",
        body: [
          "CCP: cooling. Critical limit: 135°F → 70°F within 2 hours, then → 41°F within 6 hours total. Monitor: time-stamped temperature checks during the cooling cycle. Corrective action: if not at 70°F in 2 hours, reheat to 165°F and begin again — once only.",
        ],
      },
      {
        heading: "3. Hot holding soup or chili",
        body: [
          "CCP: hot holding. Critical limit: ≥ 135°F at all times. Monitor: temperature checks every 2 hours (or per your HACCP plan). Corrective action: reheat to 165°F within 2 hours; discard if the product has been below 135°F for more than 4 cumulative hours.",
        ],
      },
      {
        heading: "4. Cold holding ready-to-eat deli items",
        body: [
          "CCP: cold holding. Critical limit: ≤ 41°F. Monitor: refrigerator temperature logged at opening and mid-shift. Corrective action: transfer to a compliant cooler immediately; discard if above 41°F for more than 4 hours.",
        ],
      },
      {
        heading: "5. Receiving raw shellfish",
        body: [
          "CCP: receiving. Critical limit: live shellfish at ≤ 45°F air temperature; shellstock tags present. Monitor: check tag and temperature on each delivery. Corrective action: reject the shipment and note on the receiving log.",
        ],
      },
      {
        heading: "6. Reheating leftovers for hot holding",
        body: [
          "CCP: reheating. Critical limit: ≥ 165°F throughout in ≤ 2 hours. Monitor: probe the thickest part before placing on the steam table. Corrective action: continue reheating; discard if 2-hour window is exceeded.",
        ],
      },
    ],
  },
  {
    slug: "foodborne-illness-prevention",
    title: "Foodborne Illness Prevention in Restaurants",
    description:
      "The most effective foodborne illness prevention practices for restaurant kitchens: personal hygiene, temperature control, and cross-contamination barriers.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "Personal hygiene is the first barrier",
        body: [
          "Handwashing is the single most effective foodborne illness control: soap and warm water for at least 20 seconds after using the restroom, handling raw proteins, touching your face, or returning from a break.",
          "A sick-employee policy is equally critical. Anyone with vomiting or diarrhea must be excluded from food handling; anyone with a diagnosed infection by Salmonella, Shigella, E. coli O157:H7, hepatitis A, or norovirus must be excluded from the premises. These are legal requirements under the FDA Food Code.",
        ],
      },
      {
        heading: "Temperature control eliminates pathogens",
        body: [
          "Cook to the correct internal temperature for the food type, cool rapidly, hold at the right temperature, and never let TCS food accumulate time in the danger zone (41°F – 135°F). Most foodborne illness outbreaks involve temperature abuse at one of these stages.",
        ],
      },
      {
        heading: "Prevent cross-contamination with physical barriers",
        body: [
          "Use color-coded cutting boards (red for raw proteins, green for produce, yellow for poultry). Store raw proteins below ready-to-eat foods in the refrigerator, in order from highest required cooking temperature (ground meat → whole-cut beef → poultry) from bottom to top. Sanitize food-contact surfaces between raw and ready-to-eat tasks.",
        ],
      },
      {
        heading: "Allergen control is a separate hazard",
        body: [
          "The FDA recognizes nine major food allergens: peanuts, tree nuts, milk, eggs, fish, shellfish, wheat, soybeans, and sesame. Cross-contact (allergen residue on equipment or in shared oil) can be fatal. Use dedicated equipment, label clearly, and train staff to take allergy requests seriously.",
        ],
      },
    ],
  },
  {
    slug: "food-safety-audit-checklist",
    title: "Restaurant Food Safety Audit Checklist",
    description:
      "A 30-point restaurant food safety audit checklist covering receiving, storage, cooking, cooling, sanitising and personal hygiene, aligned with FDA Food Code.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "Receiving (check on every delivery)",
        body: [
          "□ Delivery vehicle is clean and temperature-controlled. □ Frozen food is solid with no thaw marks. □ Refrigerated TCS food arrives at or below 41°F. □ Raw proteins are not stored above ready-to-eat items in the delivery. □ Shellstock tags are present and retained. □ Damaged or out-of-date items are rejected and noted on the log.",
        ],
      },
      {
        heading: "Storage",
        body: [
          "□ Walk-in cooler holds ≤ 41°F. □ Walk-in freezer holds ≤ 0°F. □ Raw proteins stored below and separate from ready-to-eat foods. □ All items labeled with name and date. □ FIFO rotation is in use. □ Dry storage is clean, dry, and off the floor.",
        ],
      },
      {
        heading: "Cooking, hot holding, and cooling",
        body: [
          "□ Thermometer is calibrated and probe is cleaned between uses. □ All proteins cooked to required internal temperature. □ Hot-hold units maintain ≥ 135°F. □ Cooling logs complete with time-stamped readings. □ No product spent more than 2 hours between 135°F and 70°F.",
        ],
      },
      {
        heading: "Sanitation and personal hygiene",
        body: [
          "□ Sanitizer concentration verified by test strip (chlorine 50–100 ppm, quat 200–400 ppm, or per label). □ Handwashing sinks are stocked and accessible. □ No bare-hand contact with ready-to-eat foods. □ No ill employees on the line. □ Hair restraints in use. □ HACCP/food safety plan is current and on-site.",
        ],
      },
    ],
  },
  {
    slug: "cross-contamination-prevention",
    title: "Cross-Contamination in Food Safety: How to Stop It",
    description:
      "Cross-contamination transfers pathogens from one surface or food to another. Learn the three routes and the practical barriers that block each one.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "The three routes of cross-contamination",
        body: [
          "Food-to-food: raw protein drips onto ready-to-eat food in the refrigerator. Equipment-to-food: a cutting board used for raw chicken is used for salad without washing, rinsing and sanitizing in between. Person-to-food: a food handler who touched raw beef then handles bread without washing hands.",
        ],
      },
      {
        heading: "Barriers for food-to-food contamination",
        body: [
          "Store raw proteins in covered containers, sealed and placed below ready-to-eat food. In the walk-in, order from bottom to top: raw ground beef and pork → whole cuts → raw poultry (highest required cooking temperature goes on the bottom). This limits the damage if anything leaks.",
        ],
      },
      {
        heading: "Barriers for equipment-to-food contamination",
        body: [
          "Use separate, color-coded cutting boards for different food categories and sanitize all food-contact surfaces after handling raw proteins. The wash-rinse-sanitize sequence in a three-compartment sink removes residual protein that harbors bacteria.",
        ],
      },
      {
        heading: "Barriers for person-to-food contamination",
        body: [
          "Hand washing is the primary control. Employees must wash after handling raw proteins, after using the restroom, after touching their face or phone, and after any activity that could transfer contamination. Single-use gloves add a layer but are not a substitute for hand washing — change gloves between raw and ready-to-eat tasks.",
        ],
      },
    ],
  },
  {
    slug: "servsafe-food-manager-certification",
    title: "ServSafe Food Manager: Exam & Certification Guide",
    description:
      "What the ServSafe Food Protection Manager certification covers, how the exam works, what it costs, and which states require a certified manager on site.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "What ServSafe Food Manager certification covers",
        body: [
          "The ServSafe Food Protection Manager course and exam cover the same principles as HACCP: personal hygiene, cross-contamination, time and temperature control, cleaning and sanitizing, and pest control. The exam has 90 questions (80 scored); a score of 75% or higher (60 questions correct) earns certification.",
        ],
      },
      {
        heading: "Who must be certified",
        body: [
          "Most states require at least one certified food protection manager per establishment. Common state-approved certifications include ServSafe, Prometric SafeMark, and a handful of state-specific programs. Check your local health code for the exact requirement — some jurisdictions require one certified person per shift, not just per location.",
        ],
      },
      {
        heading: "Cost and renewal",
        body: [
          "The National Restaurant Association offers ServSafe study materials, an online course, and a proctored exam. Study materials and the exam fee together typically run $125–$175, though prices vary by format and whether an instructor leads the course. Certification is valid for five years, after which you must retake the exam.",
        ],
      },
    ],
  },
  {
    slug: "food-handler-training-online",
    title: "Food Handler Training Online: What You'll Learn",
    description:
      "Online food handler training covers personal hygiene, temperature control, cross-contamination, cleaning and sanitising. What to expect and how long it takes.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "What food handler training covers",
        body: [
          "A standard food handler course covers five major topics: personal hygiene (handwashing, illness reporting, proper attire), time and temperature control (danger zone, cooking temps, cooling), cross-contamination prevention (storage order, cutting board hygiene), cleaning and sanitizing (wash-rinse-sanitize sequence, sanitizer concentrations), and pest prevention.",
        ],
      },
      {
        heading: "How long it takes",
        body: [
          "Most online food handler courses run 2–3 hours and include a short quiz at the end. Some states (California, Illinois, Texas, Arizona) require a specific state-approved card; others accept any accredited ANSI-CFP training. The card is typically valid for 2–3 years.",
        ],
      },
      {
        heading: "Who needs it",
        body: [
          "Many states require all food handlers — anyone who works with or around unpackaged food — to have a food handler card within 30 days of hire. Managers with a full food protection manager certification (such as ServSafe) are usually exempt from the basic food handler requirement. HACCPCalc is designed for the manager level, but training links for handlers are on the resources page.",
        ],
      },
    ],
  },
  {
    slug: "restaurant-food-safety-checklist",
    title: "Daily Food Safety Checklist for Restaurants",
    description:
      "A practical daily food safety checklist for restaurants: opening checks, mid-shift temperature logs, closing sanitation tasks, and what to record.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "Opening checks",
        body: [
          "□ Walk-in cooler and freezer temperatures logged and within range (≤ 41°F and ≤ 0°F). □ Hot-hold unit pre-heated before loading. □ Thermometers calibrated (ice-water method: 32°F ± 2°F). □ Handwashing stations stocked with soap, paper towels and hot water. □ No foods past use-by date in storage. □ Sanitizer solution prepared and concentration verified.",
        ],
      },
      {
        heading: "Mid-shift temperature logs",
        body: [
          "□ Hot-hold temperatures checked every 2 hours (must be ≥ 135°F). □ Cold-hold temperatures spot-checked (must be ≤ 41°F). □ Any cooling product time-stamped and temperature tracked through both stages. □ Sanitizer solution refreshed and re-tested if more than 2 hours old or visibly soiled.",
        ],
      },
      {
        heading: "Closing tasks",
        body: [
          "□ All food properly labeled with name and date. □ Raw proteins stored below ready-to-eat items. □ Cooling logs finalized — any product that did not reach 41°F in 6 hours is discarded. □ Food-contact surfaces washed, rinsed, and sanitized. □ Temperature logs filed (retain for at least 90 days or per your HACCP plan). □ Walk-in and reach-in door seals checked.",
        ],
      },
    ],
  },
  {
    slug: "haccp-reheating-temperature",
    title: "HACCP Reheating: 165°F in 2 Hours Explained",
    description:
      "FDA Food Code requires reheating TCS food to 165°F within two hours for hot holding. Here's why the limit exists and what to do if you miss it.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "The reheating rule",
        body: [
          "Under the FDA Food Code, TCS food that was previously cooked and cooled must be reheated to an internal temperature of 165°F throughout within 2 hours before it can be placed into hot holding. This applies to leftovers, batch-cooked proteins, soups, and sauces.",
          "The 165°F target kills vegetative pathogens that may have grown during the cooling or storage phase. The 2-hour time limit prevents the food from lingering in the danger zone (41°F – 135°F) while slowly warming up.",
        ],
      },
      {
        heading: "Why steamtables are not for reheating",
        body: [
          "A hot-holding unit (steam table, heat lamp, warming shelf) is designed to maintain food that is already hot. Most hold at 135°F – 150°F, which is not hot enough to rapidly reheat from refrigerator temperature. Using a hot-holding unit to reheat food means the product spends too long in the danger zone. Use a stovetop, oven, steamer, or microwave for reheating, then transfer to the holding unit.",
        ],
      },
      {
        heading: "What to do if the 2-hour window is missed",
        body: [
          "If 2 hours pass and the internal temperature has not reached 165°F, discard the product — you cannot begin again. Log the discarded item on your corrective action record, note the time-temperature readings, and document why the limit was missed (broken oven, too large a batch). Revise your reheating method to prevent recurrence.",
        ],
      },
    ],
  },
  {
    slug: "food-receiving-inspection",
    title: "Food Receiving Inspection: What to Check",
    description:
      "A step-by-step food receiving inspection checklist: temperatures, packaging integrity, supplier documentation, and what to reject on delivery.",
    updated: "2026-06-20",
    sections: [
      {
        heading: "Temperature checks at the dock",
        body: [
          "Refrigerated TCS food must arrive at ≤ 41°F. Frozen food must arrive solidly frozen with no visible thaw marks, refreezing signs, or large ice crystals inside the package. Live shellfish must arrive at an air temperature ≤ 45°F and must be alive. Use a calibrated probe thermometer — insert it between packages or into a punctured outer layer to check product temperature, not air temperature.",
        ],
      },
      {
        heading: "Packaging and labeling inspection",
        body: [
          "Reject: cans that are swollen, leaking, heavily dented on the seam or lid, or severely rusted. Reject: packages with tears, holes, or broken vacuum seals. Check that all products have a use-by or sell-by date, that dates have not passed, and that country-of-origin labeling is present on required items (raw beef, seafood, fresh produce).",
        ],
      },
      {
        heading: "Supplier documentation",
        body: [
          "Shellstock tags must accompany every shipment of live molluscan shellfish and be retained for 90 days from the date the last shellstock from the container was sold or served. Seafood should be accompanied by a bill of lading noting the harvest date and area. USDA inspection marks should be visible on red meat products.",
        ],
      },
      {
        heading: "What to do when you reject a delivery",
        body: [
          "Note the rejection on the receiving log: product name, supplier, lot number, temperature at receipt, reason for rejection, and driver's name. Contact the supplier immediately. Keep rejected product physically separated from accepted items until it is removed from the premises.",
        ],
      },
    ],
  },
];
POSTS.push(...WEEK2_POSTS);

const WEEK3_POSTS: Post[] = [
  {
    slug: "what-is-a-haccp-plan",
    title: "What Is a HACCP Plan? A Plain-English Guide",
    description:
      "What is a HACCP plan, who needs one, and what goes inside it? An FDA-sourced answer with a worked example — build yours free with HACCPCalc.",
    updated: "2026-09-10",
    sections: [
      {
        heading: "What is a HACCP plan?",
        body: [
          "A HACCP plan is a written food safety document that maps every step your food goes through — receiving, storing, prepping, cooking, holding, serving — and pins down the exact points where something could go wrong badly enough to make someone sick.",
          "HACCP stands for Hazard Analysis and Critical Control Points. Rather than inspecting a finished dish and hoping it's safe, the system builds safety into the process itself: identify the hazard, decide where you can actually catch it, set a measurable limit, write down who checks it and how often, and keep the records to prove it happened.",
          "It isn't a certificate you buy or a course you sit. It's a document specific to your menu, your kitchen and your equipment — which is exactly why two restaurants serving the same dish can have genuinely different HACCP plans.",
        ],
      },
      {
        heading: "Where the idea came from",
        body: [
          "HACCP wasn't dreamed up by a regulator with a clipboard. Pillsbury built it in the 1960s while supplying food for NASA's manned space missions, working alongside the U.S. Army's Natick research labs, because a sick astronaut mid-orbit was not an acceptable outcome and end-product testing alone couldn't guarantee that.",
          "Dr Howard Bauman, the Pillsbury microbiologist who led the project, later explained the problem that forced the rethink: \"We quickly found by using standard methods of quality control there was absolutely no way we could be assured there wouldn't be a problem.\" Sampling a handful of finished cubes from a batch simply couldn't catch a contamination event buried somewhere earlier in the process.",
          "So Bauman's team borrowed a reliability-engineering idea called \"modes of failure\", reworked it for food, and built a system that watches the process instead of just the plate. He presented it publicly at the first National Conference for Food Protection in 1971, and it has been the backbone of food safety regulation ever since.",
        ],
      },
      {
        heading: "Why it still matters, in numbers",
        body: [
          "The scale of the problem HACCP was built to solve hasn't gone away. The CDC estimates that foodborne illness sickens around 48 million people in the United States every year, sending roughly 128,000 to hospital and killing about 3,000.",
          "A more recent CDC analysis, tracking just six major pathogens (Salmonella, Listeria, Campylobacter, C. perfringens, STEC and norovirus), still counts roughly 10 million cases, 53,300 hospitalisations and over 900 deaths a year — and non-typhoidal Salmonella remains the single deadliest culprit.",
          "There's a genuine bright spot, though. Outbreaks specifically traced back to restaurants fell from 714 in 2017–2019 to just 238 in 2020–2022, according to CDC surveillance data cited by the U.S. Government Accountability Office. Process-based prevention — the whole premise of HACCP — is one of the few levers that moves that number.",
        ],
      },
      {
        heading: "The seven principles, briefly",
        body: [
          "Every HACCP plan, whatever the menu, rests on the same seven principles. They run in order, and skipping one tends to unravel the rest: you can't set a sensible critical limit before you've named the actual hazard and the point where you control it.",
          "The table below is the shape of it. If you want the full walkthrough with FDA Food Code citations for each step, see the dedicated principles guide linked further down.",
        ],
      },
      {
        heading: "Who actually needs one",
        body: [
          "HACCP is not universally mandatory — but the exceptions are the businesses most people already assume need it. The FDA requires a HACCP plan for juice and seafood processors, and the USDA's Food Safety and Inspection Service requires one for anyone slaughtering or processing meat and poultry.",
          "For everyone else — the vast majority of restaurants, cafés, food trucks and caterers — a HACCP plan is technically voluntary under the FDA Food Code, but it is the standard your local health inspector will measure you against, and in practice most jurisdictions expect a written plan for any establishment serving TCS (time/temperature control for safety) food.",
          "Layer on top of that the FDA Food Safety Modernization Act, which requires most food manufacturing facilities to hold a broader written food safety plan built on the same hazard-analysis logic. If you're unsure which bucket you fall into, your state or local health department — not a generic checklist — is the authority to ask.",
        ],
      },
      {
        heading: "HACCP plan vs a general food safety plan",
        body: [
          "People use these terms interchangeably and it causes real confusion. A HACCP plan is narrowly process-specific: it exists to control biological, chemical and physical hazards at the critical control points in your food's journey through the kitchen.",
          "A food safety management system is the wider umbrella — HACCP sits inside it alongside things like pest control, allergen management, staff hygiene training and supplier verification. Under FSMA, this wider document is usually called a Food Safety Plan, and it explicitly folds HACCP-style hazard analysis in as one component, not the whole thing.",
          "In a small kitchen the practical difference is often just paperwork structure rather than daily practice — but an inspector, or an auditor for a wholesale contract, will expect you to know which document you're actually required to produce.",
        ],
      },
      {
        heading: "What's actually inside a written plan",
        body: [
          "A complete plan has one section for each principle: a hazard analysis for every process step, a table of critical control points, the critical limits at each one (almost always a temperature and a time), a monitoring procedure naming who checks what and how often, a corrective-action plan for when a limit is missed, a verification schedule, and a record-keeping system.",
          "For a typical sit-down restaurant, that usually boils down to three or four real CCPs in practice: cooking raw proteins, cooling anything made in batch and held for later, hot- or cold-holding ready-to-eat food, and — if you handle live shellfish — receiving. Everything else in the kitchen matters, but it isn't a CCP unless losing control there could actually make someone ill.",
        ],
      },
      {
        heading: "Building your first plan in four steps",
        body: [
          "Start by mapping the process flow for each menu category — receive, store, prep, cook, hold, serve — and flag anywhere raw and ready-to-eat items could cross paths.",
          "Next, run a hazard analysis at each step and apply the CCP decision logic: is this the last point where you can actually stop the hazard? Cooking is almost always a CCP for raw meat and poultry; cold holding is usually the CCP for anything served without a cook step.",
          "Then set the critical limit and monitoring routine for each CCP — a number, a frequency, a named person, a log sheet — followed by the corrective action for when that limit is missed and a schedule for verifying the whole system still works (thermometer calibration, log review, an annual reassessment).",
          "HACCPCalc automates the first three steps: pick your food type, and it generates the hazard analysis, CCPs and FDA Food Code critical limits as a starting draft, so you're editing rather than starting from a blank page.",
        ],
      },
      {
        heading: "Mistakes that fail an inspection",
        body: [
          "The most common failure isn't a missing document — it's a plan that describes a kitchen that no longer exists. Menus change, suppliers change, a new fryer arrives, and the written hazard analysis doesn't get updated to match. Inspectors check that the plan reflects what's actually happening on the line, not what was true eighteen months ago.",
          "The second is logs that exist but don't get filled in consistently. A HACCP plan with no corresponding temperature records is, from an inspector's point of view, indistinguishable from having no plan at all — the paperwork is the proof.",
        ],
      },
    ],
    table: {
      caption: "The seven HACCP principles at a glance",
      headers: ["Principle", "What it does", "Restaurant example"],
      rows: [
        ["1. Hazard analysis", "List biological, chemical and physical hazards at each process step.", "Salmonella risk in raw chicken at receiving and prep."],
        ["2. Identify CCPs", "Find the last point where the hazard can actually be controlled.", "Cooking the chicken to the required internal temperature."],
        ["3. Critical limits", "Set a measurable boundary for each CCP.", "165°F for 1 second (FDA Food Code §3-401.11)."],
        ["4. Monitoring", "Decide what's measured, how often, and by whom.", "Probe thermometer on every batch, logged by the line cook."],
        ["5. Corrective actions", "Define what happens when a limit is missed.", "Continue cooking until the limit is reached, or discard."],
        ["6. Verification", "Confirm the system is actually working.", "Daily thermometer calibration; monthly log review."],
        ["7. Record-keeping", "Keep the evidence that proves compliance.", "Temperature logs retained and available for inspection."],
      ],
    },
    faq: [
      {
        q: "What is a HACCP plan in simple terms?",
        a: "It's a written document that lists the food safety hazards in your specific menu and process, names the exact points (critical control points) where you catch them, and sets a measurable limit — usually a temperature and time — for each one, with logs to prove it's being followed.",
      },
      {
        q: "Is a HACCP plan legally required?",
        a: "It's mandatory for FDA-regulated juice and seafood processors and for USDA-regulated meat and poultry facilities. For most restaurants and food service operations it is technically voluntary under the FDA Food Code, but local health departments generally expect a written plan for any business handling TCS food, and FSMA requires a broader food safety plan for most food manufacturers.",
      },
      {
        q: "What's the difference between a HACCP plan and a food safety plan?",
        a: "A HACCP plan is narrowly focused on hazard analysis and critical control points within the food process itself. A food safety plan (the term used under FSMA) is the broader document that includes HACCP-style hazard analysis alongside pest control, allergen management, sanitation and supplier verification.",
      },
      {
        q: "How long does it take to write a HACCP plan?",
        a: "A simple, single-menu-category plan can be drafted in an afternoon once you know your process flow. A full-menu restaurant plan with multiple CCPs typically takes a few days to draft properly and should then be reviewed with your local health department before it's treated as final.",
      },
      {
        q: "Do I need a HACCP plan for a food truck or home-based food business?",
        a: "Most likely, in some form — though the specific CCPs differ from a full kitchen because of limited equipment and shorter hold times. Check your state's cottage food law or mobile vendor rules, since requirements vary significantly by jurisdiction.",
      },
    ],
    relatedLinks: [
      { text: "The 7 HACCP principles, explained in full", href: "/guides/7-haccp-principles" },
      { text: "Six real-world critical control point examples", href: "/guides/critical-control-point-examples" },
      { text: "How to use a HACCP plan template", href: "/guides/haccp-plan-template" },
      { text: "FDA Food Code cooking temperatures chart", href: "/cooking-temperatures" },
      { text: "HACCP plan template for chicken and poultry", href: "/haccp-plan-template/chicken" },
      { text: "How HACCPCalc sources its critical limits", href: "/methodology" },
    ],
    sources: [
      { text: "FDA — Managing Food Safety: A Manual for the Voluntary Use of HACCP Principles", href: "https://www.fda.gov/media/71976/download" },
      { text: "CDC — Facts About Food Poisoning", href: "https://www.cdc.gov/food-safety/data-research/facts-stats/index.html" },
      { text: "CDC — Estimates: Burden of Foodborne Illness in the United States", href: "https://www.cdc.gov/food-safety/php/data-research/foodborne-illness-burden/index.html" },
      { text: "U.S. GAO — Food Safety: Status of Foodborne Illness in the U.S. (GAO-25-107606)", href: "https://www.gao.gov/products/gao-25-107606" },
      { text: "NASA Spinoff — How the Moon Landing Led to Safer Food for Everyone", href: "https://spinoff.nasa.gov/moon-landing-food-safety" },
    ],
  },
];
POSTS.push(...WEEK3_POSTS);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
