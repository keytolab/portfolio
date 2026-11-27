// All copy for the site lives here, so it can be edited without touching components.
export const site = {
  name: "Keyto",
  title: "Keyto — Designer and developer",
  description:
    "Portfolio of Keyto, a designer and developer making calm, precise interfaces for the web.",
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
        href: "https://www.tiktok.com/@keytolab/video/7635176330564226337",
        linkLabel: "Watch on TikTok",
        logo: "/work/spotify-logo.png",
        // Brand colour used for the card's glow.
        accent: "#1ed760",
      },
      {
        slug: "sakura",
        title: "Sakura",
        description: "A night cherry tree in living ASCII. Branches sway, petals fall and your cursor makes the wind.",
        role: "Design and code",
        year: "2026",
        type: "Creative coding",
        href: "https://keytolab.github.io/sakura/",
        linkLabel: "Visit site",
        // A full-bleed screenshot instead of a centred logo.
        cover: "/work/sakura-cover.webp",
        accent: "#ff9ec8",
      },
    ],
    comingSoon: {
      title: "More work soon",
      description: "New projects are in progress. Follow along on TikTok in the meantime.",
      href: "https://www.tiktok.com/@keytolab",
      linkLabel: "Follow on TikTok",
    },
  },
  about: {
    // The statement is split into three parts; `highlight` gets the yellow, glowing italic.
    statement: {
      before: "I'm Keyto, a designer and developer making",
      highlight: "unforgettable",
      after: "motion, interfaces and brands.",
    },
    // Shown as a swipeable card carousel. `icon` picks the card's graphic: "motion" | "ui" | "web" | "brand".
    services: [
      {
        title: "Motion graphics",
        tagline: "Films & ads",
        icon: "motion",
      },
      {
        title: "UI/UX design",
        tagline: "Calm interfaces",
        icon: "ui",
      },
      {
        title: "Web development",
        tagline: "Next.js & GSAP",
        icon: "web",
      },
      {
        title: "Branding",
        tagline: "Identity systems",
        icon: "brand",
      },
    ],
    // Shown in this order.
    socials: [
      { label: "TikTok", handle: "@keytolab", href: "https://www.tiktok.com/@keytolab" },
      { label: "X", handle: "@keytolab", href: "https://x.com/keytolab" },
      { label: "YouTube", handle: "@keytofv", href: "https://www.youtube.com/@keytofv" },
      { label: "GitHub", handle: "keytolab", href: "https://github.com/keytolab" },
    ],
  },
  contact: {
    // Headline split like the About statement; `highlight` gets the yellow, glowing italic.
    headline: { before: "Let's create the", highlight: "unforgettable", after: "." },
    intro: "Projects, collaborations or just a hello. Write to me directly.",
    email: "keytoslab@gmail.com",
    backToTop: "Back to top",
    // Footer copyright year. Set by hand: the page is pre-built, so it can't read today's date.
    copyrightYear: 2026,
  },
} as const;
