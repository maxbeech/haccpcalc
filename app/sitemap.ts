import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { FOOD_TYPES } from "@/lib/data/foodTypes";
import { STATES } from "@/lib/data/states";
import { POSTS } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/cooking-temperatures`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/states`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/guides`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/methodology`, lastModified: now, priority: 0.5 },
    { url: `${SITE.url}/pricing`, lastModified: now, priority: 0.5 },
  ];
  for (const f of FOOD_TYPES) urls.push({ url: `${SITE.url}/haccp-plan-template/${f.slug}`, lastModified: now, priority: 0.8 });
  for (const s of STATES) urls.push({ url: `${SITE.url}/food-safety/${s.slug}`, lastModified: now, priority: 0.6 });
  for (const p of POSTS) urls.push({ url: `${SITE.url}/guides/${p.slug}`, lastModified: now, priority: 0.6 });
  return urls;
}
