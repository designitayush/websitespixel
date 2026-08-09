import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { services } from "@/data/services";
import { ArrowIcon } from "@/components/ui/Button";
import { StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Shopify store design, redesigns, CRO, AI commerce, integrations, and ongoing growth support from WebsitesPixel.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="From store launch to the next growth curve."
        description="Productized Shopify growth services — outcome-led, not vague agency language."
      />

      <section className="section-y section-padding">
        <StaggerReveal className="container-canvas grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-graphite-200/30 bg-graphite/40 p-8 transition-colors duration-300 hover:border-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                <h2 className="font-display text-2xl font-bold text-offwhite group-hover:text-lime">
                  {service.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{service.outcome}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime">
                  Learn more
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>
    </>
  );
}
