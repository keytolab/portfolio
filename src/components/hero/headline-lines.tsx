import { site } from "@/content/site";

// The headline's line markup, shared by the real <h1> and the glass lens copies
// so both always break and size identically.
export function HeadlineLines() {
  return (
    <>
      {site.hero.headline.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          <span className="hl-line block whitespace-nowrap">{line}</span>
        </span>
      ))}
    </>
  );
}
