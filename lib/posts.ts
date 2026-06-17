// Long-form guide content for /guides/[slug]. Each post is a small set of
// sections rendered as an article with FAQ-style headings — citable, static,
// and targeting long-tail food-safety search queries.

export interface Section {
  heading: string;
  body: string[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: Section[];
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

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
