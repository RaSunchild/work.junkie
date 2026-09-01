import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export function SiteFooter() {
  // Footer behaviour borrowed from the kimara build: the footer occupies its
  // own full-height "page". It stays hidden below the fold until the user
  // scrolls, then glides/snaps into place with the same 600ms ease-in-out
  // page-turn used on the homepage, and its contents ride upward as the
  // section scrolls into view, settling once fully on screen.
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

  // Snap behaviour — matches the homepage's editorial page-turn: the footer
  // is a full-viewport stop. Wheel/touch gestures near it glide decisively
  // to (or away from) its top edge; slow scrolls settle onto it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isSnapping = false;
    let snapRaf = 0;
    let snapTimer = 0;
    let lastGesture = 0;

    const footerTop = () => window.scrollY + el.getBoundingClientRect().top;

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
      isSnapping = true;
      const duration = 600;
      const startTime = performance.now();
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
    const gestureLock = () => performance.now() - lastGesture < 260;

    const onWheel = (e: WheelEvent) => {
      const top = footerTop();
      const y = window.scrollY;
      const vh = window.innerHeight;
      const near = Math.abs(top - y) < vh; // footer within one viewport
      if (!near || Math.abs(e.deltaY) < 4) return;
      if (isSnapping || gestureLock()) {
        if (near) e.preventDefault();
        return;
      }
      const dir = e.deltaY > 0 ? 1 : -1;
      // Glide to the footer when scrolling down from above it; glide back to
      // the content above when scrolling up from the footer's top edge.
      if (dir === 1 && y < top - 2) {
        e.preventDefault();
        lastGesture = performance.now();
        tweenTo(top);
      } else if (dir === -1 && y <= top + 2 && y > top - vh) {
        const prev = Math.max(0, top - vh);
        e.preventDefault();
        lastGesture = performance.now();
        tweenTo(prev);
      }
    };

    const onScrollEnd = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (isSnapping || gestureLock()) return;
        const top = footerTop();
        const dist = top - window.scrollY;
        const pullRange = window.innerHeight * 0.4;
        if (dist > 2 && dist < pullRange) tweenTo(top);
      }, 140);
    };

    const onUserInput = () => {
      cancelSnap();
      window.clearTimeout(snapTimer);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScrollEnd, { passive: true });
    window.addEventListener("touchstart", onUserInput, { passive: true });
    window.addEventListener("touchmove", onUserInput, { passive: true });
    return () => {
      cancelSnap();
      window.clearTimeout(snapTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScrollEnd);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("touchmove", onUserInput);
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
