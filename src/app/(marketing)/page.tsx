import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQ } from "@/components/marketing/FAQ";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ServicesGrid />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
