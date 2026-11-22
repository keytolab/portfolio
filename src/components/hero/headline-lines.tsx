import { site } from "@/content/site";

// The headline's line markup, shared by the real <h1> and the glass lens copies
// so both always break and size identically.
export function HeadlineLines() {
  return (
    <>
      {site.hero.headline.map((line) => (
        // The mask (overflow-hidden) hides lines before they rise in. Its bottom padding must
        // clear descenders like "g" at this tight line-height; the negative margin keeps spacing.
        <span key={line} className="block overflow-hidden pb-[0.22em] -mb-[0.22em]">
          <span className="hl-line block whitespace-nowrap">{line}</span>
        </span>
      ))}
    </>
  );
}
