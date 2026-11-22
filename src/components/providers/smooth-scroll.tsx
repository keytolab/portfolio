"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger id of the pinned, horizontally-scrolling work track (see work-section.tsx).
export const WORK_PIN_ID = "work-pin";

/**
 * One Lenis instance for the whole site, driven by GSAP's ticker so Lenis,
 * GSAP tweens/ScrollTrigger and the WebGL layers update on the same frame.
 *
 * In-page links (#work, #about…) get a cinematic "whip" scroll instead of
 * Lenis's default: a quick ease-in-out with motion blur that scales with speed.
 * If the route passes through the pinned horizontal work track, that stretch
 * is skipped — the scroll runs over a virtual distance with the pin removed and
 * hops across it at full speed, where the motion blur hides the cut.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  // Keep ScrollTrigger in step with Lenis on every scroll frame.
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    let running: gsap.core.Tween | null = null;

    const setBlur = (px: number) => {
      const el = blurRef.current;
      if (!el) return;
      const v = px < 0.15 ? "none" : `blur(${px.toFixed(2)}px)`;
      el.style.backdropFilter = v;
      el.style.setProperty("-webkit-backdrop-filter", v);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      // Looked up at click time: Lenis is created after this effect first runs.
      const lenis = lenisRef.current?.lenis;
      if (!lenis || !hash || hash === "#") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();

      const pin = ScrollTrigger.getById(WORK_PIN_ID);
      const from = window.scrollY;
      // A pinned section's on-screen position doesn't say where it starts in the page,
      // so for the work section (or anything inside it) use the pin's real start.
      const pinEl = pin?.trigger as HTMLElement | undefined;
      const to =
        pin && pinEl && (pinEl === target || pinEl.contains(target))
          ? Math.round(pin.start)
          : Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY));

      // Keyboard/screen-reader users should land on the target, not stay on the link.
      const finish = () => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      history.pushState(null, "", hash);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lenis.scrollTo(to, { immediate: true, force: true });
        finish();
        return;
      }

      // Virtual axis = the page with the pinned stretch cut out.
      const a = pin ? pin.start : Infinity;
      const len = pin ? Math.max(0, pin.end - pin.start) : 0;
      const toVirtual = (y: number) => (y <= a ? y : y >= a + len ? y - len : a);
      const toReal = (v: number) => (v <= a ? v : v + len);

      const vFrom = toVirtual(from);
      const vTo = toVirtual(to);
      const distance = Math.abs(vTo - vFrom);
      if (distance < 2) {
        finish();
        return;
      }

      running?.kill();
      lenis.stop(); // ignore wheel/touch while the shot plays
      const proxy = { v: vFrom };
      // Short hops get a lighter blur than long ones.
      const maxBlur = gsap.utils.clamp(4, 12, distance / 140);

      running = gsap.to(proxy, {
        v: vTo,
        duration: gsap.utils.clamp(0.9, 1.6, 0.7 + distance / 2600),
        ease: "power3.inOut",
        onUpdate: function () {
          const y = toReal(proxy.v);
          lenis.scrollTo(y, { immediate: true, force: true });
          ScrollTrigger.update();
          // Scrubbed animations normally ease toward their target; snap them so
          // nothing keeps sliding after the hop across the work track.
          pin?.getTween()?.progress(1);
          // Motion blur follows a smooth bell over the shot (peaks mid-way, where the
          // scroll is fastest and the hop happens) instead of jittery frame speeds.
          const p = this.progress();
          setBlur(maxBlur * Math.pow(Math.sin(Math.PI * p), 1.6));
        },
        onComplete: () => {
          setBlur(0);
          lenis.start();
          running = null;
          finish();
        },
      });
    };

    document.addEventListener("click", onClick);
    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener("click", onClick);
      running?.kill();
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.075 /* lower = silkier glide after each wheel flick */ }}>
      {children}
      {/* Motion-blur layer for link scrolls: blurs the page beneath it (below the glass cursor, z-50). */}
      <div ref={blurRef} aria-hidden className="pointer-events-none fixed inset-0 z-40" />
    </ReactLenis>
  );
}
