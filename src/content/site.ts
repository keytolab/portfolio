// All copy for the site lives here, so it can be edited without touching components.
export const site = {
  name: "Jacek",
  title: "Jacek — Designer and developer",
  description:
    "Portfolio of Jacek, a designer and developer making calm, precise interfaces for the web.",
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
} as const;
