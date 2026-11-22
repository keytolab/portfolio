import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SideInOptions = {
  /** Which side the content travels in from. */
  from?: "left" | "right";
  trigger: gsap.DOMTarget;
  /** ScrollTrigger start, e.g. "top 80%" (or "left 90%" with containerAnimation). */
  start?: string;
  /** For content inside the horizontal work track. */
  containerAnimation?: gsap.core.Animation;
  /** Travel distance as a fraction of the viewport width. */
  distance?: number;
  stagger?: number;
  delay?: number;
};

// Motion tokens for every side-in, so the whole site moves with one rhythm.
const MOVE_DURATION = 1.8; // position + focus
const FADE_DURATION = 1.1; // opacity settles sooner than the move, so nothing "ghosts" in
const MOVE_EASE = "power3.out"; // long, gentle deceleration (softer start than expo)
const START_BLUR = 12; // px

/**
 * The site's signature entrance: content glides in from the side, starting
 * blurred and transparent, and settles sharp — like a camera pulling focus.
 * Plays when the trigger arrives and reverses if you scroll back above it.
 * Call inside a gsap.context/matchMedia that already excludes reduced motion.
 */
export function sideIn(
  targets: gsap.TweenTarget,
  { from = "left", trigger, start = "top 80%", containerAnimation, distance = 0.06, stagger = 0.12, delay = 0 }: SideInOptions,
) {
  const dir = from === "left" ? -1 : 1;
  const els = gsap.utils.toArray<HTMLElement>(targets);

  // Start state, set immediately so nothing flashes before its trigger.
  gsap.set(els, { x: () => dir * window.innerWidth * distance, filter: `blur(${START_BLUR}px)`, autoAlpha: 0 });

  return gsap
    .timeline({
      delay,
      scrollTrigger: {
        trigger,
        start,
        containerAnimation,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
      // Promote to their own layers only while moving, then release the memory.
      onStart: () => gsap.set(els, { willChange: "transform, filter, opacity" }),
      onComplete: () => gsap.set(els, { willChange: "auto" }),
      onReverseComplete: () => gsap.set(els, { willChange: "auto" }),
    })
    .to(els, { x: 0, filter: "blur(0px)", duration: MOVE_DURATION, ease: MOVE_EASE, stagger }, 0)
    .to(els, { autoAlpha: 1, duration: FADE_DURATION, ease: "power2.out", stagger }, 0);
}
