import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header
      data-hero-reveal
      className="fixed inset-x-0 top-0 z-30 flex cursor-auto items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12"
    >
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
