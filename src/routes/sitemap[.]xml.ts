import { createFileRoute } from "@tanstack/react-router";
import { projects } from "@/data/projects";
import { writingPieces } from "@/data/writing";
import { photoProjects } from "@/data/photography";
import { commissions } from "@/data/commissions";

const BASE_URL = "https://id-preview--339d9059-1712-4b88-8924-1db6804e5764.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/achievements", changefreq: "monthly", priority: "0.7" },
          { path: "/archive", changefreq: "monthly", priority: "0.7" },
          { path: "/commission", changefreq: "monthly", priority: "0.7" },
          { path: "/playground", changefreq: "monthly", priority: "0.6" },
          { path: "/profile", changefreq: "monthly", priority: "0.7" },
          { path: "/resume", changefreq: "monthly", priority: "0.7" },
          { path: "/writing", changefreq: "weekly", priority: "0.8" },
          ...projects.map((p): SitemapEntry => ({ path: `/projects/${p.slug}`, changefreq: "monthly", priority: "0.8" })),
          ...writingPieces.map((w): SitemapEntry => ({ path: `/writing/${w.slug}`, changefreq: "monthly", priority: "0.8" })),
          ...photoProjects.map((p): SitemapEntry => ({ path: `/photography/${p.slug}`, changefreq: "monthly", priority: "0.8" })),
          ...commissions.map((c): SitemapEntry => ({ path: `/commissions/${c.slug}`, changefreq: "monthly", priority: "0.8" })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});