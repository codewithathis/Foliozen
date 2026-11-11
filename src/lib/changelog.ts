export type ChangelogMonth = {
  month: string;
  entries: { version: string; date: string; changes: string[] }[];
};

export const CHANGELOG: ChangelogMonth[] = [
  {
    month: "2026-11",
    entries: [
      {
        version: "0.5.2",
        date: "2026-11-11",
        changes: [
          "Renamed the product to Foliozen and refreshed the logo and wordmark across the site, icons and social previews.",
        ],
      },
    ],
  },
  {
    month: "2026-10",
    entries: [
      {
        version: "0.5.1",
        date: "2026-10-24",
        changes: [
          "Introduced the new ResumeFold logo and wordmark, designed in Figma, across the site and resume builder.",
          "Added matching light and dark logos, updated browser and home screen icons and social previews, and adjusted logo spacing for small mobile screens.",
        ],
      },
      {
        version: "0.5.0",
        date: "2026-10-20",
        changes: [
          "Redesigned the site, resume builder and LaTeX studio with clearer layouts and navigation.",
          "Improved mobile, tablet and laptop layouts, with lighter previews and motion that adapts to device resources and accessibility settings.",
          "Added direct PDF downloads and editable document details, with file names based on your name, target role and company.",
          "Improved job keyword suggestions. Choose terms, add skills to your draft and undo changes.",
        ],
      },
    ],
  },
  {
    month: "2026-09",
    entries: [
      {
        version: "0.3.4",
        date: "2026-09-17",
        changes: [
          "Added a separate score for the text extracted from an uploaded resume.",
          "Improved imports of resumes with spaced-out headings, detached bullets or missing dates.",
          "Added guides to resume checks and LaTeX templates.",
          "Smoothed section scrolling and FAQ animations.",
        ],
      },
      {
        version: "0.3.3",
        date: "2026-09-14",
        changes: [
          "Fixed a Safari PDF import issue.",
          "Simplified mobile imports, with reading progress and options to retry or choose another file.",
        ],
      },
      {
        version: "0.3.2",
        date: "2026-09-14",
        changes: [
          "Improved PDF reading in older browsers.",
          "Added the option to paste resume text for review, keyword matching and downloads.",
          "Added clearer import errors and troubleshooting details.",
        ],
      },
      {
        version: "0.3.1",
        date: "2026-09-14",
        changes: [
          "Fixed a mobile PDF import issue.",
          "Added a backup reminder when browser storage is blocked or full.",
          "Improved tablet controls, landscape layouts and downloads. Reduced PDF preview memory use.",
        ],
      },
      {
        version: "0.3.0",
        date: "2026-09-14",
        changes: [
          "Added PDF, DOCX and TXT imports, processed on your device with extracted text you can review.",
          "Saved job postings and keywords with each draft and its backup.",
          "Improved keyword matching for phrases and common abbreviations.",
          "Added session nicknames for the editor, excluded from downloaded resumes.",
        ],
      },
      {
        version: "0.2.2",
        date: "2026-09-13",
        changes: [
          "Updated public links and previews to use the GitHub Pages address.",
        ],
      },
      {
        version: "0.2.1",
        date: "2026-09-13",
        changes: ["Fixed deployment and links on GitHub Pages."],
      },
      {
        version: "0.2.0",
        date: "2026-09-13",
        changes: [
          "Renamed the project to ResumeFold.",
          "Added the changelog and bundled fonts for consistent type across devices.",
          "Updated mobile navigation, buttons and headings.",
          "Made LaTeX compilation manual on mobile and low-power devices.",
        ],
      },
      {
        version: "0.1.0",
        date: "2026-09-13",
        changes: [
          "Launched the resume builder with a live preview, four layouts and resume checks.",
          "Added PDF, DOCX and LaTeX downloads, Overleaf support and an in-browser LaTeX studio.",
          "Added saved drafts, backups and appearance settings.",
        ],
      },
    ],
  },
];
