import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";

const EDGE = 24;
const THRESHOLD = 80;
const MAX = 120;

export function SwipeBackIndicator() {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const state = useRef({ startX: 0, startY: 0, startT: 0, tracking: false });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reset = () => {
      state.current.tracking = false;
      setDragging(false);
      setDragX(0);
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      if (t.clientX > EDGE) return;
      state.current = {
        startX: t.clientX,
        startY: t.clientY,
        startT: Date.now(),
        tracking: true,
      };
      setDragging(true);
    };

    const onMove = (e: TouchEvent) => {
      if (!state.current.tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - state.current.startX;
      const dy = t.clientY - state.current.startY;
      if (Math.abs(dy) > 60) {
        reset();
        return;
      }
      // damped: sqrt easing after threshold
      const damped = dx <= MAX ? dx : MAX + Math.sqrt(dx - MAX) * 4;
      setDragX(Math.max(0, damped));
    };

    const onEnd = (e: TouchEvent) => {
      if (!state.current.tracking) {
        reset();
        return;
      }
      const t = e.changedTouches[0];
      const dx = t.clientX - state.current.startX;
      const dy = t.clientY - state.current.startY;
      const dt = Date.now() - state.current.startT;
      const armed =
        dx > THRESHOLD && Math.abs(dy) < 60 && dt < 600 && window.history.length > 1;
      reset();
      if (armed) window.history.back();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", reset, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", reset);
    };
  }, []);

  const armed = dragX > THRESHOLD;
  const progress = Math.min(1, dragX / THRESHOLD);
  const visible = dragX > 0;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-50 flex items-center"
      style={{
        transform: `translateX(${Math.max(0, dragX - 44)}px)`,
        transition: dragging ? "none" : "transform 200ms ease-out",
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
        style={{
          opacity: visible ? 0.35 + progress * 0.65 : 0,
          transform: `scale(${armed ? 1.1 : 0.85 + progress * 0.15})`,
          transition: dragging
            ? "opacity 120ms linear, transform 120ms ease-out"
            : "opacity 200ms ease-out, transform 200ms ease-out",
        }}
      >
        <ChevronLeft size={22} strokeWidth={2.25} />
      </div>
    </div>
  );
}