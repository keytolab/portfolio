import { Hero } from "@/components/hero/hero";
import { WorkSection } from "@/components/work/work-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkSection />
      {/* Next up: about and contact. Spacer so the pinned work section can finish scrolling. */}
      <section id="about" aria-label="About" className="min-h-[60svh]" />
    </main>
  );
}
