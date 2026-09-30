# vkovalkovska.work

Portfolio site for Viki Kovalkovska, product designer. Built to the spec in
[`resources/BUILD-SPEC.md`](resources/BUILD-SPEC.md) — a single 760px column, two
colour modes, and four case studies in a one-card-per-frame slider on the home page.

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

Four small scripts ship to the browser, all inlined into the HTML rather than
emitted as separate files — the build produces no client JS chunks:

| Script | Where | Runs on |
| :----- | :---- | :------ |
| Restore the stored mode before first paint | inline in `<head>`, `Base.astro` | every page |
| Mode toggle click handler | `SiteHeader.astro` | every page |
| Selected work slider (chevrons, drag, trackpad swipe) | `index.astro` | home only |
| Click-to-magnify lightbox | `CaseStudy.astro` | case studies |
| Cover preloader (no empty cover when opening a case) | `CoverPreload.astro` | home and case studies |

The lightbox script ships on every case page but no-ops where the markup has no
overlay. Every case has a cover now, so today it runs on all four. Nothing else
is interactive.

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

There is **no "work" nav link** — the header carries about, playlist and the mode
toggle, and the name goes to the top of `/`. A case's **"← back"** links to
`/?work=<slug>#selected-work`: the slider script reads the query and opens on
that case's card with no animation, and the fragment scrolls the Selected work
heading to the top of the viewport natively (as far as the page is tall enough
to scroll).

## Structure

```
src/
  content.config.ts          projects collection + Zod schema
  content/projects/          one .md per case study
  layouts/
    Base.astro               <head>, mode script, header, footer
    CaseStudy.astro          the whole case-study page
  components/
    SiteHeader.astro         name, nav, mode toggle (+ its client script)
    SiteFooter.astro         contact copy, email/LinkedIn, the © line
    Frame.astro              cover/screen placeholder ground
    CoverPreload.astro       warms every case cover after load
    Zoomable.astro           a real image, wrapped as a lightbox trigger
  data/
    playlist.ts              books + Goodreads search helper
    previous-work.ts         the About page ledger
  lib/
    site.ts                  title, description, email, LinkedIn, shared copy
    projects.ts              ordering + next-case cycling
    images.ts                shared srcset widths + sizes for column-wide images
  assets/<case>/             case imagery, emitted as a srcset at build time
  styles/global.css          modes, tokens, reset, every component style
public/fonts/                self-hosted Söhne woff2
resources/                   build spec + handoff (font downloads are gitignored)
```

`Base.astro` takes a required `page` prop — `"home" | "about" | "playlist" |
"case"` — and stamps it on `<body data-page="…">`. The spec gives each page its
own vertical rhythm, so that attribute is what the stylesheet keys those numbers
off. It also gates the `rise` enter
animation, which runs on the home `<main>` only.

## Adding or editing a project

Each case study is one Markdown file in `src/content/projects/`. The frontmatter
*is* the page; the Markdown body is ignored.

| Field              | Required | Notes                                                          |
| :----------------- | :------- | :------------------------------------------------------------- |
| `title`            | yes      | e.g. `"Verizon SideView"`                                       |
| `order`            | yes      | Index order **and** the next-case loop — not the date           |
| `tag`              | yes      | Mono line beside the name on the Selected work card             |
| `description`      | yes      | The summary on the case's Selected work card                    |
| `years`            | yes      | Display string, e.g. `"2020–21"`                                |
| `premise`          | yes      | The 20px line under the case title                              |
| `meta`             | yes      | Array of strings — role, dates, tools; separated by a 26px gap  |
| `summary`          | yes      | The Overview paragraph                                          |
| `details`          | yes      | Array of `{ label, body?, bullets? }` — one `<details>` each    |
| `metrics`          | no       | `{ value, label }` — the seam grid above the summary            |
| `pageFigure`       | no       | `{ caption, alt, src, title? }` — the sticky-caption split      |
| `figures`          | no       | `{ kicker, caption?, title?, stacked? }` plus `src` + `alt`, or `imgs: [{ src, alt }]` — the figure list |
| `screens`          | no       | `{ caption }` — one placeholder frame each                      |
| `cover`            | no       | Relative path to an image, e.g. `"../../assets/komoot/komoot-cover.webp"` |
| `coverAlt`         | no       | Describe what the interface *does*, not "screenshot of X"       |
| `coverRatio`       | no       | CSS aspect-ratio for the cover; defaults to `"5 / 3"`, Verizon uses `"16 / 9"` |
| `coverPlaceholder` | no       | Caption shown when there's no cover; defaults to `cover image`  |
| `draft`            | no       | Hidden in production builds, visible in `dev`                   |

Cases render in `order`, and the footer's "next" link cycles from the last back
to the first.

**A `details` body paragraph** is either a plain string or `{ text, note }`. The
`note` renders as its own `→ …` mono line under that paragraph — it is a field
rather than a phrase parsed back out of the prose, which is what the handoff
asked a real CMS to do.

**"Selected screens" has two shapes, chosen by the data.** Give a case `figures`
and it renders the figure layout: a list with each kicker — and caption, if the
figure has one — *above* its images. Captions are optional and currently all
commented out in the frontmatter.
Add a `pageFigure` too (komoot only) and the list is led by a caption that stays
pinned beside a full-length page shot. With no `figures` it falls back to the
4:3 placeholder grid built from `screens`. The `title` on a `pageFigure` or a
figure is carried but never rendered — both title lines were removed on purpose.

A figure holds one image (`src` + `alt`) or several (`imgs`) under a single
kicker and caption. Several sit side by side, dropping to one column on a phone,
unless `stacked: true` puts them in one column — Verizon's two phone sets do
that.

**Images** live in `src/assets/` and are imported through the schema's `image()`,
so Astro emits a srcset at build time. Two things to keep in mind: an animated
GIF must not go through `<Image>` (sharp flattens it to one frame — `Zoomable`
detects `format === "gif"` and passes the original through), and the lightbox
shows the full-resolution original rather than a srcset derivative.

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
- **Selected work is a one-card-per-frame slider.** ‹ › step to a neighbour with
  a 620ms ease-out slide; wrapping from the last card to the first (or back)
  fades out and in instead of sliding across every card. Cards drag with the
  pointer (touch or mouse, rubber-banded at either end, advancing on 18% of the
  width or a flick) and a horizontal trackpad swipe moves one card. None of
  those wrap, and a drag never opens a case. Only the visible card is reachable
  by Tab. Under `prefers-reduced-motion` every move is an instant jump and the
  cover zoom is off.
- **A card's hover** zooms its cover 3% and turns the name `--link`; "read case
  study →" has no hover of its own. Covers have no border.
- **Everything else hovers differently.** Playlist rows and `<details>`
  summaries turn their text and both rules `--link` with no fill; nav links and
  inline text links take a solid `--link` chip with `--hover-ink` text.
- Rows and `<details>` carry a **transparent top border plus `margin-top: -1px`**
  so a hovered element can light its own top rule with no layout shift, and
  adjacent rules collapse to 1px instead of doubling.
- **On mobile every card's meta lays out the same** — name and year on one row,
  then tag, summary at full width and the CTA. The wrappers flatten with
  `display: contents` onto one grid; a tag left inline beside a long name
  wrapped differently on each card.
- The **metrics grid** is a seam construction — the container's background shows
  through a 1px `gap` to draw the lines. Cells carry no border and must stay
  opaque, or the container floods them.
- **Image frames** use a 45° hatch at 4.5% neutral grey, which reads identically
  in both modes, and keep their 1px border — they are placeholders. Real case
  images carry no border at all.
- **Real case images are lightbox triggers.** One click opens; a click anywhere
  on the overlay or `Escape` closes. `←`/`→` (keys or the on-screen buttons)
  step through every image on the page in document order and wrap at both ends. The overlay itself scrolls, so a tall image
  can be read at full width. Its `<img>` is built in JS and never sits in the
  markup — an empty `src` there fired a failed request on every page load.
- **The figure split needs `minmax(0, …)` on both columns**, or the tall
  guide-page image's intrinsic width pushes the grid past the 760px column.
- `.page` is a `min-height: 100vh` flex column with `flex: 1 0 auto` and a 96px
  bottom padding on `main`, so the footer sits at the bottom of the viewport on
  short pages and scrolls away on long ones, never closer than 96px to the
  content (48px on home, which closes tighter). Deliberately no `justify-content` and no `margin-top: auto` on the
  footer — either loses that floor.
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
`→` arrows.

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

- **Two cases have no screens yet.** Every case has a real cover, but rove.me
  and PodGuides still show "screens are to be added soon!" above two labelled
  4:3 placeholder frames. Drop images into `src/assets/` and add `figures` to
  move a case onto the figure layout.
- **The komoot GIF ships as a GIF** (1.1 MB, lazy-loaded). The handoff suggested
  converting it to a muted looping `<video>` with a still poster and a
  `prefers-reduced-motion` fallback; that changes the markup away from the spec's
  figure template, so it hasn't been done.
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
