import type { Resume } from "@/lib/schema";

export function safeFilenameBase(value: string): string {
  const cleaned = value.normalize("NFKC").replace(/\.(pdf|docx|tex|zip|json)$/i, "")
    .replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");
  let result = "";
  for (const character of cleaned) {
    if (new TextEncoder().encode(result + character).length > 180) break;
    result += character;
  }
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(result)) result = `Resume_${result}`;
  return result.replace(/_+$/g, "") || "Resume";
}

export function suggestedFilenameBase(r: Resume): string {
  return safeFilenameBase([
    r.contact.fullName.trim() || "Resume",
    r.meta.analysis.jobTitle.trim() || r.contact.headline.trim(),
    r.meta.analysis.company.trim(),
  ].filter(Boolean).join("_"));
}

export function exportDetails(r: Resume) {
  const filename = r.meta.exportSettings.filename.trim() ? safeFilenameBase(r.meta.exportSettings.filename) : suggestedFilenameBase(r);
  return {
    filename,
    title: r.meta.exportSettings.title ?? suggestedFilenameBase(r),
    author: r.meta.exportSettings.author ?? r.contact.fullName.trim(),
  };
}

export function resumeFilename(r: Resume, extension: string): string {
  if (!/^[a-z0-9]{1,8}$/i.test(extension)) throw new Error("Invalid file extension.");
  return `${exportDetails(r).filename}.${extension.toLowerCase()}`;
}
