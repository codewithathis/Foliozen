import { Fragment } from "react";
import { keywordRanges } from "@/lib/ats/keywords";

export function KeywordText({ text, terms }: { text: string; terms: string[] }) {
  const ranges = keywordRanges(text, terms);
  if (!ranges.length) return text;
  return <>{ranges.map((range, index) => {
    const before = text.slice(index ? ranges[index - 1].end : 0, range.start);
    return <Fragment key={`${range.start}-${range.end}`}>{before}<mark className="keyword-highlight" data-keyword={range.term}>{text.slice(range.start, range.end)}</mark></Fragment>;
  })}{text.slice(ranges.at(-1)?.end ?? 0)}</>;
}
