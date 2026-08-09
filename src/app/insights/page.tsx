import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { insights } from "@/data/insights";
import { StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Ecommerce intelligence from WebsitesPixel — practical guides on Shopify redesigns, AI commerce, and conversion optimization.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Ecommerce intelligence, without the fluff."
        description="Practical frameworks and guides for Shopify brands ready to grow."
      />

      <section className="section-y section-padding">
        <StaggerReveal className="container-canvas grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((article) => (
            <StaggerItem key={article.slug}>
              <Link
                href={`/insights/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-graphite-200/30 bg-graphite/40 p-8 transition-colors hover:border-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                <span className="text-xs uppercase tracking-wider text-lime">{article.category}</span>
                <h2 className="mt-3 flex-1 font-display text-xl font-bold text-offwhite group-hover:text-lime">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm text-muted">{article.excerpt}</p>
                <p className="mt-4 text-xs text-muted">{article.readTime}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>
    </>
  );
}
