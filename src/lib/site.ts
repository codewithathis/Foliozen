/** One place for the facts the copy and metadata refer to. Edit before you deploy. */
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const publicUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (deploymentHost
    ? `https://${deploymentHost}`
    : "https://delta-dog.github.io/resumefold/");
const parsedUrl = new URL(publicUrl);
const publicPath = (
  process.env.NEXT_PUBLIC_BASE_PATH || parsedUrl.pathname
).replace(/\/$/, "");

export const SITE = {
  name: "ResumeFold",
  tagline:
    "A free resume builder with clear layouts, resume checks and downloads you can keep.",
  /** Home page title in search results; keep it under about 60 characters. */
  title: "Free ATS-Friendly Resume Builder, No Sign-Up · ResumeFold",
  /** Search-result description for the home page; keep it under about 155 characters. */
  description:
    "Build a clear resume for free. Import a file, check job keywords and download PDF, DOCX or LaTeX. No account or watermark. Your files stay on your device.",
  /** Public URL of the deployed site (no trailing slash). Used for canonical / Open Graph. */
  url: parsedUrl.origin + publicPath,
  /** Source repository. Shown in the footer and FAQ; leave empty to hide. */
  repo: "https://github.com/delta-dog/resumefold",
  license: "MIT",
  /** Copyright holder shown in the footer. Put your name or company here. */
  owner: "ResumeFold",
  /** First year of publication; the footer shows "2026" or "2026–2027" automatically. */
  since: 2026,
};
