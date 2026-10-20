import { PDFDocument } from "pdf-lib";
import type { Resume } from "@/lib/schema";
import { exportDetails } from "./settings";

export function setResumeMetadata(pdf: PDFDocument, resume: Resume) {
  const { title, author } = exportDetails(resume);
  pdf.setTitle(title);
  pdf.setAuthor(author);
  pdf.setCreator(author);
  pdf.setProducer("");
  pdf.setSubject("");
  pdf.setKeywords([]);
}

/** Copy only pages into a fresh document, leaving source Info and XMP behind. */
export async function cleanPdfMetadata(bytes: ArrayBuffer | Uint8Array, resume: Resume): Promise<Uint8Array<ArrayBuffer>> {
  const source = await PDFDocument.load(bytes, { updateMetadata: false });
  if (source.getPageCount() > 100) throw new Error("This PDF has too many pages to export safely on this device.");
  const clean = await PDFDocument.create({ updateMetadata: false });
  const pages = await clean.copyPages(source, source.getPageIndices());
  for (const page of pages) clean.addPage(page);
  setResumeMetadata(clean, resume);
  return new Uint8Array(await clean.save());
}
