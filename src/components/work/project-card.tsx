import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GRAIN_TEXTURE } from "@/lib/grain";

export type Project = {
  slug: string;
  title: string;
  description: string;
  role: string;
  year: string;
  type: string;
  href: string;
  linkLabel: string;
  accent: string;
  // Give one: a logo centred on a brand glow, or a full-bleed cover image (e.g. a screenshot).
  logo?: string;
  cover?: string;
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { accent } = project;

  return (
    <article
      data-work-panel
      aria-labelledby={`${project.slug}-title`}
      className="group w-full shrink-0 md:w-[var(--cover-w)]"
    >
      {/* Cover: the whole visual is also a link, but hidden from tab order to avoid a duplicate stop. */}
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        // Large image link: keep the glass cursor at full size over it.
        data-lens-ignore
        className="relative block aspect-[16/10] overflow-hidden rounded-[22px] bg-[#030504] ring-1 ring-white/[0.07] sm:rounded-[28px]"
      >
        {project.cover ? (
          // Full-bleed cover. It's wider than the card so the parallax drift (±10%
          // of its width) never shows an edge; zooms in slightly on hover.
          <div data-parallax className="absolute inset-y-0 -inset-x-[14%]">
            <div className="absolute inset-0 opacity-85 transition-[opacity,scale] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:opacity-100">
              <Image
                src={project.cover}
                alt=""
                fill
                sizes="(min-width: 768px) 75vw, 130vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ) : project.logo ? (
          <>
            {/* Brand glow — brightens on hover. */}
            <div
              className="absolute inset-0 opacity-80 transition-opacity duration-700 ease-[var(--ease-out-expo)] group-hover:opacity-100"
              style={{
                background: `radial-gradient(52% 62% at 50% 58%, color-mix(in srgb, ${accent} 42%, transparent), color-mix(in srgb, ${accent} 10%, transparent) 55%, transparent 78%)`,
              }}
            />
            {/* Logo, with a slow parallax drift while the track scrolls (data-parallax). */}
            <div data-parallax className="absolute inset-0 flex items-center justify-center">
              <div className="relative aspect-square w-[24%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
                <Image
                  src={project.logo}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 16vw, 24vw"
                  className="object-contain"
                  style={{ filter: `drop-shadow(0 18px 60px color-mix(in srgb, ${accent} 55%, transparent))` }}
                  priority={index === 0}
                />
              </div>
            </div>
          </>
        ) : null}
        {/* Grain + soft vignette so it sits in the same world as the hero. */}
        <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: GRAIN_TEXTURE }} />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.55))" }}
        />
        <span className="absolute left-5 top-4 text-[13px] text-ink-muted sm:left-7 sm:top-6">
          {String(index + 1).padStart(2, "0")}
        </span>
      </a>

      <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <div>
          <h3
            id={`${project.slug}-title`}
            className="text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-ink"
          >
            {project.title}
          </h3>
          <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.45] text-ink-muted sm:text-base">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
          <dl className="grid grid-cols-3 gap-x-8 text-[13px]">
            {[
              ["Role", project.role],
              ["Year", project.year],
              ["Type", project.type],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-faint">{label}</dt>
                <dd className="mt-1 whitespace-nowrap text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-black transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
          >
            {project.linkLabel}
            <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
