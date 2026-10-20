import { nanoid } from "nanoid";
import type { Resume } from "@/lib/schema";
import { containsKeyword, normaliseKeyword } from "./keywords";

export function addKeywordToSkills(resume: Resume, term: string): boolean {
  const skill = term.trim().slice(0, 160);
  if (!skill || containsKeyword(resume.skills.flatMap((group) => group.items).join("\n"), skill)) return false;
  resume.meta.analysis.addedSkills = resume.meta.analysis.addedSkills.filter((item) => resume.skills.find((group) => group.id === item.groupId)?.items.includes(item.term));
  if (resume.meta.analysis.addedSkills.length >= 100) return false;
  let group = resume.skills.find((item) => item.category === "Additional skills");
  if (!group) { group = { id: nanoid(8), category: "Additional skills", items: [] }; resume.skills.push(group); }
  group.items.push(skill);
  resume.meta.analysis.addedSkills.push({ term: skill, groupId: group.id });
  return true;
}

export function undoKeywordSkill(resume: Resume, term: string) {
  const addition = resume.meta.analysis.addedSkills.find((item) => normaliseKeyword(item.term) === normaliseKeyword(term));
  if (!addition) return;
  const group = resume.skills.find((item) => item.id === addition.groupId);
  if (group) {
    group.items = group.items.filter((item) => item !== addition.term);
    if (!group.items.length && group.category === "Additional skills") resume.skills = resume.skills.filter((item) => item.id !== group.id);
  }
  resume.meta.analysis.addedSkills = resume.meta.analysis.addedSkills.filter((item) => item !== addition);
}
