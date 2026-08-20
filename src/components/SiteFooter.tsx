import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-6 py-16 font-sans text-xs uppercase tracking-[0.25em] md:px-10">
        <ul className="space-y-3">
          <li><Link to="/profile" className="hover:opacity-60">Ra</Link></li>
          <li><Link to="/resume">Resume</Link></li>
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
    </footer>
  );
}
