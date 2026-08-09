export interface InsightArticle {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
}

export const insights: InsightArticle[] = [
  {
    slug: "shopify-store-redesign-checklist",
    title: "The Shopify Store Redesign Checklist",
    excerpt:
      "A practical framework for knowing when to redesign, what to audit first, and how to avoid the mistakes that stall conversion.",
    readTime: "8 min read",
    category: "Redesign",
  },
  {
    slug: "where-ai-helps-ecommerce-conversion",
    title: "Where AI Actually Helps Ecommerce Conversion",
    excerpt:
      "Not every AI use case earns its place. Here are the four areas where we've seen measurable impact—and the ones to skip.",
    readTime: "6 min read",
    category: "AI Commerce",
  },
  {
    slug: "better-way-audit-product-page",
    title: "A Better Way to Audit Your Product Page",
    excerpt:
      "Most product page audits focus on aesthetics. This one focuses on the decisions that actually move add-to-cart rates.",
    readTime: "5 min read",
    category: "CRO",
  },
];
