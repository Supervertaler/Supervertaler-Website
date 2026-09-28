"""Regenerate every icon the site serves, from one set of numbers.

    python tools/make-icons.py

Writes favicon.ico, favicon.svg and apple-touch-icon.png in the repo root:
the black brand mark, which every page but the two product pages uses. Then
the same three files again in each product's colourway, as favicon-trados.*
and favicon-memoq.* (apple-touch-icon-trados.png and -memoq.png), so
/trados/ and /memoq/ carry their own product's mark in the browser tab: blue
#1976D2 -> #2196F3 and vermillion #D8402A -> #F05137, as in sv-icon.svg and
sv-icon-memoq.svg.

The geometry is sv-icon-black.svg's: a 112-radius disc in a 256 box, filled
with a diagonal #151515 -> #333333 gradient, and "Sv" in Arial Bold at 135 and
112 on baselines of 178 and 180, the pair centred as a whole - which is what
text-anchor="middle" does with two runs.

Two files rather than one because a .ico cannot know what the browser's tab
strip looks like. On a dark strip the black disc sinks into the background and
leaves the letters floating; favicon.svg carries a prefers-color-scheme rule
and inverts instead. Browsers that do not take an SVG favicon fall back to the
.ico, which is the light-strip drawing.

Requires Pillow and fontTools, and Arial Bold - so, in practice, Windows.
"""
import os

from PIL import Image, ImageDraw, ImageFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = r"C:\Windows\Fonts\arialbd.ttf"

M = 1024                                  # master raster size
K = M / 256.0                             # the geometry is in a 256 box

# name suffix, gradient top-left, gradient bottom-right. "" is the brand mark
# and writes the unsuffixed files every other page links.
COLOURWAYS = [
    ("", "#151515", "#333333"),
    ("-trados", "#1976D2", "#2196F3"),
    ("-memoq", "#D8402A", "#F05137"),
]


def rgb(hexcolour):
    return tuple(int(hexcolour[i:i + 2], 16) for i in (1, 3, 5))
SIZES = [16, 24, 32, 48, 64, 128, 256]


# --------------------------------------------------------------- the raster
def master(TOP, BOTTOM):
    im = Image.new("RGBA", (M, M), (0, 0, 0, 0))

    # The gradient runs corner to corner, so the mixing parameter is
    # (x + y) over twice the width.
    grad = Image.new("RGB", (M, M))
    gp = grad.load()
    for y in range(M):
        for x in range(M):
            t = (x + y) / float(2 * (M - 1))
            gp[x, y] = tuple(int(TOP[i] + (BOTTOM[i] - TOP[i]) * t + 0.5) for i in range(3))

    # The disc is drawn at 4x and downsampled: it is the only edge in the
    # whole mark, and the resampler makes a better one than ImageDraw.
    n = M * 4
    mask = Image.new("L", (n, n), 0)
    r, c = 112 * K * 4, 128 * K * 4
    ImageDraw.Draw(mask).ellipse([c - r, c - r, c + r, c + r], fill=255)
    im.paste(grad, (0, 0), mask.resize((M, M), Image.LANCZOS))

    big = ImageFont.truetype(FONT, int(135 * K))
    small = ImageFont.truetype(FONT, int(112 * K))
    ws, wv = big.getlength("S"), small.getlength("v")
    x = 128 * K - (ws + wv) / 2.0
    d = ImageDraw.Draw(im)
    d.text((x, 178 * K), "S", font=big, fill=(255, 255, 255, 255), anchor="ls")
    d.text((x + ws, 180 * K), "v", font=small, fill=(255, 255, 255, 255), anchor="ls")
    return im


def rasters(suffix, top, bottom):
    src = master(rgb(top), rgb(bottom))
    ico = os.path.join(ROOT, "favicon%s.ico" % suffix)
    src.resize((256, 256), Image.LANCZOS).save(ico, format="ICO",
                                               sizes=[(s, s) for s in SIZES])
    print("favicon%s.ico       " % suffix, ", ".join(str(s) for s in SIZES))

    # iOS squares the corners off against the wallpaper, so a transparent corner
    # would show. Flatten onto white.
    apple = Image.new("RGB", (180, 180), (255, 255, 255))
    big = src.resize((180, 180), Image.LANCZOS)
    apple.paste(big, (0, 0), big)
    apple.save(os.path.join(ROOT, "apple-touch-icon%s.png" % suffix))
    print("apple-touch-icon%s.png  180" % suffix)


for suffix, top, bottom in COLOURWAYS:
    rasters(suffix, top, bottom)


# ------------------------------------------------------------------ the SVG
font = TTFont(FONT)
upem = font["head"].unitsPerEm
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()


def fmt(v):
    return ("%.4f" % v).rstrip("0").rstrip(".")


def advance(ch, size):
    return font["hmtx"][cmap[ord(ch)]][0] * size / float(upem)


def outline(ch, size, x, baseline):
    """The glyph as a path on the baseline at x.

    Font outlines run y-up from the baseline and SVG runs y-down from the top,
    hence the negative y scale. The letters are outlines rather than <text>
    because a favicon is read at 16 pixels, where a substituted font would not
    just look different - it would be a different mark.
    """
    pen = SVGPathPen(glyphs)
    glyphs[cmap[ord(ch)]].draw(pen)
    s = size / float(upem)
    return ('<path transform="translate(%s %s) scale(%s %s)" d="%s"/>'
            % (fmt(x), fmt(baseline), fmt(s), fmt(-s), pen.getCommands()))


ws, wv = advance("S", 135), advance("v", 112)
x0 = 128 - (ws + wv) / 2.0
paths = "\n    ".join([outline("S", 135, x0, 178),
                       outline("v", 112, x0 + ws, 180)])

BRAND_SVG = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <!-- Generated by tools/make-icons.py - do not edit by hand.
       The tab-strip favicon. favicon.ico beside it is the fallback and is the
       light-strip drawing; this file exists so a dark strip gets the inverted
       mark rather than a black disc sinking into the background. -->
  <defs>
    <linearGradient id="d" x1="0%%" y1="0%%" x2="100%%" y2="100%%">
      <stop offset="0%%" stop-color="#151515"/>
      <stop offset="100%%" stop-color="#333333"/>
    </linearGradient>
  </defs>
  <style>
    .disc { fill: url(#d); }
    .mark { fill: #ffffff; }
    @media (prefers-color-scheme: dark) {
      .disc { fill: #ffffff; }
      .mark { fill: #1a1a1a; }
    }
  </style>
  <circle class="disc" cx="128" cy="128" r="112"/>
  <g class="mark">
    %s
  </g>
</svg>
"""

# A product mark is coloured, so it stays visible on a dark tab strip and
# needs no dark-mode rule - only the black brand disc would sink into one.
PRODUCT_SVG = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <!-- Generated by tools/make-icons.py - do not edit by hand.
       The tab-strip favicon for one product's page, in its colourway. -->
  <defs>
    <linearGradient id="d" x1="0%%" y1="0%%" x2="100%%" y2="100%%">
      <stop offset="0%%" stop-color="%s"/>
      <stop offset="100%%" stop-color="%s"/>
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="112" fill="url(#d)"/>
  <g fill="#ffffff">
    %s
  </g>
</svg>
"""

for suffix, top, bottom in COLOURWAYS:
    svg = BRAND_SVG % paths if not suffix else PRODUCT_SVG % (top, bottom, paths)
    with open(os.path.join(ROOT, "favicon%s.svg" % suffix), "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)
    print("favicon%s.svg        %s" % (suffix, "light and dark" if not suffix else "product colourway"))
