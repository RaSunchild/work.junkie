import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MenuButton } from "@/components/MenuOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { projects as designProjects } from "@/data/projects";
import { photoProjects } from "@/data/photography";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
  head: () => ({
    meta: [
      { title: "Playground — Kimara" },
      {
        name: "description",
        content:
          "A free-arrange gallery of visual-art experiments — drag design and photography projects across an open white space.",
      },
      { property: "og:title", content: "Playground — Kimara" },
      {
        property: "og:description",
        content: "Drag-to-arrange image frames opening into design and photography projects.",
      },
    ],
  }),
});

type Frame = {
  key: string;
  title: string;
  category: "Design" | "Photography";
  to: string;
  params: Record<string, string>;
  bg: string;
  x: number; // px
  y: number; // px
  width: number; // px
  aspect: string;
  rotate: number;
  z: number;
};

const STORAGE_KEY = "playground:positions:v1";
const CANVAS_W = 1600;
const CANVAS_H = 2200;

function seeded(i: number, salt: number) {
  const x = Math.sin((i + 1) * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function buildFrames(): Frame[] {
  const design = designProjects.map((p, i) => ({
    key: `d-${p.slug}`,
    title: p.title,
    category: "Design" as const,
    to: "/projects/$slug",
    params: { slug: p.slug },
    bg: p.heroBg,
    aspect: i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]",
  }));
  const photo = photoProjects.map((p, i) => ({
    key: `p-${p.slug}`,
    title: p.title,
    category: "Photography" as const,
    to: "/photography/$slug",
    params: { slug: p.slug },
    bg: p.heroBg,
    aspect: i % 2 === 0 ? "aspect-[3/2]" : "aspect-[2/3]",
  }));

  const all = [...design, ...photo];

  return all.map((f, i) => {
    const r1 = seeded(i, 1);
    const r2 = seeded(i, 2);
    const r3 = seeded(i, 3);
    const r4 = seeded(i, 4);
    const width = 180 + Math.floor(r3 * 160);
    const x = Math.floor(r2 * (CANVAS_W - width - 40)) + 20;
    const y = Math.floor(r1 * (CANVAS_H - 400)) + 40;
    const rotate = (r4 - 0.5) * 10;
    return { ...f, x, y, width, rotate, z: 10 + i };
  });
}

function PlaygroundPage() {
  const initial = useMemo(buildFrames, []);
  const [frames, setFrames] = useState<Frame[]>(initial);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const dragState = useRef<{
    key: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  // Load saved positions
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Record<string, { x: number; y: number; z: number }>;
      setFrames((prev) =>
        prev.map((f) => (saved[f.key] ? { ...f, ...saved[f.key] } : f)),
      );
    } catch {}
  }, []);

  const persist = useCallback((next: Frame[]) => {
    try {
      const map: Record<string, { x: number; y: number; z: number }> = {};
      next.forEach((f) => {
        map[f.key] = { x: f.x, y: f.y, z: f.z };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {}
  }, []);

  const onPointerDown = (e: React.PointerEvent, key: string) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const frame = frames.find((f) => f.key === key);
    if (!frame) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const maxZ = Math.max(...frames.map((f) => f.z));
    setFrames((prev) =>
      prev.map((f) => (f.key === key ? { ...f, z: maxZ + 1 } : f)),
    );
    dragState.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      origX: frame.x,
      origY: frame.y,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    setFrames((prev) =>
      prev.map((f) =>
        f.key === d.key
          ? { ...f, x: Math.max(0, d.origX + dx), y: Math.max(0, d.origY + dy) }
          : f,
      ),
    );
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (d.moved) {
      setFrames((prev) => {
        persist(prev);
        return prev;
      });
    }
    // Delay clearing so the click handler can read `moved`
    setTimeout(() => {
      dragState.current = null;
    }, 0);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    // Suppress navigation if a drag occurred
    if (dragState.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const resetLayout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setFrames(buildFrames());
  };

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
              Playground
            </h1>
            <p className="mt-3 max-w-md font-sans text-sm text-black/60">
              Welcome to my domain:
            </p>
          </div>
          <button
            onClick={resetLayout}
            className="hidden shrink-0 font-sans text-[10px] uppercase tracking-[0.25em] text-black/50 underline-offset-4 hover:text-black hover:underline md:inline"
          >
            Reset layout
          </button>
        </div>
      </section>

      {/* Empty canvas — projects will be added later */}
      <section
        className="relative mx-auto w-full bg-white"
        style={{ height: "clamp(900px, 220vh, 2400px)" }}
        aria-label="Empty playground canvas"
      />


      <SiteFooter />
    </main>
  );
}
