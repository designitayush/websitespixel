import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { insights } from "@/data/insights";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

function getArticle(slug: string) {
  return insights.find((a) => a.slug === slug);
}

export async function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
  };
}

const articleContent: Record<string, string[]> = {
  "shopify-store-redesign-checklist": [
    "Before committing to a redesign, audit your current conversion funnel. Identify where drop-off happens — is it product pages, cart, or checkout?",
    "Evaluate your brand positioning against competitors. A redesign without strategic clarity is just a new coat of paint.",
    "Map your product catalog architecture. Collections, filters, and navigation should reflect how customers actually shop.",
    "Review your tech stack. Bloated app installations often cause more problems than the redesign itself will solve.",
    "Set measurable goals before design begins. Define target metrics for conversion rate, average order value, and page speed.",
    "Plan for content migration. Product descriptions, images, and SEO metadata need a structured migration strategy.",
    "Build a realistic timeline. Quality redesigns take weeks, not days — plan for discovery, design, build, and post-launch optimization.",
  ],
  "where-ai-helps-ecommerce-conversion": [
    "Product discovery is the strongest AI use case for ecommerce. Guided shopping and smart search reduce decision fatigue in large catalogs.",
    "Pre-purchase support via AI chat can answer sizing, compatibility, and shipping questions — but only if it reduces friction, not adds it.",
    "Personalized merchandising works when based on real behavior signals, not generic demographic assumptions.",
    "Content operations acceleration — generating product descriptions, meta tags, and email variants — saves time without replacing brand voice.",
    "Skip AI for checkout optimization until you've exhausted structured CRO testing. AI can't fix a broken funnel.",
    "Avoid 'fully autonomous' claims. The best AI commerce implementations keep humans in the loop for quality and brand alignment.",
  ],
  "better-way-audit-product-page": [
    "Start with the add-to-cart rate, not the bounce rate. Bounce rate tells you little about purchase intent on product pages.",
    "Evaluate above-the-fold content hierarchy. Can a customer understand what the product is, why it matters, and how to buy within 3 seconds?",
    "Check social proof placement. Reviews and UGC should appear near the decision point, not buried below the fold.",
    "Test variant selection UX. Confusing size/color selectors are one of the most common conversion killers.",
    "Review shipping and return information visibility. Hidden costs and unclear policies create cart abandonment downstream.",
    "Measure mobile-specific behavior separately. Desktop-optimized product pages often fail on mobile where most traffic lives.",
    "Run a 5-second test with someone unfamiliar with your brand. If they can't articulate the product value, your page needs work.",
  ],
};

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const content = articleContent[slug] ?? [];

  return (
    <>
      <PageHeader eyebrow={article.category} title={article.title} description={article.excerpt} />

      <article className="section-y section-padding">
        <div className="container-canvas max-w-3xl">
          <Reveal>
            <p className="text-sm text-muted">{article.readTime}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="prose-custom mt-10 space-y-6">
              {content.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-12 rounded-2xl border border-lime/20 bg-lime/5 p-8">
            <p className="font-display text-lg font-semibold text-offwhite">
              Ready to put this into practice?
            </p>
            <p className="mt-2 text-sm text-muted">
              Book a strategy call to discuss how these frameworks apply to your store.
            </p>
            <div className="mt-6">
              <Button href="/#contact" variant="primary" size="md">
                Book a Strategy Call
                <ArrowIcon />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.3} className="mt-12">
            <Link href="/insights" className="text-sm text-lime transition-colors hover:text-lime-dim">
              ← Back to Insights
            </Link>
          </Reveal>
        </div>
      </article>
    </>
  );
}
