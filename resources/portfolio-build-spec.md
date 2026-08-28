# Build spec — vkovalkovska.com (Astro)

Portfolio for Viki Kovalkovska, product designer. Audience: hiring managers and design
managers, scanning for 20–60 seconds before deciding to read.

Approved directions: **home = compact index (1a)**, **case study = two-column ledger (1e)**.
Everything below is the contract. Where this document is silent, prefer the simpler option.

---

## 1. Stack

- Astro 5, static output (`output: 'static'`), no UI framework needed — zero client JS islands.
- Content Collections (`src/content/`) with a Zod schema for projects. Markdown bodies.
- Styling: one global CSS file with custom properties + per-component `<style>` blocks in
  `.astro` files. No Tailwind, no CSS-in-JS.
- `@astrojs/sitemap`. `astro:assets` (`<Image />`) for every project image.
- Deploy target: Netlify or Vercel static. No server runtime.

```
src/
  content/
    config.ts
    projects/
      komoot.md
      verizon-sideview.md
      rove-me.md
      podguides.md
  components/
    SiteHeader.astro
    SiteFooter.astro
    WorkIndex.astro        # the 1a hover-reveal list
    WorkRow.astro
    LedgerRow.astro        # the 1e metadata/narrative row
    MetaStrip.astro        # role / when / tools
    NextProject.astro
  layouts/
    Base.astro
    CaseStudy.astro
  pages/
    index.astro
    about.astro
    work/[slug].astro
    404.astro
  styles/
    global.css
public/
  fonts/                   # licensed Pitch Sans woff2 — see §3
  images/
```

---

## 2. Design tokens

Put these in `:root` in `global.css`. Nothing in the site hard-codes a hex or a font name.

```css
:root {
  /* palette */
  --ink:        #0E0E10;
  --paper:      #FCFCFA;
  --blue:       #1B4EF5;   /* primary accent */
  --blue-mid:   #3874FF;
  --blue-light: #5996FF;   /* accents on dark grounds only */
  --lilac:      #F4CEFF;   /* highlight fields, hover row fill */

  --ink-60: rgba(14,14,16,.60);
  --ink-45: rgba(14,14,16,.45);
  --ink-35: rgba(14,14,16,.35);
  --ink-14: rgba(14,14,16,.14);

  /* type */
  --font-sans: 'Pitch Sans', 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'Pitch', 'Space Mono', ui-monospace, monospace;

  /* rules — the structural device of the whole site */
  --rule:      2px solid var(--ink);
  --rule-hair: 1px solid var(--ink-14);

  /* rhythm */
  --gutter: clamp(20px, 5vw, 56px);
  --measure: 34em;         /* max line length for body copy */
  --page-max: 1080px;

  --ease: cubic-bezier(.2,.8,.2,1);
}
```

**Hard rules.**
- Border radius is `0` everywhere. No exceptions, including images and buttons.
- No box-shadows. No gradients. Depth comes from 2px rules and flat color fields.
- Everything flush left. Never center a heading, a paragraph, or a button label.
- Ground is `--paper` (near-white). Blue arrives in a few decisive places only:
  the ASCII mark, row numbers, the contact link, one full-field footer or highlight.
  Do **not** tint the page background.

---

## 3. Typography

Primary: **Pitch Sans** (Klim Type Foundry, https://klim.co.nz/collections/pitch/) — a web
licence must be purchased. Self-host from `public/fonts/` as woff2, `font-display: swap`.
Weights needed: **Light 300, Regular 400, Medium 500**. Do not fake weights.

Secondary: **Pitch** (the mono companion) for labels, numbers, years, kickers. If only one
licence is bought, buy Pitch Sans and use `ui-monospace` for the label role.

Until the licence lands, ship with **Space Grotesk** (300/400/500) + **Space Mono** as the
fallback stack above — the metrics are close enough that no layout retuning is needed.

### Scale

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Intro statement (home) | `clamp(24px, 3.4vw, 34px)` | 300 | line-height 1.3, `text-wrap: pretty`, max 15em |
| Case study title | `clamp(34px, 6vw, 56px)` | 300 | line-height 1.08 |
| Case study standfirst | `clamp(16px, 2vw, 19px)` | 300 | line-height 1.5, max 24em |
| Project name (row) | `clamp(18px, 2.2vw, 22px)` | 500 | line-height 1.2 |
| Body / ledger copy | `15px` | 300 | line-height 1.6 |
| Row subline | `13px` | 300 | line-height 1.5, `--ink-60` |
| Label / kicker | `10–11px` mono | 400 | `letter-spacing: .12em`, uppercase |
| Year, number | `11px` mono | 400 | tabular figures (`font-variant-numeric: tabular-nums`) |

Body copy never uses `--blue` at paragraph size — contrast is insufficient. Blue is for
display-size type, rules, and small mono labels only.

---

## 4. Content model

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),                 // "Verizon Sideview"
    order: z.number(),                 // 1..n — controls index order, not date
    year: z.string(),                  // "2023" or "2020–21" (display string)
    subline: z.string(),               // one line for the index row, ≤ 70 chars
    standfirst: z.string(),            // 1–2 sentences at the top of the case study
    cover: image(),                    // 3:2, min 1600px wide
    role: z.string(),                  // "Sole product designer"
    when: z.string(),                  // "Sep 2020 – May 2021"
    tools: z.string(),                 // "Sketch, InVision"
    ledger: z.array(z.object({         // the 1e rows, in order
      label: z.string(),               // "CONTEXT", "GOAL", "WHAT I DID", ...
      body: z.string(),                // markdown-lite: **bold**, links
      highlight: z.boolean().optional()// true = lilac field (use once, on OUTCOME)
    })),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    gated: z.boolean().default(false), // NDA'd — see §7
    draft: z.boolean().default(false),
  })
});

export const collections = { projects };
```

Index order and next/previous navigation both derive from `order`. Filter `draft` in prod.

### Copy to carry over verbatim

Intro: *"Hi! I am Viki, a product designer with engineering background and visual
sensibility."* / *"Generalist problem solver, for 6+ years I design products which work for
users and the business."* — the home page may compress these into one sentence, but do not
invent new claims.

Contact: *"Interested to work together? Reach out."*

The four projects and their sublines:

| # | Title | Year | Subline |
| --- | --- | --- | --- |
| 01 | komoot | 2023 | Growth · signup ↑1.96× · activation ↑2.04× |
| 02 | Verizon Sideview | 2021 | 0→1 · shipped to four platforms |
| 03 | rove.me | 2022 | Sole designer · visitors ↑23% · bookings ↑14% |
| 04 | iHeartMedia PodGuides | 2020 | 0→1 concept · travel discovery via podcasts |

The outcome numbers are the most persuasive content on the site. They belong in the index
subline and again as large display figures inside the case study — never buried in a paragraph.

---

## 5. Home page (direction 1a)

Single screen on a 1440×900 display, no scrolling required to see all four projects.
Max width `--page-max`, centered container, content flush left inside it.

**Order of blocks**

1. **Header** — ASCII mark left (`(-˘‿˘-)`, mono, `--blue`), nav right: `About · LinkedIn · Email`.
   Bottom border `--rule`. Padding `26px --gutter`.
2. **Intro** — 56px top padding. The statement at Intro size, then one supporting line at
   14px/`--ink-60`, max 30em, mentioning the personal side in a single clause:
   *"Off the screen: contemplative practice, yoga, contact improvisation."* That is the only
   place personal material appears outside `/about`.
3. **Section label row** — `SELECTED WORK` mono label left, count (`04`) right, `--ink-45`.
4. **Work index** — see below.
5. **Contact + footer** — one line: `Interested to work together?` + `Reach out` in `--blue`
   with a 2px blue bottom border. `© 2026` mono right, `--ink-35`.

### Work index rows

Each row is an `<a>` filling the row, `display: grid; grid-template-columns: 26px 1fr auto;
gap: 16px; align-items: baseline; padding: 18px var(--gutter);` with `border-top: var(--rule)`;
the last row also gets `border-bottom`.

- Col 1: two-digit number, mono, `--blue`, tabular.
- Col 2: project name (500) + subline (300, `--ink-60`, 4px above).
- Col 3: year, mono, `--ink-45`.

**Hover / focus-visible state** (identical for both):
- Row background → `--lilac`, `transition: background .18s`.
- The project cover fades and scales in, absolutely positioned inside the row:
  `right: 96px; top: 50%; transform: translateY(-50%) scale(.94) → scale(1);`
  `width: 190px; border: var(--rule); opacity: 0 → 1;`
  `transition: all .22s var(--ease); pointer-events: none;`
- Covers are eagerly loaded at 380px wide (2×) so the reveal never flashes empty. Four small
  images is a trivial payload; do not lazy-load them.

**Constraints**
- Below 720px: drop the hover reveal entirely and show the cover inline under each row at full
  width (`border: var(--rule)`, 3:2 crop), rows stacked. Number and year sit on one mono line
  above the name.
- `@media (prefers-reduced-motion: reduce)` — no scale, no fade; the cover appears instantly on
  hover, or is simply omitted. Row background change stays.
- Keyboard: rows are real links in DOM order, `:focus-visible { outline: 2px solid var(--blue);
  outline-offset: 2px; }`. The hover reveal must also trigger on `:focus-visible` so keyboard
  users get the same information.

### Whimsy budget

Three moves only. Anything beyond this is over budget.

1. **The ASCII mark blinks.** `@keyframes blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)} }`
   on a `5.5s infinite` loop, `display:inline-block`, `transform-origin: center`. Suppressed
   under `prefers-reduced-motion`. This is the whole personality and it should never be removed.
2. **The hover cover reveal** on the index rows (above).
3. **One page-load reveal** — header, intro, then rows staggered 40ms apart:
   `opacity 0 → 1, translateY(6px) → 0`, 400ms, `--ease`. CSS-only (`animation-delay` per
   `nth-child`), no JS, no scroll observers. Runs once. Suppressed under reduced motion.

---

## 6. Case study page (direction 1e)

Route `src/pages/work/[slug].astro` → `CaseStudy.astro`. Max width `700–760px` content column
inside `--page-max`; the cover image may run to the container edge.

**Order of blocks**

1. **Header** — `← Work` (mono, `--blue`) left, ASCII mark right, `--rule` bottom.
2. **Title block** — mono kicker `NN — CLIENT` in `--blue`; title at Case study title size,
   weight 300; standfirst at 300, max 24em, `text-wrap: pretty`. Padding `44px --gutter 28px`.
3. **Cover** — full container width, `border-top: var(--rule)`, `aspect-ratio: 16/7`,
   `object-fit: cover`.
4. **Meta strip** — three equal cells (`Role / When / Tools`) as a 3-column grid with 2px `--ink`
   gaps showing through as rules. Each cell: mono 9.5px label `--ink-45`, then 13px value.
   Below 640px it becomes a single column with hairline rules.
5. **Ledger** — the core. Each entry is `display: grid; grid-template-columns: 130px 1fr;
   gap: 24px; padding: 22px --gutter;` separated by `--rule-hair`.
   - Left: mono 10.5px, `letter-spacing: .08em`, `--blue`, uppercase — the label.
   - Right: 14.5px/1.6, weight 300, `--ink`.
   - Exactly one entry (`OUTCOME`) has `background: var(--lilac)`; it is the last one and it
     carries the external links inline.
   - Below 720px the grid collapses to one column; the label sits above its body with 10px gap.
   - Labels are short and human: `CONTEXT`, `GOAL`, `WHAT I DID`, `HARD PART`, `OUTCOME`. Do
     **not** restore the old `My Role / Challenges / Process` six-heading structure — the point
     of this layout is that the label column carries the structure so the copy can be prose.
   - Long lists inside a ledger body are set as prose separated by `·`, not as bullet lists.
     If a body genuinely needs bullets, use a `<ul>` with no markers and `--ink` text, 6px gaps.
6. **Big-figure row** (only where the project has metrics) — insert directly after the cover,
   before the meta strip: 2–3 figures at `clamp(26px,4vw,34px)` weight 500 in `--blue`, each
   with a mono 10px uppercase caption below in `--ink-45`, laid out `display:flex; gap:34px`.
   komoot and rove.me get this; Sideview and PodGuides do not.
7. **Next project** — `--rule` top, `NEXT` mono label, next title at 20px/500 with a `→`, and a
   130px-wide cover thumbnail with `border: var(--rule)` on the right. Wraps to two rows below
   560px. Cycles: last project links to the first.

### Body content in the Markdown file

The `ledger` frontmatter array is the whole page for a short case study, which is the default.
The Markdown **body** is optional and appends below the ledger, above Next project, as a
`--measure`-wide prose block for the rare project that needs more: additional images
(`<Image />`, full content width, `border: var(--rule)`, 24px vertical gaps, optional mono
caption below at 11px `--ink-45`), or a short "what I'd do differently" note.

Never ship the string "Design are coming soon…". If a project has no visuals yet, it is `draft`.

---

## 7. About, contact, gated work

**`/about`** — same header and footer. One column at `--measure`. Contents in order:
professional paragraph (engineering background → design), then a rule, then the personal
section: contemplative practice, yoga, contact improvisation, and what those give the work
(attention, timing, working with other people's weight). Keep it to ~150 words and specific;
no philosophy. Optionally one grayscale photograph, full column width, `border: var(--rule)`.
Then a short `NOW` block (mono label + 2 lines) that's cheap to keep current, and contact links.

**Contact** — no form, no contact page. `mailto:` and LinkedIn only, from the footer and About.

**Gated work** (`gated: true`) — the index row renders normally but the year column shows a mono
`ON REQUEST` instead of a link arrow, and the row is a `mailto:` with a prefilled subject rather
than a link to a case study page. No password walls, no dead ends.

---

## 8. Colour discipline (the thing most likely to go wrong)

The previous site failed because a tinted page sat under tinted cards, so nothing had contrast.
The fix is a budget, per page:

- `--paper` ground, `--ink` type. That is 90% of every page.
- `--blue`: the ASCII mark, row numbers, ledger labels, the contact link + its rule, big
  figures, focus rings. Nothing else.
- `--lilac`: exactly two uses site-wide — the index row hover fill, and the OUTCOME ledger
  field. It is a highlighter, not a background.
- `--blue-mid` / `--blue-light`: reserved for accents on `--ink` grounds. If nothing on the site
  has a dark ground, they go unused. That is fine.
- Project covers keep their own colour. They are the only saturated imagery; do not overlay,
  tint, or duotone them.

---

## 9. Images

- Covers: 3:2, ≥1600px wide, exported as WebP via `astro:assets`. Crop **into real interface
  detail** — no floating device mockups on gradient fills. If the only asset is a mockup, crop
  hard so it fills the frame and reads as a screen, not a product shot.
- Every image has a `--rule` border or sits flush against a `--rule` edge. Images never float.
- Real `alt` text describing what the interface does, not "screenshot of komoot app".

---

## 10. Non-negotiables checklist

- [ ] No border radius anywhere.
- [ ] No box-shadow, no gradient background.
- [ ] Everything flush left.
- [ ] All four projects visible on a 1440×900 home page without scrolling.
- [ ] Every index row is a real `<a>`, reachable and revealing by keyboard.
- [ ] `prefers-reduced-motion` honoured for all three whimsy moves.
- [ ] Lighthouse: 100 accessibility, 100 SEO, no CLS from font swap (use `size-adjust` in the
      fallback `@font-face` if Pitch Sans is not yet licensed).
- [ ] Zero client-side JS shipped on `/` and `/work/*`.
- [ ] No "Made with" badge, no placeholder copy, no lorem.
- [ ] Body copy is never `--blue`.
- [ ] `--lilac` appears at most twice per page.

---

## 11. Reference

The approved visual reference is the options board in this project:
`Portfolio Directions.dc.html` — option **1a** (home) and option **1e** (case study). Where this
spec and the board disagree, the board wins on visual detail and the spec wins on structure,
content model, and behaviour.
