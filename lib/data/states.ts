// US state retail-food regulatory agencies. Every US state bases its retail
// food code on the FDA Food Code (adopted in whole or with state amendments).
// We list the authoritative regulatory agency for each state and point readers
// to it to confirm the exact adopted edition and local amendments, rather than
// hard-coding edition numbers that change as states update (No-Fallbacks rule).
// Source of record: FDA, "Adoption of the FDA Food Code by State"
// (https://www.fda.gov/food/retail-food-protection/fda-food-code-adoption-state).

export interface StateInfo {
  slug: string;
  name: string;
  abbr: string;
  /** The agency that regulates retail food establishments in the state. */
  agency: string;
}

export const STATES: StateInfo[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", agency: "Alabama Department of Public Health" },
  { slug: "alaska", name: "Alaska", abbr: "AK", agency: "Alaska Dept. of Environmental Conservation, Food Safety & Sanitation" },
  { slug: "arizona", name: "Arizona", abbr: "AZ", agency: "Arizona Department of Health Services (delegated to county health depts)" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", agency: "Arkansas Department of Health" },
  { slug: "california", name: "California", abbr: "CA", agency: "California Dept. of Public Health (CalCode / California Retail Food Code)" },
  { slug: "colorado", name: "Colorado", abbr: "CO", agency: "Colorado Dept. of Public Health & Environment" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", agency: "Connecticut Department of Public Health" },
  { slug: "delaware", name: "Delaware", abbr: "DE", agency: "Delaware Health & Social Services, Office of Food Protection" },
  { slug: "florida", name: "Florida", abbr: "FL", agency: "Florida Dept. of Business & Professional Regulation (DBPR) / Dept. of Health" },
  { slug: "georgia", name: "Georgia", abbr: "GA", agency: "Georgia Department of Public Health" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", agency: "Hawaii Department of Health, Food Safety Branch" },
  { slug: "idaho", name: "Idaho", abbr: "ID", agency: "Idaho Department of Health & Welfare" },
  { slug: "illinois", name: "Illinois", abbr: "IL", agency: "Illinois Department of Public Health" },
  { slug: "indiana", name: "Indiana", abbr: "IN", agency: "Indiana State Department of Health" },
  { slug: "iowa", name: "Iowa", abbr: "IA", agency: "Iowa Dept. of Inspections, Appeals & Licensing" },
  { slug: "kansas", name: "Kansas", abbr: "KS", agency: "Kansas Department of Agriculture, Food Safety & Lodging" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", agency: "Kentucky Cabinet for Health & Family Services" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", agency: "Louisiana Department of Health" },
  { slug: "maine", name: "Maine", abbr: "ME", agency: "Maine Dept. of Health & Human Services, Health Inspection Program" },
  { slug: "maryland", name: "Maryland", abbr: "MD", agency: "Maryland Department of Health" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", agency: "Massachusetts Department of Public Health" },
  { slug: "michigan", name: "Michigan", abbr: "MI", agency: "Michigan Dept. of Agriculture & Rural Development (MDARD)" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", agency: "Minnesota Department of Health / Dept. of Agriculture" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", agency: "Mississippi State Department of Health" },
  { slug: "missouri", name: "Missouri", abbr: "MO", agency: "Missouri Department of Health & Senior Services" },
  { slug: "montana", name: "Montana", abbr: "MT", agency: "Montana Dept. of Public Health & Human Services" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", agency: "Nebraska Department of Agriculture" },
  { slug: "nevada", name: "Nevada", abbr: "NV", agency: "Nevada Division of Public & Behavioral Health (Southern Nevada Health District)" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", agency: "New Hampshire Department of Health & Human Services" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", agency: "New Jersey Department of Health (Chapter 24 / FDA Food Code)" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", agency: "New Mexico Environment Department" },
  { slug: "new-york", name: "New York", abbr: "NY", agency: "New York State Dept. of Health / NYC Dept. of Health & Mental Hygiene" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", agency: "North Carolina Dept. of Health & Human Services" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", agency: "North Dakota Department of Health & Human Services" },
  { slug: "ohio", name: "Ohio", abbr: "OH", agency: "Ohio Department of Health / Dept. of Agriculture" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", agency: "Oklahoma State Department of Health" },
  { slug: "oregon", name: "Oregon", abbr: "OR", agency: "Oregon Health Authority, Foodborne Illness Prevention" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", agency: "Pennsylvania Department of Agriculture" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", agency: "Rhode Island Department of Health" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", agency: "South Carolina Dept. of Health & Environmental Control (DHEC)" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", agency: "South Dakota Department of Health" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", agency: "Tennessee Department of Health" },
  { slug: "texas", name: "Texas", abbr: "TX", agency: "Texas Dept. of State Health Services (Texas Food Establishment Rules)" },
  { slug: "utah", name: "Utah", abbr: "UT", agency: "Utah Department of Health & Human Services" },
  { slug: "vermont", name: "Vermont", abbr: "VT", agency: "Vermont Department of Health" },
  { slug: "virginia", name: "Virginia", abbr: "VA", agency: "Virginia Department of Health" },
  { slug: "washington", name: "Washington", abbr: "WA", agency: "Washington State Department of Health" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", agency: "West Virginia Department of Health" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", agency: "Wisconsin Dept. of Agriculture, Trade & Consumer Protection (DATCP)" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", agency: "Wyoming Department of Agriculture, Consumer Health Services" },
];

export function getState(slug: string): StateInfo | undefined {
  return STATES.find((s) => s.slug === slug);
}
