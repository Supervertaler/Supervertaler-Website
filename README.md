# Supervertaler website

The source of **https://supervertaler.com**, served by GitHub Pages from the
root of this repository.

Plain HTML, CSS and one small `script.js` – no build step, no framework. Edit a
file, commit, and it is live. (The *documentation* site is a different thing:
Astro + Starlight, in `Supervertaler-Help`, published at docs.supervertaler.com.)

## Why this repo exists

The site used to live in `docs/` inside `Supervertaler-Workbench` – the repo of
a retired product – which made it hard to find and tied the public face of the
project to something no longer developed. It now stands on its own.

Two things were left behind in that move, deliberately: several folders of
internal notes (`dev-notes/`, `archive/`, `agent-archive/`, idea sketches) that
sat inside the published folder and were therefore being served to the public
without being linked from anywhere.

## Layout

| Path | What it is |
|---|---|
| `index.html` | the home page |
| `trados/` | Supervertaler for Trados |
| `workbench/` | Supervertaler Workbench (retired, kept for existing users) |
| `buy/`, `privacy/`, `releases/`, `guides/` | supporting pages |
| `assets/`, `screenshots/` | images |
| `CNAME` | the custom domain |
