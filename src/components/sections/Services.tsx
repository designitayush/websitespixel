"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/data/services";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function ServiceVisual({ accent, active }: { accent: string; active: boolean }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-3xl border border-graphite-200/30 bg-graphite transition-all duration-700",
        active ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", accent)} />
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-4">
          <div className="rounded-2xl border border-white/10 bg-canvas/80 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-lime/20" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-24 rounded-full bg-offwhite/20" />
                <div className="h-1.5 w-16 rounded-full bg-muted/30" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-graphite-200/40" />
              <div className="h-2 w-4/5 rounded-full bg-graphite-200/30" />
              <div className="h-2 w-3/5 rounded-full bg-graphite-200/20" />
            </div>
            <div className="mt-5 h-10 w-full rounded-full bg-lime/90" />
          </div>
          <div className="flex justify-center gap-2">
            <div className="h-1.5 w-8 rounded-full bg-lime" />
            <div className="h-1.5 w-4 rounded-full bg-graphite-200/40" />
            <div className="h-1.5 w-4 rounded-full bg-graphite-200/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex];

  return (
    <section className="section-y section-padding bg-graphite/20" aria-labelledby="services-heading">
      <div className="container-canvas">
        <Reveal>
          <p className="eyebrow mb-4">What we do</p>
          <h2 id="services-heading" className="section-heading">
            From store launch to the next growth curve.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <StaggerReveal className="lg:col-span-5 space-y-3">
            {services.map((service, i) => (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className={cn(
                    "group block rounded-2xl border p-5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
                    i === activeIndex
                      ? "border-lime/30 bg-graphite/80"
                      : "border-graphite-200/20 bg-transparent hover:border-graphite-200/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-offwhite">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{service.outcome}</p>
                    </div>
                    <ArrowIcon
                      className={cn(
                        "mt-1 shrink-0 text-muted transition-all duration-300",
                        i === activeIndex && "translate-x-1 text-lime"
                      )}
                    />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal delay={0.2} className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <div className="relative">
                {services.map((service, i) => (
                  <ServiceVisual key={service.slug} accent={service.accent} active={i === activeIndex} />
                ))}
              </div>
              <div className="mt-8">
                <p className="text-sm leading-relaxed text-muted">{active.description}</p>
                <Link
                  href={`/services/${active.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-lime transition-colors hover:text-lime-dim"
                >
                  Learn more about {active.shortTitle}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
