export type PhotoImage = {
  aspect: string;
  src: string | null;
  caption?: string;
};

export type PhotoProject = {
  slug: string;
  title: string;
  heroBg: string;
  photographer: string;
  /** Only rendered when collaborators are supplied in project context. */
  collaborators?: string[];
  series: string;
  location: string;
  date: string;
  description: string;
  images: PhotoImage[];
  /** Index into `images` to feature as the hero background. Defaults to 0. */
  featuredImage?: number;
  /** When true, featured on the landing page and excluded from /archive. */
  featured?: boolean;
};

// Seeded from the photography blocks on the landing page so each has a real route.
import jjI from "@/assets/portraits-with-strangers/jj-i.webp";
import jjII from "@/assets/portraits-with-strangers/jj-ii.webp";
import jjIII from "@/assets/portraits-with-strangers/jj-iii.webp";
import exposureCoverAsset from "@/assets/exposure-cover.webp.asset.json";
import landfillCoverAsset from "@/assets/landfill-cover.webp.asset.json";
import rootsCoverAsset from "@/assets/roots-cover.webp.asset.json";

export const photoProjects: PhotoProject[] = [
  {
    slug: "portraits-with-strangers",
    title: "Portraits along the way.",
    heroBg:
      "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)",
    photographer: "J. KIMARA",
    series: "PORTRAIT PHOTOGRAPHY",
    location: "KAMPALA",
    date: "ONGOING",
    description:
      "An ongoing series of portraits made with people I meet in passing.",
    images: [
      { aspect: "aspect-[2/3]", src: jjI },
      { aspect: "aspect-[2/3]", src: jjII },
      { aspect: "aspect-[2/3]", src: jjIII },
    ],
  },
  {
    slug: "exposure",
    featured: true,
    title: "Exposure",
    heroBg:
      "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #050505 100%)",
    photographer: "J. KIMARA",
    series: "STREET PHOTOGRAPHY",
    location: "KAMPALA",
    date: "2026",
    featuredImage: 1,
    description: "This project explores exposure in a dual-context; the technical and conceptual. The technical aspect of the project explores the manipulation of ISO, Shutter Speed, and Aperture and the conceptual, the act of revealing a subject, moment, or narrative to the viewer.",
    images: [
      { aspect: "aspect-[3/2]", src: null, caption: "To be exposed" },
      { aspect: "aspect-[16/9]", src: exposureCoverAsset.url, caption: "A sea of matatus" },
      { aspect: "aspect-[3/2]", src: null, caption: "After hours" },
      { aspect: "aspect-[2/3]", src: null },
    ],
  },
  {
    slug: "landfill-to-catwalk",
    featured: true,
    title: "Landfill to Catwalk.",
    heroBg:
      "radial-gradient(circle at 50% 50%, #2a2a2a 0%, #141414 60%, #060606 100%)",
    photographer: "J. KIMARA",
    series: "Photojournalism",
    location: "KAMPALA",
    date: "2024.",
    description: "Held on July, 21 2024, the 4th edition of the Shebang Fashion Show saw a garbage dump in Kampala's Namuwongo-Kasanvu Slum transformed into an open air runway. The show was organised by Shakah Farid Lwanya and the Wellbeing Foundation under the theme \"Reclaiming Waste to power fashion\" and saw five collections crafted entirely from recycled waste by Musema Culture, Bobbin Case, Quill Clothing, Trevor Kaye, and Njola Impressions. Abandoning fancy venues, it placed sustainabile design directly in the local community.",
    images: [
      { aspect: "aspect-[3/2]", src: landfillCoverAsset.url, caption: "The lineup" },
      { aspect: "aspect-[3/2]", src: null, caption: "Backs to the sun" },
      { aspect: "aspect-[3/2]", src: null, caption: "The lineup" },
      { aspect: "aspect-[3/2]", src: null, caption: "Crossing paths" },
      { aspect: "aspect-[2/3]", src: null, caption: "Draped in red" },
    ],
  },
  {
    slug: "roots",
    featured: true,
    title: "Roots",
    heroBg:
      "radial-gradient(circle at 50% 50%, #3a2a1a 0%, #1a120a 60%, #060403 100%)",
    photographer: "J. KIMARA",
    series: "Fine Art Photography",
    location: "KAMPALA",
    date: "COMPLETED.",
    description: "Details on the photography series.",
    featuredImage: 0,
    images: [
      { aspect: "aspect-[2/3]", src: rootsCoverAsset.url, caption: "Roots" },
      { aspect: "aspect-[3/2]", src: null },
      { aspect: "aspect-[2/3]", src: null },
      { aspect: "aspect-[3/2]", src: null },
    ],
  },
];

export function getPhotoProjectBySlug(slug: string): PhotoProject | undefined {
  return photoProjects.find((p) => p.slug === slug);
}
