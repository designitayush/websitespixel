import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WebsitesPixel privacy policy: how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="How we collect, use, and protect your information. Last updated July 2026."
      />

      <section className="section-padding pb-20">
        <div className="container-canvas max-w-3xl space-y-6 text-sm leading-relaxed text-muted">
          <Reveal delay={0.1}>
            <h2 className="font-display text-lg font-bold text-offwhite">Information we collect</h2>
            <p>
              When you submit a form on this website, we collect the information you provide (name,
              email, company details, and project information) to respond to your inquiry.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="font-display text-lg font-bold text-offwhite">How we use your information</h2>
            <p>
              We use submitted information solely to respond to inquiries, provide requested
              resources, and communicate about potential projects. We do not sell personal data.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <h2 className="font-display text-lg font-bold text-offwhite">Data retention and your rights</h2>
            <p>
              We keep inquiry details only as long as needed to handle your request and any project
              that follows. You can ask us at any time to access, correct, or delete the information
              you have sent us.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="font-display text-lg font-bold text-offwhite">Contact</h2>
            <p>
              For privacy-related questions, contact us at the email address listed in the footer.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
