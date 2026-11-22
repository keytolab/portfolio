"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

// Slow, grainy blue blob on black. The CSS gradient underneath is what shows
// before WebGL starts (or if it's unavailable), so there's never a flat black flash.
export function BlobBackground() {
  const [speed, setSpeed] = useState(0.22);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSpeed(mq.matches ? 0 : 0.22);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 38% 58%, #1a3a8f 0%, #0a1a45 45%, #000 80%)",
        }}
      />
      {/* Mostly-black colour set: the blues only bloom where the mesh lets them through. */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#000000", "#06112b", "#1a3a8f", "#000000", "#3f66c2", "#000000"]}
        distortion={0.85}
        swirl={0.35}
        grainMixer={0.18}
        grainOverlay={0.22}
        speed={speed}
        scale={0.9}
        maxPixelCount={1920 * 1080}
      />
      {/* Fade to black at the edges so type stays crisp and the next section can begin in black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(0 0 0 / 0.55), transparent 22%, transparent 62%, #000 100%)",
        }}
      />
    </div>
  );
}
