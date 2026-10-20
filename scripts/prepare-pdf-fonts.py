"""Build static PDF faces from the bundled OFL fonts. Requires fonttools and brotli."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1] / "public" / "fonts"
target = root / "pdf"
target.mkdir(exist_ok=True)
for family in ("source-sans", "source-serif"):
    for italic in (False, True):
        for weight, label in ((400, "regular"), (700, "bold")):
            if italic and weight == 700:
                continue
            source = root / f"{family}-{'italic' if italic else 'regular'}.woff2"
            font = TTFont(source)
            axes = {axis.axisTag: axis.defaultValue for axis in font['fvar'].axes}
            axes['wght'] = weight
            instantiateVariableFont(font, axes, inplace=True)
            font.flavor = None
            suffix = f"{label}-italic" if italic else label
            font.save(target / f"{family}-{suffix}.ttf")
