import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Thumbnail } from "@/components/workspace/Thumbnail";
import { Disclosure } from "@/components/ui/Disclosure";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { WorkflowBento } from "@/components/ui/WorkflowBento";
import {
  JsonLd,
  OG_IMAGE,
  ROUTES,
  absoluteUrl,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";
import { sampleResume } from "@/lib/sample";
import { HTML_TEMPLATES } from "@/lib/templates";
import { RESUME_CSS, RESUME_FONTS_URL } from "@/lib/templates/html/styles";
import { SITE } from "@/lib/site";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is ResumeFold free?",
    a: "Yes. Templates, resume checks and downloads are free. There’s no subscription or watermark. The source code is available under the MIT License.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. Start in the builder. Drafts save in this browser. Download a JSON backup if you want to keep a separate copy or move to another device.",
  },
  {
    q: "Can I upload my existing resume?",
    a: "Yes. Choose a PDF, DOCX or TXT up to 5 MB. ResumeFold reads it on your device. Check the extracted text before creating an editable draft.",
  },
  {
    q: "Should I download a PDF or DOCX?",
    a: "Follow the file requirements in the job posting. ResumeFold offers PDF and DOCX, so you can use the format requested.",
  },
  {
    q: "Is my resume data private?",
    a: "Files are read and drafts are saved in this browser. PDF and DOCX downloads are created on your device. Choosing Overleaf or approving the optional remote LaTeX compiler sends your source to that service.",
  },
  {
    q: "What does the ATS score mean?",
    a: "It’s a guide to common resume issues, based on ResumeFold’s own rules. It isn’t an employer’s score or a prediction of an interview. Review the suggestions and use the ones that fit your experience.",
  },
];

const RULES: [string, string][] = [
  [
    "One column",
    "Keep a clear reading order. Side-by-side sections can mix together when a document is read as text.",
  ],
  [
    "No tables or text boxes",
    "Use ordinary paragraphs and bullets so important details don’t depend on a particular page layout.",
  ],
  [
    "Contact details in the body",
    "Keep your name, email and phone in the main document, where they’re easy to find.",
  ],
  [
    "Standard section headings",
    "Use familiar labels such as “Work Experience”, “Education” and “Skills”.",
  ],
  [
    "Real text, standard fonts",
    "Use selectable text for the details that matter. Keep labels written out and letters together.",
  ],
  [
    "Consistent dates",
    "Use the same month and year format for each role, with the most recent experience first.",
  ],
];

/** Landing-page descriptions for each layout. The builder keeps its shorter labels. */
const TEMPLATE_COPY: Record<string, string> = {
  standard: "A straightforward place to start.",
  student: "Room for education and early experience.",
  combination: "Bring skills and experience together.",
  senior: "Space for a longer work history.",
};

export const metadata: Metadata = pageMetadata({
  title: SITE.title,
  absoluteTitle: true,
  description: SITE.description,
  path: ROUTES.home,
});

export default function Home() {
  const website = `${SITE.url}/#website`;
  const organization = `${SITE.url}/#organization`;
  const jsonLd = [
    {
      "@type": "Organization",
      "@id": organization,
      name: SITE.name,
      url: absoluteUrl(ROUTES.home),
      logo: absoluteUrl("/apple-touch-icon.png"),
      ...(SITE.repo ? { sameAs: [SITE.repo] } : {}),
    },
    {
      "@type": "WebSite",
      "@id": website,
      name: SITE.name,
      url: absoluteUrl(ROUTES.home),
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": organization },
    },
    {
      "@type": "WebApplication",
      name: SITE.name,
      url: absoluteUrl(ROUTES.build),
      description: SITE.tagline,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern web browser.",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "ATS resume checker",
        "Resume upload from PDF, DOCX or TXT",
        "Job description keyword matching",
        "PDF and DOCX export",
        "LaTeX export and Overleaf integration",
        "In-browser LaTeX compiler",
      ],
      image: absoluteUrl(OG_IMAGE.url),
      publisher: { "@id": organization },
      isPartOf: { "@id": website },
      ...(SITE.repo ? { codeRepository: SITE.repo } : {}),
    },
    faqSchema(FAQ),
  ];

  return (
    <div className="device-safe marketing-site">
      <Link prefetch={false} rel="stylesheet" href={RESUME_FONTS_URL} />
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <JsonLd data={jsonLd} />
      <FloatingNav
        brand={SITE.name}
        items={[
          { href: "#ats", label: "Features" },
          { href: "#templates", label: "Templates" },
          { href: "#latex", label: "LaTeX" },
          { href: "#how", label: "How it works" },
          { href: "#faq", label: "FAQ" },
        ]}
        cta={{ href: "/build", label: "Build resume" }}
      />

      <main className="editorial-main">
        <section className="chapter-hero" aria-labelledby="home-title">
          <div className="hero-architecture" aria-hidden="true">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/architecture.webp`}
              alt=""
              fill
              sizes="(max-width: 700px) 900px, 1440px"
              preload
              className="architecture-image"
            />
          </div>
          <div className="hero-content">
            <h1 id="home-title">
              Your experience.
              <br />
              <span className="editorial-serif">Well presented.</span>
            </h1>
            <p className="hero-description">
              Build a clear resume. Check it against a job posting.
              <br className="hidden sm:block" /> Download it when you’re ready.
            </p>
            <div className="hero-actions">
              <Link prefetch={false} href="/build" className="btn btn-primary">
                Build resume <span aria-hidden>↗</span>
              </Link>
              <a href="#templates" className="hero-text-link">
                See templates <span aria-hidden>↓</span>
              </a>
            </div>
            <p className="hero-reassurance">
              Free to use. No account or watermark.
            </p>
          </div>
        </section>

        <section id="ats" className="capabilities drawing-frame">
          <div className="capability-intro">
            <h2>
              Clear from
              <br />
              <span className="editorial-serif">the first read.</span>
            </h2>
            <p>
              A simple layout, readable text and the details a job application
              needs.
            </p>
            <div className="draft-emblem" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="capability-grid">
            <Link
              prefetch={false}
              href={ROUTES.atsChecker}
              className="capability-cell capability-primary"
            >
              <h3>
                Check before
                <br />
                you apply.
              </h3>
              <p>
                Find missing details and formatting issues. Compare your resume
                with a job posting.
              </p>
              <span className="cell-bottom">
                See the ATS checker <span aria-hidden>↗</span>
              </span>
            </Link>
            <Link prefetch={false} href="/build" className="capability-cell">
              <h3>
                Start with
                <br />
                your resume.
              </h3>
              <p>
                Import a PDF, DOCX or TXT. Review the extracted text, then edit
                the details.
              </p>
              <span className="cell-bottom">
                Open the builder <span aria-hidden>↗</span>
              </span>
            </Link>
            <Link
              prefetch={false}
              href={ROUTES.latexStudio}
              className="capability-cell"
            >
              <h3>
                Adjust
                <br />
                every line.
              </h3>
              <p>
                Edit and compile LaTeX with a PDF preview alongside your source.
              </p>
              <span className="cell-bottom">
                Open LaTeX studio <span aria-hidden>↗</span>
              </span>
            </Link>
            <Link prefetch={false} href="/build" className="capability-cell">
              <h3>
                Keep
                <br />
                your copy.
              </h3>
              <p>
                Download PDF, DOCX or LaTeX. Save a backup to move your draft to
                another device.
              </p>
              <span className="cell-bottom">
                Build resume <span aria-hidden>↗</span>
              </span>
            </Link>
          </div>
        </section>

        <section id="templates" className="template-section editorial-section">
          <div className="section-heading-row">
            <div>
              <h2>
                Four layouts.
                <br />
                <span className="editorial-serif">A clear starting point.</span>
              </h2>
            </div>
          </div>
          <div className="resume-ticket-grid">
            {HTML_TEMPLATES.map((template) => (
              <Link
                prefetch={false}
                key={template.id}
                href="/build"
                className="resume-ticket"
                aria-label={`Use ${template.name} resume template`}
              >
                <div className="ticket-top">
                  <span className="ticket-status">ATS-friendly</span>
                </div>
                <div className="ticket-preview">
                  <Thumbnail
                    resume={sampleResume}
                    template={template.id}
                    width={320}
                  />
                </div>
                <div className="ticket-tear" aria-hidden="true" />
                <div className="ticket-description">
                  <h3>{template.name}</h3>
                  <p>{TEMPLATE_COPY[template.id]}</p>
                  <span className="ticket-action">
                    Use layout <span aria-hidden>↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="latex"
          className="latex-feature editorial-section drawing-frame"
        >
          <div className="latex-window" aria-hidden="true">
            <div className="window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>resume.tex</span>
              <span>LOCAL STUDIO</span>
            </div>
            <div className="latex-window-body">
              <div className="source-lines">
                <span>01</span>
                <code>{"\\begin{document}"}</code>
                <span>02</span>
                <code> Your experience.</code>
                <span>03</span>
                <code> In your words.</code>
                <span>04</span>
                <code>{"\\end{document}"}</code>
              </div>
              <div className="mini-paper">
                <span className="editorial-serif">John Doe</span>
                <span>SOFTWARE ENGINEER</span>
                <i />
                <b>EXPERIENCE</b>
                <i />
                <i />
                <i />
                <b>EDUCATION</b>
                <i />
                <i />
                <b>SKILLS</b>
                <i />
                <i />
              </div>
            </div>
            <div className="window-bottom">
              <span className="status-dot" />
              Compiled on your device<span>PDF / LaTeX</span>
            </div>
          </div>
          <div className="latex-feature-copy">
            <h2>
              A little more control.
              <br />
              <span className="editorial-serif">Line by line.</span>
            </h2>
            <p>
              Start with a template, then edit the LaTeX source. Compile and
              preview on your device, or open the project in Overleaf.
            </p>
            <Link
              prefetch={false}
              href={ROUTES.latexTemplates}
              className="btn btn-secondary"
            >
              See LaTeX templates <span aria-hidden>↗</span>
            </Link>
          </div>
        </section>

        <section id="how" className="workflow-section editorial-section">
          <div className="workflow-heading">
            <h2>
              From first draft
              <br />
              <span className="editorial-serif">to ready to send.</span>
            </h2>
          </div>
          <WorkflowBento />
          <div className="workflow-rules">
            <Disclosure
              className="rules-disclosure"
              summaryClassName="py-4 text-sm"
              bodyClassName="pb-4"
              summary="What makes a resume ATS-friendly?"
            >
              <ul className="grid gap-5 sm:grid-cols-2">
                {RULES.map(([title, body]) => (
                  <li key={title}>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-1 text-xs text-ink-2">{body}</p>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
        </section>

        <section id="faq" className="faq-section editorial-section">
          <div>
            <h2>
              A few questions,
              <br />
              <span className="editorial-serif">answered.</span>
            </h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item) => (
              <Disclosure
                key={item.q}
                group="faq"
                className="faq-item"
                summaryClassName="py-6 text-sm font-medium"
                bodyClassName="pb-6"
                summary={item.q}
                summaryAs="h3"
              >
                <p className="max-w-[58ch] text-sm text-ink-2">{item.a}</p>
              </Disclosure>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
