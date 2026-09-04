import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useState } from "react";
import type * as React from "react";
import { Link } from "@tanstack/react-router";
import type { PhotoProject } from "@/data/photography";
import { MenuButton } from "@/components/MenuOverlay";

export function PhotoLayout({ project }: { project: PhotoProject }) {
  const galleryImages = project.images.filter(
    (img): img is typeof img & { src: string } => Boolean(img.src),
  );
  const [activeIdxRaw, setActiveIdx] = useState(0);
  const activeIdx = Math.min(activeIdxRaw, Math.max(0, galleryImages.length - 1));
  const activeImage = galleryImages[activeIdx];
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, [galleryImages.length, activeIdx]);
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
      {/* ============ HERO ============ */}
      <section
        className="relative flex min-h-[80vh] w-full flex-col overflow-hidden"
        style={{ background: project.heroBg }}
      >
        {(() => {
          const hero = project.images[project.featuredImage ?? 0];
          if (!hero?.src) return null;
          return (
            <>
              <img
                src={hero.src}
                alt=""
                aria-hidden
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"
              />
            </>
          );
        })()}
        <header className="relative z-20 flex items-center justify-between px-6 pt-[clamp(1rem,3vw,2rem)] md:px-10">
          <Link
            to="/"
            aria-label="Ra — Home"
            className="font-display font-normal leading-none tracking-tight text-background"
            style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
          >
            Ra
          </Link>
          <MenuButton className="text-background" />
        </header>

        <div className="flex-1" />

        <div className="relative z-10 px-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(2rem,5vw,4rem)]">
          <h1
            className="font-display font-medium leading-[1.02] tracking-tight text-background break-words hyphens-auto"
            lang="en"
            style={{ fontSize: "clamp(2rem, 6.5vw, 4.5rem)", maxWidth: "min(100%, 14ch)" }}
          >
            {project.title}
          </h1>
        </div>
      </section>

      {/* ============ META ============ */}
      <section className="bg-background text-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-y-8 px-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(2rem,5vw,4rem)] md:grid-cols-[1fr_2fr] md:gap-x-12">
          {project.collaborators && project.collaborators.length > 0 ? (
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                CREDITS
              </span>
              {project.collaborators.map((name) => (
                <p key={name} className="mt-3 font-sans text-base font-semibold">
                  {name}
                </p>
              ))}
            </div>
          ) : (
            <div aria-hidden className="hidden md:block" />
          )}


          <div className="space-y-8">
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                SCOPE
              </span>
              <p className="mt-3 font-sans text-base font-semibold uppercase tracking-wide">
                {project.series}
              </p>
            </div>
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                Location
              </span>
              <p className="mt-3 font-sans text-base font-semibold">{project.location}</p>
            </div>
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                YEAR
              </span>
              <p className="mt-3 font-sans text-base font-semibold">{project.date}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-[clamp(1.5rem,4vw,2.5rem)]">
          <div className="h-px w-full bg-foreground/20" />
          <p className="py-[clamp(2rem,4vw,3rem)] font-sans text-sm leading-relaxed md:text-base">
            {project.description}
          </p>
        </div>

        {/* Photo gallery — static main frame that cycles, with thumbnail strip below */}
        <div className="mx-auto max-w-[1400px] px-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)]">
          {/* Main static frame — adapts to active image orientation so the photo is fully visible */}
          <div
            className={`relative mx-auto w-full overflow-hidden bg-foreground/10 transition-all duration-500 ${
              activeImage?.aspect && activeImage.aspect !== "aspect-auto"
                ? activeImage.aspect
                : "aspect-[4/5]"
            }`}
            style={{
              maxHeight: "85vh",
              maxWidth: activeImage?.aspect?.includes("2/3") ? "min(100%, 60ch)" : "100%",
            }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 p-[clamp(1rem,3vw,2rem)] transition-opacity duration-700 ease-out ${
                  i === activeIdx ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={i !== activeIdx}
              >
                <img
                  src={img.src}
                  alt={img.caption ?? ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          {activeImage?.caption && (
            <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-foreground/60">
              {activeImage.caption}
            </p>
          )}

          {/* Thumbnail carousel — only when there are additional images */}
          {galleryImages.length > 1 && (
          <div className="relative mt-6 w-full">
            <div
              className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryImages.map((img, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={isActive}
                    className={`relative aspect-[4/5] w-20 shrink-0 snap-start overflow-hidden border-2 bg-foreground/10 transition-all duration-300 ${
                      isActive
                        ? "border-foreground opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </main>
  );
}
