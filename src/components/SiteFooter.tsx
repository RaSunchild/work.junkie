import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export function SiteFooter() {
  // Footer behaviour borrowed from the kimara build: the footer occupies its
  // own full-height section and its contents ride upward as the section
  // scrolls into view, settling once fully on screen.
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the footer's top edge is at the bottom of the viewport,
      // 1 once it has travelled a full viewport upward.
      const p = 1 - rect.top / vh;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const eased = progress * progress * (3 - 2 * progress);

  return (
    <footer
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-background text-foreground"
    >
      <div
        className="flex flex-1 flex-col justify-between will-change-transform"
        style={{
          transform: `translate3d(0, ${(1 - eased) * 18}vh, 0)`,
          opacity: 0.15 + eased * 0.85,
        }}
      >
        <div className="mx-auto grid w-full max-w-[1400px] flex-1 content-center grid-cols-2 gap-8 px-6 py-16 font-sans text-xs uppercase tracking-[0.25em] md:px-10">
          <ul className="space-y-3">
            <li><Link to="/profile" className="hover:opacity-60">Ra</Link></li>
            <li><Link to="/resume" className="hover:opacity-60">Resume</Link></li>
            <li className="pt-6"><Link to="/commission" className="hover:opacity-60">Commission a project</Link></li>
          </ul>
          <ul className="space-y-3">
            <li><a href="tel:+256764318585" className="hover:opacity-60">Phone</a></li>
            <li><a href="mailto:jkimara@icloud.com" className="hover:opacity-60">Email</a></li>
            <li className="pt-6"><Link to="/achievements" className="hover:opacity-60">Achievements</Link></li>
            <li><Link to="/archive" className="hover:opacity-60">Archive</Link></li>
          </ul>
        </div>
        <div className="px-6 pb-8 font-sans text-[11px] uppercase tracking-[0.25em] text-foreground/50 md:px-10">
          © RA
        </div>
      </div>
    </footer>
  );
}
