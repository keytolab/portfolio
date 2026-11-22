import { Hero } from "@/components/hero/hero";
import { WorkSection } from "@/components/work/work-section";
import { AboutSection } from "@/components/about/about-section";
import { ContactSection } from "@/components/contact/contact-section";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
