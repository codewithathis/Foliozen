import type { PDFPageProxy } from "pdfjs-dist";

const BULLET_GLYPH = /^[•●▪◦‣∙·■□○◆◇➢➤►▸-]$/;
/** Horizontal gaps wider than this (in PDF units) separate columns such as right-aligned dates. */
const COLUMN_GAP = 10;

type Line = { text: string; x: number; y: number };

// Safari's stream reader is supported much earlier than stream async iteration.
export async function readPdfPageText(page: Pick<PDFPageProxy, "streamTextContent">, signal: AbortSignal, maxLength: number) {
  if (signal.aborted) throw signal.reason ?? new Error("Reading cancelled.");
  const reader = page.streamTextContent().getReader();
  const lines: Line[] = [];
  let line = "", x = 0, y: number | null = null, gap = "", length = 0, complete = false;
  const abort = () => { void reader.cancel(signal.reason).catch(() => {}); };
  signal.addEventListener("abort", abort, { once: true });
  const finishLine = () => {
    if (line.trim()) { lines.push({ text: line.trim(), x, y: y ?? 0 }); length++; }
    line = ""; y = null; gap = "";
  };
  try {
    while (true) {
      const chunk = await reader.read();
      if (signal.aborted) throw signal.reason ?? new Error("Reading cancelled.");
      if (chunk.done) { complete = true; break; }
      for (const item of chunk.value.items) {
        if (!("str" in item)) continue;
        const nextY = item.transform[5];
        if (y !== null && Math.abs(nextY - y) > 3) finishLine();
        if (!item.str.trim()) {
          // PDF.js reports spacing as blank items. Keep one separator, and a tab for column gaps.
          if (line && item.width > COLUMN_GAP) gap = "\t";
          else if (line && !gap) gap = " ";
        } else {
          const separator = !line ? "" : gap || (/\s$/.test(line) ? "" : " ");
          if (!line) x = item.transform[4];
          length += separator.length + item.str.length;
          if (length > maxLength) throw new Error("This PDF has too much text. Choose a shorter resume.");
          line += separator + item.str;
          gap = "";
          y = nextY;
        }
        if (item.hasEOL) finishLine();
      }
    }
    finishLine();
    const text = attachBullets(lines).join("\n");
    if (text.length > maxLength) throw new Error("This PDF has too much text. Choose a shorter resume.");
    return text;
  } finally {
    signal.removeEventListener("abort", abort);
    if (!complete) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

/**
 * Some design tools write every bullet glyph after the page text. Put each one back
 * on the line it sits beside, and drop glyphs that have no line.
 */
function attachBullets(lines: Line[]) {
  const text = lines.filter((line) => !BULLET_GLYPH.test(line.text)).map((line) => ({ ...line }));
  for (const bullet of lines.filter((line) => BULLET_GLYPH.test(line.text))) {
    const target = text.find((line) => Math.abs(line.y - bullet.y) < 2 && line.x > bullet.x && !/^[•●▪◦*-]\s/.test(line.text));
    if (target) target.text = `• ${target.text}`;
  }
  return text.map((line) => line.text);
}
