import { Reveal } from "@/components/ui/Reveal";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="section-padding border-b border-graphite-200/30 bg-graphite/20 pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="container-canvas max-w-3xl">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow mb-4">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <h1 className="display-heading text-balance">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-muted">{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
