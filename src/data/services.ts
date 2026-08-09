export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  outcome: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  accent: string;
}

export const services: Service[] = [
  {
    slug: "shopify-store-design-development",
    title: "Shopify Store Design & Development",
    shortTitle: "Store Design & Development",
    outcome: "Launch a store that earns trust on first visit—and converts on every device.",
    description:
      "From brand translation to pixel-perfect Shopify builds, we create storefronts engineered for clarity, speed, and conversion from day one.",
    deliverables: [
      "Custom theme design and Shopify development",
      "Mobile-first UX and checkout optimization",
      "Product page architecture and collection strategy",
      "Performance optimization and launch QA",
    ],
    idealFor: "Brands launching on Shopify or rebuilding from a legacy platform.",
    accent: "from-lime/20 to-violet-glow/10",
  },
  {
    slug: "shopify-redesigns",
    title: "Shopify Redesigns",
    shortTitle: "Shopify Redesigns",
    outcome: "Transform an underperforming store into a brand experience that scales revenue.",
    description:
      "We audit what's holding you back, redesign with conversion architecture in mind, and rebuild without disrupting the business you already have.",
    deliverables: [
      "Conversion and UX audit",
      "Art direction and design system",
      "Theme rebuild with minimal downtime",
      "Post-launch optimization sprint",
    ],
    idealFor: "Established stores with traffic but flat or declining conversion.",
    accent: "from-blue-glow/15 to-graphite-100",
  },
  {
    slug: "conversion-rate-optimization",
    title: "Conversion Rate Optimization",
    shortTitle: "CRO",
    outcome: "Turn existing traffic into measurable revenue gains—without buying more ads.",
    description:
      "Structured experimentation across product pages, cart, checkout, and key journeys. Hypothesis-driven, data-informed, never guesswork.",
    deliverables: [
      "Funnel analysis and friction mapping",
      "A/B and multivariate test design",
      "UX improvements and copy refinement",
      "Reporting and iteration roadmap",
    ],
    idealFor: "Brands with steady traffic ready to extract more from every session.",
    accent: "from-lime/15 to-blue-glow/10",
  },
  {
    slug: "ai-commerce-experiences",
    title: "AI Commerce Experiences",
    shortTitle: "AI Commerce",
    outcome: "Deploy AI where it actually helps customers buy—not where it looks impressive in a deck.",
    description:
      "Practical AI integrations for discovery, support, personalization, and content operations—always tied to measurable commerce outcomes.",
    deliverables: [
      "Product discovery and guided shopping",
      "AI-assisted customer support flows",
      "Personalized merchandising logic",
      "Content and experiment acceleration",
    ],
    idealFor: "Brands ready to use AI as a revenue system, not a novelty.",
    accent: "from-violet-glow/20 to-lime/10",
  },
  {
    slug: "shopify-apps-integrations-automation",
    title: "Shopify Apps, Integrations & Automation",
    shortTitle: "Apps & Integrations",
    outcome: "Connect your stack cleanly—fewer tools, fewer failures, faster operations.",
    description:
      "We evaluate, integrate, and automate the apps and systems your store depends on, with architecture that stays maintainable as you grow.",
    deliverables: [
      "App stack audit and recommendations",
      "Custom integrations and middleware",
      "Automation workflows (fulfillment, CRM, email)",
      "Documentation and handoff",
    ],
    idealFor: "Growing stores drowning in disconnected tools and manual processes.",
    accent: "from-graphite-200/30 to-lime/5",
  },
  {
    slug: "ongoing-growth-technical-support",
    title: "Ongoing Growth & Technical Support",
    shortTitle: "Growth & Support",
    outcome: "Keep momentum after launch with a partner who knows your store inside out.",
    description:
      "Retainer-based support for optimization, new features, performance monitoring, and growth experiments—without hiring in-house.",
    deliverables: [
      "Monthly optimization and feature sprints",
      "Performance and uptime monitoring",
      "Priority bug fixes and Shopify updates",
      "Quarterly growth planning sessions",
    ],
    idealFor: "Brands that want continuous improvement without a full internal team.",
    accent: "from-lime/10 to-violet-glow/15",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
