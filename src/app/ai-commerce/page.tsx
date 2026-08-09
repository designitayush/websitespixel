import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { aiCapabilities } from "@/data/content";
import { CommerceSignalDiagram } from "@/components/visuals/CommerceSignalDiagram";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "AI Commerce",
  description:
    "Practical AI commerce integrations for Shopify — product discovery, support, personalization, and experiment velocity.",
};

export default function AICommercePage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Commerce"
        title="AI that earns its place in the customer journey."
        description="We deploy AI where it improves discovery, support, personalization, content operations, and testing — never as decoration."
      />

      <section className="section-y section-padding">
        <div className="container-canvas grid gap-16 lg:grid-cols-2 lg:items-start">
          <StaggerReveal className="space-y-8">
            {aiCapabilities.map((cap) => (
              <StaggerItem key={cap.title}>
                <div className="rounded-2xl border border-graphite-200/30 bg-graphite/40 p-8">
                  <h2 className="font-display text-xl font-bold text-offwhite">{cap.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{cap.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal delay={0.2} className="lg:sticky lg:top-28">
            <CommerceSignalDiagram />
            <p className="mt-6 text-sm text-muted">
              Customer behavior signals feed into smarter discovery, messaging, and conversion
              experiments — creating a continuous improvement loop tied to revenue.
            </p>
          </Reveal>
        </div>

        <Reveal className="container-canvas mt-20 text-center">
          <Button href="/#contact" variant="primary" size="lg" magnetic>
            Discuss AI Commerce
            <ArrowIcon />
          </Button>
        </Reveal>
      </section>
    </>
  );
}
