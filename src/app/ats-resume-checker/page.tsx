import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid, ContentPage, FaqSection, GuideSection } from "@/components/ui/ContentPage";
import { JsonLd, ROUTES, absoluteUrl, breadcrumb, faqSchema, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

/* Voice matches the landing page: direct, short sentences, second person, no em dashes. */

export const metadata: Metadata = pageMetadata({
  title: "Free ATS Resume Checker and Keyword Scanner",
  description: "Free ATS resume checker with no login. Upload a PDF or DOCX to see what applicant tracking systems read, get your ATS score and match job keywords.",
  path: ROUTES.atsChecker,
});

const CHECKS: [string, string][] = [
  ["Contact details", "Name, a valid email, a full phone number and a location. Portals fill their required fields from these."],
  ["Section headings", "Work Experience, Education and Skills, named the way parsers expect to find them."],
  ["Complete roles", "Every job needs a title, an employer and dates. Lose one and the whole entry can be misfiled."],
  ["Date order", "Newest role first, and no end date before its start date."],
  ["Bullet strength", "Bullets that open with “responsible for” or “helped” get flagged, with an example from your resume."],
  ["Numbers", "How many bullets include something you can count. Aim for half or more."],
  ["Length", "Long bullets and resumes that probably run past one page for your level of experience."],
  ["Special characters", "Arrows, stars and emoji that older parsers turn into junk text."],
];

const MISTAKES: [string, string][] = [
  ["Letter-spaced headings", "Design tools often store “EXPERIENCE” as separate letters. A parser can miss the heading and the section under it."],
  ["Contact details in the header", "Some parsers skip page headers and footers entirely. Keep your email in the body."],
  ["Links that only say LinkedIn", "The link works in a PDF viewer, but a parser reads the word, not the address."],
  ["Two columns and sidebars", "Text from side-by-side columns is often read across the page, mixing your skills into your job history."],
  ["Creative section names", "“Where I’ve worked” reads well to people. Parsers look for Work Experience."],
  ["Dates in words", "“Prior experience” or “Summer” can't be turned into a tenure. Use months and years."],
];

const FAQ = [
  {
    q: "How do I check if my resume is ATS-friendly?",
    a: "Upload your resume to the free ATS resume checker. It reads the file the way a parser does, gives it an ATS score, and lists what to fix: missing contact details, dates, section headings, formatting and keywords from the job description.",
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
    a: "No. Employers configure their systems differently and don't publish their scoring. The checker finds the problems that commonly break parsing and matching, so you can fix them before you apply.",
  },
  {
    q: "Why does my uploaded file score lower than my draft?",
    a: "The file score reads your original document the way a parser would. The draft score reads the fields you've edited, which export in a single-column layout. Fixing the file issues or exporting from ResumeFold closes the gap.",
  },
  {
    q: "Can it check a scanned resume?",
    a: "Not yet. Scanned PDFs and images have no selectable text, which is also a problem for most applicant tracking systems. Export a text-based PDF or DOCX first.",
  },
  {
    q: "Does it use AI to rewrite my resume?",
    a: "No. The checks are transparent rules. It tells you what to fix and leaves the writing to you.",
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
        eyebrow="Free. Private. No sign-up."
        title="Free ATS resume checker"
        intro="Check your resume’s ATS score for free, with no login. Upload a PDF or DOCX to see what an applicant tracking system actually reads, find missing keywords from the job description, and fix each problem in one place."
        cta={[ROUTES.build, "Check my resume"]}
      >
        <GuideSection title="What is an ATS resume checker?">
          <p>
            Most employers screen applications with an applicant tracking system (ATS) such as Workday, Greenhouse or Taleo. It turns your resume into plain text, sorts it into fields
            like job title, employer and dates, and searches it for keywords from the job description.
          </p>
          <p>
            An ATS resume checker shows you that view before you apply. ResumeFold scores your resume, points out formatting that parsers misread, and compares your wording with the job posting.
            It runs in your browser, so your resume is never uploaded to a server.
          </p>
        </GuideSection>

        <GuideSection title="What the ATS checker looks for" intro="Rules you can read, not a mystery number.">
          <CardGrid items={CHECKS} />
        </GuideSection>

        <GuideSection title="Check your resume’s ATS score">
          <p>
            Open the <Link className="link" href={ROUTES.build}>resume builder</Link>, go to Review, and upload a PDF, DOCX or TXT. You get two scores.
          </p>
          <p>
            <strong className="font-medium text-ink">The file score</strong> reads your original document the way a parser would. It flags missing contact details, roles without dates,
            letter-spaced or renamed headings, and text that doesn’t fit any field.
          </p>
          <p>
            <strong className="font-medium text-ink">The draft score</strong> reads the fields ResumeFold extracted. Fix them, and your PDF or DOCX export comes out single-column with
            standard headings.
          </p>
        </GuideSection>

        <GuideSection title="Match resume keywords to a job description">
          <p>
            Paste the job description and the resume keyword scanner suggests the skills and phrases it asks for. Edit that list or type your own keywords, and see your coverage as a percentage.
          </p>
          <p>
            Matching uses whole terms, so Java doesn’t count as JavaScript and SQL doesn’t count as PostgreSQL. Common abbreviations like AWS and Amazon Web Services are treated as the same thing.
            Add only the missing terms you can back up.
          </p>
        </GuideSection>

        <GuideSection title="Common ATS resume mistakes" intro="Things that look fine on screen and fall apart in a parser.">
          <CardGrid items={MISTAKES} />
        </GuideSection>

        <GuideSection title="What an ATS score can’t tell you">
          <p>
            No checker can see inside a particular employer’s system. Workday, Greenhouse, Lever, iCIMS and Taleo are all configured differently, and recruiters still read the result.
          </p>
          <p>
            Use the score to remove parsing problems, then spend your time on the content. Clear roles, real numbers and the words from the posting matter more than a perfect 100.
          </p>
          <p>
            Want a layout that avoids these problems from the start? Compare the <Link className="link" href={`${ROUTES.home}#templates`}>resume templates</Link> or the{" "}
            <Link className="link" href={ROUTES.latexTemplates}>LaTeX resume templates</Link>.
          </p>
        </GuideSection>

        <FaqSection faq={FAQ} />
      </ContentPage>
    </>
  );
}
