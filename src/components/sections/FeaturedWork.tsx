import { featuredCaseStudies } from "@/data/case-studies";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";
import { Button, ArrowIcon } from "@/components/ui/Button";

export function FeaturedWork() {
  // Hidden until at least one published case study is marked featured.
  if (featuredCaseStudies.length === 0) return null;

  return (
    <section className="section-y section-padding" aria-labelledby="work-heading">
      <div className="container-canvas">
        <Reveal>
          <h2 id="work-heading" className="section-heading max-w-2xl">
            Stores that outgrew their launch plans.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Reported client outcomes from our Shopify builds, redesigns, and CRO engagements.
          </p>
        </Reveal>

        <StaggerReveal className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-graphite-200/30 bg-graphite-200/30 lg:grid-cols-3">
          {featuredCaseStudies.map((study) => (
            <StaggerItem key={study.slug} className="h-full">
              <article className="flex h-full flex-col justify-between bg-canvas p-8 md:p-10">
                <div>
                  <h3 className="font-display text-lg font-bold text-offwhite">{study.client}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                    {study.category}
                  </p>
                </div>
                <div className="mt-10">
                  <p className="flex flex-wrap items-baseline gap-x-3 font-display font-bold tracking-tight">
                    <span className="text-2xl text-muted line-through decoration-graphite-200 md:text-3xl">
                      {study.result.from}
                    </span>
                    <span className="text-4xl text-lime md:text-5xl">{study.result.to}</span>
                  </p>
                  <p className="mt-3 text-sm text-muted">{study.result.period}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal className="mt-12">
          <Button href="/work" variant="secondary" size="lg">
            Explore Selected Work
            <ArrowIcon />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
