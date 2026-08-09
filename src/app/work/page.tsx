import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { publishedCaseStudies } from "@/data/case-studies";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Reported client outcomes from WebsitesPixel Shopify builds, redesigns, and CRO engagements.",
};

export default function WorkPage() {
  const [lead, ...others] = publishedCaseStudies;

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Outcomes, not promises."
        description="Reported client results from our Shopify builds, redesigns, and CRO engagements. Full case studies with imagery and process detail are being prepared with each client's approval."
      />

      <section className="section-y section-padding">
        <div className="container-canvas">
          {lead && (
            <Reveal>
              <article className="rounded-2xl border border-lime/15 bg-graphite/50 p-8 md:p-12">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-5">
                    <h2 className="font-display text-2xl font-bold text-offwhite md:text-3xl">
                      {lead.client}
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                      {lead.category}
                    </p>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="flex flex-wrap items-baseline gap-x-4 font-display font-bold tracking-tight">
                      <span className="text-3xl text-muted line-through decoration-graphite-200 md:text-4xl">
                        {lead.result.from}
                      </span>
                      <span className="text-5xl text-lime md:text-7xl">{lead.result.to}</span>
                    </p>
                    <p className="mt-3 text-sm text-muted">{lead.result.period}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          )}

          <StaggerReveal className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((study) => (
              <StaggerItem key={study.slug} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col justify-between rounded-2xl border border-graphite-200/30",
                    "bg-graphite/40 p-8"
                  )}
                >
                  <div>
                    <h2 className="font-display text-xl font-bold text-offwhite">{study.client}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                      {study.category}
                    </p>
                  </div>
                  <div className="mt-8">
                    <p className="flex flex-wrap items-baseline gap-x-3 font-display font-bold tracking-tight">
                      <span className="text-xl text-muted line-through decoration-graphite-200 md:text-2xl">
                        {study.result.from}
                      </span>
                      <span className="text-3xl text-lime md:text-4xl">{study.result.to}</span>
                    </p>
                    <p className="mt-2 text-sm text-muted">{study.result.period}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
            Revenue figures are client-reported monthly results following our engagements. Detailed
            case studies are published here as each client approves their story and imagery.
          </p>

          <Reveal className="mt-16">
            <Button href="/#contact" variant="primary" size="lg" magnetic>
              Start a Project
              <ArrowIcon />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
