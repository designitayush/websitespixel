// Verified proof points, sourced from the studio's published Shopify Partner record
// (wearewebsitedesigners.com). Update the values here when the numbers change.
export const trustMetrics = [
  { value: "120+", label: "Shopify stores built" },
  { value: "$78M+", label: "Client revenue generated" },
  { value: "4.9", label: "Shopify Partner rating" },
] as const;

export const credibilityStatement = {
  lead: "Good design attracts attention.",
  emphasis: "Better systems",
  tail: "turn attention into revenue.",
} as const;

export const technicalStandards = [
  {
    title: "Mobile-first commerce",
    description: "Every layout, interaction, and checkout path designed for thumb-first buyers.",
  },
  {
    title: "Core Web Vitals awareness",
    description: "Performance budgets, lazy loading, and asset discipline baked into delivery.",
  },
  {
    title: "Maintainable Shopify architecture",
    description: "Clean theme structure, reusable sections, and sensible Liquid patterns.",
  },
  {
    title: "Accessible UX",
    description: "Keyboard navigation, focus states, contrast, and semantic markup throughout.",
  },
  {
    title: "Clean app & integration strategy",
    description: "Only the tools that earn their place. No plugin bloat or fragile dependencies.",
  },
  {
    title: "Analytics-ready measurement",
    description: "Event tracking, funnel visibility, and experiment infrastructure from day one.",
  },
] as const;

export const processStages = [
  {
    number: "01",
    title: "Discover",
    description:
      "Brand, customers, data, friction points, and competitive context, mapped before a single pixel moves.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "UX strategy, art direction, prototypes, and conversion architecture that feel unmistakably yours.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Shopify engineering, integrations, performance optimization, and rigorous QA across devices.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "Testing, optimization, support, and growth experiments, because launch is the starting line.",
  },
] as const;

export const aiCapabilities = [
  {
    title: "Smart product discovery",
    description: "Guided shopping flows that help customers find the right product faster.",
  },
  {
    title: "AI customer support",
    description: "Pre-purchase assistance that answers questions without adding friction.",
  },
  {
    title: "Personalized merchandising",
    description: "Retention journeys tailored to behavior, not generic batch-and-blast.",
  },
  {
    title: "Faster creative workflows",
    description: "Content operations and experiment velocity without sacrificing quality.",
  },
] as const;
