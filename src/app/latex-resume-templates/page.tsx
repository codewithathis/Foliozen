import type { Metadata } from "next";
import Link from "next/link";
import {
  CardGrid,
  ContentPage,
  FaqSection,
  GuideSection,
} from "@/components/ui/ContentPage";
import { Thumbnail } from "@/components/workspace/Thumbnail";
import { JsonLd, ROUTES, breadcrumb, faqSchema, pageMetadata } from "@/lib/seo";
import { sampleResume } from "@/lib/sample";
import { LATEX_STYLES } from "@/lib/templates";
import { RESUME_CSS, RESUME_FONTS_URL } from "@/lib/templates/html/styles";

export const metadata: Metadata = pageMetadata({
  title: "Free LaTeX Resume Templates for Overleaf",
  description:
    "Four free LaTeX resume templates. Add your details in the builder, edit the source and compile on your device, or open the project in Overleaf.",
  path: ROUTES.latexTemplates,
});

const WORKFLOW: [string, string][] = [
  [
    "Add your details",
    "Fill in the builder. ResumeFold turns your details into LaTeX source.",
  ],
  [
    "Compile on your device",
    "Create a PDF in your browser. The local compiler keeps your source on this device.",
  ],
  [
    "Edit the source",
    "Use the editor’s outline, autocomplete and PDF preview to adjust your resume.",
  ],
  [
    "Open in Overleaf",
    "Send the project to Overleaf when you choose, or download the .tex or .zip.",
  ],
];

const FAQ = [
  {
    q: "Are these LaTeX resume templates free?",
    a: "Yes. All four styles are free to use, edit and export, with no account or watermark. The project is open source under the MIT License.",
  },
  {
    q: "Are LaTeX resumes ATS-friendly?",
    a: "Classic, Bold and Banking use a single column with selectable text. They’re the simpler choice for job portals. Two-column uses a sidebar; check its reading order before sharing. Always follow the posting’s file requirements.",
  },
  {
    q: "Do I need to know LaTeX?",
    a: "No. Fill in the builder and ResumeFold generates the source. If you do know LaTeX, edit it in the studio or in Overleaf.",
  },
  {
    q: "Which engine do the templates use?",
    a: "All four compile with pdfLaTeX and use common packages, so they work in Overleaf and in a standard TeX Live install.",
  },
  {
    q: "Can I switch templates after I start?",
    a: "Yes. Your details are stored separately from the style, so switching regenerates the source from them. Hand edits made in the LaTeX editor are replaced, so download the .tex first if you want to keep them.",
  },
];

export default function LatexResumeTemplatesPage() {
  return (
    <>
      <Link prefetch={false} rel="stylesheet" href={RESUME_FONTS_URL} />
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <JsonLd
        data={[
          breadcrumb("LaTeX resume templates", ROUTES.latexTemplates),
          {
            "@type": "ItemList",
            name: "LaTeX resume templates",
            itemListElement: LATEX_STYLES.map((style, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${style.name} LaTeX resume template`,
            })),
          },
          faqSchema(FAQ),
        ]}
      />
      <ContentPage
        eyebrow="LaTeX templates"
        title="Free LaTeX resume templates"
        intro="Four styles, with source you can edit. Add your details in the builder, compile on your device, or open the project in Overleaf."
        cta={[ROUTES.build, "Choose a template"]}
      >
        <section className="mt-12 sm:mt-20" aria-labelledby="styles">
          <h2 id="styles" className="section-title">
            Choose a LaTeX resume template
          </h2>
          <p className="mt-1 max-w-[60ch] text-ink-2">
            Shown with sample details. Compile in the editor to see the final
            PDF.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-8 sm:gap-6 lg:grid-cols-4">
            {LATEX_STYLES.map((style) => (
              <li key={style.id}>
                <Link
                  prefetch={false}
                  href={ROUTES.build}
                  className="group block"
                >
                  <div className="template-art relative flex justify-center overflow-hidden rounded-card bg-paper-2 px-3 pt-5 sm:px-6 sm:pt-8">
                    <div
                      className="max-h-[230px] w-full max-w-[220px] overflow-hidden rounded-t-[6px]"
                      style={{ boxShadow: "var(--shadow-sheet)" }}
                    >
                      <Thumbnail
                        resume={sampleResume}
                        variant={`tex-${style.id}`}
                        width={220}
                      />
                    </div>
                    {!style.atsSafe && (
                      <span className="chip absolute right-4 top-4 bg-amber-soft text-amber">
                        For direct sharing
                      </span>
                    )}
                  </div>
                  <div className="px-1 pt-4">
                    <h3 className="font-display font-medium">{style.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-2">
                      {style.tagline}. {style.detail}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <GuideSection
          title="From details to PDF"
          intro="Start in the builder. Adjust in the editor."
        >
          <CardGrid items={WORKFLOW} />
        </GuideSection>

        <GuideSection title="Are LaTeX resumes ATS-friendly?">
          <p>
            These templates produce selectable text. Check the reading order
            too: text in side-by-side columns can become mixed when copied out
            of a PDF.
          </p>
          <p>
            Classic, Bold and Banking use one column, familiar headings and
            plain bullets. Two-column has a sidebar and is intended for direct
            sharing.
          </p>
          <p>
            Use the{" "}
            <Link prefetch={false} className="link" href={ROUTES.atsChecker}>
              ATS resume checker
            </Link>{" "}
            to review missing details and keywords, then read the final PDF
            yourself.
          </p>
        </GuideSection>

        <GuideSection title="Edit your LaTeX resume online">
          <p>
            The{" "}
            <Link prefetch={false} className="link" href={ROUTES.latexStudio}>
              LaTeX editor
            </Link>{" "}
            keeps your source and PDF preview together. Each style is a single
            .tex file you can edit and download.
          </p>
        </GuideSection>

        <FaqSection faq={FAQ} />
      </ContentPage>
    </>
  );
}
