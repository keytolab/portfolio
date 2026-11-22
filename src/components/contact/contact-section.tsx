"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { GRAIN_TEXTURE } from "@/lib/grain";
import { sideIn } from "@/lib/reveal";
import { CopyEmailButton } from "./copy-email-button";

gsap.registerPlugin(useGSAP);

/**
 * Contact: a closing headline that mirrors the About statement, one large
 * email link (opens the visitor's mail app) with a copy button, and a quiet
 * footer with socials and a way back to the top. The blue glow from the hero
 * returns at the bottom, so the page ends where it began.
 */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { headline, intro, email, backToTop, copyrightYear } = site.contact;
  const { socials } = site.about;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sideIn("[data-contact-headline]", { from: "left", trigger: "[data-contact-headline]", start: "top 85%", distance: 0.1 });
        sideIn("[data-contact-email]", { from: "right", trigger: "[data-contact-email]", start: "top 90%", delay: 0.1 });
        sideIn("[data-contact-footer] > *", { from: "left", trigger: "[data-contact-footer]", start: "top 98%", distance: 0.03 });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative flex min-h-svh flex-col overflow-clip bg-black px-5 pt-32 sm:px-8 sm:pt-40 lg:px-12"
    >
      {/* The hero's blue glow returns at the very bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[35vh] left-1/2 h-[80vh] w-[120vw] -translate-x-1/2"
        style={{ background: "radial-gradient(closest-side, rgb(26 58 143 / 0.55), rgb(10 26 69 / 0.25) 55%, transparent)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: GRAIN_TEXTURE }} />

      <div className="relative flex flex-1 flex-col justify-center">
        <h2
          id="contact-heading"
          data-contact-headline
          className="max-w-[14ch] text-[clamp(3rem,8.5vw,9rem)] font-medium leading-[0.98] tracking-[-0.05em] text-ink"
        >
          {headline.before} <span className="accent-word">{headline.highlight}</span>
          {headline.after}
        </h2>

        <div data-contact-email className="mt-14 sm:mt-20">
          <p className="max-w-[40ch] text-[15px] leading-[1.45] text-ink-muted sm:text-base">{intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href={`mailto:${email}`}
              className="group relative text-[clamp(1.6rem,4.4vw,4rem)] font-medium leading-none tracking-[-0.035em] text-ink [overflow-wrap:anywhere]"
            >
              {email}
              {/* Underline that draws in from the left on hover/focus. */}
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
            <CopyEmailButton email={email} />
          </div>
        </div>
      </div>

      <footer
        data-contact-footer
        className="relative mt-24 flex flex-col gap-6 border-t border-white/10 py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                {s.label}
                <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-8 text-ink-faint sm:justify-end">
          <p>
            © {copyrightYear} {site.name}
          </p>
          <a href="#top" className="text-ink-muted transition-colors duration-300 hover:text-ink">
            {backToTop}
          </a>
        </div>
      </footer>
    </section>
  );
}
