import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Next up: the work section. Empty for now so the scroll cue has somewhere to go. */}
      <section id="work" aria-label="Work" className="min-h-svh" />
    </main>
  );
}
