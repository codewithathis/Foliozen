import Link from "next/link";
import { ROUTES } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const years =
    year > SITE.since ? `${SITE.since}–${year}` : String(SITE.since);
  return (
    <footer className="site-footer">
      <div className="footer-stage">
        <div className="footer-panel">
          <div className="footer-columns">
            <div className="footer-about">
              <Link
                prefetch={false}
                className="brand-link"
                href="/"
                aria-label={`${SITE.name} home`}
              >
                <BrandMark lockup />
              </Link>
              <p>
                A place to put your experience in order.
                <br />
                Free to use. Yours to keep.
              </p>
              <span className="footer-local">
                <span aria-hidden />
                Files stay on your device.
              </span>
            </div>
            <nav aria-label="Footer product" className="footer-link-group">
              <h3>Tools</h3>
              <Link prefetch={false} href={ROUTES.build}>
                Resume builder
              </Link>
              <Link prefetch={false} href={ROUTES.atsChecker}>
                ATS checker
              </Link>
              <Link prefetch={false} href={ROUTES.latexTemplates}>
                LaTeX templates
              </Link>
              <Link prefetch={false} href={ROUTES.latexStudio}>
                LaTeX editor
              </Link>
            </nav>
            <nav aria-label="Footer project" className="footer-link-group">
              <h3>Project</h3>
              <Link prefetch={false} href={ROUTES.changelog}>
                Changelog
              </Link>
              {SITE.repo && (
                <a href={SITE.repo} rel="noopener">
                  Source on GitHub <span aria-hidden>↗</span>
                </a>
              )}
              <span>{SITE.license} licensed</span>
              <span>No account needed</span>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>
              © {years} {SITE.owner}. All rights reserved.
            </p>
            <details className="footer-privacy">
              <summary>
                Privacy & project details <span aria-hidden>↗</span>
              </summary>
              <div>
                <p>
                  Drafts save in this browser. Download a backup to keep a
                  separate copy. PDF and DOCX files are created on your device.
                  Choosing Overleaf or approving the optional remote LaTeX
                  compiler sends your source to that service.
                </p>
                <p>
                  Overleaf, Workday, Taleo, iCIMS, Greenhouse and Lever are
                  trademarks of their respective owners. {SITE.name} is
                  independent and is not affiliated with or endorsed by them.
                </p>
              </div>
            </details>
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          {SITE.name}
        </div>
      </div>
    </footer>
  );
}
