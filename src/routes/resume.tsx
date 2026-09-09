import { SiteFooter } from "@/components/SiteFooter";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";

export const Route = createFileRoute("/resume")({
  component: ResumePage,
  head: () => ({
    meta: [
      { title: "Resume — Ra" },
      {
        name: "description",
        content:
          "Selected fellowships, programs, and partnerships — a chronological record of work.",
      },
      { property: "og:title", content: "Resume — Ra" },
      {
        property: "og:description",
        content: "Selected fellowships, programs, and partnerships.",
      },
    ],
  }),
});

type Entry = {
  year: string;
  scope: string;
  partner?: string;
  href?: string;
  links?: { label: string; href: string }[];
};

const entries: Entry[] = [
  {
    year: "JAN-MAY, 2026",
    scope: "DDQIC.Jim Leech Mastercard Fellowship",
    partner:
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
    year: "DEC, 2025",
    scope: "Studio Assistant — THE ESCAPADE by Mati Jhurry",
    href: "https://www.instagram.com/p/DQ9TbHwDOQv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    partner:
      "Mati Jhurry's practice concerns the tension between exoticism and the exotified; the labour and politics involved in selling an escapist fantasy, the performativity within hospitality and the commodification of care under globalized realities. @matijhurry(instagram) currently practices in Mauritius and makes art through performance, investigation, and turns to video, sculpture and collaborative practices in search of new narratives of decolonisation.",
  },
  {
    year: "AUG, 2025",
    scope: "Panelist — Kampala Writes Literature Festival 2025",
    href: "https://www.instagram.com/p/DNfSZcXIa9C/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    partner: "A panelist in the 2nd Edition of the event under the theme of BELONGING.",
  },
  {
    year: "2025",
    scope: "Makerere University Innovation Pod",
    partner: "Multimedia Intern. \nTasks; Graphic Design, Photography, and Editing.",
  },
  {
    year: "2024",
    scope: "Communications Associate (Intern) — Circular Design Hub",
    partner: "Graphic Design, Photography, and Socials. July–August 2024.",
  },
];

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

function parseDate(s: string): number {
  const yearMatch = s.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
  const monthMatch = s.toLowerCase().match(/[a-z]+/);
  const month = monthMatch ? MONTHS[monthMatch[0]] ?? 0 : 0;
  return new Date(year, month, 1).getTime();
}

const sortedEntries = [...entries].sort(
  (a, b) => parseDate(b.year) - parseDate(a.year),
);

function ResumePage() {
  return (
    <main className="min-h-screen w-full bg-white text-black">
      <header className="relative z-30 flex items-center justify-between px-6 pt-[clamp(1rem,3vw,2rem)] md:px-10">
        <Link
          to="/"
          aria-label="Ra — Home"
          className="font-display font-normal leading-none tracking-tight text-black"
          style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
        >
          Ra
        </Link>
        <MenuButton className="text-black" />
      </header>

      <section className="px-6 pt-[clamp(2rem,5vw,4rem)] pb-[clamp(1rem,3vw,2rem)] md:px-10">
        <h1
          className="font-display font-medium leading-[1.02] tracking-tight"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          Resume
        </h1>
        <p className="mt-3 max-w-md font-sans text-sm text-black/60">
          A selection of fellowships, programs, and partnerships.
        </p>
        <a
          href="https://drive.google.com/drive/folders/1-BpiQ7JvLOotDlJZbGXMN86Fup9y6LIo?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 border border-black px-5 py-2.5 font-sans text-xs uppercase tracking-[0.3em] font-medium text-black transition hover:opacity-60"
        >
          <span>Download CV</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </a>
      </section>

      <section className="px-6 pb-[clamp(3rem,6vw,5rem)] md:px-10">
        <ul className="divide-y divide-black/15">
          {sortedEntries.map((e, idx) => (
            <li
              key={e.year + e.scope + idx}
              className="grid grid-cols-[5.5rem_1fr] gap-x-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,2.5vw,2rem)] md:grid-cols-[8rem_1fr]"
            >
              <div className="font-sans text-sm font-bold tabular-nums tracking-[0.1em] md:text-base">
                {e.year}
              </div>
              <div>
                {e.href ? (
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-2 font-sans text-base font-medium leading-snug hover:opacity-60 md:text-lg"
                  >
                    <span className="underline decoration-black/30 underline-offset-4 group-hover:decoration-black">
                      {e.scope}
                    </span>
                    <span aria-hidden className="text-xs text-black/40">↗</span>
                  </a>
                ) : (
                  <div className="font-sans text-base font-semibold leading-snug md:text-lg">
                    {e.scope}
                  </div>
                )}
                {e.partner && (
                  <p className="mt-2 max-w-2xl whitespace-pre-line font-sans text-sm leading-relaxed text-black/70">
                    {e.partner}
                  </p>
                )}
                {e.links && e.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {e.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-baseline gap-1 font-sans text-sm font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black"
                      >
                        <span>{l.label}</span>
                        <span aria-hidden className="text-xs text-black/40">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
