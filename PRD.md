# Torah Organizer — Product Requirements Document

## 1. Summary

Torah Organizer is a public-readable, single-curator website that lets a rabbi or Torah
scholar (the site owner) browse curated resources across four domains of Torah study —
**Halacha** (Jewish law), **Machshava** (Jewish thought/philosophy), **Gemara** (Talmud, by
masechta and daf), and **Parsha** (weekly Torah portion) — and find links to articles,
online shiurim, seforim purchase links, WhatsApp group/broadcast links, and other helpful
resources, organized by topic.

## 2. Problem

Useful Torah resources (articles, shiurim, seforim, WhatsApp shiur groups) are scattered
across bookmarks, notes, and memory, with no single organized place to find "everything I
know about Hilchot Shabbat" or "everything on this week's parsha." There's no existing
personal system for curating and browsing this by topic.

## 3. Goals

- Give the curator (site owner) one place to record and browse Torah-study resources by
  topic, across Halacha, Machshava, and Parsha.
- Make the collection publicly viewable/shareable, so others can benefit from the curation.
- Keep the system simple enough that adding a new resource is a low-friction edit, not a
  chore.
- Ship something real and usable quickly; grow features only once real usage justifies them.

## 4. Non-goals (v1)

- No user accounts, logins, or multi-user editing.
- No content submission/moderation workflow from the public.
- No search functionality (browse-only).
- No tagging system beyond section/topic.
- No WhatsApp chat archiving, transcript parsing, or live feed integration — WhatsApp
  content is just a link (e.g., to a group/broadcast list).
- No full Hebrew/RTL layout — English-primary UI with inline Hebrew terms only.
- No CMS, admin UI, or database — content is hand-edited data files.
- No content sourcing/research is included in this build; that happens afterward
  (potentially with Claude's help) as an ongoing curation task.

## 5. Users

- **Primary user (curator/editor)**: the site owner — a rabbi/Torah scholar who adds and
  organizes resources by directly editing content data files and pushing to GitHub.
- **Secondary users (readers)**: anyone who visits the public site to browse and follow
  resource links. Read-only, no interaction beyond clicking links.

## 6. Information architecture

Four top-level sections, each with its own topic structure:

- **Halacha** — organized by topic area (e.g., Shabbat, Kashrut, Tefillah, Nidah, etc.).
  Topics are added as the curator defines them; no fixed list. Each topic carries multiple
  (currently 3) curated resource links.
- **Machshava** — organized by theme (e.g., Free Will, Prayer, Suffering, Emunah). Topics
  are added as the curator defines them; no fixed list. Same multi-resource structure as
  Halacha.
- **Gemara** — organized by masechta (tractate), then perek (chapter), then daf (page).
  Unlike the other sections, each daf has a fixed pair of resources rather than an
  open-ended list: a link to the text on Sefaria, and one Daf Yomi shiur link. Masechtot are
  added one at a time as the curator populates them (Berachot is the first, fully
  populated: all 125 amudim across its 9 perakim).
- **Parsha** — organized by the 54 fixed weekly Torah portions (Bereishit → Vezot
  Haberacha). This list is pre-scaffolded in full at launch, even before resources exist
  for every parsha, since the list is fixed and known in advance. Same multi-resource
  structure as Halacha/Machshava.

Navigation: Section → Topic → list of resources (Gemara: Section → Masechta → daf grid). No
cross-section search or tagging in v1.

## 7. Content model

Each **topic** (within Halacha/Machshava/Parsha) has:

- `title` (string)
- `slug` (string, used for the URL)
- optional `description` (string)
- a list of **resources**

Each **resource** has:

| Field         | Type                                                              | Required | Notes                                   |
|---------------|--------------------------------------------------------------------|----------|------------------------------------------|
| `title`       | string                                                              | yes      | Display title of the resource            |
| `url`         | string (URL)                                                        | yes      | Link destination                         |
| `type`        | enum: `article`, `shiur`, `sefer-purchase`, `whatsapp-group`, `other` | yes    | Determines display icon/label            |
| `author`      | string                                                              | no       | Rav/author name, e.g. "R' Moshe Feinstein" |
| `language`    | enum: `english`, `hebrew`, `yiddish`, `mixed`                        | no       | Defaults to unspecified if omitted       |
| `format`      | enum: `audio`, `video`, `text`                                      | no       | Mainly relevant for `shiur` type         |
| `description` | string (short, 1–2 sentences)                                       | no       | Free-text summary                        |

No tags field in v1 (explicit non-goal — revisit only if browsing becomes unwieldy).

### Gemara content model (distinct from the above)

Gemara content is structured differently, since it's inherently enumerable (a masechta has
a fixed, known set of dapim) rather than open-ended like the other three sections. Each
**perek** (chapter) file has:

- `masechta` (string, e.g. "Berachot")
- `title` (string, e.g. "Perek 1: Me'eimatai")
- `order` (number — chapter order within the masechta)
- a list of **dapim**, each with: `daf` (e.g. "2a"), `sefariaUrl`, and a single `shiur`
  object (`title`, `url`, optional `author`) — always exactly one text link + one shiur
  link per daf, not an open-ended resource list.

## 8. Content storage & editing workflow

- Content lives in structured **YAML data files** in the repo (one file per topic, grouped
  by section directory — exact layout defined in CLAUDE.md).
- The curator edits these files directly in a code editor (or with Claude Code's help),
  commits, and pushes to GitHub.
- Astro's content collections read these files at build time and generate static pages —
  no runtime backend, no database.
- No in-browser admin UI in v1. (Possible v2: a lightweight local form that writes to the
  same YAML files, if hand-editing becomes tedious.)

## 9. Functional requirements

1. Visiting the site shows the three sections (Halacha, Machshava, Parsha).
2. Each section lists its topics (Parsha: all 54, pre-scaffolded; Halacha/Machshava: as
   defined by the curator).
3. Each topic page lists its resources, showing title, type, author (if present), language
   (if present), format (if present), and description (if present), each linking out to the
   `url`.
4. Topics or resources with no content yet render cleanly (no broken/empty-looking pages) —
   e.g., "No resources yet" state.
5. The site is fully static and publicly accessible with no login.

## 10. Non-functional requirements

- **Performance**: static-generated pages, fast load, no client-side data fetching.
- **Mobile-friendly**: readable and navigable on a phone (a rabbi likely checks this on the
  go).
- **Hebrew rendering**: any inline Hebrew text (terms, titles) must render correctly (proper
  font support) even though the overall layout stays LTR.
- **Resilience to link rot**: an automated check should catch dead links over time (see
  Quality below) since the site's core value is its links.

## 11. Tech stack

- **Framework**: Astro (static site generator, content collections backed by YAML files).
- **Content format**: YAML.
- **Hosting**: GitHub Pages, default `github.io` URL (no custom domain in v1).
- **Deployment**: GitHub Action that builds and deploys on push to the default branch.
- **Styling**: minimal/clean, typography-focused, neutral color palette. No heavy design
  system or component library needed.

## 12. Quality & CI

- CI must run `astro build` on every push/PR — a failed build blocks merge.
- A scheduled (e.g., weekly) or per-push CI job runs a link checker across all resource
  URLs and flags dead links (e.g., as a CI warning/report, or a filed issue) so link rot is
  caught rather than silently accumulating.
- No automated test suite beyond build + link-check — there's no complex application logic
  to warrant one in v1.

## 13. Repo & licensing

- Public GitHub repository, name: `torah_organizer`.
- MIT license.

## 14. Out of scope / future considerations (v2+)

These are explicitly deferred, not forgotten:

- Search (e.g., Pagefind/Fuse.js client-side search) once content volume makes browsing slow.
- Tagging system for cross-cutting filters (e.g., "beginner", "practical") once real content
  patterns emerge.
- Lightweight admin form for adding resources without hand-editing YAML.
- Full Hebrew/RTL mode or bilingual toggle.
- Custom domain.
- Content contribution/suggestion mechanism from readers (still curator-approved, not open
  editing).

## 15. Open questions / risks

- **Content sourcing**: the site launches with a near-empty scaffold; populating it with
  real, high-quality resources is an ongoing effort (likely assisted by Claude for research)
  and is the actual long-term bottleneck, not the software.
- **Link rot**: seforim-purchase and shiur links are prone to going stale (site
  redesigns, moved content); the CI link-checker mitigates but won't fully solve this.
- **Halacha/Machshava topic lists** are open-ended by design — no fixed taxonomy is defined
  here; the curator adds topics organically. If this leads to inconsistent or duplicate
  topics over time, a lightweight topic-naming convention may be worth revisiting.
