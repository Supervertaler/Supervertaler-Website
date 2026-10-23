# Supervertaler website

The source of **https://supervertaler.com**, served by GitHub Pages from the
root of this repository.

Plain HTML, CSS and one small `script.js` – no build step, no framework. Edit a
file, commit, and it is live. (The *documentation* site is a different thing:
Astro + Starlight, in `Supervertaler-Help`, published at docs.supervertaler.com.)

## Why this repo exists

The site used to live in `docs/` inside `Supervertaler-Workbench`, which made it
hard to find and tied the public face of the whole project to one product's
repository. It now stands on its own.

Two things were left behind in that move, deliberately: several folders of
internal notes (`dev-notes/`, `archive/`, `agent-archive/`, idea sketches) that
sat inside the published folder and were therefore being served to the public
without being linked from anywhere.

## Layout

| Path | What it is |
|---|---|
| `index.html` | the home page |
| `trados/` | Supervertaler for Trados |
| `workbench/` | Supervertaler Workbench |
| `buy/`, `privacy/`, `releases/`, `guides/` | supporting pages |
| `assets/`, `screenshots/` | images |
| `CNAME` | the custom domain |

## Link previews

Every page's `<head>` carries Open Graph tags (`og:title`, `og:description`,
`og:url`, `og:image` and friends) plus `twitter:card`. They are what WhatsApp,
LinkedIn, Slack and X show when a link is pasted. Without them those apps fall
back to the 180-pixel touch icon and stretch it, which looks blurry. A new page
needs its own copy of the block, with its own title, description and URL. The
easiest way is to copy it from a page in the same colourway.

The three images, `og-image.png`, `og-image-trados.png` and `og-image-memoq.png`,
are made by `tools/make-icons.py` together with the icons. The docs site uses
them too, by URL. If you change one, raise the `?v=` on its URL everywhere it is
used, because the apps keep a preview they have already made.
