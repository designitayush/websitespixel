import type { Metadata } from "next";
import { Section } from "@/components/system/Section";
import { Eyebrow } from "@/components/system/Eyebrow";
import { Pill } from "@/components/system/Pill";
import { Button } from "@/components/system/Button";
import { Reveal } from "@/components/system/Reveal";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Internal design-system reference for the WebsitesPixel rebuild.",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "paper", value: "#F9F8F6", className: "bg-paper border border-line" },
  { name: "surface", value: "#FFFFFF", className: "bg-surface border border-line" },
  { name: "ink", value: "#141414", className: "bg-ink" },
  { name: "body", value: "#656565", className: "bg-body" },
  { name: "faint", value: "#A4A4A4", className: "bg-faint" },
  { name: "accent", value: "#FF0000", className: "bg-accent" },
];

const radii = [
  { name: "toolbar", className: "rounded-toolbar", label: "12" },
  { name: "media", className: "rounded-media", label: "20" },
  { name: "card", className: "rounded-card", label: "24" },
  { name: "video", className: "rounded-video", label: "32" },
  { name: "hero", className: "rounded-hero", label: "40" },
];

export default function StyleguidePage() {
  return (
    <div className="bg-ink p-2">
      <div className="min-h-screen rounded-page bg-paper pt-16 text-ink">
        <Section aria-label="Styleguide introduction">
          <Eyebrow>Design system</Eyebrow>
          <h1 className="o-h1 mt-6 max-w-4xl">
            The WebsitesPixel system, rebuilt from the ground up.
          </h1>
          <p className="o-body mt-6 max-w-xl">
            Internal reference for the new foundations: colour, type, elevation, radii, and
            motion. Every section we migrate uses only what is on this page.
          </p>
        </Section>

        <Section aria-label="Type scale">
          <p className="o-label text-faint">Type scale / Fraunces + Inter + Geist Mono</p>
          <div className="mt-10 space-y-10 border-t border-line pt-10">
            <div>
              <p className="o-label mb-3 text-faint">H1 hero 72/76</p>
              <p className="o-h1">Commerce experiences built to be chosen.</p>
            </div>
            <div>
              <p className="o-label mb-3 text-faint">Display 64/68</p>
              <p className="o-display">Stores that outgrew their launch plans.</p>
            </div>
            <div>
              <p className="o-label mb-3 text-faint">H2 56/60</p>
              <p className="o-h2">From store launch to the next growth curve.</p>
            </div>
            <div>
              <p className="o-label mb-3 text-faint">H3 40/44</p>
              <p className="o-h3">Built with taste. Measured with discipline.</p>
            </div>
            <div>
              <p className="o-label mb-3 text-faint">H4 32/36</p>
              <p className="o-h4">Conversion Rate Optimization</p>
            </div>
            <div>
              <p className="o-label mb-3 text-faint">H5 quote 24/28</p>
              <p className="o-h5 max-w-2xl">
                &ldquo;From scratch to now I&apos;m making $10K a month revenue.&rdquo;
              </p>
            </div>
            <div className="max-w-xl space-y-4">
              <p className="o-label mb-3 text-faint">Body 16/24 + small 14/20 + label 12/16</p>
              <p className="o-body">
                Design, engineering, conversion science, and practical AI, working as one system
                to grow your Shopify store. We build on Shopify with performance budgets and
                clean, maintainable architecture.
              </p>
              <p className="o-small text-body">
                Small: 120+ Shopify stores built. $78M+ client revenue generated.
              </p>
              <p className="o-label text-faint">Mono label: Shopify growth studio</p>
            </div>
          </div>
        </Section>

        <Section aria-label="Colour tokens">
          <p className="o-label text-faint">Colour</p>
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-10 md:grid-cols-3 lg:grid-cols-6">
            {swatches.map((s) => (
              <div key={s.name}>
                <div className={`h-24 rounded-media ${s.className}`} />
                <p className="o-small mt-3 font-medium">{s.name}</p>
                <p className="o-label text-faint">{s.value}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section aria-label="Components">
          <p className="o-label text-faint">Components</p>
          <div className="mt-10 grid gap-6 border-t border-line pt-10 lg:grid-cols-2">
            <div className="rounded-card bg-surface p-10 shadow-card">
              <p className="o-label mb-6 text-faint">Eyebrow + pills</p>
              <Eyebrow>Selected work</Eyebrow>
              <div className="mt-6 flex flex-wrap gap-2">
                <Pill>Shopify</Pill>
                <Pill>CRO</Pill>
                <Pill>AI Commerce</Pill>
                <Pill>Redesign</Pill>
              </div>
            </div>
            <div className="rounded-card bg-surface p-10 shadow-card">
              <p className="o-label mb-6 text-faint">Buttons / hover for label roll</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/#contact" variant="dark">
                  Start a Project
                </Button>
                <Button href="/work" variant="light">
                  Explore Selected Work
                </Button>
              </div>
              <div className="mt-8 rounded-toolbar bg-ink p-6">
                <p className="o-label mb-4 text-white/50">On dark</p>
                <Button href="/#contact" variant="light">
                  Start a Project
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Section aria-label="Elevation and radii">
          <p className="o-label text-faint">Elevation + radii</p>
          <div className="mt-10 grid gap-6 border-t border-line pt-10 md:grid-cols-3">
            <div className="rounded-card bg-surface p-8 shadow-chip">
              <p className="o-small font-medium">shadow-chip</p>
              <p className="o-small mt-1 text-body">Chips, pills, light buttons</p>
            </div>
            <div className="rounded-card bg-surface p-8 shadow-card">
              <p className="o-small font-medium">shadow-card</p>
              <p className="o-small mt-1 text-body">Cards and media frames</p>
            </div>
            <div className="rounded-card bg-ink p-8 text-white shadow-btn">
              <p className="o-small font-medium">shadow-btn</p>
              <p className="o-small mt-1 text-white/60">Primary dark surfaces</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            {radii.map((r) => (
              <div
                key={r.name}
                className={`flex h-28 w-36 items-end bg-surface p-4 shadow-chip ${r.className}`}
              >
                <p className="o-label text-faint">
                  {r.name} {r.label}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section aria-label="Motion">
          <p className="o-label text-faint">Motion / spring reveal, bounce 0, 1.5s</p>
          <div className="mt-10 grid gap-6 border-t border-line pt-10 md:grid-cols-3">
            {["Discover", "Design", "Build"].map((stage, i) => (
              <Reveal key={stage} delay={i * 0.12}>
                <div className="rounded-card bg-surface p-10 shadow-card">
                  <p className="o-label text-faint">0{i + 1}</p>
                  <p className="o-h4 mt-4">{stage}</p>
                  <p className="o-body mt-3">
                    Reveal enters from 24px below on a critically damped spring.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <footer className="o-section border-t border-line">
          <p className="o-small text-faint">
            Internal page. Not linked from navigation and excluded from search indexing.
          </p>
        </footer>
      </div>
    </div>
  );
}
