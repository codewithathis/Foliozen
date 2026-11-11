import { findHeading, parseResumeText } from "@/lib/import/parse";
import { checkResume, type AtsReport, type Issue } from "./check";

/**
 * ATS check for an uploaded file. The draft checker assumes Foliozen's own layout,
 * so here we score what a parser actually gets out of the file: the extracted text,
 * the headings it can recognise and the fields it can fill.
 */

/** Passes that only hold for Foliozen's own exports, not for someone else's file. */
const LAYOUT_PASSES = new Set(["A1", "A2", "A4", "A5", "A6", "A7", "B3", "B4", "B6"]);
const STANDARD_NAMES = { summary: "Summary", experience: "Work Experience", education: "Education", skills: "Skills", projects: "Projects", certifications: "Certifications" } as const;

export function checkUpload(text: string): AtsReport {
  const parsed = parseResumeText(text);
  const draft = checkResume(parsed);
  const issues: Issue[] = draft.issues.filter((issue) => issue.id !== "L1");
  const passes = draft.passes.filter((pass) => !LAYOUT_PASSES.has(pass.id));
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  const headings = lines.map((line) => ({ line, match: findHeading(line) })).filter((h) => h.match);
  const spaced = headings.filter((h) => h.match!.spaced);
  const renamed = headings.filter((h) => !h.match!.spaced && !h.match!.standard && h.match!.section);
  const found = new Set(headings.map((h) => h.match!.section));

  if (!found.has("experience") && !found.has("education") && !found.has("skills"))
    issues.push({
      id: "U1",
      severity: "fail",
      title: "No section headings a parser can find",
      detail: "Label your sections Work Experience, Education and Skills. Without them the text lands in one unsorted block.",
    });
  if (spaced.length)
    issues.push({
      id: "U2",
      severity: "warn",
      title: `${spaced.length} heading${spaced.length > 1 ? "s are" : " is"} letter-spaced`,
      detail: `The file stores “${spaced[0].line}” as separate letters. Plenty of parsers won't read that as ${STANDARD_NAMES[spaced[0].match!.section ?? "experience"]}, and the section under it gets lost. Remove the character spacing, or export from here.`,
    });
  else if (headings.length) passes.push({ id: "U2", title: "Headings stored as plain words" });
  if (renamed.length)
    issues.push({
      id: "U3",
      severity: "info",
      title: "Some headings use non-standard names",
      detail: `“${renamed[0].line}” works for people, but parsers match exact names. ${STANDARD_NAMES[renamed[0].match!.section!]} is the safe choice.`,
    });

  // Link labels ("LinkedIn", "Email") are clickable in a PDF viewer, but a parser only gets the word.
  const header = lines.slice(0, 8).join(" ");
  const labels = ["LinkedIn", "GitHub", "Email", "Portfolio"].filter((label) => new RegExp(`(^|[\\s|•·])${label}($|[\\s|•·])`, "i").test(header));
  const unresolved = labels.filter((label) =>
    label === "LinkedIn" ? !parsed.contact.linkedin : label === "GitHub" ? !parsed.contact.github : label === "Email" ? !parsed.contact.email : !parsed.contact.website,
  );
  if (unresolved.length)
    issues.push({
      id: "U4",
      severity: "warn",
      title: `${unresolved.join(" and ")} ${unresolved.length > 1 ? "are link labels" : "is a link label"}, not an address`,
      detail: "The link works in a PDF viewer, but parsers only read the visible word. Write the address out, like linkedin.com/in/yourname.",
      step: "basics",
    });

  // Year-only ranges ("2019 – 2021") are fine for parsers; drafts just can't store them, so they don't count here.
  const unassigned = parsed.meta.imported.unassigned.split("\n").filter((line) => line && !/\b\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now)\b/i.test(line)).length;
  if (unassigned >= 6)
    issues.push({
      id: "U5",
      severity: "warn",
      title: `${unassigned} lines didn't fit any field`,
      detail: "A parser drops text it can't place. Check Import notes to see which lines, then simplify how they're laid out.",
    });

  let score = 100;
  for (const issue of issues) score -= issue.severity === "fail" ? 18 : issue.severity === "warn" ? 7 : 3;
  score = Math.max(0, Math.min(100, score));
  const order = { fail: 0, warn: 1, info: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);
  return { score, ready: score >= 85 && !issues.some((issue) => issue.severity === "fail"), issues, passes, stats: draft.stats };
}
