"use client";

import { processStages } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

// Interim layout: the scroll-linked storytelling version of this section is
// rebuilt on the new design system in the Process migration phase.
export function Process() {
  return (
    <section
      className="section-y section-padding relative bg-graphite/20"
      aria-labelledby="process-heading"
    >
      <div className="container-canvas">
        <Reveal>
          <p className="eyebrow mb-4">The WebsitesPixel Method</p>
          <h2 id="process-heading" className="section-heading">
            Built with taste. Measured with discipline.
          </h2>
        </Reveal>
      </div>

      {/* Desktop grid */}
      <div className="section-padding container-canvas mt-14 hidden gap-6 lg:grid lg:grid-cols-4">
        {processStages.map((stage, i) => (
          <Reveal key={stage.number} delay={i * 0.08}>
            <article className="h-full rounded-2xl border border-graphite-200/30 bg-graphite/60 p-8">
              <span className="font-display text-5xl font-bold text-lime/20">{stage.number}</span>
              <h3 className="mt-4 font-display text-2xl font-bold text-offwhite">{stage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{stage.description}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Mobile vertical timeline */}
      <div className="section-padding container-canvas mt-14 lg:hidden">
        <ol className="relative space-y-0 border-l border-graphite-200/40 pl-8">
          {processStages.map((stage, i) => (
            <li key={stage.number} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-lime" />
              <Reveal delay={i * 0.1}>
                <span className="font-display text-3xl font-bold text-lime/30">{stage.number}</span>
                <h3 className="mt-2 font-display text-xl font-bold text-offwhite">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{stage.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
