import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { writingPieces } from "@/data/writing";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const piece = writingPieces.find((p) => p.slug === params.slug);
    if (!piece) throw notFound();
    return piece;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Writing — Kimara` },
          {
            name: "description",
            content: `${loaderData.title} — ${loaderData.category} by Kimara.`,
          },
          { property: "og:title", content: `${loaderData.title} — Writing — Kimara` },
          {
            property: "og:description",
            content: `${loaderData.title} — ${loaderData.category} by Kimara.`,
          },
        ]
      : [{ title: "Writing — Kimara" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-3xl">Piece not found</h1>
      <Link to="/writing" className="font-sans text-sm uppercase tracking-[0.25em] underline">
        Back to Writing
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="font-sans text-sm text-black/60">
        {import.meta.env.DEV && error.message ? error.message : "An unexpected error occurred."}
      </p>
      <Link to="/writing" className="font-sans text-sm uppercase tracking-[0.25em] underline">
        Back to Writing
      </Link>
    </div>
  ),
  component: WritingPiecePage,
});

function WritingPiecePage() {
  const piece = Route.useLoaderData();

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
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1
              className="font-display font-medium leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 7.5vw, 6rem)" }}
            >
              {piece.title}
            </h1>
            <p className="mt-3 max-w-md font-sans text-sm text-black/60">
              {piece.category}
            </p>
          </div>
          <Link
            to="/writing"
            className="font-sans text-[11px] uppercase tracking-[0.25em] text-black/60 hover:text-black whitespace-nowrap"
          >
            ← Writing
          </Link>
        </div>
      </section>

      <article className="mx-auto w-full max-w-[68ch] px-6 pb-[clamp(4rem,10vw,8rem)] pt-[clamp(2rem,5vw,4rem)] md:px-10">
        {piece.body.map((paragraph: string, i: number) => (
          <p
            key={i}
            className="font-sans text-base leading-[1.75] text-black/85 md:text-lg md:leading-[1.8] [&+p]:mt-6 md:[&+p]:mt-8"
          >
            {paragraph}
          </p>
        ))}
      </article>

      <SiteFooter />
    </main>
  );
}
