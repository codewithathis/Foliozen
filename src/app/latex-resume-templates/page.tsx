import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid, ContentPage, FaqSection, GuideSection } from "@/components/ui/ContentPage";
import { Thumbnail } from "@/components/workspace/Thumbnail";
import { JsonLd, ROUTES, breadcrumb, faqSchema, pageMetadata } from "@/lib/seo";
import { sampleResume } from "@/lib/sample";
import { LATEX_STYLES } from "@/lib/templates";
import { RESUME_CSS, RESUME_FONTS_URL } from "@/lib/templates/html/styles";

/* Voice matches the landing page: direct, short sentences, second person, no em dashes. */

export const metadata: Metadata = pageMetadata({
  title: "Free LaTeX Resume Templates for Overleaf",
  description: "Free ATS-friendly LaTeX resume templates. Fill in a form, compile the PDF in your browser, or open the .tex in Overleaf. No LaTeX knowledge needed.",
  path: ROUTES.latexTemplates,
});

const WORKFLOW: [string, string][] = [
  ["Fill in a form, not a .tex file", "Type your details once. ResumeFold writes clean LaTeX, escaping special characters like & and % for you."],
  ["Compile in your browser", "pdfTeX runs locally through WebAssembly. Nothing is uploaded, and errors point to the line that caused them."],
  ["Edit the source", "The LaTeX editor has autocomplete, an outline and a PDF preview. Your hand edits carry through to every LaTeX export."],
  ["Take it to Overleaf", "One click opens the project in Overleaf. Or download a single .tex file or a .zip."],
];

const FAQ = [
  {
    q: "Are these LaTeX resume templates free?",
    a: "Yes. All four styles are free to use, edit and export, with no account or watermark. The project is open source under the MIT License.",
  },
  {
    q: "Are LaTeX resumes ATS-friendly?",
    a: "They can be. pdfLaTeX produces real, selectable text. Classic, Bold and Banking use a single column, which parsers read in order. The Two-column style uses a sidebar, so keep it for PDFs a person will read.",
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
      <link rel="stylesheet" href={RESUME_FONTS_URL} />
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <JsonLd
        data={[
          breadcrumb("LaTeX resume templates", ROUTES.latexTemplates),
          {
            "@type": "ItemList",
            name: "LaTeX resume templates",
            itemListElement: LATEX_STYLES.map((style, index) => ({ "@type": "ListItem", position: index + 1, name: `${style.name} LaTeX resume template` })),
          },
          faqSchema(FAQ),
        ]}
      />
      <ContentPage
        eyebrow="Free. Open source. Overleaf ready."
        title="Free LaTeX resume templates"
        intro="Four original LaTeX resume templates, three of them ATS-friendly. Fill in a simple form instead of a .tex file, compile the PDF in your browser, or open the source in Overleaf."
        cta={[ROUTES.build, "Use a LaTeX template"]}
      >
        <section className="mt-12 sm:mt-20" aria-labelledby="styles">
          <h2 id="styles" className="font-display text-xl font-bold">Choose a LaTeX resume template</h2>
          <p className="mt-1 max-w-[60ch] text-ink-2">Previews are approximate and use a sample resume. Compile in the editor for the exact PDF.</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LATEX_STYLES.map((style) => (
              <li key={style.id}>
                <Link href={ROUTES.build} className="group block">
                  <div className="template-art relative flex justify-center overflow-hidden rounded-card bg-paper-3 px-6 pt-8">
                    <div className="max-h-[230px] w-[220px] overflow-hidden rounded-t-[6px]" style={{ boxShadow: "var(--shadow-sheet)" }}>
                      <Thumbnail resume={sampleResume} variant={`tex-${style.id}`} width={220} />
                    </div>
                    {!style.atsSafe && <span className="chip absolute right-4 top-4 bg-amber-soft text-amber">Humans only</span>}
                  </div>
                  <div className="px-1 pt-4">
                    <h3 className="font-display font-bold">{style.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-2">{style.tagline}. {style.detail}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <GuideSection title="How to use a LaTeX resume template" intro="The convenience of a form, the typesetting of LaTeX.">
          <CardGrid items={WORKFLOW} />
        </GuideSection>

        <GuideSection title="Are LaTeX resumes ATS-friendly?">
          <p>
            A LaTeX PDF is real text, so parsers can read it. Layout is what trips them up. Sidebars and side-by-side columns are often read straight across the page.
          </p>
          <p>
            Classic, Bold and Banking are single-column, with standard section names and plain bullets. Use one of those for job portals. Save Two-column for PDFs you send to a person.
          </p>
          <p>
            Before you apply, run the <Link className="link" href={ROUTES.atsChecker}>ATS resume checker</Link> for missing dates, weak bullets and keywords from the job posting.
          </p>
        </GuideSection>

        <GuideSection title="Edit your LaTeX resume online">
          <p>
            Open the <Link className="link" href={ROUTES.latexStudio}>LaTeX resume editor</Link>. It looks and works like Overleaf, with a file tree, lint errors in the gutter and page-by-page preview.
            Each style is one self-contained .tex file, so nothing is hidden in a class file.
          </p>
        </GuideSection>

        <FaqSection faq={FAQ} />
      </ContentPage>
    </>
  );
}
