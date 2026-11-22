"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GRAIN_TEXTURE } from "@/lib/grain";
import { ServiceArt } from "./service-art";

type Service = { title: string; tagline: string; icon: string };

/**
 * One service card at a time. Swipe/drag it (touch or mouse), use the arrows,
 * the dots, or the ← → keys. Cards slide with the same blur-and-settle feel as
 * the rest of the site: the card leaving blurs out as the next one sharpens in.
 */
export function ServiceCarousel({ services }: { services: readonly Service[] }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startY: 0, dx: 0, t: 0, axis: "" as "" | "x" | "y", id: -1 });
  const count = services.length;

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(count - 1, i))), [count]);

  // Position the track; during a drag it follows the finger with no transition.
  const place = useCallback(
    (dx = 0) => {
      const track = trackRef.current;
      const w = viewportRef.current?.offsetWidth ?? 0;
      if (!track) return;
      // Rubber-band at the ends so it can't be dragged far past the first/last card.
      const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
      const offset = atEdge ? dx * 0.3 : dx;
      track.style.transform = `translate3d(${-index * w + offset}px, 0, 0)`;
    },
    [index, count],
  );

  useEffect(() => {
    place();
    const onResize = () => place();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { startX: e.clientX, startY: e.clientY, dx: 0, t: performance.now(), axis: "", id: e.pointerId };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    // Decide once whether this is a horizontal swipe or a vertical page scroll.
    if (!d.axis && Math.hypot(dx, dy) > 6) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") {
        // Keep receiving moves even if the pointer leaves the card. Can throw if the
        // pointer was already released; the swipe still works without it.
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        setDragging(true);
      }
    }
    if (d.axis !== "x") return;
    d.dx = dx;
    place(dx);
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    if (d.axis !== "x") return;
    const w = viewportRef.current?.offsetWidth ?? 1;
    const velocity = d.dx / Math.max(1, performance.now() - d.t); // px per ms
    setDragging(false);
    // Change card on a long-enough drag or a quick flick.
    if (d.dx < -w * 0.18 || velocity < -0.45) go(index + 1);
    else if (d.dx > w * 0.18 || velocity > 0.45) go(index - 1);
    else place();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Services"
      className="relative"
      onKeyDown={onKeyDown}
    >
      <div
        ref={viewportRef}
        className="relative touch-pan-y select-none overflow-hidden rounded-[28px]"
        // Horizontal swipes belong to the carousel, not to smooth scrolling.
        data-lenis-prevent-horizontal
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={trackRef}
          className={`flex ${dragging ? "" : "transition-transform duration-[900ms] ease-[var(--ease-out-expo)] motion-reduce:duration-200"}`}
          aria-live="polite"
        >
          {services.map((s, i) => {
            const active = i === index;
            return (
              <article
                key={s.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${s.title}`}
                aria-hidden={!active}
                className={`relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[28px] bg-[#05070c] ring-1 ring-inset ring-white/[0.08] transition-[filter,opacity] duration-[900ms] ease-[var(--ease-out-expo)] max-lg:aspect-[5/6] ${
                  active ? "opacity-100 blur-0" : "opacity-40 blur-[10px]"
                }`}
              >
                <ServiceArt kind={s.icon} />
                {/* Fade the art into the caption area. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: GRAIN_TEXTURE }} />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[13px] text-ink-muted">{s.tagline}</p>
                  <h4 className="mt-1 text-[clamp(1.6rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.035em] text-ink">
                    {s.title}
                  </h4>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Controls: progress dots + arrows. */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {services.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === index}
              className="group -m-2 p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  i === index ? "w-7 bg-ink" : "w-1.5 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous service"
            className="flex size-10 items-center justify-center rounded-full text-ink ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/[0.07] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === count - 1}
            aria-label="Next service"
            className="flex size-10 items-center justify-center rounded-full text-ink ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/[0.07] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
