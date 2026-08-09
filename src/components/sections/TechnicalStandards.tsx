"use client";

import { technicalStandards } from "@/data/content";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export function TechnicalStandards() {
  return (
    <section className="section-y section-padding" aria-labelledby="standards-heading">
      <div className="container-canvas">
        <Reveal>
          <p className="eyebrow mb-4">Technical standards</p>
          <h2 id="standards-heading" className="section-heading">
            Beautiful is the baseline.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Every store we deliver is built to perform under real commerce conditions—not just look
            good in a portfolio screenshot.
          </p>
        </Reveal>

        <StaggerReveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicalStandards.map((item, i) => (
            <StaggerItem key={item.title}>
              <div className="group h-full rounded-2xl border border-graphite-200/30 bg-graphite/40 p-6 transition-colors duration-300 hover:border-lime/20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-lime/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-graphite-200/40" />
                </div>
                <h3 className="font-display text-lg font-semibold text-offwhite">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
