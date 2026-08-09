import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { services, getServiceBySlug } from "@/data/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.outcome,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow="Service" title={service.title} description={service.outcome} />

      <section className="section-y section-padding">
        <div className="container-canvas grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-offwhite">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{service.description}</p>

            <h3 className="mt-10 font-display text-xl font-bold text-offwhite">What&apos;s included</h3>
            <ul className="mt-4 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-graphite-200/30 bg-graphite/40 p-8">
              <h3 className="font-display text-xl font-bold text-offwhite">Ideal for</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.idealFor}</p>

              <div className="technical-rule my-8" />

              <Button href="/#contact" variant="primary" size="lg" magnetic className="w-full">
                Start a Project
                <ArrowIcon />
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal className="container-canvas mt-20">
          <h2 className="font-display text-xl font-bold text-offwhite">Related services</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {otherServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="block rounded-xl border border-graphite-200/30 p-5 text-sm text-muted transition-colors hover:border-lime/20 hover:text-offwhite"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
