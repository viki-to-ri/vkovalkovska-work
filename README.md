# vkovalkovska.com

Portfolio site for Viki Kovalkovska, product designer. Built to the contract in
[`resources/portfolio-build-spec.md`](resources/portfolio-build-spec.md) — home is a compact
hover-reveal index, case studies are a two-column ledger.

## Stack

- **Astro 5**, `output: 'static'` — every route prerenders, **zero client-side JS**.
- **Content Collections** with a Zod schema for projects; Markdown frontmatter is the source of truth.
- **Plain CSS** — design tokens in `src/styles/global.css` plus scoped `<style>` blocks per
  component. No Tailwind, no CSS-in-JS.
- **`astro:assets`** for every image, `@astrojs/sitemap` for the sitemap.
- Deployed as a **Cloudflare Worker** serving static assets.

**Node 22+ is required** (wrangler refuses to start below it). This repo uses Volta, so
`volta install node@22` is enough.

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
| `/work/<slug>`  | `src/pages/work/[slug].astro` |
| `/404`          | `src/pages/404.astro`         |

Slugs come from the Markdown filename: `rove-me.md` → `/work/rove-me/`.

## Structure

```
src/
  content.config.ts          projects collection + Zod schema
  content/projects/          one .md per case study
    covers/                  cropped 3:2 WebP covers
  layouts/
    Base.astro               <head>, skip link, footer
    CaseStudy.astro          the whole case-study page
  components/
    SiteHeader / SiteFooter / AsciiMark
    WorkIndex / WorkRow      the home index and its hover reveal
    MetaStrip / BigFigures / LedgerRow / NextProject
  lib/
    site.ts                  title, description, email, LinkedIn
    projects.ts              ordering + next-project cycling
    inline.ts                **bold** / [links] for ledger bodies
  styles/global.css          tokens, reset, base type, motion
public/fonts/                self-hosted woff2
resources/                   build spec + original cover art
```

## Adding or editing a project

Each case study is one Markdown file in `src/content/projects/`. The frontmatter *is* the page —
the Markdown body is optional and only needed for a project that wants more than the ledger.

| Field        | Required | Notes                                                              |
| :----------- | :------- | :----------------------------------------------------------------- |
| `title`      | yes      | e.g. `"Verizon Sideview"`                                           |
| `order`      | yes      | Controls index order **and** next-project cycling — not the date    |
| `year`       | yes      | Display string, e.g. `"2020–21"`                                    |
| `subline`    | yes      | One line for the index row, max 70 chars                            |
| `standfirst` | yes      | 1–2 sentences under the case-study title                            |
| `role`       | yes      | Meta strip                                                          |
| `when`       | yes      | Meta strip, e.g. `"Sep 2020 – May 2021"`                            |
| `tools`      | yes      | Meta strip                                                          |
| `ledger`     | yes      | Array of `{ label, body, highlight? }` — the body of the page       |
| `cover`      | no       | Relative path, e.g. `"./covers/roveme.webp"`                        |
| `coverAlt`   | no       | Describe what the interface *does*, not "screenshot of X"           |
| `figures`    | no       | Up to 3 `{ value, caption }` — big blue metrics under the cover     |
| `links`      | no       | `{ label, href }`, rendered inside the OUTCOME field                |
| `gated`      | no       | NDA'd: row becomes a prefilled `mailto:`, year reads `On request`   |
| `draft`      | no       | Hidden in production builds, visible in `dev`                       |

### The ledger

The label column carries the structure so the copy can stay prose. Labels are short and human —
`CONTEXT`, `GOAL`, `WHAT I DID`, `HARD PART`, `OUTCOME`. Exactly one entry sets `highlight: true`
(the last one, `OUTCOME`); it gets the lilac field and carries the external links.

Bodies accept `**bold**` and `[text](https://…)`, rendered at build time by `lib/inline.ts`.
Lists inside a body are set as prose separated by `·`, not as bullets.

Every project must be reachable and honest: if it has no visuals yet, mark it `draft` rather than
shipping a placeholder.

## Covers

3:2, ideally ≥1600px wide, exported as WebP into `src/content/projects/covers/`. Crop **into real
interface detail** — no floating device mockups on gradient fills. If the only asset is a marketing
mockup, crop hard so the frame reads as a screen, not a product shot. Original art is kept in
`resources/` for re-cropping.

Covers are eagerly loaded and drive both the index hover reveal (190px) and the case-study cover
band (16:7). Everything degrades cleanly when `cover` is absent.

## Design system

Tokens live in `:root` in `global.css`; nothing hard-codes a hex or a font name.

- Border radius is `0` everywhere. No box-shadows, no gradients — depth comes from 2px rules.
- Everything is flush left.
- `--paper` ground and `--ink` type are ~90% of every page. `--blue` is reserved for the mark, row
  numbers, ledger labels, big figures, the contact link, and focus rings. `--lilac` appears at most
  twice per page: the index row hover fill and the OUTCOME field.
- Rules never stack — a `border-bottom` and a `border-top` meeting would render 4px.

Three motion moves, all suppressed under `prefers-reduced-motion`: the mark blinks, the index rows
reveal their cover on hover **and keyboard focus**, and the page does one staggered load-in.

Typography is **Space Grotesk + Space Mono**, self-hosted from `public/fonts/`. These stand in for
the licensed **Pitch Sans / Pitch**; the token fallback stacks already name Pitch first, so dropping
in the licensed woff2 files needs no layout retuning.

## Deviations from the build spec

Documented here and in code comments so they don't read as mistakes:

- **Small-label colour.** Spec §5–§6 assign `--ink-45` / `--ink-35` to labels, which measure 3.07:1
  and 2.3:1 on `--paper` — below WCAG AA, and irreconcilable with the "100 accessibility" line in
  §10. Resolved toward §10 behind one token, `--ink-label`; set it back to `var(--ink-45)` to
  restore the lighter tone.
- **Hover reveal offset.** Spec §5 gives `right: 96px`, but at the resolved `--gutter` the year
  column reaches ~111px in, so the cover sat on top of the year. Uses `132px`.
- **Deploy target.** Spec §1 names Netlify/Vercel; this repo stays on Cloudflare Workers, which is
  what `wrangler.json` and the npm scripts are built around. Output is fully static either way.
- **Years.** Taken from the real project dates rather than the §4 table, which disagreed with the
  source site on komoot, rove.me, and PodGuides.

## Deploying

```bash
npm run check     # build + types + deploy dry-run
npm run deploy
```

`astro.config.mjs` sets `site: "https://vkovalkovska.com"`, which drives canonical URLs and the
sitemap — update it if the domain changes.
