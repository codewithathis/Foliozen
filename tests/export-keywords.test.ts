import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { PDFDict, PDFDocument, PDFName, PDFString, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import { produce } from "immer";
import { emptyResume, HTML_TEMPLATE_IDS, parseResume } from "../src/lib/schema";
import { sampleResume } from "../src/lib/sample";
import { addKeywordToSkills, undoKeywordSkill } from "../src/lib/ats/skill-actions";
import { containsKeyword, keywordRanges, suggestKeywords } from "../src/lib/ats/keywords";
import { exportDetails, resumeFilename, safeFilenameBase } from "../src/lib/export/settings";
import { cleanPdfMetadata } from "../src/lib/export/pdf-metadata";
import { renderPdf, type PdfFontLoader } from "../src/lib/export/pdf-document";
import { renderDocx } from "../src/lib/export/docx";
import { latexForExport } from "../src/lib/latex/source";

const fonts: PdfFontLoader = async (family, face) => new Uint8Array(await readFile(new URL(`../public/fonts/pdf/${family}-${face}.ttf`, import.meta.url)));

test("suggests concrete posting skills without repeated filler or ordinary Go/R/C", () => {
  const posting = "Build reliable distributed systems with Java, Ruby or Go. Design REST APIs and data pipelines. Use PostgreSQL and CI/CD. You will build, build, build things with exceptional people. We go further together; we value excellent, excellent, excellent work.";
  const terms = suggestKeywords(posting);
  for (const term of ["distributed systems", "Java", "Ruby", "Go", "REST APIs", "data pipelines", "PostgreSQL", "CI/CD"]) assert.ok(terms.includes(term), term);
  for (const term of ["build", "exceptional", "excellent", "people", "SQL", "continuous integration", "continuous delivery"]) assert.ok(!terms.includes(term), term);
  assert.deepEqual(suggestKeywords("We go further, work with a great team, and build excellent, excellent, excellent things."), []);
  assert.ok(suggestKeywords("Programming languages include C, R, Python and Golang.").includes("R"));
  assert.ok(containsKeyword("Worked with ReactJS, GCP and Postgres", "React"));
  assert.ok(containsKeyword("Worked with ReactJS, GCP and Postgres", "Google Cloud"));
  assert.ok(!containsKeyword("Reactivate a product", "React"));
});

test("highlights whole matching phrases without overlaps or changing source text", () => {
  const text = "JavaScript, Java, machine-learning, AWS, C++ and C#.";
  const ranges = keywordRanges(text, ["Java", "JavaScript", "machine learning", "AWS", "Amazon Web Services", "C++", "C"]);
  assert.deepEqual(ranges.map((range) => text.slice(range.start, range.end)), ["JavaScript", "Java", "machine-learning", "AWS", "C++"]);
  for (let index = 1; index < ranges.length; index++) assert.ok(ranges[index].start >= ranges[index - 1].end);
});

test("skill additions require an explicit action, deduplicate, persist and undo only inserted items", () => {
  const resume = emptyResume();
  resume.skills = [{ id: "original", category: "Languages", items: ["Python", "Amazon Web Services"] }];
  assert.equal(addKeywordToSkills(resume, "AWS"), false);
  const added = produce(resume, (draft) => { assert.equal(addKeywordToSkills(draft, "SQL"), true); });
  assert.equal(resume.skills.length, 1);
  assert.equal(added.meta.analysis.addedSkills.length, 1);
  assert.equal(addKeywordToSkills(structuredClone(added), "sql"), false);
  const restored = parseResume(JSON.parse(JSON.stringify(added)));
  restored.meta.analysis.keywordsMode = "selected";
  restored.meta.analysis.keywords = "";
  const undone = produce(restored, (draft) => undoKeywordSkill(draft, "SQL"));
  assert.deepEqual(undone.skills, resume.skills);
  assert.deepEqual(undone.meta.analysis.addedSkills, []);
  assert.equal(parseResume(JSON.parse(JSON.stringify(undone))).meta.analysis.keywordsMode, "selected");
});

test("filenames are applicant-specific and safe across Windows and Unicode", () => {
  const resume = emptyResume();
  resume.contact.fullName = "Alex Morgan";
  resume.contact.headline = "Engineer";
  resume.meta.analysis.jobTitle = "Cloud Engineer";
  resume.meta.analysis.company = "Example Labs";
  assert.equal(resumeFilename(resume, "pdf"), "Alex_Morgan_Cloud_Engineer_Example_Labs.pdf");
  assert.equal(safeFilenameBase("../../résumé : final.pdf"), "résumé_final");
  assert.equal(safeFilenameBase("CON"), "Resume_CON");
  assert.equal(safeFilenameBase("Node.js"), "Node_js");
  assert.ok(Buffer.byteLength(safeFilenameBase("名".repeat(180))) <= 180);
  resume.meta.exportSettings = { filename: "My application.pdf", title: "", author: "" };
  assert.deepEqual(exportDetails(resume), { filename: "My_application", title: "", author: "" });
  assert.throws(() => resumeFilename(resume, "../pdf"));
});

test("direct PDF renders every layout and paper with clean chosen metadata", async () => {
  for (const template of HTML_TEMPLATE_IDS) {
    const resume = structuredClone(sampleResume);
    resume.meta.template = template;
    resume.meta.paper = template === "student" ? "a4" : "letter";
    resume.meta.style.font = template === "senior" ? "mixed" : template === "student" ? "serif" : "sans";
    resume.meta.exportSettings = { filename: "", title: "Alex’s Résumé", author: "Alex Morgan" };
    const bytes = await renderPdf(resume, fonts);
    const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
    assert.equal(pdf.getTitle(), "Alex’s Résumé");
    assert.equal(pdf.getAuthor(), "Alex Morgan");
    assert.equal(pdf.getCreator(), "Alex Morgan");
    assert.equal(pdf.getProducer(), "");
    assert.equal(pdf.getCreationDate(), undefined);
    assert.ok(pdf.getPageCount() >= 1 && pdf.getPageCount() <= 3);
    assert.ok(Math.abs(pdf.getPage(0).getWidth() - (resume.meta.paper === "a4" ? 595.276 : 612)) < .01);
  }
});

test("long PDF content paginates and unsupported glyphs give a usable fallback", async () => {
  const resume = structuredClone(sampleResume);
  resume.summary = Array.from({ length: 100 }, (_, index) => `Paragraph ${index}: Delivered robust services for customers.`).join("\n");
  assert.ok((await PDFDocument.load(await renderPdf(resume, fonts))).getPageCount() > 2);
  resume.summary = "Unsupported 😀";
  await assert.rejects(renderPdf(resume, fonts), /Use Print/);
});

test("downloaded PDF retains selectable Unicode text across pages and excludes private comparison data", async () => {
  const resume = structuredClone(sampleResume);
  resume.contact.fullName = "Alex García";
  resume.summary = Array.from({ length: 100 }, (_, index) => `Line ${index}: Delivered efficient services for customers.`).join("\n");
  resume.meta.analysis.jobDescription = "PRIVATE_JOB_SENTINEL";
  resume.meta.analysis.keywords = "PRIVATE_KEYWORDS_SENTINEL";
  const bytes = await renderPdf(resume, fonts);
  const script = `
    import {pathToFileURL} from 'node:url';
    import {resolve} from 'node:path';
    import {loadPdfJs} from './src/lib/pdf.ts';
    import {readPdfPageText} from './src/lib/import/pdf-text.ts';
    globalThis.DOMMatrix = class DOMMatrix {};
    globalThis.Path2D = class Path2D {};
    const pdfjs = await loadPdfJs();
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(resolve('public' + pdfjs.GlobalWorkerOptions.workerSrc)).href;
    const task = pdfjs.getDocument({data:Uint8Array.from(Buffer.from(process.argv[1], 'base64'))});
    try {
      const doc = await task.promise;
      const parts = [];
      for(let index=1;index<=doc.numPages;index++) parts.push(await readPdfPageText(await doc.getPage(index), new AbortController().signal, 100000));
      console.log(parts.join('\\n'));
    } finally {await task.destroy();}
  `;
  const child = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", script, Buffer.from(bytes).toString("base64")], { encoding: "utf8", timeout: 30000 });
  assert.equal(child.status, 0, child.stderr);
  assert.match(child.stdout, /Alex García/);
  assert.match(child.stdout, /Line 0: Delivered efficient services/);
  assert.match(child.stdout, /Line 99: Delivered efficient services/);
  assert.match(child.stdout, /WORK EXPERIENCE/);
  assert.match(child.stdout, /Python/);
  assert.ok(!/PRIVATE_JOB_SENTINEL|PRIVATE_KEYWORDS_SENTINEL/.test(child.stdout));
});

test("clean compiled PDF metadata drops source Info and XMP without changing page content", async () => {
  const original = await PDFDocument.create();
  original.setTitle("OLD WEBSITE TITLE"); original.setAuthor("Mozilla/5.0"); original.setCreator("Chrome/155"); original.setProducer("Skia/PDF");
  original.context.lookup(original.context.trailerInfo.Info!, PDFDict).set(PDFName.of("PrivateInfo"), PDFString.of("PRIVATE_SENTINEL"));
  original.catalog.set(PDFName.of("Metadata"), original.context.register(original.context.stream("PRIVATE_XMP_SENTINEL")));
  original.addPage().drawText("Keep this resume text", { font: await original.embedFont(StandardFonts.Helvetica) });
  const resume = emptyResume(); resume.contact.fullName = "Alex Morgan";
  const bytes = await cleanPdfMetadata(await original.save(), resume);
  const clean = await PDFDocument.load(bytes, { updateMetadata: false });
  assert.equal(clean.getAuthor(), "Alex Morgan");
  assert.equal(clean.getCreator(), "Alex Morgan");
  assert.equal(clean.getProducer(), "");
  assert.equal(clean.getCreationDate(), undefined);
  assert.equal(clean.catalog.has(PDFName.of("Metadata")), false);
  assert.ok(!new TextDecoder().decode(bytes).includes("PRIVATE_SENTINEL"));
  assert.equal(clean.getPageCount(), original.getPageCount());
  assert.equal(clean.getPage(0).getWidth(), original.getPage(0).getWidth());
});

test("DOCX and generated LaTeX use chosen metadata; hand edits survive", async () => {
  const resume = structuredClone(sampleResume);
  resume.meta.exportSettings = { filename: "", title: "Application & Resume", author: "Alex Morgan" };
  const zip = await JSZip.loadAsync(await (await renderDocx(resume)).arrayBuffer());
  const core = await zip.file("docProps/core.xml")!.async("string");
  assert.match(core, /<dc:creator>Alex Morgan<\/dc:creator>/);
  assert.match(core, /Application &amp; Resume/);
  assert.ok(!core.includes("ResumeFold"));
  assert.ok(latexForExport(resume).files["resume.tex"].includes("pdfauthor={Alex Morgan}"));
  resume.meta.latexSource = "HAND EDITED";
  assert.equal(latexForExport(resume).files["resume.tex"], "HAND EDITED");
});
