export interface CaseStudyResult {
  from: string;
  to: string;
  period: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  category: string;
  result: CaseStudyResult;
  /**
   * Long-form story fields. Leave empty until the client has approved the
   * narrative and real imagery exists; the site only renders what is present.
   */
  challenge?: string;
  strategy?: string;
  services?: string[];
  /** Featured on the homepage results band (max 3). */
  featured?: boolean;
  /** Hidden from every public page until true. */
  published: boolean;
}

// Real client outcomes, as published on the studio's site (wearewebsitedesigners.com).
// Monthly revenue figures are the studio's own reported results.
export const caseStudies: CaseStudy[] = [
  {
    slug: "hashibo",
    client: "HASHIBO",
    category: "Shopify build + growth",
    result: { from: "$10K", to: "$1.3M", period: "monthly revenue in 10 months" },
    featured: true,
    published: true,
  },
  {
    slug: "primal-herbs",
    client: "PRIMALHERBS®",
    category: "Shopify build + growth",
    result: { from: "$0", to: "$670K", period: "monthly revenue in 14 months" },
    featured: true,
    published: true,
  },
  {
    slug: "reddrop",
    client: "RedDrop",
    category: "Shopify redesign + CRO",
    result: { from: "$35K", to: "$211K", period: "monthly revenue in 2 months" },
    featured: true,
    published: true,
  },
  {
    slug: "brainluxury",
    client: "BRAINLUXURY",
    category: "Shopify redesign + CRO",
    result: { from: "$45K", to: "$250K", period: "monthly revenue in 60 days" },
    published: true,
  },
  {
    slug: "timepiece",
    client: "TIMEPIECE",
    category: "Shopify build + growth",
    result: { from: "$50K", to: "$500K", period: "monthly revenue in 8 months" },
    published: true,
  },
  {
    slug: "noreo",
    client: "Noreo",
    category: "Shopify build + growth",
    result: { from: "$0", to: "$540K", period: "monthly revenue in under 6 months" },
    published: true,
  },
  {
    slug: "human-pro",
    client: "Human Pro",
    category: "Shopify build + growth",
    result: { from: "$10K", to: "$100K", period: "monthly revenue in under 10 months" },
    published: true,
  },
];

export const publishedCaseStudies = caseStudies.filter((c) => c.published);
export const featuredCaseStudies = publishedCaseStudies.filter((c) => c.featured).slice(0, 3);
