export type CommissionImage = {
  aspect: string;
  src: string | null;
  caption?: string;
};

export type Commission = {
  slug: string;
  title: string;
  category: string;
  heroBg: string;
  scope: string;
  date: string;
  description: string;
  context: string;
  deliverables: string[];
  images: CommissionImage[];
};

export const commissions: Commission[] = [
  {
    slug: "photo-pockets",
    title: "Photo-pockets",
    category: "Commission",
    heroBg:
      "radial-gradient(circle at 40% 50%, #b8742a 0%, #5a2f12 55%, #1a0d05 100%)",
    scope: "Print + Identity",
    date: "Date of Execution",
    description:
      "bring back PRINTED PHOTOGRAPHS.",
    context:
      "A format for memories to be held.\n",
    deliverables: [
      "Custom pocket-format design system",
      "Print-ready files for short-run production",
      "Cover artwork for three editions",
    ],
    images: [
      { aspect: "aspect-square", src: null },
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/4]", src: null },
    ],
  },
  {
    slug: "cards",
    title: "Cards ",
    category: "Commission",
    heroBg:
      "radial-gradient(circle at 50% 50%, #4a3a6e 0%, #1f1830 60%, #08050f 100%)",
    scope: "PRINT|DIGITAL",
    date: "Date of Execution",
    description:
      "​Cards are meant to be intentional.",
    context:
      "Commissioned to create a small print suite for an event series. The work pulls from collage, hand-set type, and layered colour to give each piece a distinct voice while staying part of a family.",
    deliverables: [
      "Three A2 posters, print-ready",
      "Matching invite + thank-you cards",
      "Source files and brand mini-guide",
    ],
    images: [
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-square", src: null },
    ],
  },
  {
    slug: "prints",
    title: "Prints",
    category: "Commission",
    heroBg:
      "radial-gradient(circle at 50% 60%, #3a2a1a 0%, #1a120a 60%, #060403 100%)",
    scope: "Fine Art Print",
    date: "Date of Execution",
    description:
      "Limited-edition, signed archival prints of selected works — produced in small batches, numbered by hand.",
    context:
      "An ongoing commission to translate photography series into archival pigment prints. Each edition is paper-tested, signed, and shipped with a short note on the work.",
    deliverables: [
      "A3 archival pigment prints",
      "Signed and numbered editions",
      "Worldwide tracked shipping",
    ],
    images: [
      { aspect: "aspect-[3/2]", src: null },
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/2]", src: null },
    ],
  },
];

export function getCommissionBySlug(slug: string): Commission | undefined {
  return commissions.find((c) => c.slug === slug);
}
