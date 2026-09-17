import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/Workspace";
import { JsonLd, ROUTES, breadcrumb, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Online Resume Maker with ATS Checker",
  description: "Make your resume online for free. Start from a template or upload a PDF or DOCX, fix ATS issues as you type, and download PDF, DOCX or LaTeX. No sign-up.",
  path: ROUTES.build,
});

export default function BuildPage() {
  return (
    <>
      <JsonLd data={[breadcrumb("Resume builder", ROUTES.build)]} />
      <Workspace />
    </>
  );
}
