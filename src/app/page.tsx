import { Hero } from "@/components/sections/Hero";
import { CredibilityBand } from "@/components/sections/CredibilityBand";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Services } from "@/components/sections/Services";
import { AICommerce } from "@/components/sections/AICommerce";
import { Process } from "@/components/sections/Process";
import { TechnicalStandards } from "@/components/sections/TechnicalStandards";
import { Testimonials } from "@/components/sections/Testimonials";
import { Insights } from "@/components/sections/Insights";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityBand />
      <FeaturedWork />
      <Services />
      <AICommerce />
      <Process />
      <TechnicalStandards />
      <Testimonials />
      <Insights />
      <FinalCTA />
    </>
  );
}
