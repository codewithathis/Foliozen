import Link from "next/link";
import { ROUTES } from "@/lib/seo";
import { SITE } from "@/lib/site";

const LINKS: [string, string][] = [
  [ROUTES.build, "Resume builder"],
  [ROUTES.atsChecker, "ATS resume checker"],
  [ROUTES.latexTemplates, "LaTeX resume templates"],
  [ROUTES.latexStudio, "LaTeX editor"],
  [ROUTES.changelog, "Changelog"],
];

export function SiteFooter() {
  const thisYear = new Date().getFullYear();
  const years = thisYear > SITE.since ? `${SITE.since}–${thisYear}` : String(SITE.since);
  return (
    <footer className="mx-auto mt-12 max-w-[1440px] break-words px-4 pb-[max(40px,env(safe-area-inset-bottom))] sm:mt-16 sm:px-6">
      <div className="grid gap-4 border-t border-rule pt-6 text-xs text-ink-3 md:grid-cols-[1fr_auto]">
        <div className="space-y-1.5">
          <p>
            &copy; {years} {SITE.owner}. All rights reserved.
            {" "}Source code is available under the {SITE.license} License
            {SITE.repo ? (
              <>
                {" "}
                <a className="link" href={SITE.repo} rel="noopener">
                  on GitHub
                </a>
              </>
            ) : null}
            .
          </p>
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 text-ink-2 [&::-webkit-details-marker]:hidden">
              Privacy and project details
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p className="mb-2">
              Drafts stay in this browser. PDF and DOCX exports are built locally. Choosing Overleaf or approving the optional remote
              LaTeX compiler sends your source to that service.
            </p>
            <p>
              Overleaf, Workday, Taleo, iCIMS, Greenhouse and Lever are trademarks of their respective owners. {SITE.name} is an independent
              project and is not affiliated with or endorsed by any of them.
            </p>
          </details>
        </div>
        <nav className="flex min-h-11 flex-wrap items-center gap-x-6 gap-y-1 md:justify-end" aria-label="Footer">
          {LINKS.map(([href, label]) => (
            <Link key={href} className="inline-flex min-h-11 items-center hover:text-ink" href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
