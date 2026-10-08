import { describe, it, expect } from "vitest";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { POSTS } from "../lib/posts";
import { SITE } from "../lib/site";

type Rule = { userAgent: string | string[]; allow?: string };

const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"];

describe("robots policy for AI crawlers", () => {
  const rules = robots().rules as Rule[];
  const named = rules
    .filter((r) => r.userAgent !== "*")
    .flatMap((r) => (Array.isArray(r.userAgent) ? r.userAgent : [r.userAgent]));

  it.each(AI_CRAWLERS)("explicitly allows %s", (bot) => {
    expect(named, `robots rules should name ${bot}`).toContain(bot);
  });

  it("allows everything for every named crawler", () => {
    expect(rules.every((r) => r.allow === "/")).toBe(true);
  });

  it("keeps the wildcard rule and the sitemap pointer", () => {
    expect(rules.some((r) => r.userAgent === "*" && r.allow === "/")).toBe(true);
    expect(robots().sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });
});

describe("sitemap guide lastModified", () => {
  const entries = sitemap();

  it.each(POSTS.map((p) => p.slug))("guide %s uses its updated date", (slug) => {
    const post = POSTS.find((p) => p.slug === slug);
    const entry = entries.find((e) => e.url === `${SITE.url}/guides/${slug}`);
    expect(entry, `sitemap should list /guides/${slug}`).toBeDefined();
    expect(entry?.lastModified).toEqual(new Date(post!.updated));
  });
});
