export type Package = {
  slug: string;
  name: string;
  blurb: string;
  price: number;
  turnaround: string;
  deliverables: string[];
  category: "Photography" | "Design" | "Print";
};

export const packages: Package[] = [
  {
    slug: "portrait-session",
    name: "Portrait Session",
    blurb:
      "A focused 90-minute portrait session — natural light, on location, ten edited frames.",
    price: 350,
    turnaround: "2 weeks",
    deliverables: [
      "10 retouched high-resolution images",
      "Online gallery for download",
      "Light retouching included",
    ],
    category: "Photography",
  },
  {
    slug: "editorial-shoot",
    name: "Editorial Shoot",
    blurb:
      "Half-day editorial concept shoot for brands, magazines, or personal projects.",
    price: 1200,
    turnaround: "3 weeks",
    deliverables: [
      "Up to 25 retouched images",
      "Concept + mood board call",
      "Two retouching rounds",
      "Print-ready files",
    ],
    category: "Photography",
  },
  {
    slug: "poster-design",
    name: "Poster Design",
    blurb:
      "Single-piece poster or print design — one concept, two refinement rounds.",
    price: 280,
    turnaround: "10 days",
    deliverables: [
      "One A2 print-ready PDF",
      "Source files (Ai/PSD)",
      "Two revision rounds",
    ],
    category: "Design",
  },
  {
    slug: "card-set",
    name: "Card / Identity Set",
    blurb:
      "Small identity bundle — business cards, sticker, or invite suite. A cohesive system.",
    price: 480,
    turnaround: "2 weeks",
    deliverables: [
      "3 print-ready assets",
      "Brand mini-guide (1 page)",
      "Source + export files",
    ],
    category: "Design",
  },
  {
    slug: "fine-art-print",
    name: "Fine Art Print",
    blurb:
      "Signed, archival fine-art print of a selected work. A3 archival pigment.",
    price: 180,
    turnaround: "1 week",
    deliverables: [
      "Archival pigment print (A3)",
      "Signed and numbered",
      "Worldwide tracked shipping",
    ],
    category: "Print",
  },
  {
    slug: "zine",
    name: "Zine / Photobook",
    blurb:
      "Limited-edition zine or short photobook from one of the published series.",
    price: 45,
    turnaround: "2 weeks",
    deliverables: ["32–48 page zine", "Numbered edition", "Tracked shipping"],
    category: "Print",
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}
