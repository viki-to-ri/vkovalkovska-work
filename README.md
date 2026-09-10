# vkovalkovska.work

Portfolio site for Viki Kovalkovska, product designer. Built to the spec in
[`resources/BUILD-SPEC.md`](resources/BUILD-SPEC.md) — a single 760px column, two
colour modes, and four case studies behind an unnumbered index.

`BUILD-SPEC.md` governs *how it looks and behaves* and supersedes the design half
of [`resources/HANDOFF.md`](resources/HANDOFF.md); HANDOFF is still the source
for *content* — bios, case copy, the book list. Where they disagree on design,
BUILD-SPEC wins, and its §8 lists what was tried and deliberately reverted.

## Stack

- **Astro 5**, `output: 'static'` — every route prerenders at build time.
- **Content Collections** with a Zod schema for projects; Markdown frontmatter is
  the whole page, and the Markdown body goes unused.
- **Plain CSS** — one stylesheet, `src/styles/global.css`, tokens in `:root`.
  No Tailwind, no CSS-in-JS, no scoped component styles.
- **`astro:assets`** for images, `@astrojs/sitemap` for the sitemap.
- Deployed as a **Cloudflare Worker** serving static assets.

Three small scripts ship to the browser, all inlined into the HTML rather than
emitted as separate files — the build produces no client JS chunks:

| Script | Where | Runs on |
| :----- | :---- | :------ |
| Restore the stored mode before first paint | inline in `<head>`, `Base.astro` | every page |
| Mode toggle click handler | `SiteHeader.astro` | every page |
| Scroll-driven active row (touch stand-in for hover) | `index.astro` | home only |

Nothing else is interactive.

**Node 22+ is required** — wrangler refuses to start below it.

## Commands

| Command             | Action                                                             |
| :------------------ | :----------------------------------------------------------------- |
| `npm install`       | Install dependencies                                                |
| `npm run dev`       | Dev server at `localhost:4321`                                      |
| `npm run build`     | Build to `./dist/`                                                  |
| `npm run preview`   | Build, then serve via `wrangler dev` (production-like)              |
| `npm run check`     | `astro build` + `tsc` + `wrangler deploy --dry-run` — the CI gate   |
| `npm run deploy`    | Manual publish — **see Deploying; normally you don't want this**    |
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

The **"work" nav link is not a plain page link**: it points at
`/#selected-work`, so it lands on the home page scrolled with the Selected work
heading flush at the top of the viewport. That is a plain fragment, handled
natively — there is no scroll script. The name/logo link goes to `/` instead.

## Structure

```
src/
  content.config.ts          projects collection + Zod schema
  content/projects/          one .md per case study
  layouts/
    Base.astro               <head>, mode script, header, contact + footer
    CaseStudy.astro          the whole case-study page
  components/
    SiteHeader.astro         name, nav, mode toggle (+ its client script)
    SiteFooter.astro         the © line
    ContactBlock.astro       closing copy + email/LinkedIn
    WorkRow.astro            one row on the home index
    Frame.astro              cover/screen image or placeholder ground
  data/
    playlist.ts              books + Goodreads search helper
    previous-work.ts         the About page ledger
  lib/
    site.ts                  title, description, email, LinkedIn, shared copy
    projects.ts              ordering + next-case cycling
  styles/global.css          modes, tokens, reset, every component style
public/fonts/                self-hosted Söhne woff2
resources/                   build spec + handoff (font downloads are gitignored)
```

`Base.astro` takes a required `page` prop — `"home" | "about" | "playlist" |
"case"` — and stamps it on `<body data-page="…">`. The spec gives each page its
own vertical rhythm and its own gap above the contact block, so that attribute is
what the stylesheet keys those numbers off. It also gates the `rise` enter
animation, which runs on the home `<main>` only.

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
| `meta`             | yes      | Array of strings — role, dates, tools; separated by a 26px gap  |
| `summary`          | yes      | The Overview paragraph                                          |
| `details`          | yes      | Array of `{ label, body?, bullets? }` — one `<details>` each    |
| `metrics`          | no       | `{ value, label }` — the seam grid above the summary            |
| `screens`          | no       | `{ caption }` — one placeholder frame each                      |
| `cover`            | no       | Relative path to a 16:9 image, e.g. `"./covers/roveme.webp"`    |
| `coverAlt`         | no       | Describe what the interface *does*, not "screenshot of X"       |
| `coverPlaceholder` | no       | Caption shown when there's no cover; defaults to `cover image`  |
| `draft`            | no       | Hidden in production builds, visible in `dev`                   |

Cases render in `order`, and the footer's "next" link cycles from the last back
to the first.

## Colour modes

Two modes, toggled from one header button — **blue day** (default) and **cool
night** — persisted to `localStorage` under `vk-portfolio-mode`. An earlier third
mode, "cold day", was removed; don't reintroduce it.

Each mode is a block of custom properties on `:root[data-mode="…"]`: `--bg`,
`--ink`, `--dim`, `--faint`, `--line`, `--frame`, `--accent`, `--dot`, `--link`,
`--hover-tint`, `--hover-ink`. Nothing hard-codes a hex. (`--accent` and
`--hover-tint` are part of the documented palette but nothing reads them yet.)

**Both modes deliberately flatten their text tones to a single value.** Blue day
is monochrome-blue — `ink`, `dim`, `faint`, `accent`, `dot` and `link` are all
`#1B5AB0`; cool night collapses `ink`/`dim`/`faint` to one cool near-white and
reserves the lighter `#8FBEEF` for links, the availability dot and hover fills.
Hierarchy comes from size, weight and font family only. Tonal hierarchy — three
shades of blue for secondary text — was tried and rejected, so a "lighter blue
for captions" change is a revert, not an improvement.

The button is a **switcher, not an indicator**: it shows the icon of the mode you
will *get* (moon in day, sun in night), and its `aria-label`/`title` say so.

## Design notes

- Border radius is `0` everywhere. No shadows, no gradients.
- **Selected-work rows invert on hover**: solid `--link` fill, every descendant
  flipped to `--hover-ink`. They bleed `20px` past the column on both sides so
  the fill has padding around the text; the wrapper carries the mirrored margin
  and padding so its `border-top` spans exactly the width of the rows' rules.
- **Everything else hovers the other way.** Playlist rows and `<details>`
  summaries turn their text and both rules `--link` with no fill; nav links and
  inline text links take a solid `--link` chip with `--hover-ink` text.
- Rows and `<details>` carry a **transparent top border plus `margin-top: -1px`**
  so a hovered element can light its own top rule with no layout shift, and
  adjacent rules collapse to 1px instead of doubling.
- **Touch has no hover**, so at ≤600px the home page marks the row nearest the
  top third of the viewport with `data-row-active`, which triggers the same
  inversion. Exactly one row is ever active — an IntersectionObserver band lit
  several at once and was replaced by nearest-to-target. The bottom-of-page
  clause is required, or the last row can never reach the line.
- The **metrics grid** is a seam construction — the container's background shows
  through a 1px `gap` to draw the lines. Cells carry no border and must stay
  opaque, or the container floods them.
- **Image frames** use a 45° hatch at 4.5% neutral grey, which reads identically
  in both modes and is simply covered up once a real image lands.
- `.page` is a `min-height: 100vh` flex column with `flex: 1 0 auto` on `main`,
  so the contact block and footer sit together at the bottom. Deliberately no
  `justify-content` and no `margin-top: auto` on the footer — either inflates the
  gap above it.
- Body copy and the contact paragraph share one `--measure` (578px) so their
  right edges line up despite different type sizes.
- Mono letter-spacing is **not** global. Only the uppercase section labels
  (`0.06em`), the header (`0.01em`) and the mobile previous-work years (`0.04em`)
  track at all.
- All transitions collapse under `prefers-reduced-motion`.

Odd-looking numbers in the stylesheet — `12.5px`, `15.5px`, `16.5px`, `11.5px`,
`0.06em` — are extracted from the prototype and intentional. Don't round them.

## Fonts

Söhne and Söhne Mono, self-hosted as woff2 in `public/fonts/`.

**These are Klim's *test* cuts.** Per Klim's own readme they carry a limited
character set — `A–Z a–z 0–9 . , -` — and no OpenType features. Everything else
falls back per glyph to `system-ui` / `ui-monospace`: apostrophes, `·`, `×`, `–`,
`%`, `()`, `/`, `©`, and the arrows. That mismatch is most visible in the small
mono labels, where the `·` separators come from a different face, and in the
index rows' `➔` (U+2794), which renders lighter than intended.

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
  render as captioned frames. No cover images are in the repo: the earlier 3:2
  `.webp` set was removed, since it didn't match the 16:9 frames and is being
  redone. Drop new ones into `src/content/projects/covers/` and set `cover:` in
  each project's frontmatter; the schema and `Frame.astro` already support it.
- **Screen captions render twice** — once inside the frame as its placeholder
  text, once as the `<figcaption>` below it. The spec doesn't say which should
  go.
- **Fonts** — see above; the licence is the blocker for going public.
- The 600px breakpoint was verified in a browser at 390px and 1440px, but not on
  real hardware.

## Deploying

**Pushing to `main` deploys.** Cloudflare Workers Builds is connected to this
repo from the Cloudflare dashboard, so a push builds and publishes on its own.
There is no workflow file in the tree — nothing here will tell you that; check
**Workers & Pages → vkovalkovska-work → Deployments** to see a build.

So the normal flow is just:

```bash
npm run check     # build + types + deploy dry-run
git push origin main
```

`npm run deploy` still works, but **avoid mixing it in**: it uploads whatever is
in your local `dist/`, which can leave the live Worker out of step with the
commit the dashboard believes is deployed. Pick one path and let the push be it.

`astro.config.mjs` sets `site: "https://vkovalkovska.work"`, which drives
canonical URLs, `og:url` and the sitemap — update it if the domain changes.
