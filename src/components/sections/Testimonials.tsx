import { testimonials } from "@/data/testimonials";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export function Testimonials() {
  // Component stays hidden until real, approved testimonials exist in the data file.
  if (testimonials.length === 0) return null;

  const [featured, ...rest] = testimonials;

  return (
    <section
      className="section-y section-padding bg-graphite/20"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-canvas">
        <Reveal>
          <h2 id="testimonials-heading" className="section-heading">
            What clients say.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <blockquote className="flex h-full flex-col justify-between rounded-2xl border border-lime/15 bg-graphite/60 p-8 md:p-10">
              <p className="font-display text-2xl font-medium leading-snug text-offwhite md:text-3xl">
                &ldquo;{featured.quote}&rdquo;
              </p>
              <footer className="mt-10">
                <cite className="not-italic text-sm font-medium text-offwhite">
                  {featured.name}
                </cite>
                <p className="mt-1 text-xs text-muted">{featured.source}</p>
              </footer>
            </blockquote>
          </Reveal>

          <StaggerReveal className="grid gap-6">
            {rest.map((t) => (
              <StaggerItem key={t.id} className="h-full">
                <blockquote className="flex h-full flex-col justify-between rounded-2xl border border-graphite-200/30 bg-graphite/60 p-8">
                  <p className="font-display text-lg font-medium leading-snug text-offwhite">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-6">
                    <cite className="not-italic text-sm font-medium text-offwhite">{t.name}</cite>
                    <p className="mt-1 text-xs text-muted">{t.source}</p>
                  </footer>
                </blockquote>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
