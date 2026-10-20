import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { orderedSections, sectionHasContent, SECTION_HEADINGS, type Resume } from "@/lib/schema";
import { fmtMonth, fmtRange } from "@/lib/dates";
import { resumeToText } from "@/lib/ats/check";
import { setResumeMetadata } from "./pdf-metadata";

type Face = "regular" | "bold" | "regular-italic";
type Family = "source-sans" | "source-serif";
export type PdfFontLoader = (family: Family, face: Face) => Promise<Uint8Array>;
const fontCache = new Map<string, Promise<Uint8Array>>();
const loadFont: PdfFontLoader = (family, face) => {
  const path = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/fonts/pdf/${family}-${face}.ttf`;
  let pending = fontCache.get(path);
  if (!pending) {
    pending = fetch(path).then(async (response) => {
      if (!response.ok) throw new Error("Could not load the PDF fonts. Please try again.");
      return new Uint8Array(await response.arrayBuffer());
    }).catch((error) => { fontCache.delete(path); throw error; });
    fontCache.set(path, pending);
  }
  return pending;
};
const ACCENTS = { none: "111111", blue: "1a5fb4", green: "1e6b3a", burgundy: "7a2432", graphite: "4a4d52" };
const color = (hex: string) => rgb(...[0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255) as [number, number, number]);

/** Text PDF: bundled fonts, automatic page breaks, no browser print metadata. */
export async function renderPdf(resume: Resume, fontLoader: PdfFontLoader = loadFont): Promise<Uint8Array<ArrayBuffer>> {
  if (resumeToText(resume).length > 100000) throw new Error("This resume is too long. Shorten it before exporting.");
  const pdf = await PDFDocument.create({ updateMetadata: false });
  pdf.registerFontkit(fontkit);
  setResumeMetadata(pdf, resume);
  const style = resume.meta.style;
  const family: Family = style.font === "serif" ? "source-serif" : "source-sans";
  const headFamily: Family = style.font === "sans" ? "source-sans" : "source-serif";
  const faces = new Map<string, Promise<PDFFont>>();
  const embed = (name: Family, face: Face) => {
    const key = `${name}-${face}`;
    if (!faces.has(key)) faces.set(key, fontLoader(name, face).then((data) => pdf.embedFont(data, { subset: true })));
    return faces.get(key)!;
  };
  const [regular, bold, italic, heading] = await Promise.all([
    embed(family, "regular"), embed(family, "bold"), embed(family, "regular-italic"), embed(headFamily, "bold"),
  ]);
  const template = resume.meta.template;
  const size = Number(style.size);
  const leading = ({ compact: 1.22, normal: 1.32, relaxed: 1.42 }[style.leading]) + (template === "senior" ? .05 : template === "student" ? -.04 : 0);
  const [width, height] = resume.meta.paper === "a4" ? [595.276, 841.89] : [612, 792];
  const [marginY, marginX] = { tight: [.42 * 72, .5 * 72], normal: [.5 * 72, .62 * 72], roomy: [.65 * 72, .8 * 72] }[style.margins];
  const contentWidth = width - marginX * 2;
  const ink = rgb(.067, .067, .067);
  const muted = rgb(.23, .22, .20);
  const accent = color(ACCENTS[style.accent]);
  let page: PDFPage;
  let y = height - marginY;
  const newPage = () => {
    if (pdf.getPageCount() >= 30) throw new Error("This resume exceeds 30 pages. Shorten it before exporting.");
    page = pdf.addPage([width, height]); y = height - marginY;
  };
  newPage();
  const ensure = (space: number) => { if (y - space < marginY) newPage(); };
  const checked = new Map<PDFFont, Set<number>>();
  const plain = (text: string) => text.replace(/\t/g, " ").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
  const measure = (text: string, font: PDFFont, fontSize: number) => {
    let supported = checked.get(font);
    if (!supported) { supported = new Set(font.getCharacterSet()); checked.set(font, supported); }
    for (const character of text) if (!supported.has(character.codePointAt(0)!)) {
      throw new Error("A character in your resume is not supported by the PDF fonts. Use Print for your browser’s font support.");
    }
    return font.widthOfTextAtSize(text, fontSize);
  };
  const lines = (value: string, font: PDFFont, fontSize: number, maxWidth: number) => {
    const result: string[] = [];
    for (const paragraph of plain(value).split(/\r?\n/)) {
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        if (line && measure(`${line} ${word}`, font, fontSize) > maxWidth) { result.push(line); line = ""; }
        if (measure(word, font, fontSize) <= maxWidth) { line = line ? `${line} ${word}` : word; continue; }
        for (const character of word) {
          if (line && measure(line + character, font, fontSize) > maxWidth) { result.push(line); line = ""; }
          line += character;
        }
      }
      result.push(line);
    }
    return result;
  };
  const draw = (text: string, x: number, baseline: number, font: PDFFont, fontSize: number, fill = ink) => {
    if (text) page.drawText(text, { x, y: baseline, font, size: fontSize, color: fill });
  };
  const paragraph = (text: string, font = regular, fontSize = size, options: { indent?: number; align?: "center"; fill?: RGB; bullet?: boolean } = {}) => {
    const indent = options.indent ?? (options.bullet ? 12 : 0);
    const wrapped = lines(text, font, fontSize, contentWidth - indent);
    wrapped.forEach((line, index) => {
      ensure(fontSize * leading);
      const x = options.align === "center" ? marginX + (contentWidth - measure(line, font, fontSize)) / 2 : marginX + indent;
      if (options.bullet && index === 0) draw("•", marginX + 2, y - fontSize, regular, fontSize);
      draw(line, x, y - fontSize, font, fontSize, options.fill);
      y -= fontSize * leading;
    });
  };
  const row = (left: string, right: string, font = bold) => {
    const leftText = plain(left).replace(/\s+/g, " ").trim();
    const rightText = plain(right).replace(/\s+/g, " ").trim();
    if (measure(leftText, font, size) + measure(rightText, regular, size * .95) + 12 <= contentWidth) {
      ensure(size * leading);
      draw(leftText, marginX, y - size, font, size);
      draw(rightText, width - marginX - measure(rightText, regular, size * .95), y - size, regular, size * .95, muted);
      y -= size * leading;
    } else {
      paragraph(leftText, font);
      if (rightText) paragraph(rightText, regular, size * .95, { fill: muted });
    }
  };
  const bullets = (items: string[]) => {
    for (const item of items.filter((value) => value.trim())) { paragraph(item, regular, size, { bullet: true }); y -= template === "student" ? .8 : 1.6; }
  };
  const contact = resume.contact;
  const centered = template === "standard" || template === "student";
  paragraph(contact.fullName || "Your Name", heading, size * (template === "senior" ? 2.5 : template === "standard" ? 2.2 : 2.3), { align: centered ? "center" : undefined, fill: accent });
  if (contact.headline && template !== "student") paragraph(contact.headline, template === "senior" ? italic : regular, size * 1.05, { align: centered ? "center" : undefined, fill: muted });
  const contacts = [contact.email, contact.phone, contact.location, contact.website, contact.linkedin, contact.github].filter(Boolean);
  if (contacts.length) { y -= 3; paragraph(contacts.join("  ·  "), regular, size * .92, { align: centered ? "center" : undefined }); }
  if (template === "combination") { y -= 5; page!.drawLine({ start: { x: marginX, y }, end: { x: width - marginX, y }, thickness: 1.6, color: accent }); }
  y -= 4;
  for (const section of orderedSections(resume).filter((id) => sectionHasContent(resume, id))) {
    const headingSize = size * (template === "senior" ? 1.25 : template === "student" ? 1.15 : 1);
    const firstLines = section === "certifications" || section === "skills" ? 1 : section === "summary" ? 2 : 3;
    ensure(headingSize * leading + size * leading * firstLines + 18);
    y -= template === "student" ? 7 : 9;
    paragraph(template === "senior" || template === "student" ? SECTION_HEADINGS[section] : SECTION_HEADINGS[section].toUpperCase(), heading, headingSize, { fill: accent });
    y -= 2;
    page!.drawLine({ start: { x: marginX, y }, end: { x: template === "combination" ? marginX + 26 : width - marginX, y }, thickness: template === "combination" ? 2 : .6, color: accent });
    y -= 5;
    const entrySpace = () => ensure(size * leading * 3);
    const gap = () => { y -= template === "student" ? 4 : template === "senior" ? 9 : 6; };
    switch (section) {
      case "summary": paragraph(resume.summary); break;
      case "experience":
        for (const item of resume.experience) {
          entrySpace(); row(item.title, fmtRange(item.start, item.end, item.current));
          if (item.company || item.location) row(item.company, item.location, italic);
          bullets(item.bullets); gap();
        }
        break;
      case "education":
        for (const item of resume.education) {
          entrySpace(); row(item.school, fmtRange(item.start, item.end));
          row([item.degree, item.field].filter(Boolean).join(" in ") + (item.gpa ? `, GPA ${item.gpa}` : ""), item.location, italic);
          bullets(item.details); gap();
        }
        break;
      case "skills":
        for (const group of resume.skills.filter((item) => item.items.length)) { paragraph((group.category ? `${group.category}: ` : "") + group.items.join(", ")); y -= 2; }
        break;
      case "projects":
        for (const item of resume.projects) {
          entrySpace(); row([item.name, item.tech].filter(Boolean).join(" | "), fmtRange(item.start, item.end) || item.link);
          if (item.link && (item.start || item.end)) paragraph(item.link, italic);
          bullets(item.bullets); gap();
        }
        break;
      case "certifications":
        for (const item of resume.certifications) { row([item.name, item.issuer].filter(Boolean).join(", "), fmtMonth(item.date)); y -= 2; }
        break;
    }
  }
  return new Uint8Array(await pdf.save());
}
