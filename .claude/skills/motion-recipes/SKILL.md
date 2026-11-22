---
name: motion-recipes
description: Reference library of 58 tested visual-effect recipes (grain textures, liquid glass, shader backdrops with refraction and chromatic aberration, split-text and blur-rise headlines, magnetic hover, stacking cards, carousels, scroll reveals, 3D) plus taste rules with concrete numbers for type, colour, spacing and motion. Use when implementing or tuning an animation, effect, texture or interaction in this portfolio.
---

# Motion recipes (reference only)

Recipes and taste rules adapted from the MIT-licensed part of the MotionSites skill (see `LICENSE.txt`). This is a code reference, not a workflow.

## How to use
1. Open `techniques/INDEX.md`, pick the recipe(s) that fit, then read only that section of the category file.
2. Use `craft.md` for type scale, tracking, spacing, colour and motion timing values.
3. **Port, don't paste.** Recipes are written as vanilla single-file / CDN code. This project is Next.js + React + TypeScript + Tailwind, so:
   - Use the installed npm packages (`gsap`, `@gsap/react`, `lenis`, `motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `@paper-design/shaders-react`), never CDN script tags or import maps.
   - Put browser-only effects in `'use client'` components; clean up listeners, RAF loops, GSAP contexts and WebGL resources on unmount.
   - Drive scroll-linked motion through Lenis + GSAP ScrollTrigger (see the `lenis` and `gsap-*` skills), not a separate scroll listener.
4. Keep each recipe's `prefers-reduced-motion` and touch/mobile branches.
5. Follow the INDEX guidance: one signature effect per page, 2–4 quiet supporting ones, at most one heavy (WebGL) effect per view.

## Most relevant for this portfolio
- Animated shader backdrop / chroma blob, refraction, aberration, grain → `techniques/3d-and-webgl.md`
- Grain and noise texture overlays, liquid glass → `techniques/surfaces-and-buttons.md`
- Split-text, blur-rise, serif-italic accent → `techniques/type-and-text-motion.md`
- Magnetic hover, custom cursor, depth carousel → `techniques/depth-and-interaction.md`
- Stacking case-study cards, scroll reveals → `techniques/scroll.md`
- Floating pill nav, mobile menu → `techniques/layout-and-ui.md`

When frontend-design and these recipes disagree on a style choice (e.g. a single italic accent word), the user's own reference design wins; ask if unclear.
