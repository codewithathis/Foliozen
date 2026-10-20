"use client";

import { exportDetails, suggestedFilenameBase } from "@/lib/export/settings";
import { useActiveResume, useResumeStore } from "@/lib/store";

export function ExportSettings() {
  const resume = useActiveResume();
  const update = useResumeStore((state) => state.update);
  const details = exportDetails(resume);
  return <details className="card min-w-0 p-4">
    <summary className="flex min-h-11 cursor-pointer flex-wrap items-center justify-between gap-2 text-sm font-medium">
      <span>File name & document details</span>
      <span className="min-w-0 break-all text-xs font-normal text-ink-2">{details.filename}.pdf</span>
    </summary>
    <div className="mt-3 grid gap-3">
      <p className="text-xs text-ink-2">Defaults use your name, target role and company. These details stay with this draft.</p>
      <label className="grid gap-1 text-xs text-ink-2">File name, without extension<input className="field" maxLength={180} value={resume.meta.exportSettings.filename} placeholder={suggestedFilenameBase(resume)} onChange={(event) => update((draft) => { draft.meta.exportSettings.filename = event.target.value; })} /></label>
      <label className="grid gap-1 text-xs text-ink-2">Document title<input className="field" maxLength={240} value={details.title} onChange={(event) => update((draft) => { draft.meta.exportSettings.title = event.target.value; })} /></label>
      <label className="grid gap-1 text-xs text-ink-2">Author<input className="field" maxLength={160} value={details.author} onChange={(event) => update((draft) => { draft.meta.exportSettings.author = event.target.value; })} /></label>
      <p className="text-xs text-ink-3">Clear title or author to leave that field blank. Direct PDF downloads use the author as creator and omit browser and operating-system details.</p>
      <button type="button" className="btn btn-ghost btn-sm justify-self-start" onClick={() => update((draft) => { draft.meta.exportSettings = { filename: "" }; })}>Reset to automatic details</button>
    </div>
  </details>;
}
