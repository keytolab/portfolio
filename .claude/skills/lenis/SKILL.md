---
name: lenis
description: Smooth scrolling with Lenis (darkroomengineering/lenis) in this Next.js portfolio, including syncing with GSAP ScrollTrigger and WebGL. Use when adding, configuring or debugging smooth scroll, scroll-linked animation, anchor links or nested scroll areas.
---

# Lenis smooth scroll

Official docs are bundled here: `reference.md` (core) and `react-reference.md` (`lenis/react`). Read them for settings, methods and events.

## Rules for this project
- Import `lenis/dist/lenis.css` once, in the root layout.
- Use **one** Lenis instance for the whole site, created in a client component (`'use client'`), e.g. via `ReactLenis root` from `lenis/react`.
- Drive Lenis from GSAP's ticker instead of its own RAF loop, so Lenis, GSAP tweens and the WebGL background stay in sync:
  ```js
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  ```
  With `ReactLenis`, pass `options={{ autoRaf: false }}` and add the ticker callback in an effect (remove it on cleanup).
- Enable `anchors: true` if the nav uses `#section` links.
- Mark scrollable overlays/modals with `data-lenis-prevent`.
- Lenis honors `prefers-reduced-motion` by default; keep it that way and check `lenis.prefersReducedMotion` to tone down custom animations too.
- No CSS scroll-snap with Lenis — use `lenis/snap` if snapping is needed.
