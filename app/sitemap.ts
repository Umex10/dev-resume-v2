import type { MetadataRoute } from "next";
import { PROJECTS } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...PROJECTS.map((p) => ({ url: `${SITE_URL}/work/${p.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
