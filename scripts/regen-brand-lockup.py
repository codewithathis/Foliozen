"""Regenerate Foliozen lockup SVGs from the icon mark + Inter Bold wordmark."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.mutator import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
FONT = ROOT / "src" / "app" / "fonts" / "inter-variable.woff2"

# Match existing lockup proportions (icon 256 + wordmark).
ICON_SIZE = 256
VIEW_H = 256
GAP = 40
# Existing lockup used scale ~0.0596 of font units; keep visual size similar.
SCALE = 0.0596
BASELINE_Y = 171.0


def wordmark_groups(text_primary: str, text_accent: str) -> tuple[str, str, float]:
    font = TTFont(str(FONT))
    inst = instantiateVariableFont(font, {"wght": 700})
    glyph_set = inst.getGlyphSet()
    cmap = inst.getBestCmap()

    def paths_for(text: str, start_x: float) -> tuple[str, float]:
        x = start_x
        parts: list[str] = []
        for ch in text:
            gname = cmap[ord(ch)]
            pen = SVGPathPen(glyph_set)
            glyph_set[gname].draw(pen)
            parts.append(f'<path transform="translate({x:.1f} 0)" d="{pen.getCommands()}"/>')
            x += glyph_set[gname].width
        return "\n".join(parts), x

    primary, x = paths_for(text_primary, 0.0)
    accent, end = paths_for(text_accent, x)
    return primary, accent, end


def extract_icon_inner(svg_text: str) -> str:
    # Drop outer svg/title; keep defs + glyph from the icon file.
    body = re.sub(r"^<svg[^>]*>\s*<title>[^<]*</title>\s*", "", svg_text.strip())
    body = re.sub(r"</svg>\s*$", "", body)
    return body.strip()


def build_lockup(icon_inner: str, primary: str, accent: str, width_units: float, dark: bool) -> str:
    word_w = width_units * SCALE
    total_w = int(round(ICON_SIZE + GAP + word_w + 8))
    primary_fill = "#FFFFFF" if dark else "#0F1B33"
    accent_fill = "#6AA8FF" if dark else "#1F63E8"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{VIEW_H}" viewBox="0 0 {total_w} {VIEW_H}">
  <title>Foliozen</title>
  <svg width="{ICON_SIZE}" height="{ICON_SIZE}" viewBox="0 0 1024 1024">
{icon_inner}
  </svg>
  <g transform="translate({ICON_SIZE + GAP} {BASELINE_Y}) scale({SCALE} -{SCALE})">
    <g fill="{primary_fill}">
{primary}
    </g>
    <g fill="{accent_fill}">
{accent}
    </g>
  </g>
</svg>
"""


def rename_icons() -> None:
    mapping = {
        "resumefold-icon-dark.svg": "foliozen-icon-dark.svg",
        "resumefold-icon-light.svg": "foliozen-icon-light.svg",
        "resumefold-icon-small-dark.svg": "foliozen-icon-small-dark.svg",
        "resumefold-icon-small-light.svg": "foliozen-icon-small-light.svg",
        "resumefold-icon-light-256.png": "foliozen-icon-light-256.png",
        "resumefold-icon-light-512.png": "foliozen-icon-light-512.png",
    }
    for old, new in mapping.items():
        src = BRAND / old
        dst = BRAND / new
        if src.exists():
            if dst.exists():
                dst.unlink()
            src.rename(dst)
        # Update title in svg files
        if dst.suffix == ".svg" and dst.exists():
            text = dst.read_text(encoding="utf-8")
            text = text.replace("<title>ResumeFold</title>", "<title>Foliozen</title>")
            dst.write_text(text, encoding="utf-8")


def main() -> None:
    rename_icons()
    primary, accent, width_units = wordmark_groups("Folio", "zen")
    icon_light = extract_icon_inner((BRAND / "foliozen-icon-light.svg").read_text(encoding="utf-8"))
    icon_dark = extract_icon_inner((BRAND / "foliozen-icon-dark.svg").read_text(encoding="utf-8"))

    light = build_lockup(icon_light, primary, accent, width_units, dark=False)
    dark = build_lockup(icon_dark, primary, accent, width_units, dark=True)

    (BRAND / "foliozen-lockup-light.svg").write_text(light, encoding="utf-8")
    (BRAND / "foliozen-lockup-dark.svg").write_text(dark, encoding="utf-8")

    for stale in [
        "resumefold-lockup-light.svg",
        "resumefold-lockup-dark.svg",
        "resumefold-lockup-light@2x.png",
    ]:
        p = BRAND / stale
        if p.exists():
            p.unlink()

    # Keep a PNG for OG image generation — rasterize via SVG copy note:
    # OG route will switch to SVG-in-PNG via ImageResponse text; also copy lockup
    # as a fallback by writing SVG path referenced later.
    print("Wrote foliozen lockups; width units", width_units)


if __name__ == "__main__":
    main()
