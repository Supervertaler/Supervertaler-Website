# Changelog

The public site at [supervertaler.com](https://supervertaler.com). It deploys on
every push to `main`, so there are no releases and no version numbers – the
headings are dates.

This file starts on 2026-09-16 and covers the work from the site's
reorganisation onwards. Anything earlier is in the git history rather than here,
because reconstructing it after the fact would be guesswork.

## 2026-09-28

Supervertaler for memoQ 0.1.0 is released, so the commit that held its
downloads back ("Hold memoQ downloads until its first release") is reverted.

### Added

- **Supervertaler for memoQ can be downloaded.** The memoQ page, the home page
  and the pricing page offer the free trial again, the memoQ page has its
  Installation section back, and "coming soon" is gone everywhere, `llms.txt`
  included.

### Changed

- **`/download/memoq/` starts the download.** It used to open the release page
  on GitHub and ask you to find the `.exe` there. Every release now uploads the
  installer under one fixed name, so the link fetches the newest installer
  directly, with the installation guide and release notes a click away.

## 2026-09-23

Everything that makes the one licence clear went live now; everything that
offers memoQ for download waits for its first release, in one commit ("Hold
memoQ downloads until its first release") that is reverted on launch day.

### Added

- **A pricing page, `/pricing/`, and the one place to buy.** Both product pages
  said "one licence covers both" in a line under the price, but the only
  Subscribe button was on the Trados page and nothing said what a Trados
  subscriber had to do to use memoQ. The page answers that first: a Trados
  subscriber already has memoQ, it picks up the licence by itself on a computer
  where Trados is activated, and both plugins on one computer are one of the two
  computers. Then where the key goes in each, and the questions that come up.
  The home page's Pricing link and every footer's now go here.
- **`/download/memoq/`**, a short, stable link to the memoQ installer, for the
  same reason `/buy` and `/appstore` exist: everything links here, so the file
  can move without breaking a link already sent.

### Changed

- **The memoQ page says Trados subscribers already have it**, and links to how the
  licence works across both. The download button, trial buttons and an Installation
  section are written and held back until the release.
- **The Trados page's pricing says memoQ is included**, with a link to how.
- `llms.txt` describes the memoQ plugin and links the pricing page.
- **The privacy policy covers the memoQ plugin**, in a section of its own: what an AI
  translation request carries, the two editor actions that send more and only on a
  click, AI assistants reading over a connection only the user's own computer can
  reach, the licence check, what it never sends (no update checks, no usage
  statistics) and what it keeps locally.
- **Link underlines are unbroken.** Browsers skip the underline under a descender,
  so "Pricing" was underlined everywhere except under the g.

## 2026-09-13

### Added

- **Supervertaler Sidekick has a place on the site.** A card in the hero's right
  column – free, with what it does and a link out to its documentation – and a
  third entry in the header's product row beside for Trados and for memoQ, with a
  one-line tooltip on each of the three saying what it is.
- **SuperVoice** on the Trados page.

### Changed

- **On a phone, the screenshot comes before the Sidekick card.** Stacked, the hero
  read heading, standfirst, then a card for the one product that earns nothing, so
  the free companion was the first thing under the fold and the paid ones came
  after it. The screenshot moved inside the hero grid so the three blocks could be
  ordered: words, what the paid product looks like, then the free companion.
- **The nav fits on one line again.** Adding Sidekick pushed the Trados nav ten
  pixels past the width it has, and the header wraps, so the whole nav dropped
  below the wordmark. "Home" went instead: the wordmark links to `/` on every page,
  so it was saying the same thing twice, and it was the one item the landing page
  never had.

## 2026-09-12

### Changed

- **The page ground stays white.** White, a warm cream (#F0EEE6) and a dark ground
  were compared on the real site behind a `?themes` switch, since the front page
  leads with a screenshot of a Windows application and every screenshot it carries
  is white – a warm or dark ground makes those read as lit rectangles rather than
  illustrations. The switcher was removed once the question was answered.
- **The ground is declared to mobile browsers** (`theme-color`), so a phone paints
  its own chrome to match instead of guessing.

## 2026-09-10

### Changed

- **The two product links in the header carry a coloured swatch** rather than
  coloured text. Coloured link text reads as state – visited, or current page –
  and this nav already says "you are here" with colour on text. A swatch is not
  text, so it also carries the true brand colours: as words, the vermillion is
  3.5:1 on white and fails AA at this size.

## 2026-09-09

### Added

- **The site covers two products.** A landing page at `/`, the former home page at
  `/trados/`, and a new `/memoq/` marked coming soon – so the external links that
  already pointed at `/trados/` stop taking a redirect hop.
- **A screenshot on the front page**, and the MCP Server screencast on the Trados
  page.

### Changed

- **The house style is black and white**, matching beijer.uk, with one accent per
  product: blue for Trados, vermillion for memoQ, black for the brand.
- **The favicon was redrawn** from the brand mark's own geometry – it had been a
  single 16×16 frame, flat blue, with the letters outlined, which no other icon in
  the family does. Seven frames now, plus an SVG that inverts itself on a dark tab
  strip. Generated by `tools/make-icons.py`, which reproduces the committed files
  byte-for-byte.
- **Mobile**: the hamburger menu came back, the product cards stopped running to
  both screen edges, and the footer navigation was restored.

### Fixed

- **Em dashes throughout.** The house style is spaced en dashes.
