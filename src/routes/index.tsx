import { SiteFooter } from "@/components/SiteFooter";
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { projects as projectData } from "@/data/projects";
import { writingPieces, getExcerpt } from "@/data/writing";
import { MenuButton, useMenu } from "@/components/MenuOverlay";
import { NavPrompt } from "@/components/NavPrompt";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "sunchild — Visual Art, Design & Writing Portfolio" },
      {
        name: "description",
        content:
          "sunchild is the multidisciplinary portfolio of Ra Kimara — photography, graphic design, and writing from a visual artist and writer.",
      },
      { property: "og:title", content: "sunchild — Visual Art, Design & Writing Portfolio" },
      {
        property: "og:description",
        content:
          "sunchild is the multidisciplinary portfolio of Ra Kimara — photography, graphic design, and writing from a visual artist and writer.",
      },
    ],
  }),
});

// Hero project list — derived from shared project data so titles link to /projects/$slug.
const heroProjects = projectData
  .filter((p) => p.featured)
  .slice(0, 3)
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    code: p.code,
    bg: p.heroBg,
  }));

type Block = {
  title: string;
  category: string;
  kind: "commission" | "description" | "poetry";
  theme: "dark" | "light";
  imageSide: "left" | "right";
  excerpt?: string;
  /** Tailwind aspect class for the image frame — varies per project for asymmetric rhythm */
  aspect?: string;
  /** When set, the Explore CTA links to /photography/$photoSlug */
  photoSlug?: string;
  /** When set, the Explore CTA links to /commissions/$commissionSlug */
  commissionSlug?: string;
  /** When set, the poetry title becomes a Link to /writing/$writingSlug */
  writingSlug?: string;
  /** Optional cover image src for the block's image frame */
  image?: string;
  /** When true, hides the image frame and lets the text column span full width */
  noImage?: boolean;
};

const blocks: Block[] = [
  {
    title: "Exposure",
    category: "Street Photography",
    kind: "description",
    theme: "dark",
    imageSide: "left",
    aspect: "aspect-[4/3]",
    photoSlug: "exposure",
    
  },
  {
    title: "Landfill to Catwalk.",
    category: "Photojournalism",
    kind: "description",
    theme: "light",
    imageSide: "right",
    aspect: "aspect-[3/4]",
    photoSlug: "landfill-to-catwalk",
    
  },
  {
    title: "Roots",
    category: "Fine Art Photography",
    kind: "description",
    theme: "dark",
    imageSide: "left",
    aspect: "aspect-[16/9]",
    photoSlug: "roots",
  },
  {
    title: "Cards",
    category: "Commission",
    kind: "description",
    theme: "light",
    imageSide: "right",
    aspect: "aspect-square",
    commissionSlug: "cards",
  },
  {
    title: "The nature of COLLECTIVE",
    category: "Essay",
    kind: "poetry",
    theme: "dark",
    imageSide: "right",
    aspect: "aspect-square",
    noImage: true,
    writingSlug: "the-nature-of-design",
  },
  {
    title: "Prints",
    category: "Commission",
    kind: "description",
    theme: "light",
    imageSide: "right",
    aspect: "aspect-[3/2]",
    commissionSlug: "prints",
  },
  {
    title: "Creative being",
    category: "Reflection",
    kind: "poetry",
    theme: "dark",
    imageSide: "right",
    aspect: "aspect-[1/1]",
    noImage: true,
    writingSlug: "creative-being",
  },
];

// Cap landing-page commission and writing blocks at 2 each (order preserved).
const MAX_COMMISSIONS = 2;
const MAX_WRITINGS = 2;
const visibleBlocks: Block[] = (() => {
  let cCount = 0;
  let wCount = 0;
  return blocks.filter((b) => {
    if (b.commissionSlug) {
      cCount += 1;
      return cCount <= MAX_COMMISSIONS;
    }
    if (b.writingSlug) {
      wCount += 1;
      return wCount <= MAX_WRITINGS;
    }
    return true;
  });
})();

// Derive each poetry block's teaser from the canonical writing data
// so the homepage opening matches the start of the actual piece.
function teaserForSlug(slug?: string): string {
  if (!slug) return "";
  const piece = writingPieces.find((p) => p.slug === slug);
  return piece ? getExcerpt(piece) : "";
}

function Index() {
  const [hoveredHero, setHoveredHero] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerCondensed, setHeaderCondensed] = useState(false);

  // A24-style header: hide on scroll down, reveal on scroll up; condense after small scroll.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - last;
        setHeaderCondensed(y > 24);
        if (Math.abs(dy) > 6) {
          setHeaderHidden(dy > 0 && y > 80);
          last = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect mobile (md breakpoint = 768px) — pointer:coarse means no hover capability
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (hover: none)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Auto-cycle hero backgrounds — 4s per slide. On desktop, pause while hovering.
  useEffect(() => {
    if (!isMobile && hoveredHero !== null) return;
    const id = window.setInterval(() => {
      setAutoIndex((i) => (i + 1) % heroProjects.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [isMobile, hoveredHero]);

  // Hover wins on desktop; otherwise the auto-cycled index drives the highlight.
  const activeIndex = hoveredHero ?? autoIndex;
  const activeBg = (heroProjects[activeIndex] ?? heroProjects[0])?.bg;

  // Track scroll progress through the hero pin wrapper so we can fade/blur the
  // hero out smoothly in its final stretch as the next section scrolls up.
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const blockRefs = useRef<Array<HTMLElement | null>>([]);
  const [releaseProgress, setReleaseProgress] = useState(0);
  useEffect(() => {
    const nodes = blockRefs.current.filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const step = isDesktop ? 140 : 80;
        const revealing = entries.filter((e) => e.isIntersecting);
        revealing.forEach((e, i) => {
          (e.target as HTMLElement).style.transitionDelay = `${i * step}ms`;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  // Vertical parallax — elements marked with data-parallax drift at a slower/faster
  // rate than the page scroll while their block passes through the viewport.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    if (els.length === 0) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const speed = Number(el.dataset["parallax"] ?? "0");
        // When data-parallaxVh is set, the speed is a fraction of the viewport
        // height (so 0.35 => background travels at ~65% of scroll speed).
        const unit = el.dataset["parallaxVh"] !== undefined ? vh : 100;
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        // -1 (below viewport) .. 1 (above viewport)
        const centered = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(centered * speed * unit).toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      els.forEach((el) => (el.style.transform = ""));
    };
  }, []);
  useEffect(() => {
    const el = heroWrapperRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let snapTimer = 0;
    let isSnapping = false;
    let snapRaf = 0;
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();
    let velocity = 0; // px/ms, signed
    const cancelSnap = () => {
      if (!isSnapping) return;
      isSnapping = false;
      if (snapRaf) cancelAnimationFrame(snapRaf);
      snapRaf = 0;
    };
    const tweenTo = (target: number) => {
      const startY = window.scrollY;
      const distance = target - startY;
      if (Math.abs(distance) < 1) return;
      if (reducedMotion) {
        window.scrollTo(0, target);
        return;
      }
      isSnapping = true;
      // Editorial page-turn: a fixed, decisive 600ms ease-in-out.
      const duration = 600;
      const startTime = performance.now();
      // easeInOutCubic — smooth on both ends, never bouncy.
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        if (!isSnapping) return;
        const t = Math.min(1, (now - startTime) / duration);
        window.scrollTo(0, startY + distance * ease(t));
        if (t < 1) snapRaf = window.requestAnimationFrame(step);
        else {
          isSnapping = false;
          snapRaf = 0;
        }
      };
      snapRaf = window.requestAnimationFrame(step);
    };
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const fadeRange = vh * 0.4;
      const distanceLeft = rect.bottom - vh;
      const p = 1 - Math.max(0, Math.min(1, distanceLeft / fadeRange));
      setReleaseProgress(p);
    };
    // Scroll stops: hero top, hero fully-released point, then each block top.
    const stops = (): number[] => {
      const rect = el.getBoundingClientRect();
      const heroTop = window.scrollY + rect.top;
      const heroRelease = heroTop + el.offsetHeight - window.innerHeight;
      const list = [heroTop, heroRelease];
      for (const node of blockRefs.current) {
        if (!node) continue;
        list.push(window.scrollY + node.getBoundingClientRect().top);
      }
      return [...new Set(list.map((n) => Math.round(n)))].sort((a, b) => a - b);
    };
    const trySnapHero = (): boolean => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const fadeRange = vh * 0.4;
      const distanceLeft = rect.bottom - vh;
      const p = 1 - Math.max(0, Math.min(1, distanceLeft / fadeRange));
      if (p <= 0.05 || p >= 0.95) return false;
      const wrapperTop = window.scrollY + rect.top;
      const target = p > 0.33 ? wrapperTop + el.offsetHeight - vh : wrapperTop;
      tweenTo(target);
      return true;
    };
    const trySnapBlock = (): boolean => {
      // Only consider blocks after hero has fully released.
      const heroRect = el.getBoundingClientRect();
      if (heroRect.bottom > 0) return false;
      const vh = window.innerHeight;
      // Don't fight a fast flick in either direction.
      if (Math.abs(velocity) > 2.5) return false;
      // Settle on whichever stop is nearest the top of the viewport,
      // as long as it's within a comfortable pull range (60% of viewport).
      const pullRange = vh * 0.6;
      const y = window.scrollY;
      let best: number | null = null;
      let bestDist = Infinity;
      for (const stop of stops()) {
        const dist = Math.abs(stop - y);
        if (dist < bestDist) {
          bestDist = dist;
          best = stop;
        }
      }
      if (best === null) return false;
      // Already locked — nothing to do.
      if (bestDist < 2 || bestDist > pullRange) return false;
      tweenTo(best);
      return true;
    };
    const scheduleSnap = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (isSnapping) return;
        if (trySnapHero()) return;
        trySnapBlock();
      }, 140);
    };
    // ---- Assisted directional scroll --------------------------------
    // Once the hero has released, a wheel notch or a vertical drag glides
    // to the next/previous block in the gesture's direction instead of
    // free-scrolling. Reduced motion jumps instead of gliding (tweenTo).
    // Assist is active from the hero downwards; above the hero top, native scroll.
    const inAssistRegion = () => el.getBoundingClientRect().top <= 4;
    const glideDirection = (dir: 1 | -1): boolean => {
      const tops = stops();
      if (!tops.length) return false;
      const y = window.scrollY;
      const tolerance = 8;
      const target =
        dir === 1
          ? tops.find((t) => t > y + tolerance)
          : [...tops].reverse().find((t) => t < y - tolerance);
      if (target === undefined) return false;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      cancelSnap();
      window.clearTimeout(snapTimer);
      tweenTo(Math.max(0, Math.min(maxY, target)));
      return true;
    };
    let lastGesture = 0;
    const gestureLock = () => performance.now() - lastGesture < 260;
    const onWheel = (e: WheelEvent) => {
      if (!inAssistRegion() || Math.abs(e.deltaY) < 4) {
        onUserInput();
        return;
      }
      if (isSnapping || gestureLock()) {
        e.preventDefault();
        return;
      }
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      if (glideDirection(dir)) {
        e.preventDefault();
        lastGesture = performance.now();
      } else {
        onUserInput();
      }
    };
    let touchStartY = 0;
    let touchStartT = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchStartT = performance.now();
      onUserInput();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!inAssistRegion() || gestureLock()) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - endY;
      const dt = performance.now() - touchStartT;
      // Deliberate vertical drag or flick.
      if (Math.abs(dy) < 40 || dt > 900) return;
      if (glideDirection(dy > 0 ? 1 : -1)) lastGesture = performance.now();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!inAssistRegion()) {
        onUserInput();
        return;
      }
      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) {
        onUserInput();
        return;
      }
      if (gestureLock()) {
        e.preventDefault();
        return;
      }
      if (glideDirection(down ? 1 : -1)) {
        e.preventDefault();
        lastGesture = performance.now();
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollT);
      velocity = (window.scrollY - lastScrollY) / dt;
      lastScrollY = window.scrollY;
      lastScrollT = now;
      if (!raf) raf = window.requestAnimationFrame(update);
      if (!isSnapping) scheduleSnap();
    };
    // User input always wins — cancel any in-flight snap immediately,
    // and clear the pending schedule so we don't snap right after they stop.
    const onUserInput = () => {
      cancelSnap();
      window.clearTimeout(snapTimer);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onUserInput, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onUserInput);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(snapTimer);
      if (raf) cancelAnimationFrame(raf);
      if (snapRaf) cancelAnimationFrame(snapRaf);
    };
  }, []);

  return (
    <main className="w-full bg-background text-foreground">
      {/* ============ GLOBAL FIXED HEADER (A24-style) ============ */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 bg-foreground text-background transition-[transform,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{
          transform: headerHidden ? "translateY(-110%)" : "translateY(0)",
          paddingLeft: "clamp(1.25rem, 3vw, 2.5rem)",
          paddingRight: "clamp(1.25rem, 3vw, 2.5rem)",
          paddingTop: headerCondensed ? "0.6rem" : "clamp(0.85rem, 1.6vw, 1.25rem)",
          paddingBottom: headerCondensed ? "0.6rem" : "clamp(0.85rem, 1.6vw, 1.25rem)",
        }}
      >
        <div className="flex items-center justify-between">
          <a
            href="/"
            aria-label="Ra — Home"
            className="font-display font-normal leading-none tracking-tight"
            style={{ fontSize: "clamp(1.125rem, 1.4vw + 0.75rem, 1.75rem)" }}
          >
            <AnimatedWord text="Ra" />
          </a>
          <A24MenuTrigger />
        </div>
      </header>


      {/* ============ HERO (sticky pin) ============ */}
      <div ref={heroWrapperRef} className="relative h-[180vh]">
      <section
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-background will-change-[opacity,filter]"
        style={{
          opacity: 1 - releaseProgress,
          filter: `blur(${releaseProgress * 12}px)`,
          transform: `scale(${1 - releaseProgress * 0.02})`,
        }}
      >
        {/* Background image layer — blurred when not hovered, sharpens on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-[filter,opacity] duration-700 ease-out"
          style={{
            background: activeBg,
            filter: "blur(8px)",
            opacity: 0.85,
          }}
        />


        {/* Spacer pushes content down */}
        <div className="flex-1" />

        {/* Hero project list — anchored to bottom, with page indicator inline on desktop */}
        <section className="relative z-10 px-6 pb-20 md:px-10 md:pb-24">
          <div className="flex items-end justify-between gap-8">
            <ol className="space-y-4 md:space-y-1 flex-1" onMouseLeave={() => setHoveredHero(null)}>
              {heroProjects.map((p, i) => {
                const dimmed = activeIndex !== i;
                return (
                  <li
                    key={p.title}
                    className="title-rise"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      onMouseEnter={() => setHoveredHero(i)}
                      onFocus={() => setHoveredHero(i)}
                      className="group relative flex items-start gap-2 text-left"
                    >
                      <span
                        className={`font-display font-medium leading-[1.02] tracking-tight transition-colors duration-300 ${
                          dimmed ? "text-foreground/35" : "text-foreground"
                        }`}
                        style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)" }}
                      >
                        {p.title}
                      </span>
                      {p.code && (
                        <span className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-foreground/60 md:text-sm">
                          {p.code}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* Page indicator — inline with last title's baseline (desktop asymmetry) */}
            <div
              aria-hidden
              className="hidden md:block font-display font-medium leading-[1.02] shrink-0 tabular-nums transition-opacity duration-300"
              style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)" }}
            >
              {(activeIndex ?? 0) + 1}
            </div>
          </div>
        </section>

        {/* Page indicator — mobile only (kept in corner on small screens) */}
        <div className="md:hidden absolute bottom-8 right-8 z-20 font-display text-2xl font-normal tabular-nums">
          {(activeIndex ?? 0) + 1}
        </div>

        {/* Navigation prompts — "Scroll" cue + mobile "Tap to access" hint */}
        <NavPrompt />
      </section>
      </div>

      {/* ============ PROJECT BLOCKS ============ */}
      <div className="relative z-10 -mt-[60vh] md:-mt-[80vh] bg-background">
      {visibleBlocks.map((b, i) => {
        const isDark = b.theme === "dark";
        const imgFirst = b.imageSide === "left";

        return (
          <section
            key={b.title + i}
            ref={(node) => {
              blockRefs.current[i] = node;
            }}
            className={`relative isolate h-[100svh] overflow-hidden ${
              isDark ? "text-foreground" : "text-background"
            }`}
          >
            {/* Background layer — clipped strictly to this section, drifting at
                ~65% of scroll speed. Oversized so the parallax offset can never
                expose a gap or let the neighbouring colour bleed in. */}
            <div
              aria-hidden
              data-parallax="0.35"
              data-parallax-vh=""
              style={{ willChange: "transform" }}
              className={`pointer-events-none absolute inset-x-0 -top-[45svh] -bottom-[45svh] -z-10 ${
                isDark ? "bg-background" : "bg-foreground"
              }`}
            />
            <div className={`relative mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 content-center items-center gap-6 px-6 py-[clamp(3rem,8vh,6rem)] md:gap-12 md:px-10 ${b.noImage ? "" : "md:grid-cols-2"}`}>
              {/* Image placeholder */}
              {!b.noImage && (
                <div
                  className={`order-1 ${
                    imgFirst ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div
                    className={`flex w-full items-center justify-center overflow-hidden h-[clamp(34svh,44svh,50svh)] md:h-[clamp(46svh,58svh,64svh)] ${
                      b.image ? "" : `${b.aspect ?? "aspect-square"} ${isDark ? "bg-foreground/15" : "bg-background/15"}`
                    }`}
                  >
                    {b.image && (
                      <img
                        src={b.image}
                        alt={b.title}
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Text column */}
              <div
                className={`order-2 flex flex-col justify-between ${

                  b.noImage ? "" : "md:min-h-[clamp(46svh,58svh,64svh)]"
                } ${imgFirst ? "md:order-2" : "md:order-1"}`}
              >
                {b.kind === "poetry" ? (
                  <>
                    <p
                      className={`font-sans text-sm leading-relaxed ${
                        isDark ? "text-foreground/90" : "text-background/90"
                      }`}
                    >
                      {b.excerpt ?? teaserForSlug(b.writingSlug)}
                    </p>
                    <div className="mt-12 flex items-end justify-between">
                      {b.writingSlug ? (
                        <Link
                          to="/writing/$slug"
                          params={{ slug: b.writingSlug }}
                          className="font-display font-medium leading-[1.02] tracking-tight whitespace-pre-line hover:opacity-70 transition-opacity animate-gentle-pulse"
                          style={{ fontSize: "clamp(2rem, 5.6vw, 4.5rem)" }}
                        >
                          <h2 className="contents">{b.title}</h2>
                        </Link>
                      ) : (
                        <h2
                          className="font-display font-medium leading-[1.02] tracking-tight whitespace-pre-line"
                          style={{ fontSize: "clamp(2rem, 5.6vw, 4.5rem)" }}
                        >
                          {b.title}
                        </h2>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span
                        className={`font-sans text-[11px] uppercase tracking-[0.25em] ${
                          isDark ? "text-foreground/80" : "text-background/80"
                        }`}
                      >
                        {b.category}
                      </span>
                      <span
                        className={`block h-3 w-3 ${
                          isDark ? "bg-foreground" : "bg-background"
                        }`}
                        aria-hidden
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span
                        className={`block font-sans text-[11px] uppercase tracking-[0.25em] ${
                          isDark ? "text-foreground/80" : "text-background/80"
                        }`}
                      >
                        {b.category}
                      </span>
                      <h2
                        className="mt-4 font-display font-medium leading-[1.02] tracking-tight whitespace-pre-line"
                        style={{ fontSize: "clamp(2rem, 5.6vw, 4.5rem)" }}
                      >
                        {b.title}
                      </h2>
                    </div>
                    {b.photoSlug ? (
                      <Link
                        to="/photography/$slug"
                        params={{ slug: b.photoSlug }}
                        className={`mt-12 md:mt-auto self-start font-sans text-base md:text-lg font-medium uppercase tracking-[0.3em] ${
                          isDark ? "text-foreground" : "text-background"
                        } hover:opacity-60 transition-opacity`}
                      >
                        Explore
                      </Link>
                    ) : b.commissionSlug ? (
                      <Link
                        to="/commissions/$slug"
                        params={{ slug: b.commissionSlug }}
                        className={`mt-12 md:mt-auto self-start font-sans text-base md:text-lg font-medium uppercase tracking-[0.3em] ${
                          isDark ? "text-foreground" : "text-background"
                        } hover:opacity-60 transition-opacity`}
                      >
                        Explore
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`mt-12 md:mt-auto self-start font-sans text-base md:text-lg font-medium uppercase tracking-[0.3em] ${
                          isDark ? "text-foreground" : "text-background"
                        } hover:opacity-60 transition-opacity`}
                      >
                        Explore
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}
      </div>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </main>
  );
}

/**
 * A24-style word: each letter slides up on hover while a duplicate
 * rises from below. Letters animate in a staggered cascade.
 */
function AnimatedWord({ text }: { text: string }) {
  const letters = Array.from(text);
  return (
    <span className="group/word inline-flex overflow-hidden align-baseline leading-[1.05]">
      {letters.map((ch, i) => (
        <span
          key={i}
          className="relative inline-block overflow-hidden"
          style={{ height: "1em" }}
        >
          <span
            className="block transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/word:-translate-y-full"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
          <span
            aria-hidden
            className="absolute left-0 top-full block transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/word:-translate-y-full"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/** A24-style menu trigger: "Menu" wordmark + animated bars that morph on hover. */
function A24MenuTrigger() {
  const { toggle } = useMenu();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open menu"
      className="group/menu flex items-center gap-3"
    >
      <span
        className="hidden font-display font-normal leading-none tracking-tight sm:inline-block"
        style={{ fontSize: "clamp(0.95rem, 1vw + 0.6rem, 1.25rem)" }}
      >
        <AnimatedWord text="Menu" />
      </span>
      <span className="flex flex-col gap-[clamp(3px,0.5vw,6px)]">
        <span
          className="block h-[2px] bg-current transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/menu:w-[clamp(1.75rem,2.6vw,2.5rem)]"
          style={{ width: "clamp(1.25rem, 2vw, 2rem)" }}
        />
        <span
          className="block h-[2px] bg-current transition-all duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/menu:w-[clamp(1rem,1.6vw,1.5rem)]"
          style={{ width: "clamp(1.25rem, 2vw, 2rem)" }}
        />
      </span>
    </button>
  );
}

