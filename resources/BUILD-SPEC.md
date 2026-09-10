# Viki Kovalkovska — Portfolio: Implementation Spec

Pixel-level build spec. Every value here is extracted from the working prototype (`Direction 3 - Warm Modes.dc.html`) and is intentional — do not round, normalize, or "clean up" numbers. Odd values (12.5px, 15.5px, 16.5px, 11.5px, 0.06em) are deliberate.

**Content** (all case study copy, bios, book list) lives in `HANDOFF.md`. This document covers *how it looks and behaves*.

---

## 1. Foundations

### 1.1 Fonts

Two families, both Klim Type Foundry Söhne. Not on any CDN — the `.otf` files must be copied into the build (`public/fonts/`).

```css
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Buch.otf") format("opentype");font-weight:400;font-style:normal}
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Kraftig.otf") format("opentype");font-weight:500;font-style:normal}
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Halbfett.otf") format("opentype");font-weight:600;font-style:normal}
@font-face{font-family:"Sohne Mono";src:url("fonts/SohneMono-Buch.otf") format("opentype");font-weight:400;font-style:normal}
@font-face{font-family:"Sohne Mono";src:url("fonts/SohneMono-Kraftig.otf") format("opentype");font-weight:500;font-style:normal}
```

- Stacks: `"Sohne", system-ui, sans-serif` and `"Sohne Mono", monospace`.
- **Söhne is the body default.** Söhne Mono is opt-in per element and must be set explicitly — if you forget it on a mono element it silently falls back to Söhne and the whole design reads wrong.
- Weights actually used: Söhne 400 and 500 only. Söhne Mono 400 only. (600 and Mono 500 are loaded but unused — keep them loaded for future use.)
- `-webkit-font-smoothing: antialiased` on `body`. This matters — without it the light-on-dark text in night mode looks noticeably heavier.
- **Licensing**: commercial Klim license required before public launch.

### 1.2 Color tokens

Two modes. Both are defined as CSS custom properties on `:root[data-mode="…"]`. There is no third mode — an earlier "cold day" was removed.

```css
:root[data-mode="blue-day"]{
  --bg:#F4F6F9; --ink:#1B5AB0; --dim:#1B5AB0; --faint:#1B5AB0;
  --line:#C7D9F0; --frame:#EAEEF3; --accent:#1B5AB0;
  --dot:#1B5AB0; --link:#1B5AB0;
  --hover-tint:rgba(27,90,176,0.14); --hover-ink:#F4F6F8;
}
:root[data-mode="cool-night"]{
  --bg:#171B24; --ink:#D3DBE8; --dim:#D3DBE8; --faint:#D3DBE8;
  --line:#2E3F56; --frame:#212734; --accent:#D3DBE8;
  --dot:#8FBEEF; --link:#8FBEEF;
  --hover-tint:rgba(143,190,239,0.22); --hover-ink:#12151A;
}
```

Design intent behind these values:

- **Blue day is monochrome-blue on purpose.** `ink`, `dim`, `faint`, `accent`, `dot`, and `link` are all the *same* `#1B5AB0`. There is no tonal hierarchy from color — hierarchy comes entirely from size, weight, and font family. Do not reintroduce lighter/darker blues for secondary text; it was tried and rejected.
- **Cool night** likewise flattens `ink`/`dim`/`faint` to one value (`#D3DBE8`, a near-white with a cool blue tint — not gray), and reserves the lighter sky blue `#8FBEEF` exclusively for links, the availability dot, and active/hover fills.
- `--line` in night mode is blue-tinted (`#2E3F56`), not neutral gray. Separators must read as part of the blue palette.
- `--bg` in night mode (`#171B24`) is deliberately blue-shifted rather than neutral black, to rhyme with day mode.
- `--frame` is only used for the diagonal-hatch image placeholders.
- `--hover-ink` is the text color used *on top of* a solid `--link` fill.

**Contrast (verified, all AAA):** body text 12.4:1 · links 8.9:1 · inverted hover text on link fill 9.4:1. Any color change must re-verify at ≥7:1 for body text.

### 1.3 Global CSS

```css
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:"Sohne",system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  transition:background 240ms ease,color 240ms ease;
}
a{color:var(--ink);text-decoration:none}
a:hover{color:var(--link)}
::selection{background:var(--link);color:var(--hover-ink)}
summary{list-style:none;cursor:pointer}
summary::-webkit-details-marker{display:none}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
```

The `240ms ease` transition on `background`/`color` is what makes the mode switch feel like a dissolve rather than a flash. Apply it on `body` only — do not put a global `transition: all` on every element; that makes hover states feel laggy.

---

## 2. Layout

- Page shell: `min-height:100vh; background:var(--bg)`.
- Content column: `max-width:760px; margin:0 auto; padding:0 32px 40px`.
- Single column throughout. No sidebars, no multi-column text.
- **Header is not sticky.** It scrolls away with the page. This was an explicit decision.
- Breakpoint: **one**, at `max-width:600px`.
- Footer sits directly after content (not pinned). If you need it pushed to the bottom on short pages, use `display:flex; flex-direction:column; min-height:100vh` on the shell and `flex:1 0 auto` on `<main>` — never `position:fixed`.

### Vertical rhythm (top padding per section)

| Context | Value |
|---|---|
| Header top padding | `36px 0 0` |
| Home hero section | `72px 0 0` |
| Home → Selected work | `56px 0 0` |
| Home → contact block | `64px 0 0` |
| Case / About / Playlist `<main>` | `88px 0 0` |
| Case internal sections (Overview, The details, Selected screens) | `64px 0 0` |
| Case footer section | `24px 0 0; margin-top:24px` — **no border-top** |
| About → Previous work, About → contact | `72px 0 0` |
| Playlist → contact | `140px 0 0` |
| Global footer | `margin-top:28px; padding-top:16px; border-top:1px solid var(--line)` |

---

## 3. Typography reference

Söhne unless "Mono" is noted. Colors are tokens.

| Element | Font | Size | Weight | Color | Notes |
|---|---|---|---|---|---|
| Header name | Mono | 12.5px | 400 | `ink` | `letter-spacing:0.01em`, `white-space:nowrap` |
| Nav links | Mono | 12.5px | 400 | `link` active / `dim` inactive | inherits header |
| Availability tagline | Mono | 12px | 400 | `dim` | |
| Hero H1 | Söhne | 31px → 26px ≤600px | 400 | `ink` | `line-height:1.42`, `letter-spacing:-0.015em`, `max-width:26em`, `text-wrap:pretty` |
| Hero paragraph | Söhne | 17px | 400 | `dim` | `line-height:1.65`, `max-width:34em`, `margin-top:26px` |
| Section label (SELECTED WORK, OVERVIEW…) | Mono | 12px | 400 | `faint` | uppercase, `letter-spacing:0.06em` |
| Selected-work year | Mono | 12px | 400 | `faint` | `white-space:nowrap` |
| Selected-work title | Söhne | 19px | **500** | `ink` | `letter-spacing:-0.01em` |
| Selected-work tag | Mono | 11.5px | 400 | `faint` | |
| Selected-work description | Söhne | 15.5px | 400 | `dim` | `line-height:1.6`, `max-width:38em`, `margin-top:8px` |
| Selected-work arrow ➔ | Mono | 18px → 24px ≤600px | 400 | `faint` | `line-height:1` |
| Contact paragraph | **Mono** | 13.5px | 400 | `dim` | `line-height:1.65`, `max-width:34em` — Mono despite reading as body copy |
| email / linkedin links | Mono | 13.5px | 400 | `link` | underlined |
| Case "← back" | Mono | 12px | 400 | `link` | |
| Case H1 | Söhne | 36px | 400 | `ink` | `letter-spacing:-0.02em`, `margin-top:34px` |
| Case premise | Söhne | 20px | 400 | `ink` | `line-height:1.5`, `max-width:26em`, `margin-top:14px` |
| Case meta tags | Mono | 12px | 400 | `faint` | `gap:26px`, `margin-top:26px` |
| Metric value | Söhne | 30px | 400 | `link` | `letter-spacing:-0.02em` |
| Metric label | Mono | 11.5px | 400 | `link` | `margin-top:6px`, `line-height:1.5` |
| Case summary paragraph | Söhne | 17px | 400 | `dim` | `line-height:1.7`, `max-width:34em` |
| Details summary title | Söhne | 16.5px | 400 | `ink` | |
| Details chevron ▸ | Mono | 11px | 400 | `faint` | |
| Details body paragraph | Söhne | 16px | 400 | `dim` | `line-height:1.7`, `margin-bottom:12px` |
| Details list item | Söhne | 16px | 400 | `dim` | `line-height:1.6`, `gap:9px` between items |
| Placeholder caption (cover / screens) | Mono | 11.5px / 11px | 400 | `faint` | |
| Case footer lines | Mono | 13px | 400 | `link` | |
| About H1 / Playlist H1 | Söhne | 28px | 400 | `ink` | `letter-spacing:-0.015em` |
| About bio paragraphs | Söhne | 17px | 400 | `dim` | `line-height:1.7`, `max-width:34em`, `gap:18px` |
| Previous-work years | Mono | 13px | 400 | `faint` | 11.5px + `letter-spacing:0.04em` ≤600px |
| Previous-work project name | **Söhne** | 17px | 400 | `ink` | the one place inside a Mono row that switches back to Söhne; matches About bio size |
| Previous-work role | Mono | 13px | 400 | `dim` | `white-space:nowrap` desktop; 12px + wrapping ≤600px |
| Playlist subhead | Söhne | 16.5px | 400 | `dim` | `line-height:1.65`, `max-width:32em` |
| Playlist book title | Söhne | 16.5px | 400 | `ink` | `line-height:1.55`, `text-wrap:pretty` |
| Playlist author | Mono | 12px | 400 | `dim` | right-aligned, `white-space:nowrap` desktop |
| "last updated…" | Mono | 11.5px | 400 | `faint` | |
| Global footer | Mono | 11.5px | 400 | `faint` | |

`text-wrap: pretty` is applied to the hero H1, case premise, all body paragraphs, and playlist titles. Keep it — it prevents orphans in a narrow measure.

---

## 4. Components

### 4.1 Header

```
display:flex; align-items:baseline; justify-content:space-between; gap:24px;
padding:36px 0 0; font-family:Mono; font-size:12.5px; letter-spacing:0.01em
```
Nav: `display:flex; gap:22px; align-items:center; color:var(--dim)`.

Each nav link: `padding:2px 4px; margin:-2px -4px` — the negative margin cancels the padding so the fill-chip hover state has breathing room without shifting layout. Active page link uses `color:var(--link)`; inactive `var(--dim)`. Active state is **color only** — no fill, no underline. (A filled active state was tried and rejected.)

### 4.2 Mode toggle button

```css
[data-mode-btn]{appearance:none;background:none;border:0;padding:5px 7px;line-height:0;cursor:pointer;color:var(--ink)}
```
Hover: `color:var(--link)`.

**It is a switcher, not an indicator.** It shows the icon of the mode you will get, not the mode you are in:

- In **blue-day** → show the **crescent moon**: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.2 10.35A5.6 5.6 0 0 1 6.05 3.2a5.6 5.6 0 1 0 7.15 7.15z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`
- In **cool-night** → show the **sun/dot**: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.3" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>`

`aria-label` and `title` mirror this: "Switch to night mode" / "Switch to day mode".

Persistence: localStorage key `vk-portfolio-mode`, value `"blue-day"` or `"cool-night"`. On load, read it, validate against the two allowed values, fall back to `"blue-day"`, and set `document.documentElement.dataset.mode` **before first paint** (inline script in `<head>`) to avoid a flash of the wrong theme.

### 4.3 Availability line

```
display:flex; align-items:flex-start; gap:9px; margin-bottom:40px;
font-family:Mono; font-size:12px; color:var(--dim)
```
Dot: `width:6px; height:6px; border-radius:50%; background:var(--dot); margin-top:5px; flex-shrink:0`.

`align-items:flex-start` + `margin-top:5px` (not `align-items:center`) so that when the text wraps to two lines on mobile the dot stays optically aligned with the *first* line rather than floating in the middle of the block.

### 4.4 Selected work list — the most detailed component

Wrapper:
```
display:flex; flex-direction:column;
border-top:1px solid var(--line); margin-top:20px;
margin-left:-20px; margin-right:-20px; padding-left:20px; padding-right:20px
```

Each row (`<a>`):
```
display:grid; grid-template-columns:56px 1fr auto; gap:20px;
padding:26px 20px; margin:0 -20px; margin-top:-1px;
border-bottom:1px solid var(--line); border-top:1px solid transparent;
align-items:baseline
```

Why each of these:

- **`56px` fixed first column** — the year column. Fixed, not `auto`, so that "2021" and "2024–25" produce the same indent and every project title lines up on one vertical axis. Do not change to `auto`/`min-content`.
- **`align-items:baseline`** — the year sits on the same baseline as the project title, not the top of the content block.
- **`padding:26px 20px` + `margin:0 -20px`** — the row bleeds 20px past the content column on both sides so the hover fill has padding around the text instead of clipping flush at the edge. The *wrapper* carries the mirrored `-20px` margin + `20px` padding so the section's `border-top` spans the same width as the rows' `border-bottom` — otherwise the top separator is visibly 40px shorter than the ones below it.
- **`border-top:1px solid transparent` + `margin-top:-1px`** — lets the hover state color the top border without any layout shift, and collapses adjacent borders so separators stay 1px, not 2px.
- **No numbering.** 01–04 was removed. Do not add it back.

Row contents, in DOM order:
1. Year — Mono 12px, `faint`, `white-space:nowrap`.
2. Content block (`display:block`) containing:
   - a flex row `display:flex; align-items:baseline; gap:10px; flex-wrap:wrap` with the title (19px/500, `-0.01em`) and the mono tag (11.5px, `faint`);
   - the description (`display:block; margin-top:8px`, 15.5px, `line-height:1.6`, `max-width:38em`).
3. Arrow `➔` — Mono 18px, `faint`, `line-height:1`, `align-self:end; justify-self:end`. The character is U+2794 (heavy wide-headed arrow), not `→`.

**Active/hover state — full inversion:**
```css
[data-selected-row]:hover,
[data-selected-row][data-row-active]{background:var(--link) !important}
[data-selected-row]:hover *,
[data-selected-row][data-row-active] *{color:var(--hover-ink) !important}
```
Solid fill, everything inside (title, year, tag, description, arrow) flips to `--hover-ink`. Square corners — no border-radius anywhere on this site.

### 4.5 Mobile behavior for Selected work (≤600px)

Rows drop the grid entirely and stack:
```css
[data-selected-row]{display:flex !important;flex-direction:column !important;align-items:flex-start !important;gap:6px !important}
[data-selected-row] > span:first-child{text-align:right !important;align-self:flex-end !important}
[data-selected-row] > span:nth-child(2) > span:first-child{flex-direction:column !important;align-items:flex-start !important;gap:4px !important}
[data-selected-row] > span:last-child{align-self:flex-end !important}
[data-row-arrow]{font-size:24px !important}
```
Resulting order: **year (right-aligned)** → title → tag on its own line → description → arrow (bottom-right).

The year going *right* while everything else goes left is intentional compositional contrast, and it pairs the year with the arrow on the same edge. The title/tag flex row must be forced to `column` or the tag rides up next to the title and the line overflows.

### 4.6 Scroll-driven active row on mobile

Touch devices have no hover, so the row nearest the top third of the viewport gets the inverted state automatically.

```js
updateActiveRow() {
  const rows = document.querySelectorAll("[data-selected-row]");
  if (!rows.length) return;
  if (window.innerWidth > 600 || currentPage !== "home") {
    rows.forEach(r => r.removeAttribute("data-row-active"));
    return;
  }
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let closest = null;
  if (atBottom) {
    closest = rows[rows.length - 1];
    rows.forEach(r => r.removeAttribute("data-row-active"));
  } else {
    const targetY = window.innerHeight * 0.35;
    let closestDist = Infinity;
    rows.forEach(r => {
      const rect = r.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) { r.removeAttribute("data-row-active"); return; }
      const dist = Math.abs(rect.top + rect.height / 2 - targetY);
      if (dist < closestDist) { closestDist = dist; closest = r; }
      r.removeAttribute("data-row-active");
    });
  }
  if (closest) closest.setAttribute("data-row-active", "");
}
```
Bound to `scroll` (passive) and `resize`, plus one call ~50ms after mount.

Two details that matter:
- **Exactly one row is ever active.** An IntersectionObserver band was tried first and lit up several rows at once — use nearest-to-target instead.
- **The bottom-of-page clause is required.** The last row can never reach the 35% line on a short list, so it would never activate. When the page is scrolled to the bottom, force the last row active.

### 4.7 Case study page

Order: `← back` → H1 → premise → meta strip → 16:9 cover placeholder → **Overview** (metrics + summary) → **The details** (collapsible) → **Selected screens** → footer.

**Image placeholders** (cover 16:9, screens 4:3):
```
border:1px solid var(--line); background:var(--frame);
aspect-ratio:16/9;  /* or 4/3 */
display:flex; align-items:center; justify-content:center;
background-image:repeating-linear-gradient(45deg,transparent,transparent 9px,rgba(120,120,120,0.045) 9px,rgba(120,120,120,0.045) 18px)
```
The hatch uses a neutral gray at 4.5% alpha so it reads identically in both modes. Cover has `margin-top:44px`. Screens grid is `grid-template-columns:1fr 1fr; gap:16px`, collapsing to `1fr` ≤600px.

**Metrics grid — the seam trick.** Get this exact or it looks wrong:
```
/* container */ display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
                gap:1px; background:var(--link); border:1px solid var(--link)
/* cell */      background:var(--bg); padding:24px 20px
```
The 1px gaps reveal the container's `--link` background, which *is* the dividing lines. Do **not** add borders to individual cells (doubles the lines) and do **not** make cells transparent (the whole cell turns blue).

**Collapsible sections** (`<details>`): `border-bottom:1px solid var(--line); border-top:1px solid transparent; margin-top:-1px` — same collapsing-border pattern as the work rows. Summary: `display:flex; align-items:center; gap:12px; padding:18px 0`. Chevron `▸` with `transition:transform 180ms ease`, rotated via `details[open] > summary > span[data-chev]{transform:rotate(90deg)}`. Body: `padding:0 0 26px 24px; max-width:36em`. All collapsed by default.

Hover on `<details>` uses the *non-inverted* pattern: text → `--link`, top and bottom borders → `--link`, no fill.

**Case footer** — stacked, no separator above:
```
section: padding:24px 0 0; margin-top:24px      /* no border-top */
inner:   display:flex; flex-direction:column; align-items:flex-end;
         gap:36px; padding-top:4px; font-family:Mono; font-size:13px
```
Line 1: `next: ` as plain text + the project name and `→` as the underlined link. **Only the project name + arrow are underlined**, never the word "next:".
Line 2: `have questions? get in touch` with `align-self:flex-start` — it left-aligns to the case title while the next-case line stays right. That asymmetry is intentional.

There is no "all work" link — the header nav covers it.

### 4.8 Inline text links

```
color:var(--link); text-decoration:underline;
text-decoration-color:var(--link); text-decoration-thickness:1px; text-underline-offset:3px;
padding:1px 3px 3px; margin:-1px -3px -3px
```
Hover: `background:var(--link); color:var(--hover-ink); text-decoration-color:var(--hover-ink)`.

The 1px thickness and 3px offset are the site's link signature — a heavier or closer underline changes the whole feel. Padding/negative-margin pairs exist so the hover chip has padding without moving text.

### 4.9 Previous work table (About)

Container: `display:flex; flex-direction:column; font-family:Mono; font-size:13px; border-top:1px solid var(--line)`.

Row: `display:grid; grid-template-columns:100px 1fr auto; gap:20px; padding:13px 0; border-bottom:1px solid var(--line); align-items:baseline`. Years `faint`; project name Söhne 17px `ink`; role `dim`, `white-space:nowrap`, right column.

Not links — no hover state.

Mobile (≤600px) restacks with a clear hierarchy:
```css
[data-cv-row]{grid-template-columns:1fr !important;gap:2px !important;padding:16px 0 !important}
[data-cv-row] > span:first-child{font-size:11.5px !important;letter-spacing:0.04em !important;text-align:right !important}
[data-cv-row] > span:nth-child(2){font-size:17px !important;margin-top:2px !important}
[data-cv-row] > span:last-child{white-space:normal !important;font-size:12px !important}
```
Year (small, right-aligned) → project name (17px) → role (12px). More row padding, tighter internal gap.

### 4.10 Playlist

`border-top:1px solid var(--line)` on the container, `margin-top:36px`.

Row (`<a>` to a Goodreads search URL, `https://www.goodreads.com/search?q=` + `encodeURIComponent(title + " " + author)`):
`display:grid; grid-template-columns:1fr auto; gap:16px; padding:16px 0; border-bottom:1px solid var(--line); border-top:1px solid transparent; margin-top:-1px; align-items:baseline`.

Not numbered. Hover uses the non-inverted pattern (text + borders → `--link`).

Mobile: `grid-template-columns:1fr; gap:4px`, author left-aligned below the title and allowed to wrap.

---

## 5. Interaction summary

| Target | State |
|---|---|
| Selected work row | **Inverted fill**: `background:var(--link)`, all descendants `var(--hover-ink)` |
| Selected work row on mobile | Same inversion, driven by scroll position (§4.6) |
| Playlist row, `<details>` summary | Text → `--link`, top + bottom border → `--link`, no fill |
| Nav link, inline text link | Fill chip: `background:var(--link)`, text `var(--hover-ink)` |
| Nav link, current page | `color:var(--link)` only |
| Mode button | `color:var(--link)` |
| Text selection | `background:var(--link)`, `color:var(--hover-ink)` |
| Chevron in open `<details>` | `rotate(90deg)`, 180ms ease |
| Mode switch | `background`/`color` 240ms ease on body |
| Page enter | `animation:rise 400ms ease both` on Home `<main>` only |

No border-radius anywhere. No box-shadows. No page transition beyond the single `rise` on Home.

---

## 6. Routing & navigation behavior

Routes: `/` · `/about` · `/playlist` · `/work/komoot` · `/work/verizon` · `/work/roveme` · `/work/podguides`.

- Normal navigation scrolls to top.
- **The "work" nav link is special**: it navigates to `/` *and* scrolls so the "Selected work" section — heading included — sits flush at the top of the viewport, with no offset. The name/logo link goes to the very top of the page instead.

```js
goWorkNav(e) {
  e.preventDefault();
  navigateHome();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = document.querySelector("[data-selected-work-section]");
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    else window.scrollTo(0, 0);
  }));
}
```
The double `requestAnimationFrame` is needed: the home view must be committed to the DOM before the target's offset can be measured. On a real router, do the scroll in the route's after-navigation hook.

- Case pages loop: komoot → Verizon → rove.me → PodGuides → komoot.

---

## 7. Responsive rules (single breakpoint, `max-width:600px`)

```css
@media (max-width:600px){
  [data-header]{flex-wrap:wrap;row-gap:14px}
  [data-nav]{gap:16px;flex-wrap:wrap}
  [data-hero-h1]{font-size:26px !important}
  [data-case-footer]{align-items:flex-end !important}
  [data-case-cols]{grid-template-columns:1fr !important}
  [data-case-meta]{gap:12px 20px}
  /* plus the Selected work, Previous work, and Playlist rules in §4.5, §4.9, §4.10 */
}
```

Verify at **390px** and **1440px** — those are the two widths the design was tuned against.

---

## 8. Things that were tried and rejected

Do not reintroduce these; each was explicitly reverted.

- A third "cold day" theme with neutral gray text.
- Tonal hierarchy (three shades of blue) for text in blue-day mode.
- A `#EBFABD` background for day mode.
- Numbering (01–04, 01–09) on the Selected work and Playlist lists.
- A filled/inverted active state on the current-page nav link.
- Sticky header.
- "all work" link in case footers.
- A separator line above the case footer.
- The hero intro paragraph "I'm looking for my next role right now…".
- A "Now" section on About.
- A before/after image comparison block on the komoot case.
- Page-transition fade on every route (only Home keeps `rise`).

---

## 9. Outstanding before launch

1. Replace every placeholder with real imagery: 4 × 16:9 case covers, 8 × 4:3 screens.
2. Confirm the Klim Söhne commercial license covers a public site.
3. Device-test at 390px on real hardware (the responsive rules were tuned in a browser).
4. Verify `viki.kovalkovska@gmail.com` and the LinkedIn URL.
5. Add the pre-paint inline theme script (§4.2) — the prototype sets the mode after mount, which would flash on a real static build.
