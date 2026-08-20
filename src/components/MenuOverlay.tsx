import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { projects as projectData } from "@/data/projects";

type MenuContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider
      value={{ open, setOpen, toggle: () => setOpen(!open) }}
    >
      {children}
      <MenuOverlay />
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
}

const links: { label: string; to: string }[] = [
  { label: "Profile", to: "/profile" },
  { label: "Resume", to: "/resume" },
  { label: "Archive", to: "/archive" },
  { label: "Playground", to: "/playground" },
];

function MenuOverlay() {
  const { open, setOpen } = useMenu();
  const [autoIndex, setAutoIndex] = useState(0);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Cycle the right-panel project image
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setAutoIndex((i) => (i + 1) % projectData.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [open]);

  const project = projectData[autoIndex] ?? projectData[0];

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
        {/* LEFT — links on light bg */}
        <div className="relative flex flex-col bg-white text-black">
          <div className="flex items-center justify-end px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1rem,3vw,2rem)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="md:hidden relative h-6 w-6"
            >
              <span className="absolute left-0 top-1/2 block h-[2px] w-6 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 block h-[2px] w-6 -translate-y-1/2 -rotate-45 bg-current" />
            </button>
          </div>

          <nav className="flex flex-1 items-center px-[clamp(1.5rem,5vw,4rem)]">
            <ul className="space-y-[clamp(0.75rem,2vw,1.25rem)]">
              {links.map((l, i) => (
                <li
                  key={l.label}
                  className={open ? "title-rise" : ""}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display font-bold leading-[1.05] tracking-tight hover:opacity-60 transition-opacity"
                    style={{ fontSize: "clamp(1.75rem, 6vw, 5rem)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RIGHT — cycling project image with close button */}
        <div
          className="relative hidden md:flex flex-col text-background"
          style={{ background: project.heroBg }}
        >
          {/* Cross-fade backgrounds */}
          {projectData.map((p, i) => (
            <div
              key={p.slug}
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === autoIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ background: p.heroBg }}
            />
          ))}

          <div className="relative flex items-center justify-end px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1rem,3vw,2rem)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="relative"
              style={{ width: "clamp(1.25rem, 2vw, 2rem)", height: "clamp(1.25rem, 2vw, 2rem)" }}
            >
              <span
                className="absolute left-0 top-1/2 block h-[2px] -translate-y-1/2 rotate-45 bg-background"
                style={{ width: "clamp(1.25rem, 2vw, 2rem)" }}
              />
              <span
                className="absolute left-0 top-1/2 block h-[2px] -translate-y-1/2 -rotate-45 bg-background"
                style={{ width: "clamp(1.25rem, 2vw, 2rem)" }}
              />
            </button>
          </div>

          <div className="flex-1" />

          <div className="relative flex items-end justify-between gap-6 px-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(1.5rem,4vw,2.5rem)]">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              onClick={() => setOpen(false)}
              className="font-sans text-xs uppercase tracking-[0.25em] text-background/80 hover:text-background"
            >
              {project.title}
            </Link>
            <span
              className="font-display font-medium leading-none tabular-nums text-background"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              {autoIndex + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reusable hamburger button — wire any header's menu button via this. */
export function MenuButton({ className = "" }: { className?: string }) {
  const { toggle } = useMenu();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open menu"
      className={`flex flex-col gap-[clamp(3px,0.5vw,6px)] ${className}`}
    >
      <span className="block h-[2px] bg-current" style={{ width: "clamp(1.25rem, 2vw, 2rem)" }} />
      <span className="block h-[2px] bg-current" style={{ width: "clamp(1.25rem, 2vw, 2rem)" }} />
    </button>
  );
}
