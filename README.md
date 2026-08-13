# Torah Organizer

A curated, browsable index of Torah-study resources — articles, online shiurim, seforim
purchase links, and WhatsApp groups — organized by topic across three sections:

- **Halacha** — Jewish law, organized by topic.
- **Machshava** — Jewish thought, organized by theme.
- **Parsha** — organized by the 54 weekly Torah portions.

See [PRD.md](./PRD.md) for the full product spec, and [CLAUDE.md](./CLAUDE.md) for
build/content conventions (used by Claude Code, but useful reading for any contributor).

## Adding a resource

Content lives as YAML files under `src/content/{halacha,machshava,parsha}/`. Open the
relevant topic file (or create a new one) and add an entry to its `resources` list. See
CLAUDE.md for the schema.

## Commands

| Command           | Action                                    |
| :----------------- | :----------------------------------------- |
| `npm install`       | Install dependencies                       |
| `npm run dev`       | Start local dev server at `localhost:4321` |
| `npm run build`     | Build production site to `./dist/`         |
| `npm run preview`   | Preview the production build locally       |

## Deployment

Pushes to `main` build and deploy automatically to GitHub Pages via
[.github/workflows/deploy.yml](./.github/workflows/deploy.yml). A separate scheduled
workflow ([.github/workflows/link-check.yml](./.github/workflows/link-check.yml)) checks
all resource URLs for dead links.
