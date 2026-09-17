import type { Metadata } from "next";
import { SITE } from "./site";

/** Indexable routes, with trailing slashes to match `trailingSlash: true`. Keep in step with src/app. */
export const ROUTES = {
  home: "/",
  build: "/build/",
  atsChecker: "/ats-resume-checker/",
  latexTemplates: "/latex-resume-templates/",
  latexStudio: "/latex/",
  changelog: "/changelog/",
} as const;

/** Relative to metadataBase, which already includes any base path. */
export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: `${SITE.name}: free ATS-friendly resume builder with PDF, DOCX and LaTeX export` };

export const absoluteUrl = (path: string) => `${SITE.url}${path === "/" ? "/" : path}`;

/**
 * Per-page metadata. Next.js replaces (not merges) nested `openGraph` and `twitter`
 * objects, so every page sets its own canonical URL, social title and description.
 */
export function pageMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE.name, locale: "en_US", title: socialTitle, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [OG_IMAGE] },
  };
}

/** JSON-LD breadcrumb for a page one level below home. */
export function breadcrumb(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.name, item: absoluteUrl(ROUTES.home) },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  // "<" is escaped so user-facing copy can never close the script element.
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": data }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
