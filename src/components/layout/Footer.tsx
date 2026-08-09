import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/config";
import { services } from "@/data/services";

export function Footer() {
  const year = new Date().getFullYear();

  // Social profiles render only once a real URL is set in siteConfig.
  const socialLinks = [
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "X / Twitter", href: siteConfig.social.twitter },
  ].filter((link) => link.href !== "");

  return (
    <footer className="border-t border-graphite-200/30 bg-graphite/40">
      <div className="section-padding container-canvas section-y pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-display text-xl font-bold text-offwhite transition-colors hover:text-lime"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs uppercase tracking-[0.15em] text-muted">Navigation</h3>
            <ul className="space-y-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite/80 transition-colors hover:text-lime"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs uppercase tracking-[0.15em] text-muted">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-offwhite/80 transition-colors hover:text-lime"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs uppercase tracking-[0.15em] text-muted">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="break-all text-sm text-offwhite/80 transition-colors hover:text-lime"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-offwhite/80 transition-colors hover:text-lime"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-offwhite/80 transition-colors hover:text-lime"
                >
                  WhatsApp {siteConfig.whatsapp}
                </a>
              </li>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-offwhite/80 transition-colors hover:text-lime"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="technical-rule my-10" />

        <div className="flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-offwhite">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-offwhite">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
