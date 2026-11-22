import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header
      data-hero-reveal
      className="fixed inset-x-0 top-0 z-30 flex cursor-auto items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12"
    >
      {/* Soft fade behind the bar so content scrolling underneath doesn't collide with it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[160%] bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      />
      <a href="#top" className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
        {site.name}
      </a>

      <nav aria-label="Main">
        <ul className="flex items-center gap-5 sm:gap-8">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-[13px] text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
