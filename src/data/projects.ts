import nbcFebruary from "@/assets/nbc-kampala/february.webp";
import nbcMarchMeetup from "@/assets/nbc-kampala/march-meetup.webp";
import nbcMarch from "@/assets/nbc-kampala/march.webp";
import nbcAprilPick from "@/assets/nbc-kampala/april-pick.webp";
import nbcAprilBuzzwords from "@/assets/nbc-kampala/april-buzzwords.webp";
import nbcMarch26 from "@/assets/nbc-kampala/march-26-meetup.webp.asset.json";
import nbcMarchDiscussion from "@/assets/nbc-kampala/march-discussion.webp.asset.json";
import nbcClip from "@/assets/nbc-kampala/nbc-clip.mp4.asset.json";
import veiledPoster from "@/assets/veiled/veiled.gif.asset.json";

export type ProjectImage = {
  aspect: string;
  src: string | null;
  /** Media kind. Defaults to "image". */
  kind?: "image" | "video";
};

export type Project = {
  slug: string;
  title: string;
  code?: string;
  heroBg: string;
  contributors: string[];
  scope: string;
  date: string;
  description: string;
  images: ProjectImage[];
  /** Optional external links shown beneath the description. */
  links?: { label: string; href: string }[];
  /** Index into `images` to feature as the hero background. Defaults to 0. */
  featuredImage?: number;
  /** When true, this project is featured on the landing page and excluded from /archive. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "v-dfx",
    featured: true,
    title: "v+ DfX",
    heroBg:
      "radial-gradient(circle at 40% 50%, #4a3a6e 0%, #1f1830 60%, #08050f 100%)",
    contributors: ["KIMARA JONATHAN"],
    scope: "Design Thinking. UX/UI Design",
    date: "2025 to DATE",
    description:
      "Many people interact with textiles in a linear take-make-waste sense. This together with shifting personal tastes and preferences, and the absence of alternative avenues sees most clothes buried away in closets, discarded, or prematurely landfilled with changes in their perceived values.\n\nThis not only presents financial losses, but creates missed re-use opportunities, and fuels Kampala's waste crisis.\n\nOur solution, value add (or v+) is a mobile-first digital platform developed around principles of the sharing economy, repair economy, and sustainable business models to facilitate alternative pathways for clothes; SWAP, SELL/BUY, RENT, and DONATE — and integrates repair and upcycling services by onboarding tailors and artisans.\n\nWith v+, people can earn from idle clothing, access fashion affordably, and dress sustainably; tailors and artisans can feature their works and connect with clients; shelters and charities can access dignified clothing and textile waste is diverted from landfills, a win for the environment.\n\nThe model was selected for the 2025/2026 Jim Leech Mastercard Foundation Fellowship on Entrepreneurship.",
    links: [
      {
        label: "View the prototype",
        href: "https://www.figma.com/proto/zTCjlYh4ALzvkNXo78okTH/value-add.-DFX?node-id=96-782&t=SsYLDDEiH7acgrWE-1",
      },
      { label: "Watch the pitch", href: "https://youtu.be/PzFw69x__nI" },
    ],
    images: [
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/4]", src: null },
    ],
  },
  {
    slug: "the-garden",
    featured: true,
    title: "The garden.",
    heroBg:
      "radial-gradient(circle at 70% 30%, #2d4a5a 0%, #14232e 60%, #060b10 100%)",
    contributors: ["KIMARA JONATHAN"],
    scope: "Branding. Packaging Design",
    date: "2026",
    description:
      "Herbalism, in its oldest sense, is a domestic practice of care; plants observed, knowledge passed, and remedies made at home across every culture. Yet as a form of alternative therapy today, it faces a persistent perception challenge: widely reported interest coexists with a preference for foreign products, driven by poor presentation and a perceived lack of credibility in locally-branded alternatives. The result is a market where herbalism appears either imported or unreliable, never fully familiar or trusted.\n\nDespite reporting an interest in herbal teas as a form of alternative therapy, most individuals report a preference for foreign products as a consequence of poor presentation and a perceived lack of credibility in locally-branded alternatives.\n\nThe Garden addresses this perception gap through a branding and packaging strategy grounded in honesty, restraint, and locality. Single-origin herbs are presented in a curated manner, replacing the visual language of imported commodities with an aesthetic of care.",
    images: [
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/4]", src: null },
    ],
  },
  {
    slug: "out-x-about",
    featured: true,
    title: "out.x.about",
    heroBg:
      "radial-gradient(circle at 50% 50%, #5a4a2d 0%, #2a2114 60%, #0a0804 100%)",
    contributors: ["KIMARA JONATHAN"],
    scope: "COLLECTIVE",
    date: "2026",
    description: "Details on the design project.",
    images: [
      { aspect: "aspect-[3/4]", src: null },
      { aspect: "aspect-[3/4]", src: null },
    ],
  },
  {
    slug: "uwezo",
    title: "UWEZO",
    heroBg:
      "radial-gradient(circle at 35% 45%, #49C4C1 0%, #0077B6 25%, #3C4F76 55%, #0f172a 100%)",
    contributors: ["KIMARA JONATHAN"],
    scope: "Brand Identity Design",
    date: "2026",
    description:
      "Brand identity for UWEZO Creative Hub, a women-founded co-creative community space intended for Jinja. The project documents concept, development, and refinement of the brand logo — including construction, logomark, wordmark, combination mark, colour system, and usage constraints. UWEZO supports youth creatives through peer-to-peer learning, technical training, and a network centred on community growth and transformative learning experiences.",
    images: [
      { aspect: "aspect-[16/9]", src: null },
      { aspect: "aspect-[16/9]", src: null },
    ],
  },
  {
    slug: "veiled",
    title: "VEILED",
    heroBg:
      "radial-gradient(circle at 50% 50%, #3a3a3a 0%, #161616 60%, #050505 100%)",
    contributors: ["KIMARA JONATHAN"],
    scope: "Poster Design",
    date: "2026",
    description: "Typography is a design sense that relies on the manipulation of type to convey emotions, themes, and context. Poster design for \"VEILED\".",
    images: [
      { aspect: "aspect-[3/4]", src: veiledPoster.url },
    ],
  },
  {
    slug: "nbc-kampala",
    title: "NBC Kampala",
    heroBg:
      "radial-gradient(circle at 60% 40%, #2a4a3a 0%, #11201a 60%, #050a08 100%)",
    contributors: ["NONAME BOOK CLUB"],
    scope: "CHAPTER FACILITATOR- KAMPALA",
    date: "2025 to 2026",
    description: "The Noname Book Club is an international community that prioritises black and coloured authorship with the intention of socio-political awareness and reform through conversation centred around the primary themes of select monthly book picks.",
    images: [
      { aspect: "aspect-auto", src: nbcFebruary },
      { aspect: "aspect-auto", src: nbcMarchMeetup },
      { aspect: "aspect-auto", src: nbcMarch },
      { aspect: "aspect-auto", src: nbcMarch26.url },
      { aspect: "aspect-auto", src: nbcMarchDiscussion.url },
      { aspect: "aspect-auto", src: nbcAprilPick },
      { aspect: "aspect-auto", src: nbcAprilBuzzwords },
      { aspect: "aspect-auto", src: nbcClip.url, kind: "video" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
