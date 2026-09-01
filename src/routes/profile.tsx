import { SiteFooter } from "@/components/SiteFooter";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import kimaraProfile from "@/assets/ra-profile.webp.asset.json";


export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — Ra Kimara | sunchild" },
      {
        name: "description",
        content:
          "About Ra Kimara (sunchild) — a multidisciplinary visual artist, designer, and writer. Background, practice, and hobbies.",
      },
      { property: "og:title", content: "Profile — Ra Kimara | sunchild" },
      {
        property: "og:description",
        content:
          "About Ra Kimara (sunchild) — a multidisciplinary visual artist, designer, and writer. Background, practice, and hobbies.",
      },
    ],
  }),
});



function ProfilePage() {

  return (
    <main className="w-full bg-background text-foreground">
      {/* Header band */}
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

      {/* Bio block */}
      <section className="px-6 py-[clamp(2rem,5vw,4rem)] md:px-10">
        <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(1.5rem,4vw,2.5rem)] md:grid-cols-2">
          <div className="contents md:order-1 md:block md:flex md:flex-col md:justify-end">
            <div className="md:hidden">
              <img
                src={kimaraProfile.url}
                alt="Portrait of Ra (Jonathan Kimara)"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <p
              className="mt-[clamp(1rem,2vw,1.5rem)] font-sans leading-relaxed text-foreground/80 whitespace-pre-line"
              style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
            >
              sunchild
            </p>
          </div>
          <div className="hidden md:order-2 md:block">
            <img
              src={kimaraProfile.url}
              alt="Portrait of Ra (Jonathan Kimara)"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <hr className="mx-6 border-foreground/15 md:mx-10" />

      <SiteFooter />
    </main>
  );
}
