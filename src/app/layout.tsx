import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { site } from "@/content/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} antialiased`}>
      <body>
        <noscript>
          <style>{`.hero-pending .hl-line, .hero-pending [data-hero-reveal] { visibility: visible !important; }`}</style>
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
