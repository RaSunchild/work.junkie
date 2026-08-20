/**
 * ============================================================
 *  ARCHIVE — EDIT HERE
 * ============================================================
 *
 *  The /archive page lists work that doesn't sit on the landing
 *  page. It is built from two sources:
 *
 *   1. Internal entries: any item in projects.ts, photography.ts,
 *      or writing.ts WITHOUT `featured: true` flows here
 *      automatically and links to its own page.
 *
 *   2. External extras: add entries to `archiveExtras` below for
 *      off-site work (published articles, IG posts, Behance, etc).
 *      These open in a new tab.
 *
 *  Category must be "Design", "Photography", or "Writing".
 * ============================================================
 */

import { projects } from "./projects";
import { photoProjects } from "./photography";
import { writingPieces, getExcerpt } from "./writing";

export type ArchiveCategory = "Design" | "Photography" | "Writing";

export type ArchiveItem = {
  title: string;
  category: ArchiveCategory;
  scope: string;
  description?: string;
} & (
  | { to: string; params?: Record<string, string>; href?: never }
  | { href: string; to?: never; params?: never }
);

export type ArchiveExtra = {
  title: string;
  category: ArchiveCategory;
  scope?: string;
  description?: string;
  href: string;
};

/** Add off-site / external work here. */
export const archiveExtras: ArchiveExtra[] = [];

const CATEGORY_ORDER: ArchiveCategory[] = ["Design", "Photography", "Writing"];

export function getArchiveItems(): ArchiveItem[] {
  const items: ArchiveItem[] = [];

  for (const p of projects) {
    if (p.featured) continue;
    items.push({
      title: p.title,
      category: "Design",
      scope: p.scope,
      description: p.description,
      to: "/projects/$slug",
      params: { slug: p.slug },
    });
  }

  for (const p of photoProjects) {
    if (p.featured) continue;
    items.push({
      title: p.title,
      category: "Photography",
      scope: p.series,
      description: p.description?.split(/(?<=\.)\s/)[0],
      to: "/photography/$slug",
      params: { slug: p.slug },
    });
  }

  for (const w of writingPieces) {
    if (w.featured) continue;
    items.push({
      title: w.title,
      category: "Writing",
      scope: w.category,
      description: getExcerpt(w, 180),
      to: "/writing/$slug",
      params: { slug: w.slug },
    });
  }

  for (const e of archiveExtras) {
    items.push({
      title: e.title,
      category: e.category,
      scope: e.scope ?? e.category,
      description: e.description,
      href: e.href,
    });
  }

  // Stable category order: Design → Photography → Writing.
  items.sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
  );

  return items;
}
