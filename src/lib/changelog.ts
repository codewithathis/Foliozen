export type ChangelogMonth = {
  month: string;
  entries: { version: string; date: string; changes: string[] }[];
};

export const CHANGELOG: ChangelogMonth[] = [
  {
    month: "2026-09",
    entries: [
      {
        version: "0.3.4",
        date: "2026-09-17",
        changes: [
          "Added a separate ATS score for uploaded files, based on what a parser can read from the original.",
          "Improved imports of design-tool resumes, including letter-spaced headings, detached bullets and entries without dates.",
          "Added ATS resume checker and LaTeX resume template pages, and simplified the home page.",
          "Added smooth FAQ animations and gentler scrolling from the navigation.",
        ],
      },
      {
        version: "0.3.3",
        date: "2026-09-14",
        changes: [
          "Fixed PDF uploads failing in Safari.",
          "Simplified mobile uploads into choose, progress and review steps, with retry and change-file controls.",
        ],
      },
      {
        version: "0.3.2",
        date: "2026-09-14",
        changes: [
          "Fixed PDF reading in browsers without newer JavaScript features.",
          "Added resume text paste with the same review, keyword matching and export flow.",
          "Added clearer guidance and optional error details when a file can't be read.",
        ],
      },
      {
        version: "0.3.1",
        date: "2026-09-14",
        changes: [
          "Fixed mobile PDF uploads.",
          "Kept the editor usable when browser storage is blocked or full, with a visible backup reminder.",
          "Improved tablet touch controls, landscape layouts, downloads and PDF preview memory use.",
        ],
      },
      {
        version: "0.3.0",
        date: "2026-09-14",
        changes: [
          "Added local PDF, DOCX and TXT resume uploads with editable extracted text and import notes.",
          "Saved job targets, postings and keywords with each draft, including JSON backups.",
          "Improved job matching for phrases, common abbreviations and whole terms.",
          "Added a playful session nickname that never appears in exported resumes.",
        ],
      },
      {
        version: "0.2.2",
        date: "2026-09-13",
        changes: [
          "Set the GitHub Pages site as the default public URL for links and previews.",
        ],
      },
      {
        version: "0.2.1",
        date: "2026-09-13",
        changes: [
          "Fixed GitHub Pages deployment and public URLs under a repository path.",
        ],
      },
      {
        version: "0.2.0",
        date: "2026-09-13",
        changes: [
          "Renamed the site and project to ResumeFold.",
          "Added this changelog and bundled all fonts locally for consistent typography.",
          "Simplified mobile navigation and introduced black primary buttons and bold headings.",
          "Made LaTeX compilation manual by default on mobile and low-power devices.",
        ],
      },
      {
        version: "0.1.0",
        date: "2026-09-13",
        changes: [
          "Built the resume wizard, live preview, four single-column layouts and rules-based ATS checker.",
          "Added PDF, DOCX, LaTeX and Overleaf exports, with a browser-based LaTeX editor and compiler.",
          "Added saved drafts, JSON backups and light, dark and system themes.",
        ],
      },
    ],
  },
];
