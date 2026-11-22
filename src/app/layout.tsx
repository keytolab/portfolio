import type { Metadata, Viewport } from "next";
import { Inter_Tight, Playfair_Display } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { GlassLens } from "@/components/cursor/glass-lens";
import { site } from "@/content/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Accent face for single highlighted words (italic only, so only that file loads).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  style: "italic",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  // Shown when the link is shared (iMessage, WhatsApp, LinkedIn, X…).
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${playfair.variable} antialiased`}>
      <body>
        <noscript>
          <style>{`.hero-pending .hl-line, .hero-pending [data-hero-reveal] { visibility: visible !important; }`}</style>
        </noscript>
        {/* First tab stop: lets keyboard users jump past the menu. Visible only when focused. */}
        <a
          href="#work"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-black focus:not-sr-only focus:fixed focus:left-5 focus:top-5"
        >
          Skip to work
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <GlassLens />
      </body>
    </html>
  );
}
