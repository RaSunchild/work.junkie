import { SiteFooter } from "@/components/SiteFooter";
import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCommissionBySlug, type Commission } from "@/data/commissions";
import { MenuButton } from "@/components/MenuOverlay";

export const Route = createFileRoute("/commissions/$slug")({
  loader: ({ params }) => {
    const commission = getCommissionBySlug(params.slug);
    if (!commission) throw notFound();
    return { commission };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.commission;
    const title = c ? `${c.title} — Commission — Kimara` : "Commission — Kimara";
    const description = c?.description ?? "Commission details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CommissionDetailPage,
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-foreground/70">
          {import.meta.env.DEV && error.message ? error.message : "An unexpected error occurred."}
        </p>
        <button onClick={reset} className="mt-6 underline">
          Try again
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="text-center">
          <h1 className="font-display text-4xl">Commission not found</h1>
          <p className="mt-2 text-sm text-foreground/70">
            No commission matches "{slug}".
          </p>
          <Link to="/" className="mt-6 inline-block underline">
            Back home
          </Link>
        </div>
      </div>
    );
  },
});

function CommissionDetailPage() {
  const { commission } = Route.useLoaderData() as { commission: Commission };

  const count = commission.deliverables.length || 1;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [commission.slug]);

  React.useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setActiveIndex((i) => (i + 1) % count);
    }, 3000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const heroImage =
    commission.images[activeIndex]?.src
      ? commission.images[activeIndex]
      : commission.images[0];

  return (
    <main
      className="w-full bg-background text-foreground"
      style={
        {
          "--background": "oklch(0.985 0 0)",
          "--foreground": "oklch(0.12 0 0)",
        } as React.CSSProperties
      }
    >
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 pt-[clamp(1rem,3vw,2rem)] md:px-10">
        <Link
          to="/"
          aria-label="Ra — Home"
          className="font-display font-normal leading-none tracking-tight"
          style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
        >
          Ra
        </Link>
        <MenuButton className="text-foreground" />
      </header>

      {/* HERO — title bottom-left, square image top-right */}
      <section className="px-[clamp(1.5rem,4vw,2.5rem)] pt-[clamp(2rem,5vw,4rem)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-end gap-y-12 md:grid-cols-2 md:gap-x-12">
          <div className="md:order-1">
            <h1
              className="mt-2 font-display font-medium leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
            >
              {commission.title.toLowerCase()}
            </h1>
          </div>
          <div className="md:order-2">
            {/* Frame adapts to the photo's natural aspect ratio.
                Falls back to a square placeholder only when no image is set. */}
            <div
              className={`relative w-full overflow-hidden bg-foreground/80 ${
                heroImage?.src ? "" : "aspect-square"
              }`}
            >
              {heroImage?.src && (
                <img
                  key={activeIndex}
                  src={heroImage.src}
                  alt={heroImage.caption ?? commission.title}
                  decoding="async"
                  fetchPriority="high"
                  className="block h-auto w-full object-contain animate-fade-in"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* META */}
      <section className="px-[clamp(1.5rem,4vw,2.5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-y-6">
            <div>
              <span className="block font-sans text-[11px] uppercase tracking-[0.25em] text-foreground/70">
                Scope
              </span>
              <p className="mt-2 font-sans text-base leading-relaxed font-semibold">
                {commission.description}
              </p>
            </div>
          </div>
          <div className="mt-8 h-px w-full bg-foreground/30" />
        </div>
      </section>

      {/* CONTEXT */}
      <section className="px-[clamp(1.5rem,4vw,2.5rem)] pt-[clamp(2rem,4vw,3rem)] pb-[clamp(4rem,8vw,7rem)]">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-12">
            <div />
            <div>
              <p className="max-w-prose whitespace-pre-line font-sans text-base leading-relaxed text-foreground/80">
                {commission.context}
              </p>
              <Link
                to="/commission"
                className="mt-8 inline-block font-sans text-sm font-medium uppercase tracking-[0.3em] hover:opacity-60 transition-opacity"
              >
                Commission similar →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
