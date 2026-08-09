export const siteConfig = {
  name: "WebsitesPixel",
  tagline:
    "A Shopify design, development, CRO, and AI-commerce growth studio for ambitious DTC brands.",
  description:
    "WebsitesPixel designs, builds, and optimizes high-performing Shopify stores with brand-first creative, clean engineering, conversion science, and practical AI.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://websitespixel.com",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "sales.wearewebsitedesigners@gmail.com",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+1 (972) 713-5586",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "+1 (814) 790-7668",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendly.com/wearewebsitedesigners/30min",
  leadMagnetEndpoint: process.env.LEAD_MAGNET_ENDPOINT ?? "",
  contactFormEndpoint: process.env.CONTACT_FORM_ENDPOINT ?? "",
  // Leave a value empty to hide that link from the site until the profile exists.
  social: {
    linkedin: "",
    instagram: "",
    twitter: "",
  },
} as const;

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "AI Commerce", href: "/ai-commerce" },
  { label: "Process", href: "/process" },
  { label: "Insights", href: "/insights" },
] as const;

export const footerNav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "AI Commerce", href: "/ai-commerce" },
  { label: "Process", href: "/process" },
  { label: "Insights", href: "/insights" },
  { label: "Start a Project", href: "/#contact" },
] as const;

export const revenueRanges = [
  "Under $10k / month",
  "$10k - $50k / month",
  "$50k - $250k / month",
  "$250k - $1M / month",
  "$1M+ / month",
  "Pre-launch / not live yet",
] as const;

export const helpOptions = [
  "New Shopify store launch",
  "Store redesign",
  "Conversion rate optimization",
  "AI commerce integration",
  "Apps & integrations",
  "Ongoing growth support",
  "Not sure yet, need guidance",
] as const;
