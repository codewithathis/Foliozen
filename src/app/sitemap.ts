import type { MetadataRoute } from "next";
import { CHANGELOG } from "@/lib/changelog";
import { ROUTES, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** The latest release date doubles as last-modified, so the sitemap changes when the site does. */
const released = new Date(`${CHANGELOG[0].entries[0].date}T00:00:00Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    [ROUTES.home, 1, "weekly"],
    [ROUTES.build, 0.9, "weekly"],
    [ROUTES.atsChecker, 0.8, "monthly"],
    [ROUTES.latexTemplates, 0.8, "monthly"],
    [ROUTES.latexStudio, 0.6, "monthly"],
    [ROUTES.changelog, 0.4, "weekly"],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: released, changeFrequency, priority }));
}
