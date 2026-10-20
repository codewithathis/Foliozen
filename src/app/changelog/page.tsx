import type { Metadata } from "next";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { CHANGELOG } from "@/lib/changelog";
import { SITE } from "@/lib/site";
import { JsonLd, ROUTES, breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog and Release Notes",
  description:
    "What’s new in ResumeFold. Features, fixes and improvements, grouped by month and version.",
  path: ROUTES.changelog,
});

const monthFormat = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default function ChangelogPage() {
  return (
    <div className="device-safe min-h-dvh">
      <JsonLd data={[breadcrumb("Changelog", ROUTES.changelog)]} />
      <FloatingNav
        brand={SITE.name}
        items={[
          { href: "/", label: "Home" },
          { href: "/#templates", label: "Templates" },
          { href: "/changelog/", label: "Changelog" },
        ]}
        cta={{ href: "/build", label: "Build resume" }}
      />
      <main className="mx-auto max-w-3xl px-5 pb-12 pt-[calc(96px+env(safe-area-inset-top))] sm:px-8 lg:pt-28">
        <p className="eyebrow mb-4">Project updates</p>
        <h1 className="page-title editorial-serif">Changelog</h1>
        <p className="mt-3 text-sm text-ink-2">
          Features, fixes and improvements, by release.
        </p>
        <div className="mt-10 space-y-12">
          {CHANGELOG.map(({ month, entries }) => (
            <section key={month} aria-labelledby={`month-${month}`}>
              <h2 id={`month-${month}`} className="section-title">
                {monthFormat.format(new Date(`${month}-01T00:00:00Z`))}
              </h2>
              <div className="mt-6 space-y-6">
                {entries.map(({ version, date, changes }) => (
                  <article
                    key={version}
                    className="changelog-entry rounded-tile bg-paper-2 p-5 sm:p-6"
                  >
                    <h3 className="font-display text-md font-medium">
                      {version}
                    </h3>
                    <time
                      dateTime={date}
                      className="mt-1 block text-xs text-ink-3"
                    >
                      {dateFormat.format(new Date(`${date}T00:00:00Z`))}
                    </time>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-ink-2">
                      {changes.map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
