# Viki Kovalkovska — Portfolio Site
Handoff spec for full Astro build. Source design lives in `Direction 3 - Warm Modes.dc.html` (working prototype) — this doc is the content + design spec extracted from it.

## Stack notes
- Static site, 4 routes: `/` (Work/Home), `/about`, `/playlist`, and case study pages (`/work/[slug]` — komoot, verizon, roveme, podguides).
- No backend. All content below can live in Astro content collections (e.g. `src/content/cases/*.md`) or a simple data file.
- Client-side theme toggle persisted to localStorage (see Theme section).

## Fonts
- **Söhne** (sans) — the default body font. Applied via `body { font-family: "Sohne", system-ui, sans-serif }`; any text element below NOT marked "Mono" uses this.
- **Söhne Mono** — used for labels, metadata, nav, dates, section headers, and the header name. Must be explicitly set per-element (it's not the default).
- Weights used: Söhne 400 (Buch), 500 (Kraftig), 600 (Halbfett — loaded but not currently used anywhere, available for future use). Söhne Mono: 400 (Buch), 500 (Kraftig — loaded but not currently used).
- **Exact `@font-face` declarations required** (copy these verbatim — if these are missing or point to the wrong files, every element silently falls back to `system-ui`/`monospace`, which is likely what's causing the "off" look):
```css
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Buch.otf") format("opentype");font-weight:400;font-style:normal}
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Kraftig.otf") format("opentype");font-weight:500;font-style:normal}
@font-face{font-family:"Sohne";src:url("fonts/Sohne-Halbfett.otf") format("opentype");font-weight:600;font-style:normal}
@font-face{font-family:"Sohne Mono";src:url("fonts/SohneMono-Buch.otf") format("opentype");font-weight:400;font-style:normal}
@font-face{font-family:"Sohne Mono";src:url("fonts/SohneMono-Kraftig.otf") format("opentype");font-weight:500;font-style:normal}
```
- The actual `.otf` files must be copied into the build (e.g. `public/fonts/`) — they are NOT Google Fonts and won't load from a CDN link. Source files are in this project's `fonts/` folder; confirm your agent actually copied them into the new site's asset folder, not just referenced the CSS.
- Fallback stack: `"Sohne", system-ui, sans-serif` / `"Sohne Mono", monospace`.
- **License check needed**: Klim Type Foundry commercial license required for production/public use beyond personal testing — confirm before shipping live.

## Typography reference (every text style on the site)
Default font is Söhne unless "Mono" is specified. Color values are tokens (see Theme table above) — they resolve differently per mode.

| Element | Font | Size | Weight | Color | Other |
|---|---|---|---|---|---|
| Header name "viki kovalkovska" | Mono | 12.5px | 400 | `ink` | inherits from header wrapper |
| Nav links (work/about/playlist) | Mono | 12.5px | 400 | `link` (active) / `dim` (inactive) | inherits from header |
| Availability tagline | Mono | 12px | 400 | `dim` | dot is 6×6px circle, `dot` color |
| Hero H1 | Söhne | 31px (26px ≤600px) | 400 | `ink` | line-height 1.42, letter-spacing -0.015em, max-width 26em |
| Hero/About/Case body paragraphs | Söhne | 17px | 400 | `dim` | line-height 1.65–1.7, max-width 34em |
| Section label (SELECTED WORK / OVERVIEW / etc.) | Mono | 12px | 400 | `faint` | uppercase, letter-spacing 0.06em |
| Selected-work row number (01–04) | Mono | 12px | 400 | `faint` | |
| Selected-work project title | Söhne | 19px | 500 | `ink` | letter-spacing -0.01em |
| Selected-work tag (e.g. "product design · acquisition (SEO) squad") | Mono | 11.5px | 400 | `faint` | |
| Selected-work description line | Söhne | 15.5px | 400 | `dim` | line-height 1.6, max-width 38em |
| Selected-work year (right-aligned) | Mono | 12px | 400 | `faint` | |
| Contact block paragraph ("I'm open to product design roles...") | Mono | 13.5px | 400 | `dim` | line-height 1.65 — Mono, not Söhne, despite reading as body copy. Lives in the **global footer** on every page (see Global footer). No border/separator above it. |
| email / linkedin / get in touch links | Mono | 13.5px (13px in case footer) | 400 | `link` | underlined, 1px, offset 3px |
| Case "← back" link | Mono | 12px | 400 | `link` | |
| About H1 / Playlist H1 | Söhne | 28px | 400 | `ink` | letter-spacing -0.015em |
| Case title H1 | Söhne | 36px | 400 | `ink` | letter-spacing -0.02em |
| Case premise line | Söhne | 20px | 400 | `ink` | line-height 1.5, max-width 26em |
| Case meta tags (role · dates · tools) | Mono | 12px | 400 | `faint` | |
| Cover/screen placeholder captions | Mono | 11.5px / 11px | 400 | `faint` | |
| Metric value (e.g. "1.96×") | Söhne | 30px | 400 | `link` | letter-spacing -0.02em |
| Metric label | Mono | 11.5px | 400 | `link` | |
| Details section title (Context/Goal/etc.) | Söhne | 16.5px | 400 | `ink` | |
| Details chevron ▸ | Mono | 11px | 400 | `faint` | rotates 90° when open |
| Details body paragraph / list item | Söhne | 16px | 400 | `dim` | line-height 1.6–1.7 |
| Case footer nav (next/all work) | Mono | 13px | 400 | `link` | |
| Previous-work years | Mono | 13px | 400 | `faint` | |
| Previous-work project name | **Söhne** (explicitly overridden from the mono row container) | 14px (18px in blue-day mode only) | 400 | `ink` | this is the one place inside a mono-font row that switches back to Söhne |
| Previous-work role tag | Mono | 13px | 400 | `dim` | right-aligned |
| Playlist row number | Mono | 11.5px | 400 | `faint` | |
| Playlist book title | Söhne | 16.5px | 400 | `ink` | line-height 1.55 |
| Playlist author (right-aligned) | Mono | 12px | 400 | `dim` | |
| Playlist "last updated" line | Mono | 11.5px | 400 | `faint` | |
| Global footer "© 2026 all rights reserved" | Mono | 11.5px | 400 | `faint` | 36px above it |

## Layout
- Single column, `max-width: 760px`, centered, `padding: 0 32px 40px`.
- The column is a **flex column with `min-height:100vh`** so the global footer sticks to the bottom of the viewport on short pages (see Global footer).
- Header: name (left) + nav (right): work / about / playlist / theme toggle button. Entire header — including the "viki kovalkovska" name link — uses **Söhne Mono**, 12.5px, not the body Söhne font. Sticky header was explicitly rejected — keep it static, scrolls with page.
- Mobile breakpoint at 600px (see Responsive section).

## Theme system (2 modes, one toggle button, persisted in localStorage key `vk-portfolio-mode`)
Default on load: **Blue day**. Cold day mode has been removed entirely — only Blue day and Cool night remain.

| Token | Blue day (default) | Cool night |
|---|---|---|
| `--bg` | `#F4F6F9` | `#1B1D22` |
| `--ink` (primary text) | `#1B5AB0` | `#DCDFE3` |
| `--dim` (secondary text) | `#1B5AB0` | `#A3ABB9` |
| `--faint` (tertiary/labels) | `#1B5AB0` | `#A6AEBC` |
| `--line` (borders) | `#C7D9F0` | `#2E3F56` |
| `--frame` (placeholder bg) | `#EAEEF3` | `#262932` |
| `--dot` (availability dot) | `#1B5AB0` | `#68A4E1` |
| `--link` (links, active states, hover) | `#1B5AB0` | `#76AFE7` |
| `--hover-tint` | `rgba(27,90,176,.14)` | `rgba(118,175,231,.22)` |
| `--hover-ink` (text on filled hover bg) | `#F4F6F8` | `#1C2025` |

Notes:
- Blue day uses a single flat blue (`#1B5AB0`) for ink/dim/faint/accent/dot/link — no tonal hierarchy between them, intentionally. Previous-work project names still render at 18px (vs 14px base) in blue-day mode.
- Cool night's `--line` was corrected from a neutral dark gray (`#31333B`) to a blue-tinted dark line (`#2E3F56`) so separators read as part of the blue palette rather than black.
- Toggle button is a **switcher, not a status indicator**: it always shows the icon of the mode you'd switch *to*, not the current mode. In blue-day mode, the button shows the night (crescent moon) icon; in cool-night mode, it shows the day (circle+dot) icon. Clicking cycles blue day ↔ cool night.
- Text selection (`::selection`) uses `background: var(--link)`, `color: var(--hover-ink)`.
- Background/color transition: `240ms ease` on mode switch.

## Interaction patterns
- **Row hover, Selected work rows specifically**: inverted fill — background becomes solid `var(--link)`, all text/arrow inside becomes `var(--hover-ink)`. On mobile, since there's no hover, the row nearest the top third of the viewport gets this same inverted state automatically as the user scrolls (tracked via scroll position, recalculated on scroll/resize); when scrolled to the very bottom of the page, the LAST row is forced active even if it hasn't reached the top-third band (a short list won't always be able to scroll a row up there).
- **Row hover, other rows** (Details `<details>` summaries, Playlist rows): text inside turns `var(--link)`, and the row's top+bottom border also turns `var(--link)`. No background fill.
- **Nav / text link hover**: background fills `var(--link)`, text becomes `var(--hover-ink)` (i.e. a solid-fill hover chip), corners square (no border-radius).
- **Mode button hover**: icon color turns `var(--link)`.
- Underlined inline links (email, linkedin, "get in touch") use `text-decoration-color: var(--link)`, thickness 1px, offset 3px; on hover the same fill-chip treatment applies.
- No page-transition animation (removed intentionally — pages should render instantly, no fade-in).
- `<details>` elements are collapsed by default; chevron (▸) rotates 90° when open.

## Responsive (max-width: 600px)
- Header wraps (name + nav can go to two lines) instead of overlapping.
- Hero H1 drops to 26px.
- Selected-work rows: see stacking behavior described above (year → title → tag → description → arrow, each own line).
- Availability-line dot aligns to the top of the first text line, not vertically centered, since the tagline text wraps to multiple lines on narrow screens.
- Case footer (see below) stacks and both lines right-align.
- Case "Selected screens" grid drops from 2 columns to 1.
- Case meta tags wrap with tighter gap.

## Pages & content

### Home / Work (`/`)
**Availability line** (small dot + mono text, dot color = `var(--dot)`):
> open to product design roles · remote / berlin / leipzig

**Hero H1** (31px, weight 400):
> Hi, I'm Viki, a product designer with an engineering background and a soft spot for the details other people skip.

**Body paragraph 1**:
> For the last 6+ years I've worked on product-led growth, native mobile apps, websites, 0→1 discovery and design, mostly remotely and mostly in international teams.

(The second intro paragraph — "I'm looking for my next role right now..." — has been removed. Do not re-add it.)

**Selected work** — 4 rows, NOT numbered (numbers removed — do not add 01–04 back), each: year range (left-aligned, fixed-width column, baseline-aligned with title so project titles stay vertically aligned regardless of year-string length), title (19px/500), a mono tag, one outcome-line description, and an ➔ arrow bottom-right of the row indicating it opens further. Rows link to case pages.

Row layout: `grid-template-columns: 56px 1fr auto` (year / content / arrow), `align-items:baseline`. Arrow is `font-size:18px` on desktop, `24px` on mobile (≤600px), color `faint`, self-aligned to the row's bottom-right corner.

Row hover/active state (desktop hover, or the row nearest the top-third of the viewport on mobile while scrolling — see Interaction patterns): background fills solid `var(--link)`, ALL text and the arrow inside invert to `var(--hover-ink)`. Rows have `padding:26px 20px` with a `-20px` horizontal bleed/margin so the hover fill extends past the content column edges to the row's full visual width; the "Selected work" section label above shares this same `-20px` bleed on its top border so the two separators align exactly.

On mobile (≤600px), each row's contents stack into 3 lines instead of one: year (right-aligned) → project title (left-aligned) → metadata tag (own line, left-aligned) → description → arrow bottom-right.

| Title | Tag | Description | Years | Links to |
|---|---|---|---|---|
| komoot | product design · acquisition (SEO) squad | As part of the growth team, I contributed to improving signup rate by 1.96× and activation rate by 2.04×. | 2024–25 | /work/komoot |
| Verizon Sideview | 0→1, cross-platform app | Led the 0→1 design of a native cross-platform app that gives sales and support teams a unified view of contact and account data during calls, shipped across iOS, Android, macOS and Windows. | 2020–21 | /work/verizon |
| rove.me | retention, engagement | As part of cross-functional team, I contributed to improving unique visitors by 23%, returning visitors by 17% and bookings by 14%, through a sequence of experiments spanning content, design and SEO optimizations. | 2019–20 | /work/roveme |
| PodGuides | product concept, mvp | Led 0→1 concept and MVP design exploring travel discovery through podcasts. Developed in collaboration with the iHeartMedia research team. | 2021 | /work/podguides |

**Nav "work" link behavior**: clicking "work" in the header nav navigates home AND scrolls the page so the "Selected work" section (heading included) lands flush at the top of the viewport, no offset. The logo/name link still goes to the very top of the page.

**Contact block**: no longer part of the Home page — it moved into the global footer (see Global footer).

---

### Case study pages (4 total, same template)
Template order: back link → title (36px) → premise (20px) → meta tags (mono, faint) → cover image (16:9 placeholder, **needs real screenshot**) → **Overview** (optional metrics grid + summary paragraph) → **The details** (collapsible sections) → **Selected screens** (image grid, 2 placeholders per case, **needs real screenshots**) → case footer — a right-aligned `next: [case] →` link only, no separator, no contact line (the global footer carries the contact block).

**Metrics grid construction** (this is a "seam" trick, not individual bordered cells — get this exact or it looks wrong):
- Outer grid container: `display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:1px; background:var(--link); border:1px solid var(--link)`.
- Each cell: `background:var(--bg)` (the page background color, NOT transparent), `padding:24px 20px`. No border on individual cells.
- The 1px `gap` between cells shows through as a thin `var(--link)`-colored line because the gap reveals the container's background — that's what creates the dividing lines. Do NOT add explicit `border` to each cell (this doubles the lines and looks wrong) and do NOT set cell background to transparent (the link-colored container would show through the whole cell instead of just the seams).
- Inside each cell: value (30px Söhne, color `link`, letter-spacing -0.02em) then label (11.5px Söhne Mono, color `link`, margin-top 6px, line-height 1.5).
- `auto-fit`/`minmax(160px,1fr)` means cells reflow responsively — 2 or 3 per row depending on container width and metric count, wrapping to a new row if they don't fit.

#### komoot
- Premise: Enhancing user acquisition, activation, and user experience.
- Meta: product designer, acquisition (SEO) squad · jun 2024 – sep 2025 · figma, dovetail (corrected — must match the Selected-work table tag exactly, do not say "growth squad")
- Metrics (2 tiles — **experiment-level, not squad-level**; the 1.96×/2.04× squad figures now live in the Results section instead): `+12%` "signups — guide page banner vs. control" | `+8%` "signups — tour page banner vs. control"
- Summary: Our squad owned komoot’s web journey from first visit to activation. I led the user research, owned design iterations and prototyping, and turned data and research insights into testable solutions. Most changes shipped behind an A/B test.

**Nine accordion sections, in this order.** This case was rewritten in Sept 2026 to match Verizon's granularity. Tone is deliberately plain and collaborative — mostly "we", first person only where the action is literally hers. **Copy rules for this case: no em dashes in body copy** (screen placeholder labels keep theirs as separators), and typographic apostrophes (U+2019) throughout. Do not "improve" this copy; it is the user's own wording and was iterated over several rounds.

1. **Context** (2 paras, no list)
   > komoot is a route planner app offering tailored route recommendations for any activity, anywhere. With 22 million active users in 2025, it helps people find, plan, share and track outdoor adventures.
   > Our squad owned all of komoot’s landing pages and the web journey from first visit to activation, the seven-day explorer window. We worked closely with the data science and growth teams who owned monetisation and retention, so analytics, research and A/B tests were part of how we made most decisions.
2. **My role** (1 para, no list)
   > I was the product designer in the squad. I led the user research, owned the design iterations and prototyping, and worked with the team to turn what we learned into things we could actually test. I also contributed to the design system and to how the wider team ran research.
3. **Deep dive: guide and tour pages** (2 paras, no list)
   > Guide pages were our highest-traffic, highest-signup content type, with close to 60% of all web signups in June. So when a change to how content was displayed meant we had to rethink these pages anyway, it seemed like a good place to spend our effort.
   > Our goal was to clearly communicate komoot’s value proposition and the value of creating an account, help people find a perfect route, and inspire them to go out within the next 7 days.
4. **Process** (2 paras, no list)
   > We started with product analytics, to see how the content changes had affected behaviour and our main KPIs. That told us what had moved but not why, so we followed up with qualitative research.
   > We ran ten unmoderated usability tests and interviews on mobile and ten on desktop. We matched the structure of an earlier study on purpose, so we could compare results instead of starting from scratch. From there I iterated design directions against our goals, and we scored them together on an impact-effort scale.
5. **What we learned** (2 paras + 4-item list)
   > We were surprised to learn that most people simply didn’t realise a komoot account was free. We confirmed our assumption that the signup popup was frustrating for most visitors, but removing it wasn’t possible at the time, so timing became the thing we could work on.
   > We’d also assumed that komoot’s community and its user-generated content would be the most compelling reason to sign up. The A/B test suggested otherwise. People were more motivated when they could see a clear number of routes they’d get access to. The rest of the research gave us useful material to work with:
   - People paid the most attention to photos, using them to judge whether a route would be interesting
   - Star ratings and route stats built credibility and trust
   - People found the content useful and engaging despite the new limitations and the signup wall
   - The mobile version of the site was difficult to navigate
6. **What we shipped** (3 paras, no list)
   > We went for the overlap between what the research told us, what we were trying to achieve, and what didn’t need much engineering time. Almost everything shipped behind an A/B test.
   > We tested three versions of the end-of-page signup banner on guide pages, and variation 1 brought in 12% more signups than control. We rebuilt the signup banner on tour pages the same way, which came out 8% ahead of control. Both shipped.
   > We also changed the timing and targeting of the initial signup popup, and rewrote the copy on buttons and signup modules so that a free account actually reads as free.

   ⚠ **Do not swap these two figures.** +12% is the **guide** page banner, +8% is the **tour** page banner. Confirmed directly with the user; an earlier draft had them reversed.
7. **What we left out** (2 paras, no list)
   > We had to keep the scope tight, so quite a few things moved further up the product timeline. Removing the signup popup entirely, filtering for logged-out visitors, rethinking navigation across mobile and desktop, redesigning tour cards to lead with photos, and reworking the main CTAs on those cards all came out of scope.
   > Navigation and the tour-card CTAs were the ones I thought were essential to improving the pages, and the research pointed at both. We couldn’t fit them into the quarter, but we opened experiments on them in the next one.
8. **Results** (1 para + 3-item list) — squad-level and framed as such
   > Across everything the squad did on the activation journey and on guide and tour pages over the year:
   - 18–20% of all komoot signups in 2024 came through web
   - Signup rate increased by 1.96×
   - Activation rate increased by 2.04× (YoY growth of users coming from web)
9. **Other work in the squad** (1 para + 6-item list)
   > Guide and tour pages were one project among many. Over the next months we also picked up several of the things this deep dive had put on the list, and plenty that it hadn’t:
   - Improved the CTAs on tour cards
   - Smoothed the redirects and transitions between logged-out and logged-in pages
   - Fixed site navigation on mobile and desktop
   - Experimented with how routes are saved, and where people land after signing up depending on the page they signed up from
   - Started on changes to how tours could be filtered
   - Started fixing the onboarding setup flows

- Screens: **6 placeholders** (2-col grid, 4:3) — user is supplying real assets:
  1. `signup banner — control`
  2. `signup banner — variation 1 (+12%)`
  3. `signup banner — variation 2`
  4. `tour page signup banner — experiment (gif)` — animated, needs a still poster frame for print/PDF
  5. `smart tour page, desktop`
  6. `smart tour page, mobile`
- Next case: Verizon Sideview

#### Verizon Sideview
- Premise: Collaborative cross-platform app design.
- Meta: sole product designer · sep 2020 – may 2021 · sketch, invision
- Metrics: 4 platforms shipped (ios, android, macos, windows) | 0→1 from first concept to a released first version
- Summary: Led the 0→1 design of a native cross-platform app that gives sales and support teams a unified view of contact and account data during calls, shipped across iOS, Android, macOS and Windows. Created in collaboration with the Verizon product team.
- **Context**: People working in sales and support had to switch between multiple tools during live calls to access customer information. This fragmented workflow slowed them down and increased cognitive load.
- **Goal**: Build an initial version of a unified app to streamline workflows, surface relevant CRM and account data, and enable logging and scheduling — all from a single interface.
- **My role**: Sole product designer leading end-to-end design:
  - Facilitated co-creation sessions with engineering and main stakeholders
  - Designed low- and high-fidelity prototypes
  - Conducted internal testing with stakeholders
  - Supported handoff and implementation across platforms
- **Challenges**:
  - Four platforms with unique tech & UI conventions
  - Limited access to end users
  - Multiple stakeholders with varied priorities
- **Process**: Optimised for clarity and collaboration:
  - Frequent co-creation and feedback sessions with engineers and stakeholders
  - Mapped complex workflows to align understanding
  - Iterated designs rapidly through low- and high-fidelity prototypes
  - Maintained cross-platform consistency while adapting to each OS
- **Outcome**: Successfully shipped the first app version across iOS, Android, macOS and Windows. The product team began collecting real user feedback to guide next iterations.
- Screens (placeholders): contact view (mobile), lead details (mobile)
- Next case: rove.me

#### rove.me
- Premise: Improving retention & content discoverability.
- Meta: product designer · jul 2019 – may 2020 · figma, google analytics, hotjar
- Metrics: +23% unique visitors | +17% returning visitors | +14% bookings
- Summary: Working as the sole designer within a cross-functional team, I helped improve unique visitors, returning visitors and bookings through a sequence of experiments spanning content, design and SEO optimizations.
- **Context**: rove.me is a travel guide that suggests the best time to visit a destination based on the experiences it offers — the actual reasons to go for a trip. The guide focused on time and seasonality, built on both editorial content and data analysis. Seasonality, weather statistics and crowdedness intel all come together in a travel recommendation engine designed to inspire every type of traveller.
- **Goal**: Increase engagement, retention and bookings by making content and features easier to discover.
- **My role**: Sole product designer responsible for:
  - Generating design improvement hypotheses
  - Designing UX/UI improvements, sketches → hi-fi prototypes
  - Crafting UX copy and interactive features
  - Collaborating with engineering on implementation
  - Designing and analysing A/B tests to validate assumptions
- **Constraints**: Limited resources to try and develop ideas.
- **Process**: Optimised for experimentation and fast learning:
  - Reviewed analytics, competitor sites and user behaviour
  - Generated hypotheses for engagement improvements
  - Re-designed interactive features, like a dynamic tooltip for the destination graph
  - Ran A/B tests to validate impact and iterate
- **Outcome**: Through a sequence of experiments encompassing content, design and SEO optimizations we achieved:
  - Unique visitors +23%, returning visitors +17%
  - Bookings +14%
  - Dynamic graph tooltip A/B test increased pages per session by 12%
  - Validated approach to feature discovery, informing future site enhancements
- Screens (placeholders): homepage (desktop), destination graph tooltip
- Next case: PodGuides

#### PodGuides
- Premise: Reimagining travel discovery through podcasts.
- Meta: product designer · jun – aug 2021 · figma, usertesting
- No metrics grid.
- Summary: Led 0→1 concept and MVP design exploring travel discovery through podcasts. Developed in collaboration with the iHeartMedia research team.
- **Context**: Research showed that travellers use podcasts for inspiration, but discovery was fragmented and unstructured. The product team wanted to explore whether curated, location-based podcasts could become a new entry point into travel planning.
- **Goal**: Test whether podcasts could work as a practical travel discovery tool. Launch an MVP to test assumptions and observe real user behaviour ahead of peak travel season.
- **My role**: Sole product designer in a small cross-functional team. Led the process end-to-end — research, concept development, prototyping, testing and final UI. Worked closely with engineering and partnered with iHeartMedia's research team throughout.
- **Process**: Optimised for speed and learning.
  - Early concept validation
  - Rapid low → high fidelity iteration and prototyping
  - Frequent co-creation & feedback sessions
  - Usability testing to refine assumptions
- **Results**: Launched a lightweight MVP to test the concept with real users. After launch, I transitioned off the project while the team continued gathering insights for future iterations.
- Screens (placeholders): concept wireframes, destination guide (mobile)
- Next case: komoot (loops back)

**Case footer** (updated — no separator line above it anymore; "all work" link removed since "work" nav already covers that):
- Stacked vertically, right-aligned (both lines), in this order top to bottom:
  1. `next: [next case] →` — only "[next case] →" portion is underlined/a link; the word "next:" itself is plain, non-linked text.
  2. `have questions? get in touch` — "get in touch" underlined/linked (mailto), "have questions?" plain text. On desktop this line is left-aligned (not right-aligned like the next-case line above it) to align with the case title.
- Section wrapper: `padding-top:24px; margin-top:24px` (no border-top — removed intentionally), inner stack `gap:36px` between the two lines, `padding-top:4px` above the "next" line.

---

### About (`/about`)
**H1**: About

**Bio** (4 paragraphs, in order):
1. I studied engineering before moving into design. I love figuring out how things work, and how they look and feel matters just as much to me.
2. For the last 6+ years I've worked on product-led growth, native mobile apps, websites, and 0→1 discovery and design, mostly remotely and mostly in international teams.
3. I care about craft as much as usefulness. I like polishing details until they earn their place, but I also know when good enough is good enough. Mostly, I want to build things that people actually feel good using.
4. Outside of design, I read a lot, learn German, and explore movement arts.

**Previous work** — table, 7 rows, 3 columns (years / project name — 14px base, 18px in blue-day mode / role tag, right-aligned). Note: the 18px override in blue-day mode is scoped via `:root[data-mode="blue-day"] [data-cv-org]{font-size:18px}` — implement as a mode-conditional style, not a global change.

| Years | Project | Role |
|---|---|---|
| 2024–2025 | komoot | design, growth |
| 2023–2024 | Lezo, Prjctr Library | design, growth |
| 2021 | iHeartMedia PodGuides | discovery & design |
| 2020–2021 | Verizon SideView | discovery & design |
| 2019–2020 | rove.me | design, growth |
| 2018–2019 | UnDo app | design, research |
| 2017–2018 | WoWoenders, Danaeg | concept & design |

*Note: a "Now" section (current status bullets) was drafted and explicitly removed — do not add it unless requested.*

---

### Playlist (`/playlist`)
**H1**: Playlist
**Subhead**: Books I've read recently.

List, NOT numbered (numbers removed — do not add 01–09 back), each row: title, author (right-aligned), links out to a Goodreads search URL (`https://www.goodreads.com/search?q=` + encoded "title author"). Row hover = link-color text + top/bottom border highlight, same as Selected work rows' non-inverted hover style.

| Title | Author |
|---|---|
| The Shortest History of Germany | James Hawes |
| The Art of Color: The Subjective Experience and Objective Rationale of Color | Johannes Itten |
| Politics of Design | Ruben Pater |
| Sapiens | Yuval Noah Harari |
| One Simple Thing: A New Look at the Science of Yoga | Eddie Stern |
| The Culture Map | Erin Meyer |
| Radical Candor | Kim Scott |
| Just Enough Research | Erika Hall |
| The Anatomy of Color: The Story of Heritage Paints and Pigments | Patrick Baty |

Footer text: "last updated august 2026" (update as list changes).

---

### Global footer (every page)
Rendered once, outside the per-page content, as the last child of the flex column. **No border-top / separator** — removed intentionally, do not add one back.

Order top to bottom:
1. Contact paragraph — Mono 13.5px, `dim`, line-height 1.65, max-width 34em:
   > I'm open to product design roles and the occasional project. Interested in working together? Get in touch!
2. Link row — `display:flex; gap:28px; flex-wrap:wrap; margin-top:24px`, Mono 13.5px:
   - `email` → `mailto:viki.kovalkovska@gmail.com`
   - `linkedin ↗` → `https://www.linkedin.com/in/viki-kovalkovska/`
   Both underlined 1px / offset 3px, `link` color, fill-chip hover.
3. Copyright — Mono 11.5px, `faint`, `margin-top:36px`:
   > © 2026 all rights reserved

**Sticky-to-bottom mechanics**: the 760px column is `display:flex; flex-direction:column; min-height:100vh; box-sizing:border-box`. Immediately before the footer sits a flexible spacer `<div style="flex:1 0 auto; min-height:96px"></div>`. On short pages the spacer expands and pushes the footer to the bottom of the viewport; on long pages it collapses to its 96px minimum, guaranteeing breathing room after content. Do not use `position:fixed` — the footer scrolls with the page.

## Outstanding before launch
1. Replace all cover/screen placeholders (16:9 case covers ×4, 4:3 screen pairs ×8) with real screenshots.
2. Confirm Söhne/Söhne Mono commercial license covers intended public audience.
3. Test on real mobile devices (this spec's responsive rules were written but not device-verified).
4. Verify email (`viki.kovalkovska@gmail.com`) and LinkedIn URL are correct before going live.
