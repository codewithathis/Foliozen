import { nanoid } from "nanoid";
import { emptyResume, type Resume } from "@/lib/schema";

type Section = "summary" | "experience" | "education" | "skills" | "projects" | "certifications";
const HEADINGS: Record<string, Section> = {
  summary: "summary", profile: "summary", "professional summary": "summary", objective: "summary", "career objective": "summary", "about me": "summary", overview: "summary", about: "summary", "professional profile": "summary", "career summary": "summary",
  experience: "experience", "work experience": "experience", "professional experience": "experience", employment: "experience", "employment history": "experience", "career history": "experience", "work history": "experience", "relevant experience": "experience", internships: "experience", internship: "experience",
  education: "education", qualifications: "education", "academic background": "education", "educational background": "education", "education and training": "education", academics: "education",
  skills: "skills", "technical skills": "skills", "core skills": "skills", "core competencies": "skills", technologies: "skills", "skills and tools": "skills", "key skills": "skills", "tools and technologies": "skills", "technical proficiencies": "skills", competencies: "skills", expertise: "skills",
  projects: "projects", "personal projects": "projects", "selected projects": "projects", "academic projects": "projects", "key projects": "projects", "side projects": "projects",
  certifications: "certifications", certificates: "certifications", "licenses and certifications": "certifications", "certifications and licenses": "certifications", courses: "certifications",
};
const UNSUPPORTED = ["languages", "interests", "hobbies", "awards", "honors", "honours", "publications", "volunteering", "volunteer experience", "achievements", "references", "additional information", "extracurricular activities", "leadership", "activities"];
const BULLET = /^\s*[-•●▪◦‣∙■*➢➤►▸]\s*/;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DATE = "\\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]{0,6}\\.?\\s+\\d{4}|\\d{4}[-/]\\d{1,2}|\\d{1,2}/\\d{4}|\\d{4}|Present|Current|Now)";
const RANGE = new RegExp(`(${DATE})\\s*(?:[-–—]|to)\\s*(${DATE})`, "i");
/** A lone month and year at the end of an entry heading, e.g. "Clipt  Jan 2026". */
const SINGLE_DATE = /(?:^|\t|\s{2,}|\|\s*)((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}-\d{1,2})\s*$/i;
const ROLE = /engineer|developer|manager|analyst|designer|lead|intern|consultant|director|specialist|assistant|officer|associate|coordinator|architect|scientist|accountant|nurse|teacher|technician|founder|executive|researcher|administrator|representative|strategist|writer|editor|producer|programmer/i;
const DEGREE = /bachelor|master|doctor|ph\.?d|\bb\.?\s?s\.?c?\b|\bm\.?\s?s\.?c?\b|\bb\.?a\b|\bm\.?a\b|\bmba\b|diploma|certificate|\bb\.?\s?(?:des(?:ign)?|tech|e|com|arch|ba)\b|\bm\.?\s?(?:des(?:ign)?|tech|e|com|arch|ca)\b|secondary|high school|\bgcse|a-levels?|\bhsc\b|\bssc\b|associate of/i;

const compact = (text: string) => text.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
const COMPACT_HEADINGS = new Map(Object.entries(HEADINGS).map(([key, section]) => [compact(key), section]));
const COMPACT_UNSUPPORTED = new Set(UNSUPPORTED.map(compact));

export type HeadingMatch = { section: Section | null; standard: boolean; spaced: boolean };

/**
 * Recognises section headings, including letter-spaced ones ("W O R K E X P E R I E N C E")
 * and extended names ("Skills & Capabilities"). `standard` is false when a stricter parser
 * would probably miss the heading.
 */
export function findHeading(line: string): HeadingMatch | null {
  const text = line.trim().replace(/[:\s]+$/, "");
  if (!text || text.length > 60 || /\d|[.,;!?]$/.test(text)) return null;
  const spaced = /^(?:\S{1,3} ){3,}\S{1,3}$/.test(text);
  const key = compact(text);
  if (!key) return null;
  const exact = HEADINGS[text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ")];
  if (exact && !spaced) return { section: exact, standard: true, spaced };
  if (COMPACT_HEADINGS.has(key)) return { section: COMPACT_HEADINGS.get(key)!, standard: false, spaced };
  if (COMPACT_UNSUPPORTED.has(key)) return { section: null, standard: !spaced, spaced };
  // "Projects & Apps", "Skills and Capabilities": a known heading followed by "and ...".
  if (spaced || text.split(/\s+/).length <= 5) {
    for (const [known, section] of COMPACT_HEADINGS) if (key.startsWith(`${known}and`)) return { section, standard: false, spaced };
    for (const known of COMPACT_UNSUPPORTED) if (key.startsWith(`${known}and`)) return { section: null, standard: false, spaced };
  }
  return null;
}

export function parseImportDate(raw: string) {
  const text = raw.trim().toLowerCase();
  const monthName = text.match(/^([a-z]+)\.?\s+(\d{4})$/);
  let year = "", month = 0;
  if (monthName) { year = monthName[2]; month = MONTHS.indexOf(monthName[1].slice(0, 3)) + 1; }
  else {
    const yearFirst = text.match(/^(\d{4})[-/](\d{1,2})$/);
    const monthFirst = text.match(/^(\d{1,2})\/(\d{4})$/);
    if (yearFirst) { year = yearFirst[1]; month = Number(yearFirst[2]); }
    else if (monthFirst) { year = monthFirst[2]; month = Number(monthFirst[1]); }
  }
  return year && month >= 1 && month <= 12 ? `${year}-${String(month).padStart(2, "0")}` : "";
}

function clean(line: string) { return line.replace(BULLET, "").replace(/[ \t]+/g, " ").replace(/ ([.,;:!?])(?=\s|$)/g, "$1").trim(); }

/** Splits an entry heading on "|", tabs, " at ", "@" and spaced dashes, but not inside brackets ("Class I – X"). */
function splitHeader(lines: string[]) {
  return lines.flatMap((line) => {
    const parts: string[] = [];
    let depth = 0, start = 0;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "(" || char === "[") depth++;
      else if ((char === ")" || char === "]") && depth) depth--;
      if (depth) continue;
      const separator = line.slice(i).match(/^(?:\s*[|\t]\s*|\s+[—–-]\s+|^\s*[—–]\s+|\s+at\s+|\s+@\s+)/);
      if (separator) { parts.push(line.slice(start, i)); i += separator[0].length - 1; start = i + 1; }
    }
    parts.push(line.slice(start));
    return parts;
  }).map(clean).filter(Boolean);
}

type Entry = { header: string[]; bullets: string[]; start: string; end: string; current: boolean };

/** Short, unpunctuated lines with separators or a job title read as the heading of a new entry. */
function looksLikeEntryHeader(line: string) {
  return line.length <= 160 && !/[.,;:]$/.test(line) && (/\t|\s[|—–@]\s|\s-\s/.test(line) || ROLE.test(line) || SINGLE_DATE.test(line));
}

export function parseResumeText(text: string, filename = ""): Resume {
  const r = emptyResume();
  const warnings = new Set<string>(["Check the extracted fields before exporting. Original layout and styling are not retained."]);
  const unassigned: string[] = [];
  const sections: Record<Section, string[]> = { summary: [], experience: [], education: [], skills: [], projects: [], certifications: [] };
  const header: string[] = [];
  let section: Section | null = null;
  let unsupported = false;
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    const match = findHeading(line);
    if (match?.section) { section = match.section; unsupported = false; continue; }
    if (match) { unsupported = true; section = null; unassigned.push(line); continue; }
    if (unsupported) { if (line) unassigned.push(line); }
    else if (section) sections[section].push(line);
    else if (line) header.push(line);
  }

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phone = header.join(" ").match(/(?:\+?\d[\d ()-]{6,}\d)/)?.[0]?.trim() ?? "";
  r.contact.email = email;
  r.contact.phone = phone;
  const links = [...text.matchAll(/(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/)[\w.-]+\/?/gi)].map((match) => match[0]);
  r.contact.linkedin = links.find((link) => /linkedin/i.test(link)) ?? "";
  r.contact.github = links.find((link) => /github/i.test(link)) ?? "";
  r.contact.website = header.join(" ").match(/https?:\/\/[^\s|,]+/g)?.find((link) => !/linkedin\.com|github\.com/i.test(link)) ?? "";
  const nameIndex = header.findIndex((line) => line.length < 70 && /^[\p{L}][\p{L} .'-]+$/u.test(line) && line.split(/\s+/).length >= 2 && !ROLE.test(line) && !/resume|curriculum vitae/i.test(line));
  if (nameIndex >= 0) r.contact.fullName = header[nameIndex];
  else warnings.add("The name could not be identified confidently. Fill it in under Basics.");
  header.forEach((line, index) => {
    if (index === nameIndex) return;
    const parts = line.split(/[|\t•·]/).map((part) => part.trim()).filter(Boolean);
    for (const part of parts) {
      if ((email && part.includes(email)) || (phone && part.includes(phone)) || /linkedin\.com|github\.com|https?:\/\//i.test(part)) continue;
      if (!r.contact.headline && ROLE.test(part) && part.length < 100) r.contact.headline = part;
      else if (!r.contact.location && /^[\p{L} .'-]+,\s*[\p{L} .'-]+$/u.test(part)) r.contact.location = part;
      else if (!r.contact.website && /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/\S*)?$/i.test(part)) r.contact.website = part;
      else unassigned.push(part);
    }
  });
  r.summary = sections.summary.filter(Boolean).map(clean).join(" ");

  for (const line of sections.skills.filter(Boolean)) {
    const colon = line.indexOf(":");
    const tab = line.indexOf("\t");
    const split = colon > 0 && colon < 50 ? colon : tab > 0 && tab < 50 && !line.slice(0, tab).includes(",") ? tab : -1;
    const category = split > 0 ? clean(line.slice(0, split)) : "Skills";
    const items = clean(split > 0 ? line.slice(split + 1) : line).split(/[,;|•]+/).map((item) => item.trim()).filter(Boolean);
    if (items.length) r.skills.push({ id: nanoid(10), category, items });
  }

  let undated = false;
  for (const kind of ["experience", "education", "projects"] as const) {
    let pending: string[] = [];
    let active: Entry | null = null;
    const finish = () => {
      if (!active) return;
      const parts = splitHeader(active.header);
      if (!parts.length) { unassigned.push(...active.bullets); active = null; return; }
      const { start, end, current, bullets } = active;
      if (kind === "experience") {
        const titleIndex = parts.findIndex((part) => ROLE.test(part));
        const title = titleIndex >= 0 ? parts[titleIndex] : parts[0];
        const company = parts.find((_, index) => index !== (titleIndex >= 0 ? titleIndex : 0)) ?? "";
        r.experience.push({ id: nanoid(10), title, company, location: "", start, end, current, bullets });
        if (!company) warnings.add("Some employers need checking under Experience.");
        if (!start) undated = true;
        unassigned.push(...parts.filter((part) => part !== title && part !== company));
      } else if (kind === "education") {
        const degreeIndex = parts.findIndex((part) => DEGREE.test(part));
        const degree = degreeIndex >= 0 ? parts[degreeIndex] : "";
        const school = parts.find((_, index) => index !== degreeIndex) ?? "";
        r.education.push({ id: nanoid(10), school, degree, field: "", location: "", start, end, gpa: "", details: bullets });
        unassigned.push(...parts.filter((part) => part !== degree && part !== school));
      } else {
        r.projects.push({ id: nanoid(10), name: parts[0], link: "", tech: parts.slice(1).join(", "), start, end, bullets });
      }
      active = null;
    };
    /** Starts an entry from heading lines that have no date range. */
    const startFrom = (lines: string[]): Entry => {
      finish();
      const joined = lines.join("\t");
      const single = joined.match(SINGLE_DATE);
      const date = single ? parseImportDate(single[1]) : "";
      return { header: single ? [joined.slice(0, single.index).trim()] : lines, bullets: [], start: date, end: date, current: false };
    };
    let lastLength = 0;
    for (const line of sections[kind]) {
      if (!line) continue;
      const previousLength = lastLength;
      lastLength = line.length;
      const bullet = BULLET.test(line);
      const range: RegExpMatchArray | null = bullet && active ? null : line.match(RANGE);
      const last = active ? active.bullets.length - 1 : -1;
      if (range) {
        finish();
        const title: string = line.replace(range[0], "").replace(/^[|,\s—–-]+|[|,\s—–-]+$/g, "");
        const current = /present|current|now/i.test(range[2]);
        const start: string = parseImportDate(range[1]), end: string = current ? "" : parseImportDate(range[2]);
        if (!start || (!current && !end)) { warnings.add("Dates without a recognised month are left blank. Check them against the original text."); unassigned.push(line); }
        active = { header: [...pending, ...(title ? [title] : [])], bullets: [], start, end, current };
        pending = [];
      } else if (bullet && pending.length && (!active || looksLikeEntryHeader(pending[0]))) {
        active = startFrom(pending); pending = [];
        active.bullets.push(clean(line));
      } else if (bullet && active) {
        if (pending.length) { active.bullets.push(...pending.map(clean)); pending = []; }
        active.bullets.push(clean(line));
      } else if (active && last >= 0 && !pending.length && (/^[a-z]/.test(line) || (previousLength >= 70 && !/[.!?]$/.test(active.bullets[last]) && !looksLikeEntryHeader(line)))) {
        // A wrapped bullet: the previous line ran to the margin without finishing its sentence.
        const previous = active.bullets[last];
        active.bullets[last] = /\w-$/.test(previous) ? previous + clean(line) : `${previous} ${clean(line)}`;
      } else if (active && !pending.length && !active.bullets.length && active.header.length < 2) {
        active.header.push(line);
      } else pending.push(line);
    }
    if (active) { active.bullets.push(...pending.map(clean)); pending = []; finish(); }
    else if (pending.length) {
      if (kind === "education") r.education.push({ id: nanoid(10), school: pending[0], degree: pending.slice(1).join(" "), field: "", location: "", start: "", end: "", gpa: "", details: [] });
      else if (kind === "projects") r.projects.push({ id: nanoid(10), name: pending[0], link: "", tech: "", start: "", end: "", bullets: pending.slice(1).map(clean) });
      else { unassigned.push(...pending); warnings.add("Experience without clear date ranges is saved as unassigned text. Place it in the right fields before exporting."); }
    }
  }
  if (undated) warnings.add("Some roles have no recognisable dates. Add them under Experience.");
  for (const line of sections.certifications.filter(Boolean)) r.certifications.push({ id: nanoid(10), name: clean(line), issuer: "", date: "", link: "" });
  r.meta.imported = { filename, text, unassigned: [...new Set(unassigned)].join("\n"), warnings: [...warnings] };
  if (r.meta.imported.unassigned) r.meta.imported.warnings.push("Some text could not be assigned to a field. It is kept in Import notes for review.");
  return r;
}
