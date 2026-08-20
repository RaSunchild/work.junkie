import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { getArchiveItems, type ArchiveItem } from "@/data/archive";

export const Route = createFileRoute("/archive")({
  component: ArchivePage,
  head: () => ({
    meta: [
      { title: "Archive — Ra" },
      {
        name: "description",
        content:
          "An archive of design, photography, and writing projects beyond the featured work on the landing page.",
      },
      { property: "og:title", content: "Archive — Ra" },
      {
        property: "og:description",
        content:
          "An archive of design, photography, and writing projects beyond the featured work.",
      },
    ],
  }),
});

function ArchiveRow({ item }: { item: ArchiveItem }) {
  const title = (
    <span className="font-sans text-lg leading-snug md:text-lg font-semibold">
      {item.title}
    </span>
  );

  return (
    <li className="py-[clamp(1.5rem,3vw,2.25rem)]">
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-60"
        >
          {title}
        </a>
      ) : (
        <Link
          to={item.to!}
          params={item.params as never}
          className="block transition-opacity hover:opacity-60"
        >
          {title}
        </Link>
      )}
      <p className="mt-[clamp(0.75rem,1.5vw,1.25rem)] font-sans text-xs uppercase tracking-[0.25em] text-black/50">
        {item.scope}
      </p>
      {item.description ? (
        <p className="mt-[clamp(0.75rem,1.5vw,1.25rem)] max-w-2xl font-sans text-sm leading-relaxed text-black/70">
          {item.description}
        </p>
      ) : null}
    </li>
  );
}

function ArchivePage() {
  const items = getArchiveItems();

  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-black">
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
          Archive
        </h1>
        <p className="mt-3 max-w-md font-sans text-[10px] uppercase tracking-[0.25em] text-black/60">
          TAP TITLE TO ACCESS.
        </p>
      </section>

      <section className="flex-1 px-6 pb-[clamp(3rem,6vw,5rem)] md:px-10">
        {items.length > 0 ? (
          <ul className="divide-y divide-black/15 border-t border-black/15">
            {items.map((item, idx) => (
              <ArchiveRow key={item.category + idx} item={item} />
            ))}
          </ul>
        ) : (
          <p className="font-sans text-sm text-black/60">
            The archive is empty for now — new work will appear here as it's
            added.
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
