# CLAUDE.md — Torah Organizer

Guidance for Claude Code when working in this repository. See [PRD.md](./PRD.md) for the
full product spec — this file is about *how to build and maintain it*, not *what it is*.

## Project in one paragraph

A static, public-readable website (Astro, deployed to GitHub Pages) that lets a single
curator browse and record Torah-study resources — links to articles, shiurim, seforim
purchases, and WhatsApp groups — across four sections: Halacha, Machshava, Gemara, and
Parsha. No backend, no database, no accounts. Content lives in YAML files edited directly
in the repo.

## Status

As of 2026-08-17: fully scaffolded, deployed, and populated. `src/content/` collections
exist for all four sections. Halacha (25 topics), Machshava (25 topics), and all 54
parshiyot each carry 3 real resource links. Gemara has Masechet Berachot fully populated
(125 dapim across its 9 perakim, each with a Sefaria text link + one Daf Yomi shiur link).
Pages/routes, layout, and CI (build+deploy, link-check) are in place. Repo is public at
github.com/anfelder613/torah_organizer, live at https://anfelder613.github.io/torah_organizer/.
Ongoing work is content: adding more masechtot to Gemara, more topics to Halacha/Machshava,
and more resources per topic as the curator finds them.

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

### Gemara collection (distinct schema)

Gemara doesn't use `topicSchema` — it's structured `masechta -> perek -> daf`, since a
masechta's daf count is fixed and known (unlike open-ended Halacha/Machshava topics). Layout:

```
src/content/gemara/
  <masechta-slug>/
    01-<perek-slug>.yaml
    02-<perek-slug>.yaml
    ...
```

Each perek file:

```yaml
masechta: "Berachot"
title: "Perek 1: Me'eimatai"
order: 1
dapim:
  - daf: "2a"
    sefariaUrl: "https://www.sefaria.org/Berakhot.2a"
    shiur:
      title: "Daf Yomi: Berachot 2a"
      url: "https://www.yutorah.org/daf.cfm/6004/berachot/2/a/"
```

Every daf gets exactly one Sefaria link and one shiur link — not an open-ended resource
list. Both URL patterns are predictable and were verified once per masechta rather than
searched per-daf:
- Sefaria: `https://www.sefaria.org/<MasechtaName>.<daf><a|b>` (note Sefaria spells it
  "Berakhot", not "Berachot" — check the exact spelling per masechta before generating).
- YUTorah "On the Daf": `https://www.yutorah.org/daf.cfm/<masechta-id>/<masechta>/<N>/<a|b>/`
  — the numeric masechta ID (6004 for Berachot) must be found via search per masechta; it's
  not derivable from the masechta name.

When chapter boundaries fall mid-daf (very common in Mishnah/Gemara), assign each daf to
exactly one perek (the chapter it's first associated with) — don't duplicate a daf across
two perek files.

Add a new masechta by: creating a new subfolder, verifying its Sefaria name and YUTorah
masechta ID, generating its perek files (a script, not one Write call per daf — see how
Berachot was generated), and adding it to the `masechtot` array in
`src/pages/gemara/index.astro` plus a new `src/pages/gemara/<masechta>/index.astro` page
(copy `berachot/index.astro` and change the collection filter).

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

### Finding real resource links

Never fabricate a URL. Use WebSearch restricted to the approved sites (YUTorah,
TorahAnytime, KolHalashon, OUTorah, AllDaf, TorahDownloads, TorahApp — `allowed_domains` on
the search call) and pick a real result with a clear, on-topic title.

**Prefer these URL shapes**, in order of demonstrated reliability:
- `outorah.org/p/<id>/` and `torahdownloads.com/shiur-<id>.html` — most reliable so far,
  none have gone stale.
- `yutorah.org/lectures/<id>/` (or `<id>/Title-Slug`) — reliable.
- `yutorah.org/categories/...` or `torahanytime.com/topics/<id>` — topic/category
  aggregator pages, reliable and often a better fit than one arbitrary lecture anyway.
- **Avoid** `yutorah.org/lectures/lecture.cfm/<id>/...` — this older URL format has been
  confirmed dead (user-reported "unable to locate the shiur requested") on multiple
  otherwise-real links found via search. If a search result only offers this format, prefer
  a different domain over using it.

I can't reliably verify these links myself: YUTorah blocks bot/datacenter requests with a
403 regardless of User-Agent (confirmed via curl and WebFetch), and OU Torah's article body
loads via client-side JS that my fetch tools don't execute (so a page can look "empty" and
still be a real, working page for an actual browser — check the page *title* matches what's
expected before assuming it's broken). The CI link-checker (see Quality bar) is configured
to accept 403 as "likely bot-blocked, not dead" — so a genuinely broken link (404) will
still fail CI, but a YUTorah link passing CI is not itself proof it works. When in doubt,
ask the user to click it in a real browser and report back — that's the only reliable check
available.

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
