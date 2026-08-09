import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { services } from "@/data/services";
import { insights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticPages = ["", "/work", "/services", "/ai-commerce", "/process", "/insights", "/privacy", "/terms"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const servicePages = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const insightPages = insights.map((a) => ({
    url: `${base}/insights/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...insightPages];
}
