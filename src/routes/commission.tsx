import { SiteFooter } from "@/components/SiteFooter";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CommissionForm } from "@/components/CommissionForm";
import { MenuButton } from "@/components/MenuOverlay";

export const Route = createFileRoute("/commission")({
  component: CommissionPage,
  head: () => ({
    meta: [
      { title: "Commission a project — Ra" },
      {
        name: "description",
        content:
          "Send a brief for a custom commission — photography, design, or print. Quick form, personal reply.",
      },
      { property: "og:title", content: "Commission a project — Ra" },
      {
        property: "og:description",
        content: "Send a brief for a custom commission.",
      },
    ],
  }),
});

function CommissionPage() {
  return (
    <main className="w-full bg-background text-foreground">
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

      <section className="px-[clamp(1.5rem,4vw,2.5rem)] pt-4 pb-2 md:pt-20 md:pb-12">
        <h1
          className="font-display font-medium leading-[1.02] tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 7vw, 5.5rem)" }}
        >
          Commission a project
        </h1>
        <span className="mt-2 md:mt-4 block font-sans text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          IDEAS TO LIFE
        </span>
      </section>

      <section className="px-[clamp(1.5rem,4vw,2.5rem)] pb-4 md:pb-24">
        <div className="max-w-2xl">
          <CommissionForm mode="custom" theme="light" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
