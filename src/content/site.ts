// All copy for the site lives here, so it can be edited without touching components.
export const site = {
  name: "Jacek",
  title: "Jacek — Designer and developer",
  description:
    "Portfolio of Jacek, a designer and developer making calm, precise interfaces for the web.",
  // Only list sections that exist on the page.
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
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
  about: {
    // The statement is split into three parts; `highlight` gets the yellow, glowing italic.
    statement: {
      before: "I'm Jacek, a designer and developer making",
      highlight: "unforgettable",
      after: "motion, interfaces and brands.",
    },
    services: ["Motion graphics", "UI/UX design", "Web development", "Branding"],
    // Shown in this order.
    socials: [
      { label: "TikTok", handle: "@77forms", href: "https://www.tiktok.com/@77forms" },
      { label: "X", handle: "@gigovfx", href: "https://x.com/gigovfx" },
      { label: "YouTube", handle: "@gigovfx", href: "https://www.youtube.com/@gigovfx" },
      { label: "GitHub", handle: "keyzlab", href: "https://github.com/keyzlab" },
    ],
  },
  contact: {
    // Headline split like the About statement; `highlight` gets the yellow, glowing italic.
    headline: { before: "Let's create the", highlight: "unforgettable", after: "." },
    intro: "Projects, collaborations or just a hello. Write to me directly.",
    email: "keyzzlab@gmail.com",
    backToTop: "Back to top",
    // Footer copyright year. Set by hand: the page is pre-built, so it can't read today's date.
    copyrightYear: 2026,
  },
} as const;
