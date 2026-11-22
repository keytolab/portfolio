"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/*
  Liquid-glass lens (in the spirit of Apple's Liquid Glass).

  Refraction: the lens applies an SVG displacement filter to whatever is
  *behind* it (backdrop-filter: url(#…)). A generated displacement map bends
  light gently in the middle and strongly near the rim, the way a thick glass
  drop does. The red, green and blue channels are displaced by slightly
  different amounts, which leaves a faint rainbow along edges.

  It is the site-wide cursor (the native cursor is hidden while it's active).
  Motion: the lens follows the pointer like a camera move — it eases in, glides,
  and eases out to a stop with no overshoot. It never changes shape.
  Size: full size over the hero, shrinking smoothly as you scroll down into the
  rest of the page, and smaller still over links and buttons.

  backdrop-filter with an SVG url() only renders in Chromium browsers. Elsewhere
  the lens falls back to clear frosted glass with the same rim and motion.
*/

// How much each colour channel is displaced, relative to the full amount.
// Close together = subtle rainbow.
const CHANNEL_STRENGTH = { r: 1, g: 0.975, b: 0.95 };

// Refraction profile, in lens-radius units: a pixel at radius r samples from
// radius r − d(r). MAGNIFY is the gentle zoom everywhere; RIM is the extra bend
// that ramps up (r^RIM_POWER) towards the edge. Kept so that r − d(r) always
// increases (RIM·RIM_POWER < 1 − MAGNIFY), otherwise the edge folds over and mirrors.
const MAGNIFY = 0.17;
const RIM = 0.18;
const RIM_POWER = 4;
const MAX_D = MAGNIFY + RIM;

/** Displacement map: R/G encode where each pixel samples from (128 = no shift). */
function makeDisplacementMap(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(size, size);
  const R = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x + 0.5 - R) / R;
      const ny = (y + 0.5 - R) / R;
      const r = Math.hypot(nx, ny);
      let dx = 0;
      let dy = 0;
      if (r < 1 && r > 0) {
        // Sample towards the centre (negative = inward), normalised to [-1, 1].
        const d = MAGNIFY * r + RIM * Math.pow(r, RIM_POWER);
        dx = -(nx / r) * (d / MAX_D);
        dy = -(ny / r) * (d / MAX_D);
      }
      const i = (y * size + x) * 4;
      img.data[i] = Math.round(128 + dx * 127);
      img.data[i + 1] = Math.round(128 + dy * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

function isChromium() {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } })
    .userAgentData?.brands;
  return !!brands?.some((b) => /Chromium/i.test(b.brand));
}

// Lens size relative to full: in the hero, after scrolling past it, and over a link/button.
const HERO_SCALE = 1;
const PAGE_SCALE = 0.28;
const CONTROL_SCALE = 0.4; // multiplied with the current scale

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * True over links, buttons and form fields, where the lens shrinks.
 * Add `data-lens-ignore` to any element (e.g. a big clickable image) to keep
 * the lens at its normal size over it.
 */
function isControl(el: Element | null | undefined) {
  if (!el?.closest) return false;
  if (el.closest("[data-lens-ignore]")) return false;
  return !!el.closest("a, button, [role='button'], input, textarea, select, label");
}

export function GlassLens() {
  const filterId = `liquid-glass-${useId().replace(/:/g, "")}`;
  const bodyRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [size, setSize] = useState(0);

  // Desktop + real mouse + motion welcome.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const apply = () => setSupported(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Lens diameter follows the viewport; the displacement map is rebuilt to match.
  useEffect(() => {
    if (!supported) return;
    const measure = () => setSize(Math.round(Math.min(230, Math.max(150, window.innerWidth * 0.14))));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [supported]);

  // `size` is only set in the browser, so this never runs during server render.
  // Non-Chromium browsers get no map → frosted-glass fallback.
  const map = useMemo(() => (size && isChromium() ? makeDisplacementMap(size) : null), [size]);

  // Hide the native cursor while the lens stands in for it.
  useEffect(() => {
    if (!supported) return;
    document.documentElement.classList.add("lens-cursor");
    return () => document.documentElement.classList.remove("lens-cursor");
  }, [supported]);

  // Pointer follow on GSAP's ticker (shared with Lenis).
  useEffect(() => {
    const body = bodyRef.current;
    if (!supported || !body || !size) return;

    const R = size / 2;
    const target = { x: 0, y: 0 };
    const mid = { x: 0, y: 0 }; // first smoothing stage
    const pos = { x: 0, y: 0, s: 0 }; // second stage = what's drawn
    let seen = false;
    let inside = false;
    let overControl = false;

    // Camera-style follow: two exponential smoothing stages in series. One stage
    // alone starts abruptly; two give an ease-in *and* ease-out, like a dolly
    // shot, and never overshoot. Time constants in seconds — larger = slower glide.
    const FOLLOW_TAU = 0.065;
    const SCALE_TAU = 0.12;
    const approach = (from: number, to: number, tau: number, dt: number) =>
      from + (to - from) * (1 - Math.exp(-dt / tau));

    // Viewport coordinates: the lens layer is position: fixed, so scrolling needs no correction.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      inside = true;
      overControl = isControl(e.target as Element | null);
      if (!seen) {
        seen = true;
        pos.x = mid.x = target.x;
        pos.y = mid.y = target.y;
      }
    };
    // The element under a still pointer changes while scrolling, so re-check it then.
    const onScroll = () => {
      if (!seen) return;
      const el = document.elementFromPoint(target.x, target.y);
      overControl = isControl(el);
    };
    const onLeave = () => (inside = false);
    const onEnter = () => (inside = true);

    const tick = () => {
      // Real elapsed seconds, capped so a backgrounded tab doesn't jump.
      const dt = Math.min(gsap.ticker.deltaRatio(60), 3) / 60;
      mid.x = approach(mid.x, target.x, FOLLOW_TAU, dt);
      mid.y = approach(mid.y, target.y, FOLLOW_TAU, dt);
      pos.x = approach(pos.x, mid.x, FOLLOW_TAU, dt);
      pos.y = approach(pos.y, mid.y, FOLLOW_TAU, dt);

      // Scroll-linked size: full in the hero, easing down to PAGE_SCALE over the
      // first ~35% of a screen of scrolling. Driven by scroll position, so it
      // shrinks as you scroll (and grows back if you scroll up).
      const hero = document.getElementById("top");
      const span = (hero?.offsetHeight ?? window.innerHeight) * 0.35;
      const t = smoothstep(Math.min(1, Math.max(0, window.scrollY / span)));
      const base = HERO_SCALE + (PAGE_SCALE - HERO_SCALE) * t;
      const targetScale = !inside ? 0 : overControl ? base * CONTROL_SCALE : base;
      pos.s = approach(pos.s, targetScale, SCALE_TAU, dt);
      const s = Math.max(pos.s, 0);

      // The lens always stays a perfect circle; only position and size change.
      body.style.transform =
        `translate3d(${(pos.x - R).toFixed(2)}px, ${(pos.y - R).toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      body.style.opacity = s < 0.02 ? "0" : "1";
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerenter", onEnter);
    window.addEventListener("scroll", onScroll, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [supported, size]);

  if (!supported || !size) return null;

  // Overall refraction strength. Tuned by eye in Chrome: the browser reads the
  // map more strongly than the nominal maths suggests, so this is ~half of MAX_D·size.
  // Higher = more magnification and rim bend; lower = flatter glass.
  const scale = Math.round(size * 0.18);
  const useRefraction = !!map;
  const backdrop = useRefraction
    ? `url(#${filterId}) saturate(1.25) brightness(1.06)`
    : "blur(5px) saturate(1.4) brightness(1.08)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {useRefraction && (
        <svg width="0" height="0" className="absolute" focusable="false">
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={map!} x="0" y="0" width={size} height={size} preserveAspectRatio="none" result="map" />
            {(["r", "g", "b"] as const).map((ch) => (
              <feDisplacementMap
                key={ch}
                in="SourceGraphic"
                in2="map"
                scale={scale * CHANNEL_STRENGTH[ch]}
                xChannelSelector="R"
                yChannelSelector="G"
                result={`d${ch}`}
              />
            ))}
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cr" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cg" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cb" />
            <feBlend in="cr" in2="cg" mode="screen" result="rg" />
            <feBlend in="rg" in2="cb" mode="screen" />
          </filter>
        </svg>
      )}

      <div
        ref={bodyRef}
        className="absolute left-0 top-0 rounded-full will-change-transform"
        style={{ width: size, height: size, opacity: 0, transform: "scale(0)" }}
      >
        {/* The glass itself: refracts (or frosts) what's behind it. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
        />
        {/* Specular light: a soft glint top-left, a faint bounce bottom-right.
            Normal blending on purpose — a blend mode here would isolate the lens
            and cut the glass off from the page behind it. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(60% 45% at 30% 18%, rgb(255 255 255 / 0.14), transparent 70%), radial-gradient(50% 35% at 72% 88%, rgb(190 210 255 / 0.07), transparent 70%)",
          }}
        />
        {/* Rim: bright where light enters (top-left), dimmer on the far side, soft inner depth. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: [
              "inset 1.5px 1.5px 0.5px -0.5px rgb(255 255 255 / 0.7)",
              "inset -1px -1px 0.5px -0.5px rgb(255 255 255 / 0.35)",
              "inset 0 0 0 0.5px rgb(255 255 255 / 0.18)",
              "inset 0 0 22px rgb(255 255 255 / 0.06)",
              "0 12px 32px -14px rgb(0 0 0 / 0.55)",
            ].join(", "),
          }}
        />
      </div>
    </div>
  );
}
