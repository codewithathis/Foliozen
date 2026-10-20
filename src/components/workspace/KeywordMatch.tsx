"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { keywordMatch, resumeToText } from "@/lib/ats/check";
import { containsKeyword, normaliseKeyword, parseKeywordList, suggestKeywords } from "@/lib/ats/keywords";
import { addKeywordToSkills, undoKeywordSkill } from "@/lib/ats/skill-actions";
import { useActiveResume, useResumeStore } from "@/lib/store";
import { KeywordText } from "./KeywordText";

export function KeywordMatch() {
  const r = useActiveResume();
  const update = useResumeStore((s) => s.update);
  const target = r.meta.analysis;
  const jd = useDeferredValue(target.jobDescription);
  const suggested = useMemo(() => suggestKeywords(jd), [jd]);
  const selected = useMemo(() => target.keywords.trim() ? parseKeywordList(target.keywords) : target.keywordsMode === "selected" ? [] : suggested, [target.keywords, target.keywordsMode, suggested]);
  const report = useMemo(() => selected.length ? keywordMatch(jd, r, selected.join(", "), target.source === "upload" && r.meta.imported.text ? r.meta.imported.text : undefined) : null, [jd, r, selected, target.source]);
  const additions = target.addedSkills.filter((item) => r.skills.find((group) => group.id === item.groupId)?.items.includes(item.term));
  const options = [...new Map([...suggested, ...selected].map((term) => [normaliseKeyword(term), term])).values()];
  const [custom, setCustom] = useState("");
  const [notice, setNotice] = useState("");
  const id = useId();
  const choose = (terms: string[]) => update((draft) => {
    const accepted: string[] = [];
    for (const term of terms.slice(0, 100)) {
      if ([...accepted, term].join(", ").length > 3000) break;
      accepted.push(term);
    }
    draft.meta.analysis.keywords = accepted.join(", ");
    draft.meta.analysis.keywordsMode = "selected";
  });
  const toggle = (term: string) => choose(selected.some((item) => normaliseKeyword(item) === normaliseKeyword(term)) ? selected.filter((item) => normaliseKeyword(item) !== normaliseKeyword(term)) : [...selected, term]);
  const addCustom = () => {
    const terms = parseKeywordList(custom).filter((term) => term.length <= 160);
    if (!terms.length) { setNotice("Use keywords of 160 characters or fewer."); return; }
    choose(parseKeywordList([...selected, ...terms].join(", ")));
    setCustom(""); setNotice("Keyword selected for comparison. Your resume has not been changed.");
  };
  return <section className="grid min-w-0 gap-4" aria-labelledby={`${id}-title`}>
    <div>
      <h3 id={`${id}-title`} className="font-display text-md font-medium">Keyword match</h3>
      <p className="mt-1 text-sm text-ink-2">Choose skills from this job posting. Add only the ones you can support.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-xs text-ink-2">Target job title<input className="field" value={target.jobTitle} maxLength={160} placeholder="e.g. Software engineer" onChange={(event) => update((draft) => { draft.meta.analysis.jobTitle = event.target.value; })} /></label>
      <label className="grid gap-1 text-xs text-ink-2">Company<input className="field" value={target.company} maxLength={160} placeholder="Optional" onChange={(event) => update((draft) => { draft.meta.analysis.company = event.target.value; })} /></label>
    </div>
    <label htmlFor={`${id}-posting`} className="label">Job posting</label>
    <textarea id={`${id}-posting`} className="field" rows={5} value={target.jobDescription} maxLength={30000} onChange={(event) => update((draft) => { draft.meta.analysis.jobDescription = event.target.value; })} placeholder="Paste the job posting here…" />
    <div className="card grid gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Select keywords · {selected.length} selected</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost btn-sm" disabled={!suggested.length} onClick={() => update((draft) => { draft.meta.analysis.keywords = ""; draft.meta.analysis.keywordsMode = "suggested"; })}>Use suggestions</button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={!selected.length} onClick={() => choose([])}>Clear selection</button>
        </div>
      </div>
      <p className="text-xs text-ink-3">Selecting a keyword tracks it. Adding it to Skills changes your draft.</p>
      <div role="group" aria-label="Keyword selection" className="flex flex-wrap gap-2">
        {options.map((term) => {
          const on = selected.some((item) => normaliseKeyword(item) === normaliseKeyword(term));
          return <button key={normaliseKeyword(term)} type="button" aria-pressed={on} className={`min-h-11 rounded-control border px-3 py-2 text-left text-sm ${on ? "border-signal bg-signal-soft text-ink" : "border-rule text-ink-2"}`} onClick={() => toggle(term)}><span aria-hidden>{on ? "✓ " : "+ "}</span>{term}</button>;
        })}
      </div>
      {!options.length && <p className="text-sm text-ink-2">No clear skills found yet. Add a keyword below if a relevant skill was missed.</p>}
      <form className="flex min-w-0 flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); addCustom(); }}>
        <label className="min-w-0 flex-1"><span className="sr-only">Add your own keyword</span><input className="field" value={custom} maxLength={500} onChange={(event) => setCustom(event.target.value)} placeholder="Add a skill or phrase" /></label>
        <button type="submit" className="btn btn-secondary btn-sm" disabled={!custom.trim() || selected.length >= 100}>Add keyword</button>
      </form>
    </div>
    {r.meta.imported.text && <label className="grid gap-1 text-xs text-ink-2">Compare against<select className="field" value={target.source} onChange={(event) => update((draft) => { draft.meta.analysis.source = event.target.value === "upload" ? "upload" : "draft"; })}><option value="draft">Edited draft</option><option value="upload">Uploaded resume text</option></select></label>}
    <p className="text-xs text-ink-3">Wording coverage is a local comparison, not an employer’s score. Job targets and selections are saved with this draft.</p>
    {!selected.length && <p role="status" className="text-sm text-ink-2">Choose at least one keyword to compare.</p>}
    {report && <div className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm"><span className="font-medium">{report.matched.length} of {selected.length} selected terms present</span><span className="font-mono text-xs text-ink-3">{Math.round(report.coverage * 100)}% coverage</span></div>
      {!!report.missing.length && <div className="grid gap-2">
        <p className="label">Missing from {target.source === "upload" ? "the uploaded text" : "your draft"}</p>
        <ul className="flex flex-wrap gap-2">{report.missing.map((term) => {
          const inSkills = containsKeyword(r.skills.flatMap((group) => group.items).join("\n"), term);
          return <li key={term} className="min-w-0 max-w-full"><button type="button" className="btn btn-secondary btn-sm max-w-full whitespace-normal text-left [overflow-wrap:anywhere]" aria-label={`Add ${term} to Skills`} disabled={inSkills || additions.length >= 100} onClick={() => {
            update((draft) => { if (addKeywordToSkills(draft, term)) draft.meta.analysis.source = "draft"; });
            setNotice(`${term} added to Skills. You can undo it below.`);
          }}><span aria-hidden>{inSkills ? "✓ " : "+ "}</span>{term}</button></li>;
        })}</ul><p className="text-xs text-ink-3">Tap a missing skill to add it to your draft.</p>
      </div>}
      {!!report.matched.length && <div><p className="label">Present</p><div className="flex flex-wrap gap-2">{report.matched.map((term) => <span key={term} className="chip bg-moss-soft text-moss">{term}</span>)}</div></div>}
    </div>}
    {!!additions.length && <div className="grid gap-2 border-t border-rule pt-4">
      <p className="text-sm font-medium">Added to your draft</p>
      <p className="text-xs text-ink-3">Highlighted in the live preview. Highlights are excluded from exported files.</p>
      <ul className="grid gap-2">{additions.map((item) => <li key={`${item.groupId}-${item.term}`} className="flex flex-wrap items-center justify-between gap-2 text-sm"><mark className="keyword-highlight">{item.term}</mark><button type="button" className="btn btn-ghost btn-sm" aria-label={`Undo adding ${item.term}`} onClick={() => { update((draft) => undoKeywordSkill(draft, item.term)); setNotice(`${item.term} removed from Skills.`); }}>Undo</button></li>)}</ul>
    </div>}
    {!!selected.length && <details><summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium">Show keyword matches in resume text</summary><div className="card mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words p-4 text-sm"><KeywordText text={target.source === "upload" && r.meta.imported.text ? r.meta.imported.text : resumeToText(r)} terms={selected} /></div></details>}
    {notice && <p role="status" className="text-sm text-ink-2">{notice}</p>}
  </section>;
}
