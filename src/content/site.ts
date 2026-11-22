// All copy for the site lives here, so it can be edited without touching components.
export const site = {
  name: "Jacek",
  title: "Jacek — Designer and developer",
  description:
    "Portfolio of Jacek, a designer and developer making calm, precise interfaces for the web.",
  // Only list sections that exist on the page. Add About / Contact back when those sections are built.
  nav: [{ label: "Work", href: "#work" }],
  hero: {
    // Each string is one line of the giant headline.
    headline: ["Designed", "and built."],
    intro: "Designer and developer making calm, precise interfaces for the web.",
    status: "Open to new projects",
    scrollLabel: "Scroll",
  },
  work: {
    heading: "Selected work",
    intro: "Motion, interfaces and identities, made with care from first frame to release.",
    projects: [
      {
        slug: "spotify-ad",
        title: "Spotify ad",
        description: "Apple-style motion graphics for Spotify.",
        role: "Design and release",
        year: "2026",
        type: "Motion graphics",
        href: "https://www.tiktok.com/@77forms/video/7635176330564226337",
        linkLabel: "Watch on TikTok",
        logo: "/work/spotify-logo.png",
        // Brand colour used for the card's glow.
        accent: "#1ed760",
      },
    ],
    comingSoon: {
      title: "More work soon",
      description: "New projects are in progress. Follow along on TikTok in the meantime.",
      href: "https://www.tiktok.com/@77forms",
      linkLabel: "Follow on TikTok",
    },
  },
} as const;
