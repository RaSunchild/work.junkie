/**
 * ============================================================
 *  ACHIEVEMENTS — EDIT HERE
 * ============================================================
 *
 *  Each entry shows up on the /achievements page as a simple
 *  row: YEAR — TITLE — short description, with an optional
 *  external link (click the title to open it in a new tab).
 *
 *  Order the array however you want them to display (newest
 *  first is the convention).
 * ============================================================
 */

export type Achievement = {
  /** Date shown on the left. Year only ("2026") or month + year ("Aug 2025"). */
  year: string;
  /** Title of the achievement / post / mention */
  title: string;
  /** One- or two-line description shown next to the title */
  description: string;
  /** Optional external URL — when set, the title becomes a link */
  href?: string;
  /** Optional extra links rendered as text buttons beneath the description */
  links?: { label: string; href: string }[];
};

export const achievements: Achievement[] = [
  {
    year: "2026",
    title: "DDQIC.Jim Leech Mastercard Fellowship",
    description:
      "In partnership with the Dunnin-Deshpande Institute, Queens University, Canada the fellowship is conducted over a set of three stages- EXPLORE, IGNITE, and LAUNCH the fellowship provides a structured pathway for aspiring entrepreneurs to move from curiosity to venture creation. In EXPLORE fellows gain foundational exposure to entrepreneurial thinking and problem discovery. IGNITE builds momentum by sharpening ideas through mentorship, skill development, and prototype testing. LAUNCH equips fellows with the networks, resources, and strategic support needed to advance their ventures toward market readiness. Together, these stages form a comprehensive journey that nurtures innovation, resilience, and impact-driven enterprise.",
    links: [
      {
        label: "EXPLORE Badge",
        href: "https://credentials.innovationcentre.queensu.ca/88087c37-98c2-4276-9a0f-4bed3221848c#acc.VKAln3MU",
      },
      {
        label: "IGNITE Badge",
        href: "https://credentials.innovationcentre.queensu.ca/f0bb7f00-d321-4762-8a3e-e262d382bd9e#acc.uFpLSBkQ",
      },
    ],
  },

  {
    year: "NOV, 2024",
    title: "WINNER. YOUNG SILVERBACKS COMPETITION 2024 — PRINT EDITION",
    description:
      "PEAK emerged winner in the print category for mental health campaign \"Day by Day\".",
    href: "https://silverbackawards.com/young-silverback/",
  },
];
