import type { LatexStyleId, Resume } from "@/lib/schema";
import { renderClassic } from "./classic";
import { renderBold } from "./bold";
import { renderBanking } from "./banking";
import { renderModern } from "./modern";
import { renderColumns } from "./columns";
import type { LatexOutput } from "./common";

export type { LatexOutput };

export function renderLatex(r: Resume, style: LatexStyleId = r.meta.latexStyle): LatexOutput {
  switch (style) {
    case "classic":
      return renderClassic(r);
    case "bold":
      return renderBold(r);
    case "banking":
      return renderBanking(r);
    case "modern":
      return renderModern(r);
    case "columns":
      return renderColumns(r);
  }
}
