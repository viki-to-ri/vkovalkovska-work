# vkovalkovska.com

Portfolio site for Viki Kovalkovska, product designer. Built to the spec in
[`resources/HANDOFF.md`](resources/HANDOFF.md) — a single 760px column, three
colour modes, and four case studies behind a numbered index.

## Stack

- **Astro 5**, `output: 'static'` — every route prerenders at build time.
- **Content Collections** with a Zod schema for projects; Markdown frontmatter is
  the whole page, and the Markdown body goes unused.
- **Plain CSS** — one stylesheet, `src/styles/global.css`, tokens in `:root`.
  No Tailwind, no CSS-in-JS, no scoped component styles.
- **`astro:assets`** for images, `@astrojs/sitemap` for the sitemap.
- Deployed as a **Cloudflare Worker** serving static assets.

Two small scripts ship to the browser, both for the colour-mode toggle and both
inlined into the HTML rather than emitted as separate files: a blocking one in
`<head>` that restores the stored mode before first paint, and the click handler
in `SiteHeader.astro`. Nothing else is interactive.

**Node 22+ is required** — wrangler refuses to start below it.

## Commands

| Command             | Action                                                             |
| :------------------ | :----------------------------------------------------------------- |
| `npm install`       | Install dependencies                                                |
| `npm run dev`       | Dev server at `localhost:4321`                                      |
| `npm run build`     | Build to `./dist/`                                                  |
| `npm run preview`   | Build, then serve via `wrangler dev` (production-like)              |
| `npm run check`     | `astro build` + `tsc` + `wrangler deploy --dry-run` — the CI gate   |
| `npm run deploy`    | Publish to Cloudflare Workers                                       |
| `npm run cf-typegen`| Regenerate `worker-configuration.d.ts` from `wrangler.json`         |
| `npx wrangler tail` | Stream live logs from the deployed Worker                           |

There is no test suite and no linter. `npm run check` is the closest thing to CI.

## Routes

| Route           | Source                        |
| :-------------- | :---------------------------- |
| `/`             | `src/pages/index.astro`       |
| `/about`        | `src/pages/about.astro`       |
| `/playlist`     | `src/pages/playlist.astro`    |
| `/work/<slug>`  | `src/pages/work/[slug].astro` |
| `/404`          | `src/pages/404.astro`         |

Slugs come from the Markdown filename: `roveme.md` → `/work/roveme/`. The spec
fixes these at `komoot`, `verizon`, `roveme` and `podguides`, so renaming a file
changes a published URL.

## Structure

```
src/
  content.config.ts          projects collection + Zod schema
  content/projects/          one .md per case study
    covers/                  3:2 WebP covers, currently unreferenced
  layouts/
    Base.astro               <head>, mode script, header, contact + footer
    CaseStudy.astro          the whole case-study page
  components/
    SiteHeader.astro         name, nav, mode toggle (+ its client script)
    SiteFooter.astro         the © line
    ContactBlock.astro       closing copy + email/LinkedIn
    WorkRow.astro            one numbered row on the home index
    Frame.astro              cover/screen image or placeholder ground
  data/
    playlist.ts              books + Goodreads search helper
    previous-work.ts         the About page ledger
  lib/
    site.ts                  title, description, email, LinkedIn, shared copy
    projects.ts              ordering + next-case cycling
  styles/global.css          modes, tokens, reset, every component style
public/fonts/                self-hosted Söhne woff2
resources/                   handoff specs (font downloads are gitignored)
```

## Adding or editing a project

Each case study is one Markdown file in `src/content/projects/`. The frontmatter
*is* the page; the Markdown body is ignored.

| Field              | Required | Notes                                                          |
| :----------------- | :------- | :------------------------------------------------------------- |
| `title`            | yes      | e.g. `"Verizon Sideview"`                                       |
| `order`            | yes      | Index order **and** the next-case loop — not the date           |
| `tag`              | yes      | Mono line beside the title on the index row                     |
| `description`      | yes      | The one outcome-line on the index row                           |
| `years`            | yes      | Display string, e.g. `"2020–21"`                                |
| `premise`          | yes      | The 20px line under the case title                              |
| `meta`             | yes      | Array of strings — role, dates, tools; rendered dot-separated   |
| `summary`          | yes      | The Overview paragraph                                          |
| `details`          | yes      | Array of `{ label, body?, bullets? }` — one `<details>` each    |
| `metrics`          | no       | `{ value, label }` — the seam grid above the summary            |
| `screens`          | no       | `{ caption }` — one placeholder frame each                      |
| `cover`            | no       | Relative path, e.g. `"./covers/roveme.webp"`                    |
| `coverAlt`         | no       | Describe what the interface *does*, not "screenshot of X"       |
| `coverPlaceholder` | no       | Caption shown when there's no cover; defaults to `cover image`  |
| `draft`            | no       | Hidden in production builds, visible in `dev`                   |

Cases render in `order`, and the footer's "next" link cycles from the last back
to the first.

## Colour modes

Three modes cycle from one header button — **cold day** (default) → **cool
night** → **blue day** — persisted to `localStorage` under `vk-portfolio-mode`.

Each mode is a block of custom properties on `:root[data-mode="…"]`: `--bg`,
`--ink`, `--dim`, `--faint`, `--line`, `--frame`, `--dot`, `--link`,
`--hover-tint`, `--hover-ink`. Nothing hard-codes a hex, so a new mode is one
more block and one more entry in the `MODES` array in `SiteHeader.astro`.

Cold day and cool night keep neutral grey text with blue reserved for links.
Blue day pulls *every* text tone into the accent, which flattens the hierarchy —
so previous-work project names take their weight back through size in that mode
only, via `:root[data-mode="blue-day"] .ledger-name`.

## Design notes

- Border radius is `0` everywhere. No shadows, no gradients.
- **Row hover** (work rows, playlist rows, `<details>` summaries) turns the text
  and the row's top and bottom rules to `--link`, with no background fill. Rows
  overlap by `-1px` and lift on `z-index` so a hovered rule never doubles.
- **Nav and text-link hover** is the opposite: a solid `--link` fill with
  `--hover-ink` text, square corners.
- The **metrics grid** is a seam construction — the container's background shows
  through a 1px `gap` to draw the lines. Cells carry no border and must stay
  opaque, or the container floods them.
- `.page` is a `min-height: 100vh` flex column with `flex: 1 0 auto` on `main`,
  so the contact block and footer sit together at the bottom. Deliberately no
  `justify-content` and no `margin-top: auto` on the footer — either inflates the
  gap above it.
- Body copy and the contact paragraph share one `--measure` (578px) so their
  right edges line up despite different type sizes.
- All transitions collapse under `prefers-reduced-motion`.

## Fonts

Söhne and Söhne Mono, self-hosted as woff2 in `public/fonts/`.

**These are Klim's *test* cuts.** Per Klim's own readme they carry a limited
character set — `A–Z a–z 0–9 . , -` — and no OpenType features. Everything else
falls back per glyph to `system-ui` / `ui-monospace`: apostrophes, `·`, `×`, `–`,
`%`, `()`, `/`, `©`, and the arrows. That mismatch is most visible in the small
mono labels, where the `·` separators come from a different face.

Licensed retail cuts fix it with no code change — drop them into `public/fonts/`
under these five names:

| Klim cut         | Filename                | Used for                    |
| :--------------- | :---------------------- | :-------------------------- |
| Söhne Buch       | `sohne-400.woff2`       | body text                   |
| Söhne Kräftig    | `sohne-500.woff2`       | row titles                  |
| Söhne Halbfett   | `sohne-600.woff2`       | loaded, currently unused    |
| Söhne Mono Buch  | `sohne-mono-400.woff2`  | labels, nav, metadata       |
| Söhne Mono Kräftig | `sohne-mono-500.woff2` | loaded, currently unused    |

A Klim commercial licence is required for public use beyond personal testing.
The trial download itself is gitignored rather than committed.

## Known gaps

- **Case imagery is all placeholders** — four 16:9 covers and eight 4:3 screens
  render as captioned frames. The `.webp` covers in `content/projects/covers/`
  are still in the repo but no longer referenced.
- **Fonts** — see above; the licence is the blocker for going public.
- The 600px breakpoint was written to spec but not verified on real devices.

## Deploying

```bash
npm run check     # build + types + deploy dry-run
npm run deploy
```

`astro.config.mjs` sets `site: "https://vkovalkovska.com"`, which drives
canonical URLs and the sitemap — update it if the domain changes.
