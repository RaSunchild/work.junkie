import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { achievements, type Achievement } from "@/data/achievements";

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

/** Parse a year string like "2026", "AUG, 2025", or "March 2025" into a sortable timestamp. */
function parseDate(s: string): number {
  const yearMatch = s.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
  const monthMatch = s.toLowerCase().match(/[a-z]+/);
  const month = monthMatch ? MONTHS[monthMatch[0]] ?? 0 : 0;
  return new Date(year, month, 1).getTime();
}

const sortedAchievements: Achievement[] = [...achievements].sort(
  (a, b) => parseDate(b.year) - parseDate(a.year),
);

export const Route = createFileRoute("/achievements")({
  component: AchievementsPage,
  head: () => ({
    meta: [
      { title: "Achievements — Ra" },
      {
        name: "description",
        content:
          "Selected achievements, features, and recognitions — with links to the original posts and publications.",
      },
      { property: "og:title", content: "Achievements — Ra" },
      {
        property: "og:description",
        content: "Selected achievements, features, and recognitions.",
      },
    ],
  }),
});

function AchievementsPage() {
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
          Achievements
        </h1>
        <p className="mt-3 max-w-md font-sans text-[10px] uppercase tracking-[0.25em] text-black/60">
          TITLE LINKS TO ORIGINAL POST/SITE.
        </p>
      </section>

      <section className="px-6 pb-[clamp(3rem,6vw,5rem)] md:px-10">
        <ul className="divide-y divide-black/15">
          {sortedAchievements.map((a, idx) => (
            <li
              key={a.year + a.title + idx}
              className="grid grid-cols-[5.5rem_1fr] gap-x-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,2.5vw,2rem)] md:grid-cols-[8rem_1fr]"
            >
              <div className="font-sans text-sm font-bold tabular-nums tracking-[0.1em] md:text-base">
                {a.year}
              </div>
              <div>
                {a.href ? (
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-2 font-sans text-base font-medium leading-snug hover:opacity-60 md:text-lg"
                  >
                    <span className="underline decoration-black/30 underline-offset-4 group-hover:decoration-black">
                      {a.title}
                    </span>
                    <span aria-hidden className="text-xs text-black/40">↗</span>
                  </a>
                ) : (
                  <div className="font-sans text-base font-medium leading-snug md:text-lg">
                    {a.title}
                  </div>
                )}
                <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-black/70">
                  {a.description}
                </p>
                {a.links && a.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {a.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-baseline gap-1.5 font-sans text-sm font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black hover:opacity-70"
                      >
                        {l.label}
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
