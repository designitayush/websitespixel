import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "WebsitesPixel terms of service: usage terms for this website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        description="Usage terms for this website. Last updated July 2026."
      />

      <section className="section-padding pb-20">
        <div className="container-canvas max-w-3xl space-y-6 text-sm leading-relaxed text-muted">
          <Reveal delay={0.1}>
            <h2 className="font-display text-lg font-bold text-offwhite">Use of this website</h2>
            <p>
              This website is provided for informational purposes about WebsitesPixel&apos;s services.
              Content on this site does not constitute a binding offer or agreement.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="font-display text-lg font-bold text-offwhite">Intellectual property</h2>
            <p>
              All content, design, and code on this website are the property of WebsitesPixel unless
              otherwise noted. Unauthorized reproduction is prohibited.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="font-display text-lg font-bold text-offwhite">Contact</h2>
            <p>
              For questions about these terms, contact us at the email address listed in the footer.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
