"use client";

import { aiCapabilities } from "@/data/content";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { CommerceSignalDiagram } from "@/components/visuals/CommerceSignalDiagram";

export function AICommerce() {
  return (
    <section className="section-y section-padding overflow-hidden" aria-labelledby="ai-heading">
      <div className="container-canvas">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">AI Commerce</p>
              <h2 id="ai-heading" className="section-heading">
                AI that earns its place in the customer journey.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted">
                WebsitesPixel uses AI only where it improves discovery, support, personalization,
                content operations, and testing. No buzzwords—just practical systems tied to
                revenue outcomes.
              </p>
            </Reveal>

            <StaggerReveal className="mt-10 space-y-6">
              {aiCapabilities.map((cap) => (
                <StaggerItem key={cap.title}>
                  <div className="border-l-2 border-lime/40 pl-5">
                    <h3 className="font-display text-lg font-semibold text-offwhite">
                      {cap.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{cap.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>

            <Reveal delay={0.3} className="mt-10">
              <Button href="/ai-commerce" variant="secondary" size="lg">
                Explore AI Commerce
                <ArrowIcon />
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <CommerceSignalDiagram />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
