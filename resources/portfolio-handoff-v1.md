# Viki Kovalkovska — Portfolio Site
Handoff spec for full Astro build. Source design lives in `Direction 3 - Warm Modes.dc.html` (working prototype) — this doc is the content + design spec extracted from it.

## Stack notes
- Static site, 4 routes: `/` (Work/Home), `/about`, `/playlist`, and case study pages (`/work/[slug]` — komoot, verizon, roveme, podguides).
- No backend. All content below can live in Astro content collections (e.g. `src/content/cases/*.md`) or a simple data file.
- Client-side theme toggle persisted to localStorage (see Theme section).

## Fonts
- **Söhne** (sans) — body text, headings. Weights used: 400 (Buch), 500 (Kraftig), 600 (Halbfett).
- **Söhne Mono** — labels, metadata, nav, dates, section headers (uppercase, letter-spacing 0.06em). Weights: 400 (Buch), 500 (Kraftig).
- Self-hosted `.otf` files (not Google Fonts). **License check needed**: Klim Type Foundry commercial license required for production/public use beyond personal testing — confirm before shipping live.
- Fallback stack: `"Sohne", system-ui, sans-serif` / `"Sohne Mono", monospace`.

## Layout
- Single column, `max-width: 760px`, centered, `padding: 0 32px 40px`.
- Header: name (left) + nav (right): work / about / playlist / theme toggle button. Sticky header was explicitly rejected — keep it static, scrolls with page.
- Mobile breakpoint at 600px (see Responsive section).

## Theme system (3 modes, cycled by one button, persisted in localStorage key `vk-portfolio-mode`)
Default on load: **Cold day**.

| Token | Cold day (default) | Cool night | Blue day |
|---|---|---|---|
| `--bg` | `#F4F6F9` | `#1B1D22` | `#F4F6F9` |
| `--ink` (primary text) | `#1B222B` | `#DCDFE3` | `#1251A5` |
| `--dim` (secondary text) | `#4B545E` | `#A3ABB9` | `#1B5AB0` |
| `--faint` (tertiary/labels) | `#4C545D` | `#A6AEBC` | `#3568B5` |
| `--line` (borders) | `#DDE3EA` | `#31333B` | `#C7D9F0` |
| `--frame` (placeholder bg) | `#EAEEF3` | `#262932` | `#EAEEF3` |
| `--dot` (availability dot) | `#1B5AB0` | `#68A4E1` | `#1B5AB0` |
| `--link` (links, active states, hover) | `#1251A5` | `#76AFE7` | `#1251A5` |
| `--hover-tint` | `rgba(27,90,176,.14)` | `rgba(118,175,231,.22)` | `rgba(27,90,176,.14)` |
| `--hover-ink` (text on filled hover bg) | `#F4F6F8` | `#1C2025` | `#F4F6F8` |

Notes:
- Cold day and cool night use neutral gray text (ink/dim/faint) with blue reserved for links/accents only.
- Blue day is a variant where ALL text tones shift into shades of the accent blue (ink/dim/faint all blue). In blue-day mode only, Previous-work project names render at 18px (vs 14px base) to carry more visual weight since color no longer distinguishes them as strongly.
- Toggle icon: cold day = sun (circle + rays), cool night = crescent moon, blue day = circle with center dot. Cycle order: cold day → cool night → blue day → cold day.
- Text selection (`::selection`) uses `background: var(--link)`, `color: var(--hover-ink)`.
- Background/color transition: `240ms ease` on mode switch.

## Interaction patterns
- **Row hover** (Selected work rows, Previous work is NOT a link so no hover, Details `<details>` summaries, Playlist rows): text inside turns `var(--link)`, and the row's top+bottom border also turns `var(--link)`. No background fill.
- **Nav / text link hover**: background fills `var(--link)`, text becomes `var(--hover-ink)` (i.e. a solid-fill hover chip), corners square (no border-radius).
- **Mode button hover**: icon color turns `var(--link)`.
- Underlined inline links (email, linkedin, "get in touch") use `text-decoration-color: var(--link)`, thickness 1px, offset 3px; on hover the same fill-chip treatment applies.
- No page-transition animation (removed intentionally — pages should render instantly, no fade-in).
- `<details>` elements are collapsed by default; chevron (▸) rotates 90° when open.

## Responsive (max-width: 600px)
- Header wraps (name + nav can go to two lines) instead of overlapping.
- Hero H1 drops to 26px.
- Selected-work rows collapse from 3-column grid (`28px 1fr auto`) to 2-column (`24px 1fr`); the description/date block spans full width below, left-aligned.
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

**Body paragraph 2**:
> I'm looking for my next role right now, and I'm happy to chat about any of the projects below. Get in touch!

**Selected work** — 4 rows, numbered 01–04, each: title (19px/500), a mono tag, one outcome-line description, year range right-aligned. Rows link to case pages.

| # | Title | Tag | Description | Years | Links to |
|---|---|---|---|---|---|
| 01 | komoot | product design · acquisition (SEO) squad | As part of the growth team, I contributed to improving signup rate by 1.96× and activation rate by 2.04×. | 2024–25 | /work/komoot |
| 02 | Verizon Sideview | 0→1, cross-platform app | Led the 0→1 design of a native cross-platform app that gives sales and support teams a unified view of contact and account data during calls, shipped across iOS, Android, macOS and Windows. | 2020–21 | /work/verizon |
| 03 | rove.me | retention, engagement | As part of cross-functional team, I contributed to improving unique visitors by 23%, returning visitors by 17% and bookings by 14%, through a sequence of experiments spanning content, design and SEO optimizations. | 2019–20 | /work/roveme |
| 04 | PodGuides | product concept, mvp | Led 0→1 concept and MVP design exploring travel discovery through podcasts. Developed in collaboration with the iHeartMedia research team. | 2021 | /work/podguides |

**Contact block** (bottom of Home):
> I'm open to product design roles and the occasional project. Interested in working together? Get in touch!
Links: `email` → `mailto:viki.kovalkovska@gmail.com`, `linkedin ↗` → `https://www.linkedin.com/in/viki-kovalkovska/`

---

### Case study pages (4 total, same template)
Template order: back link → title (36px) → premise (20px) → meta tags (mono, faint) → cover image (16:9 placeholder, **needs real screenshot**) → **Overview** (optional metrics grid + summary paragraph) → **The details** (collapsible sections) → **Selected screens** (image grid, 2 placeholders per case, **needs real screenshots**) → footer (have questions?/get in touch, next case link, all work link).

Metrics grid: cells separated by 1px `var(--link)` gridlines, value in 30px `var(--link)`, label below in mono/11.5px/`var(--link)`.

#### komoot
- Premise: Enhancing user acquisition, activation, and user experience.
- Meta: product designer, growth squad · jun 2024 – sep 2025 · figma, dovetail
- Metrics: 1.96× signup rate | 2.04× activation rate, yoy
- Summary: Our squad owned komoot's web journey from first visit to activation. I led the user research, owned design iterations and prototyping, and turned data and research insights into testable solutions. Most changes shipped behind an A/B test.
- **Context**: komoot is a route planner app with the goal of offering tailored route recommendations for any activity, anywhere. With 22 million active users in 2025, it helps people find, plan, share and track outdoor adventures. Our squad owned all of komoot's landing pages and the web user journey from first visit to activation — the seven-day explorer window. We worked closely with the data science and growth teams responsible for monetisation and retention, relying heavily on analytics, user research and A/B tests.
- **My role**: As product designer within the squad, I led user research, owned design iterations and prototyping, turning data and research insights into testable design directions.
  - Led the user research and turned insights into testable design directions
  - Owned design iterations and prototyping
  - Collaborated closely with front- and back-end engineers, analysts and the wider design team
  - Contributed to the design system and the broader research practice
- **Deep dive: improving conversion on guide pages**: Guide pages were consistently our highest-traffic, highest-signup content type, driving nearly 60% of all web signups in June alone. When changes to how content was displayed required us to rethink these pages, we saw an opportunity to focus our efforts where the impact would be greatest. I led the user research to find out how first-time visitors perceived the updated guide pages, and iterated design improvements based on user insights.
  - Visitors found site content mostly useful and engaging despite content changes (set limitations & introduced signup wall)
  - Users had difficulties navigating the mobile version of the site
  - Signup banner pop-ups were frustrating for most users
  - Many research participants didn't realise creating a komoot account was free
  - Users paid the most attention to photos, using them to judge whether a route would be interesting
  - Route star ratings and stats built credibility and trust
- **Outcomes and results**: Based on our findings, we implemented a series of changes to better communicate the value of creating an account and reduce friction. Most of these changes were tested to make sure we were making a positive impact. Changes included improvements to how route limitations were presented on destination pages, and the navigation menu for mobile web.
  - Drove 18–20% of all komoot signups in 2024
  - Increased signup rate by 1.96×
  - Increased activation rate by 2.04× (YoY growth of users coming from web)
- Screens (placeholders): guide page (desktop), guide page (mobile)
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

Each case footer: "have questions? get in touch" (email link) + "next: [next case] →" + "all work" (back to home).

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

**Contact block** (same pattern as Home): "I'm open to product design roles and the occasional project. Interested in working together? Get in touch!" + email/linkedin links.

*Note: a "Now" section (current status bullets) was drafted and explicitly removed — do not add it unless requested.*

---

### Playlist (`/playlist`)
**H1**: Playlist
**Subhead**: Books I've read recently.

Numbered list (01–09), each row: number, title, author (right-aligned), links out to a Goodreads search URL (`https://www.goodreads.com/search?q=` + encoded "title author"). Row hover = link-color text + top/bottom border highlight, same as Selected work rows.

| # | Title | Author |
|---|---|---|
| 01 | The Shortest History of Germany | James Hawes |
| 02 | The Art of Color: The Subjective Experience and Objective Rationale of Color | Johannes Itten |
| 03 | Politics of Design | Ruben Pater |
| 04 | Sapiens | Yuval Noah Harari |
| 05 | One Simple Thing: A New Look at the Science of Yoga | Eddie Stern |
| 06 | The Culture Map | Erin Meyer |
| 07 | Radical Candor | Kim Scott |
| 08 | Just Enough Research | Erika Hall |
| 09 | The Anatomy of Color: The Story of Heritage Paints and Pigments | Patrick Baty |

Footer text: "last updated august 2026" (update as list changes).

Contact block at bottom, same pattern as Home/About.

---

### Global footer (every page)
> © 2026 all rights reserved

## Outstanding before launch
1. Replace all cover/screen placeholders (16:9 case covers ×4, 4:3 screen pairs ×8) with real screenshots.
2. Confirm Söhne/Söhne Mono commercial license covers intended public audience.
3. Test on real mobile devices (this spec's responsive rules were written but not device-verified).
4. Verify email (`viki.kovalkovska@gmail.com`) and LinkedIn URL are correct before going live.
