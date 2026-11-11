import type { Metadata } from "next";
import Link from "next/link";
import {
  CardGrid,
  ContentPage,
  FaqSection,
  GuideSection,
} from "@/components/ui/ContentPage";
import {
  JsonLd,
  ROUTES,
  absoluteUrl,
  breadcrumb,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Free ATS Resume Checker and Keyword Scanner",
  description:
    "Check your resume for missing details, formatting issues and job keywords. Read PDF, DOCX or TXT on your device. Free, with no account needed.",
  path: ROUTES.atsChecker,
});

const CHECKS: [string, string][] = [
  [
    "Contact details",
    "Your name, email, phone number and location, with checks for missing or incomplete details.",
  ],
  [
    "Section headings",
    "Familiar labels such as Work Experience, Education and Skills.",
  ],
  ["Complete roles", "A job title, employer and dates for each role."],
  ["Date order", "Newest role first, and no end date before its start date."],
  [
    "Bullet wording",
    "Phrases such as “responsible for”, with examples you can review in context.",
  ],
  [
    "Numbers",
    "Results you can measure, such as time saved or team size. Use numbers you can support.",
  ],
  [
    "Length",
    "Long bullets and a word-count estimate. Check the preview for the actual page count.",
  ],
  [
    "Special characters",
    "Arrows, stars and emoji that may be clearer as words or plain bullets.",
  ],
];

const MISTAKES: [string, string][] = [
  [
    "Spaced-out letters",
    "Check that headings copy as whole words, rather than separate letters.",
  ],
  [
    "Contact details outside the body",
    "Keep your email and phone in the main document so they’re easy to find.",
  ],
  [
    "Links without an address",
    "Show a readable profile address as well as making it clickable.",
  ],
  [
    "Two columns and sidebars",
    "Copy the text into a plain-text editor and check that sections stay in order.",
  ],
  [
    "Unfamiliar section names",
    "Use clear headings such as Work Experience, Education and Skills.",
  ],
  [
    "Vague dates",
    "Use months and years consistently instead of labels such as “Summer”.",
  ],
];

const FAQ = [
  {
    q: "How do I check if my resume is ATS-friendly?",
    a: "Choose a PDF, DOCX or TXT in the builder, check the extracted text, then continue to Review & export. You’ll see suggested fixes and can compare keywords with a job posting.",
  },
  {
    q: "Is the ATS resume checker really free?",
    a: "Yes. There is no account, trial or paywall. The checker, uploads, keyword matching and every export are free.",
  },
  {
    q: "Does my resume get uploaded to a server?",
    a: "No. PDF, DOCX and TXT files are read in your browser. The extracted text is saved with your draft on this device only.",
  },
  {
    q: "Is this the same score an employer sees?",
    a: "No. This score comes from Foliozen’s rules. It helps you review common issues, but it doesn’t reproduce an employer’s system or predict an interview.",
  },
  {
    q: "Why does my uploaded file score lower than my draft?",
    a: "The file check uses extracted text. The draft check uses the fields you’ve edited. Imported text can lose structure, so review both reports and check the preview before downloading.",
  },
  {
    q: "Can it check a scanned resume?",
    a: "Foliozen doesn’t read text from images. Use a PDF with selectable text, a DOCX or TXT file, or paste your resume text.",
  },
  {
    q: "Does Foliozen write my resume?",
    a: "You write your resume. The checks suggest what to review, and you choose which changes to make.",
  },
];

export default function AtsResumeCheckerPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb("ATS resume checker", ROUTES.atsChecker),
          {
            "@type": "WebApplication",
            name: `${SITE.name} ATS resume checker`,
            url: absoluteUrl(ROUTES.atsChecker),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          faqSchema(FAQ),
        ]}
      />
      <ContentPage
        eyebrow="Resume checks"
        title="Free ATS resume checker"
        intro="Find missing details, review the text in your file and compare it with a job posting. The checks run on your device. No account needed."
        cta={[ROUTES.build, "Check resume"]}
      >
        <GuideSection title="What is an ATS resume checker?">
          <p>
            An applicant tracking system (ATS) helps employers manage
            applications. Resume parsers extract details such as job titles,
            employers and dates from a document.
          </p>
          <p>
            Foliozen checks your extracted text or edited draft for common
            issues. You can also compare keywords from a job posting. These are
            local checks, separate from any employer’s system.
          </p>
        </GuideSection>

        <GuideSection
          title="What gets checked"
          intro="Each suggestion explains what to review."
        >
          <CardGrid items={CHECKS} />
        </GuideSection>

        <GuideSection title="Check your resume’s ATS score">
          <p>
            Open the{" "}
            <Link className="link" href={ROUTES.build}>
              resume builder
            </Link>{" "}
            and choose a PDF, DOCX or TXT. Check the extracted text, then
            continue to Review &amp; export. Imported resumes have two reports.
          </p>
          <p>
            <strong className="font-medium text-ink">The file score</strong>{" "}
            uses the extracted text. It checks for missing details, unclear
            headings and entries without dates.
          </p>
          <p>
            <strong className="font-medium text-ink">The draft score</strong>{" "}
            uses your editable fields. Review those fields and the preview
            before downloading your resume.
          </p>
        </GuideSection>

        <GuideSection title="Match resume keywords to a job description">
          <p>
            Paste a job posting to get suggested skills and phrases. Select the
            terms that matter, or add your own. You’ll see which are present in
            your resume.
          </p>
          <p>
            Selecting a keyword adds it to the comparison. Use Add to Skills to
            put it in your draft. You choose what gets added and can undo each
            change. Include only experience you can back up.
          </p>
        </GuideSection>

        <GuideSection
          title="Formatting to look over"
          intro="A few details to check before you send."
        >
          <CardGrid items={MISTAKES} />
        </GuideSection>

        <GuideSection title="What an ATS score can’t tell you">
          <p>
            Foliozen doesn’t connect to an employer’s hiring system. Its score
            reflects the checks described here, not a hiring decision.
          </p>
          <p>
            Use the suggestions to review your resume. Check names, dates and
            claims yourself, and read the finished document before applying.
          </p>
          <p>
            For a starting layout, compare the{" "}
            <Link className="link" href={`${ROUTES.home}#templates`}>
              resume templates
            </Link>{" "}
            or the{" "}
            <Link className="link" href={ROUTES.latexTemplates}>
              LaTeX resume templates
            </Link>
            .
          </p>
        </GuideSection>

        <FaqSection faq={FAQ} />
      </ContentPage>
    </>
  );
}
