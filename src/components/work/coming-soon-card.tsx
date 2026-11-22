import { ArrowUpRight } from "lucide-react";
import { GRAIN_TEXTURE } from "@/lib/grain";

// Mirrors ProjectCard's structure (cover, then text below) so the two line up in the track.
export function ComingSoonCard({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <aside data-work-panel aria-labelledby="coming-soon-title" className="w-full shrink-0 md:w-[min(34vw,520px)]">
      {/* Same height as a project cover on desktop. */}
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[22px] bg-[#05070c] ring-1 ring-white/[0.07] sm:rounded-[28px] md:aspect-auto md:h-[calc(var(--cover-w)*0.625)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 55% at 50% 60%, rgb(26 58 143 / 0.32), transparent 75%)" }}
        />
        <div aria-hidden className="absolute inset-0 opacity-25 mix-blend-overlay" style={{ backgroundImage: GRAIN_TEXTURE }} />
        {/* Three quiet placeholder bars, like slots waiting to be filled. */}
        <div aria-hidden className="relative flex w-[46%] flex-col gap-3">
          {[1, 0.7, 0.45].map((w) => (
            <span key={w} className="h-2 rounded-full bg-white/[0.07]" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3
          id="coming-soon-title"
          className="text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-ink"
        >
          {title}
        </h3>
        <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.45] text-ink-muted sm:text-base">{description}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-ink ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/[0.06]"
        >
          {linkLabel}
          <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </aside>
  );
}
