import type { Metadata } from "next";
import Link from "next/link";
import { Thumbnail } from "@/components/workspace/Thumbnail";
import { Disclosure } from "@/components/ui/Disclosure";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { JsonLd, OG_IMAGE, ROUTES, absoluteUrl, faqSchema, pageMetadata } from "@/lib/seo";
import { sampleResume } from "@/lib/sample";
import { HTML_TEMPLATES } from "@/lib/templates";
import { RESUME_CSS, RESUME_FONTS_URL } from "@/lib/templates/html/styles";
import { SITE } from "@/lib/site";

/*
 * Landing copy. Voice: direct, warm, a bit wry. Short sentences. Second person.
 * No em dashes anywhere. Keywords appear where a person would use them, never as lists:
 * primary "free ATS-friendly resume builder"; supporting "resume builder no sign-up",
 * "no watermark", "ATS resume templates", "ATS score / resume checker", "job description
 * keywords", "PDF / DOCX", "LaTeX resume", "Overleaf", "open source", "private".
 * Headings mirror common searches, e.g. "How to make an ATS-friendly resume".
 */

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is this resume builder really free?",
    a: "Yes. Every template, the ATS checker and every download are free, with no trial, subscription or watermark. ResumeFold is open source under the MIT License.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. Open the resume builder and start typing. Drafts save in your browser, and a JSON backup moves them to another device.",
  },
  {
    q: "Can I upload my existing resume?",
    a: "Yes. Upload a PDF, DOCX or TXT and it is read on your device. You get an ATS score for the file and editable fields for a new draft.",
  },
  {
    q: "Should I download a PDF or DOCX?",
    a: "Whatever the job posting asks for. A text-based PDF suits most applicant tracking systems. DOCX is safer for older portals such as Taleo and iCIMS.",
  },
  {
    q: "Is my resume data private?",
    a: "Yes. Drafts stay in your browser and PDF and DOCX files are built on your device. Your LaTeX source only leaves if you choose Overleaf or the optional remote compiler.",
  },
];

const RULES: [string, string][] = [
  ["One column", "Sidebars and two-column skills grids are often read out of order by Workday and Taleo."],
  ["No tables or text boxes", "Table cells get merged into one line, and text-box content is often skipped entirely."],
  ["Contact details in the body", "Many resume parsers skip page headers and footers. Put your email and phone where they can find them."],
  ["Standard section headings", "“Work Experience”, “Education”, “Skills”. Not “Where I’ve Been”."],
  ["Real text, standard fonts", "No icons standing in for labels, no text inside images, and no wide letter-spacing that splits words apart."],
  ["Consistent dates", "One date format everywhere. Applicant tracking systems work out your years of experience from them."],
];

const STEPS: [string, string][] = [
  ["Pick a template or upload your resume", "Four ATS-friendly layouts, or your own PDF or DOCX."],
  ["Add your details", "The live preview updates as you type."],
  ["Check your ATS score", "Each issue links to the field that fixes it."],
  ["Match the job description", "See which keywords you already cover."],
  ["Download", "PDF, DOCX or LaTeX for Overleaf."],
];

/** Landing-page descriptions for each layout. The builder keeps its shorter labels. */
const TEMPLATE_COPY: Record<string, string> = {
  standard: "For most jobs.",
  student: "For students and new graduates.",
  combination: "For career changers.",
  senior: "For senior professionals.",
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
    { "@type": "Organization", "@id": organization, name: SITE.name, url: absoluteUrl(ROUTES.home), logo: absoluteUrl("/apple-touch-icon.png"), ...(SITE.repo ? { sameAs: [SITE.repo] } : {}) },
    { "@type": "WebSite", "@id": website, name: SITE.name, url: absoluteUrl(ROUTES.home), description: SITE.description, inLanguage: "en", publisher: { "@id": organization } },
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
      featureList: ["ATS resume checker", "Resume upload from PDF, DOCX or TXT", "Job description keyword matching", "PDF and DOCX export", "LaTeX export and Overleaf integration", "In-browser LaTeX compiler"],
      image: absoluteUrl(OG_IMAGE.url),
      publisher: { "@id": organization },
      isPartOf: { "@id": website },
      ...(SITE.repo ? { codeRepository: SITE.repo } : {}),
    },
    faqSchema(FAQ),
  ];

  return (
    <div className="device-safe min-h-dvh">
      <link rel="stylesheet" href={RESUME_FONTS_URL} />
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <JsonLd data={jsonLd} />

      {/* Header: one persistent floating pill that condenses as you scroll */}
      <FloatingNav
        brand={SITE.name}
        items={[
          { href: "#ats", label: "ATS checker" },
          { href: "#templates", label: "Templates" },
          { href: "#latex", label: "LaTeX" },
          { href: "#how", label: "How it works" },
          { href: "#faq", label: "FAQ" },
        ]}
        cta={{ href: "/build", label: "Build my resume" }}
      />

      <main className="mx-auto max-w-[1440px] px-4 pt-[calc(80px+env(safe-area-inset-top))] sm:px-6 lg:pt-[76px] [&_[id]]:scroll-mt-[calc(80px+env(safe-area-inset-top))] lg:[&_[id]]:scroll-mt-24">
        {/* Hero */}
        <section className="tile mt-3 grid min-w-0 grid-cols-1 items-center gap-8 overflow-hidden px-5 py-8 sm:mt-6 sm:gap-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:px-16 lg:py-16">
          <div>
            <p className="text-sm font-medium text-signal">Free. No sign-up. No watermark.</p>
            <h1 className="mt-3 font-display text-xl font-bold leading-[1.1] sm:text-2xl lg:text-3xl lg:leading-[1.06]">
              Free ATS-friendly resume builder
            </h1>
            <p className="mt-5 max-w-[44ch] text-md text-ink-2">
              Pick a template, check your ATS score, and download a PDF or DOCX. Your drafts stay in your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center">
              <Link href="/build" className="btn btn-primary">
                Build my resume
              </Link>
              <a href="#templates" className="btn btn-secondary">
                See the templates
              </a>
            </div>
          </div>
          <div className="relative mx-auto min-w-0 w-full max-w-[240px] sm:max-w-[440px]">
            <div className="rounded-[6px]" style={{ boxShadow: "var(--shadow-sheet)" }}>
              <Thumbnail resume={sampleResume} template="standard" width={440} />
            </div>
          </div>
        </section>

        {/* Three things it does */}
        <section className="mt-6 grid gap-6 md:grid-cols-3" aria-label="What it does">
          <Bento
            id="ats"
            tint="bg-tint-sage"
            title="Check your ATS score."
            body="See what parsers miss and which job keywords you cover."
            link={[ROUTES.atsChecker, "How the ATS checker works"]}
          >
            <div className="mt-6 flex items-center gap-4">
              <Ring value={92} />
              <div className="text-sm">
                <p className="font-medium">Example ATS score</p>
                <p className="text-ink-2">14 checks passed</p>
              </div>
            </div>
          </Bento>
          <Bento
            tint="bg-tint-sky"
            title="PDF, DOCX or LaTeX."
            body="One set of details. Every format matches."
          >
            <div className="mt-6 flex flex-wrap gap-2">
              {["PDF", "DOCX", ".tex", "Overleaf"].map((t) => (
                <span key={t} className="chip bg-paper/80 text-ink">
                  {t}
                </span>
              ))}
            </div>
          </Bento>
          <Bento
            tint="bg-tint-lavender"
            title="LaTeX, built in."
            body="Compile in your browser or open in Overleaf."
            link={[ROUTES.latexStudio, "Open the LaTeX editor"]}
          >
            <pre className="mt-6 hidden overflow-hidden rounded-2xl bg-paper/80 p-4 font-mono text-[12px] leading-relaxed text-ink-2 sm:block">
              {`\\vEntry{Senior Engineer}\n  {Feb 2023 -- Present}\n  {Northwind Payments}`}
            </pre>
          </Bento>
        </section>

        {/* Layouts */}
        <section id="templates" className="mt-12 sm:mt-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-xl font-bold">ATS-friendly resume templates</h2>
              <p className="mt-1 max-w-[60ch] text-ink-2">
                Four single-column layouts that applicant tracking systems read in order.
              </p>
            </div>
            <Link href="/build" className="link hidden text-sm md:inline">
              Compare templates in the builder
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HTML_TEMPLATES.map((t) => (
              <ProductCard key={t.id} name={`${t.name} resume template`} description={TEMPLATE_COPY[t.id] ?? t.bestFor} href="/build">
                <Thumbnail resume={sampleResume} template={t.id} width={220} />
              </ProductCard>
            ))}
          </div>
        </section>

        {/* LaTeX styles */}
        <section id="latex" className="tile mt-12 flex flex-col gap-4 px-5 py-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-display text-lg font-bold">LaTeX resume templates</h2>
            <p className="mt-1 text-sm text-ink-2">Four styles, ready to compile here or open in Overleaf.</p>
          </div>
          <Link href={ROUTES.latexTemplates} className="btn btn-secondary shrink-0">
            See LaTeX templates
          </Link>
        </section>

        {/* How it works */}
        <section id="how" className="mt-12 grid gap-8 sm:mt-20 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-xl font-bold">How to make an ATS-friendly resume</h2>
          </div>
          <div>
            <ol className="divide-y divide-rule">
              {STEPS.map(([title, body], index) => (
                <li key={title} className="flex items-baseline gap-4 py-3">
                  <span className="w-5 shrink-0 font-mono text-sm text-ink-3" aria-hidden>
                    {index + 1}
                  </span>
                  <p>
                    <span className="font-medium">{title}.</span> <span className="text-ink-2">{body}</span>
                  </p>
                </li>
              ))}
            </ol>
            <Disclosure className="mt-4 border-t border-rule pt-2" summaryClassName="py-2 font-medium" bodyClassName="pb-2 pt-2" summary="What makes a resume ATS-friendly?">
              <ul className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {RULES.map(([t, d]) => (
                  <li key={t}>
                    <p className="font-medium">{t}</p>
                    <p className="mt-0.5 text-ink-2">{d}</p>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-12 grid gap-8 sm:mt-20 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-xl font-bold">Common questions</h2>
          </div>
          <div className="divide-y divide-rule">
            {FAQ.map((f) => (
              <Disclosure key={f.q} group="faq" className="py-2" summaryClassName="py-2 font-medium" bodyClassName="pb-3 pt-1" summary={f.q}>
                <p className="max-w-[60ch] text-sm text-ink-2">{f.a}</p>
              </Disclosure>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="tile mt-12 px-5 py-10 text-center sm:mt-20 sm:px-8 sm:py-14 md:px-16">
          <h2 className="font-display text-xl font-bold md:text-2xl">Ready to build your resume?</h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-ink-2">It’s free, and it takes a few minutes.</p>
          <Link href="/build" className="btn btn-primary mt-8">
            Build my resume
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Bento({ tint, title, body, children, id, link }: { tint: string; title: string; body: string; children?: React.ReactNode; id?: string; link?: [string, string] }) {
  return (
    <div id={id} className={`min-w-0 rounded-card p-6 sm:p-8 ${tint}`}>
      <h2 className="font-display text-lg font-bold leading-snug">{title}</h2>
      <p className="mt-2 text-sm text-ink-2">{body}</p>
      {children}
      {link && (
        <Link href={link[0]} className="link mt-6 inline-block text-sm">
          {link[1]}
        </Link>
      )}
    </div>
  );
}

function ProductCard({
  name,
  description,
  href,
  badge,
  children,
}: {
  name: string;
  description: string;
  href: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <div
        className="template-art relative flex justify-center overflow-hidden rounded-card bg-paper-3 px-6 pt-8 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.015]"
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        <div className="max-h-[230px] w-[220px] overflow-hidden rounded-t-[6px]" style={{ boxShadow: "var(--shadow-sheet)" }}>
          {children}
        </div>
        {badge && <span className="chip absolute right-4 top-4 bg-amber-soft text-amber">{badge}</span>}
      </div>
      <div className="px-1 pt-4">
        <h3 className="font-display font-bold">{name}</h3>
        <p className="mt-0.5 text-sm text-ink-2">{description}</p>
        <span className="link mt-3 inline-block text-sm">Use this one</span>
      </div>
    </Link>
  );
}

function Ring({ value }: { value: number }) {
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative grid h-14 w-14 place-items-center">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="6" />
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--moss)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (C * value) / 100} />
      </svg>
      <span className="absolute font-mono text-sm font-medium">{value}</span>
    </div>
  );
}
