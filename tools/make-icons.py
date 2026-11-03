"""Regenerate every icon the site serves, from one set of numbers.

    python tools/make-icons.py

Writes favicon.ico, favicon.svg and apple-touch-icon.png in the repo root:
the purple brand mark, which every page but the product pages uses. Then the
same three files again in each product's colourway, as favicon-trados.*,
favicon-memoq.* and favicon-workbench.* (apple-touch-icon-trados.png and so
on), so /trados/, /memoq/ and /workbench/ carry their own product's mark in
the browser tab: blue #1976D2 -> #2196F3, vermillion #D8402A -> #F05137 and
green #2E7D32 -> #43A047, as in sv-icon.svg, sv-icon-memoq.svg and
sv-icon-workbench.svg.

Also og-image.png and og-image-{trados,memoq,workbench}.png: the 1200 x 630
picture a chat app or social site shows when a link to a page is pasted: the
mark alone, large, in the same colourways.

The geometry is sv-icon-brand.svg's: a 112-radius disc in a 256 box, filled
with a diagonal #5B21B6 -> #7C3AED gradient, and "Sv" in Arial Bold at 135 and
112 on baselines of 178 and 180, the pair centred as a whole - which is what
text-anchor="middle" does with two runs.

Until 2026-11-03 the brand mark was black (#151515 -> #333333), and
favicon.svg carried a prefers-color-scheme rule that inverted it on a dark tab
strip, where a black disc sinks into the background. Every colourway is now a
colour, visible on light and dark strips alike, so all of them share one SVG
and none needs a dark rule. Sidekick's tray icon is the brand favicon.ico,
copied across, for the same reason.

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
    ("", "#5B21B6", "#7C3AED"),
    ("-trados", "#1976D2", "#2196F3"),
    ("-memoq", "#D8402A", "#F05137"),
    ("-workbench", "#2E7D32", "#43A047"),
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
    return src


# ------------------------------------------------------- the link preview
# What WhatsApp, LinkedIn, Slack and the rest show when a link to a page is
# pasted. Without one they fall back to the 180-pixel touch icon and stretch
# it. 1200 x 630 is the size they all take.
#
# The mark alone, and no name. WhatsApp's small preview is the middle square
# of the picture, shrunk to about 115 pixels and saved as a rough JPEG. A mark
# with the name under it came out about 45 pixels wide there, and soft; one
# that fills the square survives. The apps print the page's title beside the
# picture, so the name is there anyway.
OG_W, OG_H = 1200, 630
OG_MARK = 500                             # the mark's 256 box; its disc is 437


def card(suffix, src):
    im = Image.new("RGB", (OG_W, OG_H), (255, 255, 255))
    mark = src.resize((OG_MARK, OG_MARK), Image.LANCZOS)
    im.paste(mark, ((OG_W - OG_MARK) // 2, (OG_H - OG_MARK) // 2), mark)
    im.save(os.path.join(ROOT, "og-image%s.png" % suffix), optimize=True)
    print("og-image%s.png      %dx%d" % (suffix, OG_W, OG_H))


for suffix, top, bottom in COLOURWAYS:
    card(suffix, rasters(suffix, top, bottom))


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

SVG = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <!-- Generated by tools/make-icons.py - do not edit by hand.
       The tab-strip favicon, in one colourway. -->
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
    svg = SVG % (top, bottom, paths)
    with open(os.path.join(ROOT, "favicon%s.svg" % suffix), "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)
    print("favicon%s.svg" % suffix)
