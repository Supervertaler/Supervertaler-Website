# Changelog

The public site at [supervertaler.com](https://supervertaler.com). It deploys on
every push to `main`, so there are no releases and no version numbers – the
headings are dates.

This file starts on 2026-09-16 and covers the work from the site's
reorganisation onwards. Anything earlier is in the git history rather than here,
because reconstructing it after the fact would be guesswork.

## 2026-10-15

### Added

- **The footer explains the name.** After "Built by Michael Beijer…" it now
  says *Supervertaler* is Dutch for "super translator", on every page. The
  word is marked `lang="nl"` so screen readers pronounce it as Dutch.

### Changed

- **A plainer standfirst on the home page.** "Feed an AI one sentence at a time
  and you get good sentences and a poor translation", then four kinds of
  context instead of six, with the list numbering and figures the grid never
  shows kept for last. The line below it is unchanged.
- **The Trados and memoQ pages' Context layers sections open the same way.**
  Their "An engine that sees only the sentence…" opening is replaced by the
  home page's new first sentence, and the next sentence now starts "In
  Supervertaler," so the contrast still lands. The rest of each paragraph is
  unchanged.

### Fixed

- **The home page's opening paragraphs are one size on a phone.** The
  standfirst shrank on narrow screens but the "It reads like a translation…"
  line below it did not, so on a phone that line came out larger than the
  paragraphs either side of it. It now shrinks with the standfirst, as it
  already matched it on a desktop. The stylesheet version is now 32 on every
  page.

## 2026-10-14

### Added

- **The case study shows the comparison spreadsheet**, claims 1 to 6, as a
  screenshot beside the download, with a caption giving the colour key.
- **A Docs and resources page** at `/docs/`, which the header's Docs link now
  opens on the home, pricing, changelog and case-study pages (the product pages
  still go straight to their own docs). It lists the most useful docs pages for
  Trados, memoQ and Sidekick, the case study, the screencasts, both changelogs,
  pricing and privacy, and the source code. The footer's Help column links it on
  every page.
- **A "Tested on a real patent" section on the home page**, after Context
  layers, linking the case study and the new page.
- **A case study: "Can a local AI model translate a patent?"** at
  `/articles/local-ai-patent-test/`. A published Dutch patent (BE1029761B1)
  translated in memoQ with Gemma 4 31B and with Claude Opus 5.5, compared
  paragraph by paragraph with its official English publication
  (WO2023042137A1): the results, examples side by side, a screenshot of
  Opus's translator comments in memoQ, the effect of house rules in
  SuperMemory, what working locally takes, and which Claude plans fall under
  Anthropic's Commercial Terms. The comparison spreadsheet is downloadable
  beside it. Linked from the memoQ and Trados pages.

### Changed

- **Lighter link underlines.** A 1px grey line, turning black on hover, instead
  of the font's own thickness in full black. Still unbroken under descenders.
  The stylesheet version is now 31 on every page.
- **The memoQ page mentions local models.** Its "AI translation" card said
  "Anthropic, OpenAI or Google" only; Supervertaler for memoQ has also
  supported Ollama and OpenAI-compatible servers since 0.1.12. It now says so,
  and links the case study.
- **llms.txt lists the new page and the case study**, and its changelog link
  points at `/changelog/` rather than the old address that only redirects.
- **The Trados page links the case study** from the providers line of its
  "AI translation" card.
- **The case study links to a confidentiality page** on beijer.uk, which sets
  out how the author handles client documents.

## 2026-10-13

### Added

- **Changelog pages for both plugins**, at `/changelog/trados/` and
  `/changelog/memoq/`, with `/changelog/` to choose between them. Each reads
  the plugin's own CHANGELOG.md from GitHub as the page opens, so a release
  never needs a commit here and the page cannot fall behind the file. Releases
  are listed down the side (folded into a menu on a phone), dates are written
  out, and the entries a release would be announced for (★) stand out.
  `?since=0.1.12` shows only the releases after that version, with a line
  saying how many: the plugins' update offers can link here with the
  translator's own version. Trados's numbering (one number per Studio
  version, and the older single 4.20.x) is compared on the number for the
  same Studio version. The page needs marked and DOMPurify, kept in
  `changelog/vendor/` rather than loaded from a CDN, so it asks no third party
  for anything but the changelog itself. The footer links and the old
  `/changelog.html` now lead here instead of to GitHub.

### Changed

- **Plainer intros on the changelog pages.** The memoQ page said "when
  Supervertaler offers you an update", which read like a sales offer; it now
  says the page opens from Supervertaler's "new version available" window. The
  Trados page promised the same, but the Trados plugin does not link there with
  its version yet, so its intro now says only what the page is.
- **The footer's "Source code" link goes to the Supervertaler organisation on
  GitHub**, where every product's repository is listed, instead of to the
  Trados plugin's repository alone. The site covers memoQ and Workbench too.
  Community's "GitHub" link, which went to the same page, is gone.

### Fixed

- **The memoQ changelog is in the footer.** The footer's one "Changelog" link
  went to Supervertaler for Trados's changelog on every page, the memoQ page
  included, so a memoQ user following it read about the other product. The
  Help column now has a "Trados changelog" and a "memoQ changelog", beside the
  docs links for each (on GitHub at first; now the pages above).

## 2026-10-12

### Added

- **The memoQ page shows the product.** Under the download buttons, a
  screenshot of memoQ with the Supervertaler editor open beside the grid:
  termbase terms highlighted in the source, and the AI's suggestion and the
  term hits in Translation results. Until now the page had no picture at all.
  It is 2000px wide, sharp at the page's width on a high-density screen, and
  carries its width and height so the page does not jump as it loads.

## 2026-10-11

### Fixed

- **The site no longer scrolls sideways on a phone.** On every page the footer
  was wider than most phone screens: its columns' minimum widths and the gap
  between them came to about 460px, so the whole page could be dragged
  sideways and the right-hand footer columns were cut off. On a phone the
  footer now puts the Supervertaler line across the top and the four link
  columns two by two underneath. The phone rule that was meant to narrow the
  footer had never taken effect, because a later rule in the stylesheet
  overrode it. Checked at 320, 360, 390 and 430px wide on the home, Trados,
  memoQ and pricing pages.

### Changed

- **The footer's five blocks sit on one row on a desktop.** The Supervertaler
  line and the four link columns had room for only four across, so About sat
  alone on a second row. They now fit on one row from 992px wide. In a
  narrower window, down to a tablet, the Supervertaler line takes the top row
  and the four link columns share the row beneath it, instead of leaving one
  column on its own. "Dutch–English" in the footer no longer breaks across
  two lines at the dash.

## 2026-10-09

### Fixed

- **The Sidekick card on the home page has a top edge, like the two product
  cards beside it.** Supervertaler for Trados and Supervertaler for memoQ each
  open with a 3px rule in their colour; the Sidekick card below them had none,
  and looked unfinished rather than black. It now has the same rule in black,
  Sidekick's colour, so the column reads blue, vermillion, black. (Later the
  same day the three cards were redesigned without top edges at all; see
  Changed.)

### Changed

- **Trados Studio 2022 is supported as well as 2024 and 2026,** ahead of the
  Supervertaler for Trados 199 release that ships it. The home page (its card
  and the product section), the Trados page's opening, the pricing page and
  `llms.txt` say "Trados Studio 2022, 2024 and 2026" where they said "2024 and
  2026". The screenshot's caption still says Trados Studio 2024, because that
  is what it shows.
- **The three cards beside the home page's heading are one design.** White,
  one hairline border, the same padding and type, and the whole card a link,
  Sidekick's included, which until now was a link on its last line only. Each
  card shows its product's colour in the mark, the name and the link, and
  nowhere else: the coloured top edges, which curled into the sides at the
  rounded corners, and the tinted backgrounds are gone.
- **No coloured dots in the menu.** The three product links had a dot in their
  product's colour. Beside plain words the dots read as list bullets, and they
  were the only colour in the header; the cards and each product's own page
  carry the colours instead. The extra space after Sidekick still sets the
  products apart from the other links. On every page.

## 2026-09-30

### Changed

- **Workbench is in active development again, and the site says so.** The
  Workbench page opened with "This project is no longer actively developed" and
  explained why the time went elsewhere. It now says development has resumed,
  with v1.10.372 closing 22 issues, and describes what Workbench is and who it
  is for next to the Trados and memoQ plugins. The footer of the home, Trados,
  memoQ and pricing pages, the page's description and `llms.txt` follow. The
  README no longer calls Workbench a retired product.

## 2026-09-29

### Fixed

- **The privacy policy now describes the Trados plugin's usage statistics as they
  are.** It called them "strictly opt-in" and listed five fields. In fact the
  first-start dialog leaves them on unless you choose *Turn it off*, and the ping
  also carries virtual-machine detection, processor architecture and three
  scaling percentages. Section 6 now says both.
- **The privacy policy covers memoQ 0.1.2's update check.** Section 7 no longer
  says the memoQ plugin makes no update checks. It describes the daily request to
  GitHub for the latest version, which sends nothing about you, and the check an
  installer passes before Download and install runs it.
- **The privacy policy covers Supervertaler for memoQ 0.1.1**, released today.
  Section 7 describes its usage statistics, which unlike Trados's are sent only
  if you agree and carry five fields, and the trial registration it shares with
  Trados. It no longer says the memoQ plugin sends no usage statistics, and its
  opening no longer claims "no Supervertaler servers": the documents still never
  pass through one. Section 6 points memoQ users to section 7.

### Changed

- **memoQ 11 is supported as well as memoQ 12.** The home page, the memoQ page
  (the note under Download and its Requirements), the pricing page and `llms.txt`
  say "memoQ 11 and 12" where they said "memoQ 12". The memoQ page adds that
  Supervertaler goes into both when both are installed.

- **The home page has the two products in their colours at the top.** Beside
  the headline, above the Sidekick card, a blue card for Supervertaler for Trados
  and a vermillion one for Supervertaler for memoQ, each linking to its page.
  The licence line names both products in their colours too. The home page is
  the one page that wears the black brand mark, and without these it had no
  colour above the fold at all. The headline is unchanged. Both cards say
  "Try free for 14 days", since it is one trial and one licence, and the
  Sidekick card beside them lost its feature list, which made the free tool the
  tallest thing in the column. It now opens like the other two, with its black
  mark beside its name instead of a "Free" pill ("Get it free" still says so),
  so the column reads blue, vermillion, black: the icon system in order.
  Polish: "Get it free" is the same size as the cards' "Try free for 14 days",
  and the Trados card says "2024 or 2026" on one line, with the card titles a
  fraction smaller so they no longer run to the card's edge.

- **Each product page carries its own product's mark.** `/trados/` shows the
  blue Sv and `/memoq/` the vermillion one, in the header, the footer and the
  browser tab; every other page keeps the black brand mark. The tab icons come
  from `tools/make-icons.py`, which now also writes `favicon-trados.*`,
  `favicon-memoq.*` and `apple-touch-icon-{trados,memoq}.png` from the same
  geometry, and still reproduces the black set byte for byte.

- **"Where the licence key goes" on the pricing page says where to install
  from.** Each product's step now starts with its download: the RWS App Store
  for Trados, the installer for memoQ. Lemon Squeezy's post-purchase popup and
  receipt now send new subscribers to this section, since one licence covers
  both products and a single "Install from RWS App Store" button no longer
  fitted.

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
