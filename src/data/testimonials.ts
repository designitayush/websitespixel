export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  source: string;
}

// Real client feedback, quoted from the studio's published Shopify Partner reviews
// (wearewebsitedesigners.com). Add new entries only with the client's approval.
export const testimonials: Testimonial[] = [
  {
    id: "herhaircollections",
    quote: "From scratch to now I'm making $10K a month revenue.",
    name: "HerHaircollections",
    source: "Shopify Partner review",
  },
  {
    id: "rawrichextensions",
    quote: "Professional, patient, and really took the time to understand my vision.",
    name: "Rawrichextensions",
    source: "Shopify Partner review",
  },
  {
    id: "pureaurahairs",
    quote: "Everything looks super professional, easy to navigate, and fits my brand perfectly.",
    name: "Pureaurahairs",
    source: "Shopify Partner review",
  },
] as const;
