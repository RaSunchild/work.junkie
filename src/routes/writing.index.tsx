import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/writing/")({
  component: WritingPage,
  head: () => ({
    meta: [
      { title: "Writing — Essays on Creative Practice | sunchild" },
      {
        name: "description",
        content:
          "Selected writing by Ra Kimara — essays, reflections, and notes on photography, design, and creative practice from the sunchild portfolio.",
      },
      { property: "og:title", content: "Writing — Essays on Creative Practice | sunchild" },
      {
        property: "og:description",
        content:
          "Selected writing by Ra Kimara — essays, reflections, and notes on photography, design, and creative practice from the sunchild portfolio.",
      },
    ],
  }),
});

function WritingPage() {
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
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
            >
              Writing
            </h1>
            <p className="mt-3 max-w-md font-sans text-sm text-black/60">
              Essays, reflections, and notes. Pieces will appear here as they're published.
            </p>
          </div>
        </div>
      </section>

      {/* Empty body — pieces will be added later */}
      <section
        className="relative mx-auto w-full bg-white"
        style={{ minHeight: "clamp(600px, 100vh, 1400px)" }}
        aria-label="Writing list (empty)"
      />

      <SiteFooter />
    </main>
  );
}
