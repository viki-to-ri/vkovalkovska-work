# Release notes — footer consolidation & heading cleanup

For the agent shipping the live site. Source of truth is `Direction 3 - Warm Modes.dc.html`; the full spec is `HANDOFF.md` (already updated to match). This file lists only what changed in this round, why, and how to verify it.

Scope: 4 changes — three layout/content, plus a full copy rewrite of the komoot case study (item 6). No theme, font, or interaction changes. No new dependencies.

---

## 1. Page headings on About and Playlist — unchanged

These were briefly removed during review and have been **restored**. `/about` and `/playlist` each open with an `<h1>` (Söhne 28px, weight 400, `ink`, letter-spacing -0.015em) under the 88px top padding. About's bio stack keeps `margin-top: 26px`; Playlist's list wrapper keeps `margin-top: 36px`. Nothing to do here — noted only so the heading row in `HANDOFF.md`'s typography table is not read as stale.

---

## 2. Removed the Playlist subhead

**What**: Deleted "Books I've read recently."

**Why**: Redundant — a list of titles and authors reads as exactly that.

**Implementation**: the list wrapper's `margin-top: 36px` was dropped along with it; the wrapper's `border-top: 1px solid var(--line)` is now the first thing under the header. Row markup, hover behavior, and the "last updated august 2026" line are unchanged.

---

## 3. Contact block moved into the global footer

**What**: The contact paragraph + `email` / `linkedin ↗` links used to be a `<section>` repeated at the bottom of Home, About, and Playlist (with three different top paddings: 64px, 72px, 140px). All three copies were deleted. One instance now lives in the global footer, which renders on every page including case studies.

**Why**: It is footer content. Three near-identical copies with inconsistent spacing was a maintenance liability and made the three pages end differently.

**Implementation** — in your shared layout (e.g. `src/layouts/Base.astro`), the footer is the last child of the content column:

```html
<footer style="font-family:'Sohne Mono',monospace">
  <p style="margin:0;font-size:13.5px;line-height:1.65;color:var(--dim);max-width:34em">I’m open to product design roles and the occasional project. Interested in working together? Get in touch!</p>
  <div style="display:flex;gap:28px;flex-wrap:wrap;margin-top:24px;font-size:13.5px">
    <a href="mailto:viki.kovalkovska@gmail.com">email</a>
    <a href="https://www.linkedin.com/in/viki-kovalkovska/" target="_blank" rel="noreferrer">linkedin ↗</a>
  </div>
  <p style="margin:36px 0 0;font-size:11.5px;color:var(--faint)">© 2026 all rights reserved</p>
</footer>
```

Both links use the standard inline-link treatment: `color: var(--link)`, `text-decoration: underline`, `text-decoration-color: var(--link)`, `text-decoration-thickness: 1px`, `text-underline-offset: 3px`, and the fill-chip hover (`background: var(--link)`, `color: var(--hover-ink)`, `text-decoration-color: var(--hover-ink)`) with `padding: 1px 3px 3px; margin: -1px -3px -3px` so the chip hugs the text.

Note the apostrophe in "I’m" is a typographic apostrophe (U+2019), not `'`. Keep it.

**Related removal**: the case-study footer's own `have questions? get in touch` line has been **deleted** from the case template — it duplicated the global contact block. The case footer now contains only the right-aligned `next: [case] →` link (the `gap:36px` on its flex column was dropped along with the second child).

---

## 4. Footer now sticks to the bottom of the viewport

**What**: On short pages (any case study viewed on a tall screen, or `/playlist` on desktop) the footer used to float mid-page with dead space beneath it. It now sits at the bottom of the viewport, while still scrolling normally on long pages.

**Why**: Visual anchoring — the page should always look intentionally terminated.

**Implementation** — two parts, both required:

```css
/* the 760px content column */
.column {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 32px 40px;
  box-sizing: border-box;   /* required — without it the padding pushes past 100vh and creates a scrollbar on every page */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

```html
<!-- flexible spacer, immediately before <footer> -->
<div style="flex:1 0 auto;min-height:96px"></div>
```

- `flex: 1 0 auto` on the spacer absorbs all leftover vertical space on short pages, pushing the footer down.
- `min-height: 96px` is the floor, so on long pages there is still a 96px gap between the last content and the footer.
- **Do not** use `position: fixed` or `position: sticky` on the footer. The footer must scroll away with the page.
- **Do not** replace the spacer with `margin-top: auto` on the footer — that gives you the sticky behavior but loses the guaranteed 96px minimum gap on long pages.
- The outer page wrapper keeps `min-height:100vh; background: var(--bg)` so the theme background always fills the viewport.
- Use `100vh`, not `100dvh`. On mobile, `dvh` makes the footer position shift as the browser chrome collapses during scroll, which reads as a layout jump.

---

## 5. Removed the footer separator

**What**: The `border-top: 1px solid var(--line)` and `padding-top: 32px` were removed from `<footer>`. The footer element now carries only `font-family:'Sohne Mono',monospace`.

**Why**: The 96px spacer already separates it; the rule read as clutter.

**Do not add a separator back to any footer** — this matches the case-study footer, which also had its border removed in an earlier round. The site has no horizontal rules except the row borders in the three list/table sections (Selected work, Previous work, Playlist).

---

## 6. komoot case study rewritten

**What**: The komoot case went from 4 accordion sections to 9, and the copy was rewritten end to end. The other three cases are untouched.

**Why**: The old version described research findings and year-long squad results with nothing in between — no shipped changes, no per-experiment numbers, no scope decisions. It also sat at a different level of granularity than the Verizon case, which made the set read inconsistently.

**Full copy**: in `HANDOFF.md` → Case study content → komoot. Take it from there verbatim; it was iterated with the user across several rounds and the wording is hers.

**Section order**: Context → My role → Deep dive: guide and tour pages → Process → What we learned → What we shipped → What we left out → Results → Other work in the squad.

**Metrics tiles changed meaning.** They now show experiment-level results (`+12%` guide page banner, `+8%` tour page banner) instead of the squad-level `1.96×` / `2.04×`, which moved down into the Results section with explicit framing ("Across everything the squad did… over the year"). Two tiles, not three — the `18–20%` figure is now a Results bullet.

⚠ **+12% belongs to the GUIDE page banner, +8% to the TOUR page banner.** Confirmed with the user. An earlier draft had them reversed; if you see them the other way round anywhere, that source is stale.

**Copy rules specific to this case** (they differ from the rest of the site, so don't normalise them away):
- **No em dashes in body copy.** Commas or full stops instead. The six screen placeholder labels keep their em dashes, where the dash is a separator rather than punctuation.
- Typographic apostrophes (U+2019) throughout — `didn’t`, `komoot’s`, `wasn’t`. A straight-quote regression was caught and fixed once already; if your build pipeline or CMS import normalises quotes, verify the output.
- Voice is mostly "we" by the user's explicit choice (the work was collaborative). First person appears only where the action is literally hers. Do not rewrite for a stronger "I".

**Screens**: 6 placeholders, up from 2, in the existing 2-col 4:3 grid. Real assets are coming: three signup banner variants (control, variation 1, variation 2), an animated gif of the tour page banner experiment, and the smart tour page in desktop and mobile. The gif needs a static poster frame so print and PDF export don't render a blank box.

---

## QA checklist before deploy

1. **Every route** (`/`, `/about`, `/playlist`, `/work/komoot`, `/work/verizon`, `/work/roveme`, `/work/podguides`): footer appears exactly once; contact paragraph, both links, copyright all present.
2. **Short-page check**: load `/playlist` and each case page on a 1440×900 and a 1440×1200 viewport. Footer bottom-aligned, no dead space below it, no vertical scrollbar caused by the 100vh column (this is the `box-sizing` bug — if you see a ~40px scroll on a page that should fit, that is the cause).
3. **Long-page check**: `/` and `/work/komoot` — footer scrolls with the page, 96px gap above it, no separator line.
4. **Both themes**: toggle blue day / cool night on a page where the footer is bottom-aligned. Background fills the full viewport in both; footer text contrast holds (`dim` on `bg`, `faint` for the copyright).
5. **Mobile ≤600px**: footer link row wraps if needed; the 96px spacer does not create excess scroll; no heading gap artifacts at the top of `/about` and `/playlist` (the removed 26px/36px margins).
6. **Links live**: `mailto:` opens with the right address; LinkedIn opens in a new tab with `rel="noreferrer"`.
7. **No leftovers**: grep the built output for `Books I’ve read recently`, `>About<`, `>Playlist<` as headings, and any second occurrence of `I’m open to product design roles` on a single page. All should be absent.
8. **komoot case**: 9 sections render in the order listed in item 6; metrics tiles read `+12%` / `+8%`; the +12%/+8% page attribution matches item 6; no em dashes in the body copy; all apostrophes curly; 6 screen slots present.
9. **Print / reduced motion**: unaffected by this round, but confirm the flex column does not clip the footer when printing a case page.

## Still outstanding (unchanged from `HANDOFF.md`)

1. Real screenshots for all case covers (16:9 ×4) and screen pairs (4:3 ×8) — currently placeholders.
2. Söhne / Söhne Mono commercial license confirmation before public launch.
3. Real-device mobile testing.
4. Confirm email and LinkedIn URL.
