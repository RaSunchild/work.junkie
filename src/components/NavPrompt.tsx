import { useEffect, useState } from "react";

/**
 * Navigation prompts, borrowed from the kimara build:
 * a bottom-centre "Scroll" cue with a drifting rule, plus a mobile-only
 * "Tap to access" hint over the project list. Both fade out for good on
 * the visitor's first scroll or touch.
 */
export function NavPrompt() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.scrollY > 8) {
      setDismissed(true);
      return;
    }
    const hide = () => setDismissed(true);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    window.addEventListener("touchstart", hide, { passive: true, once: true });
    window.addEventListener("wheel", hide, { passive: true, once: true });
    window.addEventListener("keydown", hide, { once: true });
    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("touchstart", hide);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("keydown", hide);
    };
  }, []);

  const fade = dismissed ? "opacity-0" : "opacity-100";

  return (
    <>
      <span
        aria-hidden
        className={`md:hidden pointer-events-none absolute bottom-64 left-1/2 z-20 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.3em] text-foreground/60 transition-opacity duration-500 ${fade}`}
      >
        Tap to access
      </span>
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-foreground/60 transition-opacity duration-500 ${fade}`}
      >
        <span>Scroll</span>
        <span className="scroll-cue block h-8 w-px bg-foreground/40" />
      </div>
    </>
  );
}