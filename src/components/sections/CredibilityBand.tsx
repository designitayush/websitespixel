import { trustMetrics, credibilityStatement } from "@/data/content";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";

export function CredibilityBand() {
  return (
    <section
      className="border-y border-graphite-200/30 bg-graphite/30"
      aria-label="Studio track record"
    >
      <div className="section-padding container-canvas grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-16">
        <Reveal className="lg:col-span-5">
          <p className="max-w-md font-display text-xl font-medium leading-snug text-offwhite md:text-2xl">
            {credibilityStatement.lead}{" "}
            <span className="text-lime">{credibilityStatement.emphasis}</span>{" "}
            {credibilityStatement.tail}
          </p>
        </Reveal>

        <StaggerReveal className="grid grid-cols-3 lg:col-span-7">
          {trustMetrics.map((metric, i) => (
            <StaggerItem
              key={metric.label}
              className={
                i > 0
                  ? "border-l border-graphite-200/40 pl-6 md:pl-10"
                  : ""
              }
            >
              <p className="font-display text-3xl font-bold tracking-tight text-offwhite md:text-4xl lg:text-5xl">
                {metric.value}
              </p>
              <p className="mt-2 text-xs leading-snug text-muted md:text-sm">{metric.label}</p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
