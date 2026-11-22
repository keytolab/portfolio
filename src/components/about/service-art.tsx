// Illustrations for the service cards, drawn with HTML/CSS/SVG so they stay crisp
// at any size and can move gently. Palette: the site's blues + the yellow accent.
// All looping motion uses `motion-safe:` so it stops when reduced motion is on.

const YELLOW = "#ffd60a";

/** Motion graphics: a film frame with a glass play button and a timeline being scrubbed. */
function MotionArt() {
  return (
    <div className="absolute inset-0">
      {/* Slowly turning colour field, like a lens flare across footage. */}
      <div
        className="absolute left-1/2 top-[42%] size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl motion-safe:animate-[spin_18s_linear_infinite]"
        style={{ background: `conic-gradient(from 0deg, #1a3a8f, #06112b, ${YELLOW}55, #3f66c2, #06112b, #1a3a8f)` }}
      />
      {/* Frame corners. */}
      <div className="absolute inset-[14%] rounded-2xl ring-1 ring-white/15" />
      {/* Glass play button. */}
      <div className="absolute left-1/2 top-[42%] flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30 backdrop-blur-md sm:size-28">
        <svg viewBox="0 0 24 24" className="ml-1 size-9 fill-white" aria-hidden>
          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
        </svg>
      </div>
      {/* Timeline with keyframes and a playhead. */}
      <div className="absolute inset-x-[14%] top-[70%]">
        <div className="relative h-1 rounded-full bg-white/15">
          <div
            className="absolute inset-y-0 left-0 w-[62%] rounded-full motion-safe:animate-[timeline_5s_ease-in-out_infinite_alternate]"
            style={{ background: YELLOW, boxShadow: `0 0 16px ${YELLOW}` }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="size-2 rotate-45 bg-white/40" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Window({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <div className={`absolute w-[64%] rounded-2xl bg-[#0b0f1a]/90 p-4 ring-1 ring-white/12 backdrop-blur-sm ${className}`}>
      <div className="mb-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-white/20" />
        ))}
      </div>
      {children ?? (
        <div className="space-y-2">
          <span className="block h-2 w-3/4 rounded-full bg-white/10" />
          <span className="block h-2 w-1/2 rounded-full bg-white/10" />
        </div>
      )}
    </div>
  );
}

/** UI/UX: three app windows fanned out, the front one with a switch, a button and a cursor. */
function UiArt() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-[40%] size-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#1a3a8f88,transparent)]" />
      <Window className="left-[6%] top-[14%] -rotate-6 opacity-60" />
      <Window className="right-[6%] top-[20%] rotate-6 opacity-70" />
      <Window className="left-1/2 top-[26%] -translate-x-1/2 shadow-2xl shadow-black/60">
        <div className="space-y-3">
          <span className="block h-2.5 w-2/3 rounded-full bg-white/80" />
          <span className="block h-2 w-full rounded-full bg-white/15" />
          <span className="block h-2 w-5/6 rounded-full bg-white/15" />
          <div className="flex items-center justify-between pt-2">
            {/* Toggle switch, on. */}
            <span className="relative h-5 w-9 rounded-full" style={{ background: YELLOW }}>
              <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-black" />
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-black">Continue</span>
          </div>
        </div>
      </Window>
      {/* Pointer arrow, drifting as if moving toward the button. */}
      <svg
        viewBox="0 0 24 24"
        className="absolute right-[24%] top-[54%] size-7 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] motion-safe:animate-[float_4s_ease-in-out_infinite]"
        aria-hidden
      >
        <path d="M4 2.5 20 11l-7.2 1.6L9.6 20 4 2.5Z" fill="#fff" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Web development: a glowing </> over a receding grid, inside a browser frame. */
function WebArt() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Perspective grid floor. */}
      <div className="absolute inset-x-[-30%] bottom-[-10%] h-[70%] [perspective:400px]">
        <div
          className="absolute inset-0 origin-bottom [transform:rotateX(62deg)] motion-safe:animate-[grid_6s_linear_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(79 118 204 / 0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(79 118 204 / 0.35) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "linear-gradient(to top, #000 20%, transparent)",
          }}
        />
      </div>
      {/* Browser chrome. */}
      <div className="absolute inset-x-[12%] top-[12%] flex items-center gap-1.5 rounded-t-xl border border-b-0 border-white/12 bg-white/[0.04] px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-white/25" />
        ))}
        <span className="ml-3 h-2 w-1/3 rounded-full bg-white/10" />
      </div>
      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 font-mono text-[clamp(4rem,9vw,7rem)] font-semibold tracking-[-0.06em]"
        style={{ color: YELLOW, textShadow: `0 0 24px ${YELLOW}88, 0 0 60px ${YELLOW}44` }}
      >
        {"</>"}
      </div>
    </div>
  );
}

/** Branding: a monogram mark with orbiting rings and the brand's colour swatches. */
function BrandArt() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-[42%] size-[78%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full border border-dashed border-white/15 motion-safe:animate-[spin_40s_linear_infinite]" />
        <div className="absolute inset-[14%] rounded-full border border-white/10 motion-safe:animate-[spin_26s_linear_infinite_reverse]">
          <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full" style={{ background: YELLOW, boxShadow: `0 0 14px ${YELLOW}` }} />
        </div>
        {/* The mark: same "k" monogram as the site icon. */}
        <div
          className="absolute inset-[30%] flex items-center justify-center rounded-[28%] text-[clamp(2.5rem,5vw,4rem)] font-semibold text-[#f2f3f5] shadow-2xl shadow-black/60"
          style={{ background: "radial-gradient(circle at 38% 62%, #3f66c2 0%, #1a3a8f 40%, #000 100%)" }}
        >
          k
        </div>
      </div>
      {/* Swatches. */}
      <div className="absolute inset-x-0 top-[78%] flex justify-center gap-2.5">
        {["#000000", "#1a3a8f", "#3f66c2", YELLOW, "#f2f3f5"].map((c) => (
          <span key={c} className="size-6 rounded-full ring-1 ring-white/20" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

export function ServiceArt({ kind }: { kind: string }) {
  switch (kind) {
    case "motion":
      return <MotionArt />;
    case "ui":
      return <UiArt />;
    case "web":
      return <WebArt />;
    default:
      return <BrandArt />;
  }
}
