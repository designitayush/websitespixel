import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { processStages } from "@/data/content";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Process",
  description:
    "The WebsitesPixel Method: discover, design, build, and improve. A disciplined approach to Shopify growth.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="The WebsitesPixel Method"
        title="Built with taste. Measured with discipline."
        description="Four stages from discovery to continuous improvement. Timelines are scoped per engagement in your proposal."
      />

      <section className="section-y section-padding">
        <div className="container-canvas space-y-8">
          {processStages.map((stage, i) => (
            <Reveal key={stage.number} delay={i * 0.1}>
              <article className="grid gap-6 rounded-2xl border border-graphite-200/30 bg-graphite/40 p-8 md:grid-cols-[120px_1fr] md:items-start">
                <span className="font-display text-5xl font-bold text-lime/30">{stage.number}</span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-offwhite">{stage.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">{stage.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="container-canvas mt-16 text-center">
          <Button href="/#contact" variant="primary" size="lg" magnetic>
            Start a Project
            <ArrowIcon />
          </Button>
        </Reveal>
      </section>
    </>
  );
}
