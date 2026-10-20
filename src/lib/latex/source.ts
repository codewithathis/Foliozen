import type { Resume } from "@/lib/schema";
import { renderLatex, type LatexOutput } from "@/lib/templates/latex";
import { tex } from "@/lib/templates/latex/common";
import { exportDetails } from "@/lib/export/settings";

/**
 * The .tex a user actually exports: their hand-edited source from the LaTeX
 * studio if they have one, otherwise a fresh render from data.
 */
export function latexForExport(r: Resume): LatexOutput & { edited: boolean } {
  const gen = renderLatex(r);
  if (r.meta.latexSource.trim()) {
    return { ...gen, files: { ...gen.files, [gen.main]: r.meta.latexSource }, edited: true };
  }
  const { title, author } = exportDetails(r);
  const metadata = `\\hypersetup{pdftitle={${tex(title)}},pdfauthor={${tex(author)}},pdfcreator={${tex(author)}},pdfproducer={}}\n`;
  return { ...gen, files: { ...gen.files, [gen.main]: gen.files[gen.main].replace("\\begin{document}", `${metadata}\\begin{document}`) }, edited: false };
}
