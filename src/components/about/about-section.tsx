"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { GRAIN_TEXTURE } from "@/lib/grain";
import { sideIn } from "@/lib/reveal";

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
              // Fully lit once the statement's bottom passes ~60% — reached when
              // landing on #about from the menu, so the sentence never arrives half-dim.
              end: "bottom 60%",
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
        const [services, elsewhere] = gsap.utils.toArray<HTMLElement>("[data-about-detail]");
        sideIn(services, { from: "left", trigger: "[data-about-details]", start: "top 88%" });
        sideIn(elsewhere, { from: "right", trigger: "[data-about-details]", start: "top 88%", delay: 0.1 });
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
      className="relative overflow-hidden bg-black px-5 py-32 sm:px-8 sm:py-40 lg:px-12 lg:py-48"
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

      <p
        data-statement
        className="relative max-w-[20ch] text-[clamp(2.4rem,6vw,6.25rem)] font-medium leading-[1.02] tracking-[-0.045em] text-ink"
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

      <div
        data-about-details
        className="relative mt-20 grid gap-12 border-t border-white/10 pt-10 sm:mt-28 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr]"
      >
        <div data-about-detail>
          <h3 className="text-[13px] text-ink-faint">Services</h3>
          <ul className="mt-4 space-y-2 text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium tracking-[-0.02em] text-ink">
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div data-about-detail>
          <h3 className="text-[13px] text-ink-faint">Elsewhere</h3>
          <ul className="mt-4 space-y-2">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium tracking-[-0.02em] text-ink"
                >
                  {s.label}
                  <span className="text-ink-muted transition-colors duration-300 group-hover:text-ink">{s.handle}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 text-ink-muted transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
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
