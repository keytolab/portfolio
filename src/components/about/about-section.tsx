"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { GRAIN_TEXTURE } from "@/lib/grain";
import { sideIn } from "@/lib/reveal";
import { ServiceCarousel } from "./service-carousel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/**
 * About: one large statement whose words light up one by one as you scroll
 * (tied to scroll position, so it reads at your pace), with a single yellow,
 * glowing italic word. Services and links sit quietly underneath.
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { statement, services, socials } = site.about;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words start dim (still readable as a ghost) and brighten in reading order.
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: "[data-statement]",
              start: "top 78%",
              // Fully lit once the statement's bottom passes ~72% — reached when
              // landing on #about from the menu, so the sentence never arrives half-dim.
              end: "bottom 72%",
              scrub: 1,
            },
          },
        );
        // The highlighted word's glow blooms a little after it lights up.
        gsap.fromTo(
          "[data-accent]",
          { "--glow": 0 },
          {
            "--glow": 1,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-accent]", start: "top 62%", end: "top 40%", scrub: 1 },
          },
        );
        // The statement glides in from the left, blurred, and settles; the words then
        // keep lighting up with scroll. Details below arrive from opposite sides.
        sideIn("[data-statement]", { from: "left", trigger: "[data-statement]", start: "top 85%", distance: 0.1 });
        // The services carousel arrives from the right; the links from the left.
        sideIn("[data-about-services]", { from: "right", trigger: "[data-about-services]", start: "top 85%", distance: 0.06, delay: 0.1 });
        sideIn("[data-about-elsewhere] li", { from: "left", trigger: "[data-about-elsewhere]", start: "top 92%", distance: 0.03, stagger: 0.06 });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative overflow-clip bg-black px-5 py-32 sm:px-8 sm:py-40 lg:px-12 lg:py-48"
    >
      {/* Faint warm bloom behind the statement, tied to the accent colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[70vh] w-[90vw] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(closest-side, rgb(255 190 0 / 0.07), transparent)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: GRAIN_TEXTURE }} />

      <h2 id="about-heading" className="sr-only">
        About
      </h2>

      {/* Statement on the left, the services carousel on the right (stacked on smaller screens). */}
      <div className="relative grid items-center gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[6vw]">
      <p
        data-statement
        className="relative max-w-[20ch] text-[clamp(2.4rem,6vw,6.25rem)] font-medium leading-[1.02] tracking-[-0.045em] text-ink lg:text-[clamp(2.4rem,4.6vw,5.25rem)]"
      >
        {/* Each word is its own span (for the reveal) with a real space after it, so lines wrap normally. */}
        {words(statement.before).map((w, i) => (
          <Fragment key={`b${i}`}>
            <span data-word className="inline-block">
              {w}
            </span>{" "}
          </Fragment>
        ))}
        <span data-word data-accent className="accent-word inline-block pr-[0.08em]">
          {statement.highlight}
        </span>{" "}
        {words(statement.after).map((w, i) => (
          <Fragment key={`a${i}`}>
            <span data-word className="inline-block">
              {w}
            </span>{" "}
          </Fragment>
        ))}
      </p>

      <div data-about-services className="w-full max-w-[440px] justify-self-center lg:justify-self-end">
        <h3 className="mb-4 text-[13px] text-ink-faint">Services</h3>
        <ServiceCarousel services={services} />
      </div>
      </div>

      <div data-about-details className="relative mt-20 sm:mt-28">

        <div data-about-elsewhere className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:gap-10">
          <h3 className="shrink-0 text-[13px] text-ink-faint">Elsewhere</h3>
          <ul className="flex flex-wrap gap-2.5">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/[0.03] py-2.5 pl-4 pr-3.5 text-[14px] font-medium text-ink ring-1 ring-white/10 transition-colors duration-300 hover:bg-white/[0.07] hover:ring-white/25"
                >
                  {s.label}
                  <span className="text-ink-muted transition-colors duration-300 group-hover:text-ink">{s.handle}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-ink-muted transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.75}
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
