"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { WORK_PIN_ID } from "@/components/providers/smooth-scroll";
import { sideIn } from "@/lib/reveal";
import { ProjectCard } from "./project-card";
import { ComingSoonCard } from "./coming-soon-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Work: on desktop the section pins and the cards slide sideways as you scroll
 * down (one vertical scroll = one horizontal move, synced through Lenis).
 * On phones and tablets it's a simple vertical stack.
 */
export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { work } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        // Must be linear (ease: none) so scroll position maps 1:1 to horizontal position.
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: WORK_PIN_ID, // in-page links use this to skip past the track
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7, // a touch of easing so the track glides rather than tracks the wheel 1:1
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progressRef.current, { scaleX: self.progress }),
          },
        });

        // Gentle parallax: each cover's logo drifts against the direction of travel.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 10 },
            {
              xPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: 0.7,
              },
            },
          );
        });

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Entrances: the intro glides in from the left, cards from the right, each
        // starting blurred and settling sharp. The first card is on screen when the
        // section arrives; later ones play as the track carries them into view.
        sideIn("[data-work-intro] > *", { from: "left", trigger: section, start: "top 70%" });
        const panels = gsap.utils.toArray<HTMLElement>("[data-work-panel]");
        panels.forEach((panel, i) => {
          if (i === 0) sideIn(panel, { from: "right", trigger: section, start: "top 60%", delay: 0.12 });
          else sideIn(panel, { from: "right", trigger: panel, start: "left 92%", containerAnimation: slide, distance: 0.06 });
        });
      });

      // Phones/tablets: a vertical stack, so content alternates sides as it scrolls in.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        sideIn("[data-work-intro] > *", { from: "left", trigger: sectionRef.current!, start: "top 75%" });
        gsap.utils.toArray<HTMLElement>("[data-work-panel]").forEach((panel, i) => {
          sideIn(panel, { from: i % 2 ? "left" : "right", trigger: panel, start: "top 85%" });
        });
      });

      // Fonts change text widths, so re-measure once they've loaded.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="work-heading"
      className="relative overflow-hidden bg-black md:h-svh"
      // Cover width: limited by viewport width AND height (cover + ~21rem of text and margins must fit).
      style={{ "--cover-w": "min(62vw, 1040px, calc((100svh - 21rem) * 1.6))" } as React.CSSProperties}
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-16 px-5 py-24 sm:px-8 md:h-full md:w-max md:flex-row md:items-start md:gap-[6vw] md:px-12 md:pb-0 md:pt-[max(5rem,calc((100svh-var(--cover-w)*0.625-15rem)/2))]"
      >
        {/* Covers share a top line (items-start + computed top padding); the intro centres on its own. */}
        <header data-work-intro className="shrink-0 md:w-[min(30vw,440px)] md:self-center">

          <h2
            id="work-heading"
            className="text-[clamp(3rem,6.4vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink"
          >
            {work.heading}
          </h2>
          <p className="mt-6 max-w-[30ch] text-[15px] leading-[1.45] text-ink-muted sm:text-base">{work.intro}</p>
          <p aria-hidden className="mt-10 hidden items-center gap-3 text-[13px] text-ink-faint md:flex">
            <span className="h-px w-10 bg-ink-faint/60" />
            Keep scrolling
          </p>
        </header>

        {work.projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}

        <ComingSoonCard {...work.comingSoon} />

        {/* Breathing room at the end of the track on desktop. */}
        <div aria-hidden className="hidden w-[4vw] shrink-0 md:block" />
      </div>

      {/* Horizontal progress (desktop). */}
      <div aria-hidden className="absolute inset-x-12 bottom-6 hidden h-px bg-white/10 md:block">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-ink/70" />
      </div>
    </section>
  );
}
