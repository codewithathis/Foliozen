import type { Metadata } from "next";
import { LatexStudio } from "@/components/latex/LatexStudio";
import { JsonLd, ROUTES, breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Online LaTeX Resume Editor and Compiler",
  description: "Edit and compile your LaTeX resume online for free. Overleaf-style editor with autocomplete, error highlighting and PDF preview, all in your browser.",
  path: ROUTES.latexStudio,
});

export default function LatexPage() {
  return (
    <>
      <JsonLd data={[breadcrumb("LaTeX resume editor", ROUTES.latexStudio)]} />
      <LatexStudio />
    </>
  );
}
