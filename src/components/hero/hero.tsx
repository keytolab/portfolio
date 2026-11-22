"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { BlobBackground } from "./blob-background";
import { GlassLens } from "./glass-lens";
import { HeadlineLines } from "./headline-lines";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  // One orchestrated entrance: headline lines rise out of a blur, then the
  // quiet UI (nav, intro, scroll cue) settles in around it.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = gsap.utils.toArray<HTMLElement>(".hl-line");
      const quiet = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");

      if (reduce) {
        gsap.fromTo([...lines, ...quiet], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, onComplete: () => setEntered(true) });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "expo.out" }, onComplete: () => setEntered(true) })
        .fromTo(
          lines,
          { yPercent: 105, filter: "blur(18px)", autoAlpha: 0 },
          { yPercent: 0, filter: "blur(0px)", autoAlpha: 1, duration: 1.6, stagger: 0.14, delay: 0.15, clearProps: "filter" },
        )
        .fromTo(
          quiet,
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.08 },
          "-=1.05",
        );
    },
    { scope: heroRef },
  );

  return (
    <section
      id="top"
      ref={heroRef}
      // `hero-pending` hides content until GSAP's inline styles take over the entrance.
      className={`relative isolate flex min-h-[600px] h-svh flex-col justify-end overflow-hidden px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12 ${entered ? "md:cursor-none" : "hero-pending"}`}
    >
      <SiteHeader />
      <BlobBackground />

      <h1 className="display-type relative z-10 text-ink" aria-label={site.hero.headline.join(" ")}>
        <HeadlineLines />
      </h1>

      <div className="relative z-10 mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end sm:gap-8">
        <p data-hero-reveal className="max-w-[30ch] text-[15px] leading-[1.45] text-ink sm:text-base">
          {site.hero.intro}
        </p>
        <p data-hero-reveal className="flex items-center gap-2.5 text-[13px] text-ink-muted">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink/60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ink" />
          </span>
          {site.hero.status}
        </p>
        <a
          data-hero-reveal
          href="#work"
          className="hidden items-center gap-3 text-[13px] text-ink-muted transition-colors duration-300 hover:text-ink sm:flex"
        >
          {site.hero.scrollLabel}
          <span aria-hidden className="relative h-12 w-px overflow-hidden bg-ink-faint/40">
            <span className="scroll-line absolute inset-0" />
          </span>
        </a>
      </div>

      <GlassLens heroRef={heroRef} active={entered} />
    </section>
  );
}
