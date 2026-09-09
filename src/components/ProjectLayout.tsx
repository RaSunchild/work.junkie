import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import type { Project } from "@/data/projects";
import { MenuButton } from "@/components/MenuOverlay";
import { SwipeBackIndicator } from "@/components/SwipeBackIndicator";

export function ProjectLayout({ project }: { project: Project }) {
  const navigate = useNavigate();
  const heroImage =
    project.images[project.featuredImage ?? 0] ?? project.images[0];
  const withSrc = project.images.filter(
    (img): img is typeof img & { src: string } => Boolean(img.src),
  );
  const featuredIdx = project.featuredImage ?? 0;
  const galleryImages = (() => {
    const featured = project.images[featuredIdx];
    if (!featured?.src) return withSrc;
    const featuredWithSrc = featured as typeof featured & { src: string };
    const rest = withSrc.filter((img) => img !== featured);
    return [featuredWithSrc, ...rest];
  })();
  const [activeIdx, setActiveIdx] = useState(0);
  const safeIdx = galleryImages.length ? activeIdx % galleryImages.length : 0;
  const activeImage = galleryImages[safeIdx];
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    if (paused) return;
    const advance = () =>
      setActiveIdx((i) => (i + 1) % galleryImages.length);
    if (activeImage?.kind === "video") {
      const v = videoRefs.current[safeIdx];
      if (!v) return;
      const onEnded = () => advance();
      v.addEventListener("ended", onEnded);
      return () => v.removeEventListener("ended", onEnded);
    }
    const id = setTimeout(advance, 4000);
    return () => clearTimeout(id);
  }, [galleryImages.length, safeIdx, activeImage?.kind, paused]);
  // Pause off-screen videos; restart active video from 0 on entry.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === safeIdx) {
        v.currentTime = 0;
        if (!paused) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [safeIdx, paused]);
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
      <SwipeBackIndicator />
      {/* ============ HERO ============ */}
      <section
        className="relative flex min-h-[80vh] w-full flex-col overflow-hidden"
        style={{ background: project.heroBg }}
      >
        {heroImage?.src && (
          <>
            <img
              src={heroImage.src}
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
        )}
        <header className="relative z-20 flex items-center justify-between px-6 pt-[clamp(1rem,3vw,2rem)] md:px-10">
          {project.featured ? (
            <Link
              to="/"
              aria-label="Ra — Home"
              className="font-display font-normal leading-none tracking-tight text-background"
              style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
            >
              Ra
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  navigate({ to: "/" });
                }
              }}
              aria-label="Go back"
              className="font-display font-normal leading-none tracking-tight text-background cursor-pointer"
              style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
            >
              Ra
            </button>
          )}
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
        <div
          className={`mx-auto grid max-w-[1400px] grid-cols-1 gap-y-8 px-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(2rem,5vw,4rem)] md:gap-x-12 ${
            project.contributors && project.contributors.length > 0
              ? "md:grid-cols-[1fr_2fr]"
              : ""
          }`}
        >
          {project.contributors && project.contributors.length > 0 ? (
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                Credits
              </span>
              <ul className="mt-3 space-y-1">
                {project.contributors.map((c) => (
                  <li key={c} className="font-sans text-base font-semibold">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}


          <div className="space-y-8">
            <div>
              <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70">
                SCOPE
              </span>
              <p className="mt-3 font-sans text-base font-semibold uppercase tracking-wide">
                {project.scope}
              </p>
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
          <p className="whitespace-pre-line py-[clamp(2rem,4vw,3rem)] font-sans text-sm leading-relaxed md:text-base">
            {project.description}
          </p>
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-[clamp(1.25rem,4vw,2.5rem)] pb-[clamp(2rem,4vw,3rem)]">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/70 underline-offset-[6px] transition-colors hover:text-foreground hover:underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Auto-cycling main frame + thumbnails, confined to the right column */}
        {galleryImages.length > 0 && (
          <div className="mx-auto max-w-[1400px] px-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)]">
            <div
              onClick={() => setPaused((p) => !p)}
              role="button"
              tabIndex={0}
              aria-label={paused ? "Resume" : "Pause"}
              className={`relative mx-auto w-full cursor-pointer overflow-hidden bg-foreground/10 transition-all duration-500 ${
                activeImage?.aspect && activeImage.aspect !== "aspect-auto"
                  ? activeImage.aspect
                  : "aspect-[4/5]"
              }`}
              style={{ maxWidth: "min(100%, 720px)", maxHeight: "85vh" }}
            >
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 p-[clamp(1rem,3vw,2rem)] transition-opacity duration-700 ease-out ${
                    i === safeIdx ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={i !== safeIdx}
                >
                  {img.kind === "video" ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={img.src}
                      className="h-full w-full object-contain"
                      autoPlay={i === safeIdx}
                      muted={muted}
                      playsInline
                      preload={i === safeIdx ? "metadata" : "none"}
                    />
                  ) : (
                    <img
                      src={img.src}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              ))}
              {activeImage?.kind === "video" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                  }}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                >
                  {muted ? (
                    <VolumeX size={18} strokeWidth={2} />
                  ) : (
                    <Volume2 size={18} strokeWidth={2} />
                  )}
                </button>
              )}
              {paused && (
                <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                  Paused
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </main>
  );
}
