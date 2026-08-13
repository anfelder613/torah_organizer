# CLAUDE.md — Torah Organizer

Guidance for Claude Code when working in this repository. See [PRD.md](./PRD.md) for the
full product spec — this file is about *how to build and maintain it*, not *what it is*.

## Project in one paragraph

A static, public-readable website (Astro, deployed to GitHub Pages) that lets a single
curator browse and record Torah-study resources — links to articles, shiurim, seforim
purchases, and WhatsApp groups — across three sections: Halacha, Machshava, and Parsha.
No backend, no database, no accounts. Content lives in YAML files edited directly in the
repo.

## Status

As of 2026-08-12: the Astro project is scaffolded (minimal template, TypeScript strict,
`npm install` run) at repo root. `src/content/` collections (halacha/machshava/parsha) have
not been created yet — that's the next step, per "Content structure & schema" below.

## Tech stack

- **Astro** — static site generator, content collections for data-driven pages.
- **YAML** — all content data files (topics, resources, the Parsha list).
- **GitHub Pages** — hosting, via a GitHub Action that builds and deploys on push to the
  default branch.
- No React/Vue/etc. framework integration unless a specific page genuinely needs client-side
  interactivity — this site is static/content-first by design. Don't add one speculatively.
- No backend, no database, no auth. If a task seems to require one, stop and check the PRD's
  non-goals before proceeding — it's probably out of scope for this version.

## Content structure & schema

Content lives under `src/content/` as Astro content collections, one collection per
section:

```
src/content/
  halacha/
    <topic-slug>.yaml
  machshava/
    <topic-slug>.yaml
  parsha/
    <parsha-slug>.yaml   # all 54, pre-scaffolded
```

Each topic file has this shape:

```yaml
title: "Hilchot Shabbat"
description: "Optional short description of the topic."
resources:
  - title: "Resource title"
    url: "https://example.com"
    type: article          # article | shiur | sefer-purchase | whatsapp-group | other
    author: "R' Full Name" # optional
    language: english      # optional: english | hebrew | yiddish | mixed
    format: text            # optional, mainly for shiurim: audio | video | text
    description: "One or two sentence summary." # optional
```

- Define this shape as an Astro content collection schema (`src/content/config.ts`) using
  `zod`, so malformed entries fail the build loudly instead of rendering broken pages.
- Every resource **must** have `title`, `url`, and `type`. All other fields are optional —
  render their absence gracefully (don't show "undefined" or empty labels).
- Empty topics/resource lists are valid and expected at launch — render a clean "No
  resources yet" state, not a broken layout.

### The Parsha list

The 54 parshiyot are a fixed, known list. When scaffolding the `parsha/` collection, create
one file per parsha in the standard annual cycle order (Bereishit through Vezot Haberacha),
each starting with an empty `resources: []` list. Don't invent or guess parsha names —
verify against a standard list (e.g., the standard Sephardi/Ashkenazi annual triennial
cycle order) before generating all 54 files.

## Adding content (the main day-to-day workflow)

Adding a resource means editing a YAML file directly, e.g.:

1. Find (or create) the relevant topic file under `src/content/<section>/`.
2. Add an entry to its `resources` list following the schema above.
3. Run the build locally to confirm nothing broke (see Commands).
4. Commit and push — GitHub Actions handles deploy.

For **Halacha** and **Machshava**, topics are open-ended — if a new topic doesn't fit an
existing file, create a new one with a clear, non-duplicate slug. Check existing topic
titles first to avoid near-duplicates (e.g., don't create both `shabbat` and
`hilchot-shabbat`).

There is no admin UI or CMS in v1 — do not build one unless explicitly asked (see PRD §14,
deferred to v2).

## Commands

- `npm run dev` — local dev server. When starting it from Claude Code, prefer
  `astro dev --background` so the shell isn't blocked; manage it with `astro dev stop`,
  `astro dev status`, and `astro dev logs`.
- `npm run build` — production build; **must pass** before pushing.
- `npm run preview` — preview the production build locally.

### Astro documentation

Consult these before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content collections](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles](https://docs.astro.build/en/guides/styling/)

## Quality bar

- `astro build` must succeed — treat a broken build as blocking, not a warning.
- A CI job (GitHub Actions) runs a link checker across all resource URLs (e.g., on a
  schedule or per-push) to catch dead links. When adding/editing this workflow, prefer a
  well-maintained existing action (e.g., a link-checker action) over hand-rolling one.
- No unit/integration test suite is expected for this project — don't add one speculatively.
  There's no complex application logic here; the schema validation (via content collection
  config) plus build + link-check is the intended quality bar per the PRD.

## Design conventions

- Minimal, clean, typography-focused. Neutral color palette.
- English-primary UI copy. Hebrew terms/titles may appear inline (e.g., topic titled
  "Hilchot Shabbat (הלכות שבת)") — make sure the font stack renders Hebrew characters
  correctly, but do not build RTL layout support (explicitly out of scope, see PRD §4).
- Mobile-friendly by default — this is likely read on a phone.
- No search UI in v1 (explicit non-goal) — navigation is Section → Topic → Resources only.
  Don't add a search box speculatively.

## Things to avoid (explicit non-goals — see PRD §4 for full list)

- User accounts, login, or any multi-editor workflow.
- Public content submission or moderation flows.
- WhatsApp chat transcript storage/parsing or live feed integration — WhatsApp content is
  just a link.
- A tagging system beyond section/topic.
- A database or backend of any kind.

If a request seems to need one of these, flag the mismatch with the PRD rather than quietly
building it.

## Git & repo conventions

- Public repo, MIT licensed.
- No custom domain — deploys to the default `github.io` URL.
- Commit content additions and code changes separately where practical (e.g., don't bundle
  "add 5 new resources" into the same commit as an unrelated layout change), so content
  history stays easy to skim.
