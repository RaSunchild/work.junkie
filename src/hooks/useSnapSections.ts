import { useEffect } from "react";

/**
 * Full-viewport "page-turn" snapping shared by the homepage, the site footer,
 * and the photography project pages. Wheel gestures glide decisively to the
 * next/previous snap stop with a 600ms ease-in-out tween; slow scrolls settle
 * onto the nearest stop. Touch input cancels snaps so mobile stays natural.
 *
 * `getStops` returns the absolute document Y positions of each snap stop
 * (section tops). It is called lazily inside event handlers, so it can read
 * refs without needing a stable identity.
 */
export function useSnapSections(getStops: () => number[]) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let isSnapping = false;
    let snapRaf = 0;
    let snapTimer = 0;
    let lastGesture = 0;

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

    /** Snap to the nearest stop whenever the scroll comes to rest mid-section
     *  (keyboard, scrollbar drag, trackpad momentum tail). */
    const settleToNearest = () => {
      if (isSnapping) return;
      const y = window.scrollY;
      const stops = getStops();
      if (stops.length < 2) return;
      const pullRange = window.innerHeight;
      let nearest: number | undefined;
      for (const s of stops) {
        const dist = s - y;
        if (
          Math.abs(dist) > 2 &&
          Math.abs(dist) < pullRange &&
          (nearest === undefined || Math.abs(dist) < Math.abs(nearest - y))
        ) {
          nearest = s;
        }
      }
      if (nearest !== undefined) tweenTo(nearest);
    };

    const gestureLock = () => performance.now() - lastGesture < 260;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      const y = window.scrollY;
      if (isSnapping || gestureLock()) {
        e.preventDefault();
        return;
      }
      const stops = getStops().slice().sort((a, b) => a - b);
      if (stops.length < 2) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const target =
        dir === 1
          ? stops.find((s) => s > y + 2)
          : [...stops].reverse().find((s) => s < y - 2);
      if (target === undefined) return;
      e.preventDefault();
      lastGesture = performance.now();
      tweenTo(target);
    };

    const onScrollEnd = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (isSnapping || gestureLock()) return;
        settleToNearest();
      }, 140);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End", " "].includes(
          e.key,
        )
      ) {
        // Let the browser scroll, then snap once it settles.
        window.clearTimeout(snapTimer);
        snapTimer = window.setTimeout(settleToNearest, 200);
      }
    };

    const onUserInput = () => {
      cancelSnap();
      window.clearTimeout(snapTimer);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScrollEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onUserInput, { passive: true });
    window.addEventListener("touchmove", onUserInput, { passive: true });
    return () => {
      cancelSnap();
      window.clearTimeout(snapTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScrollEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("touchmove", onUserInput);
    };
  }, [getStops]);
}

/** Document-absolute Y position of an element's top edge. */
export function sectionTop(el: HTMLElement | null): number | null {
  if (!el) return null;
  return window.scrollY + el.getBoundingClientRect().top;
}
