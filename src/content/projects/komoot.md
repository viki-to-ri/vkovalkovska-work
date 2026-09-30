---
# Copy rules for this case only: no em dashes in body copy (the screen captions
# keep theirs as separators), typographic apostrophes (’) throughout, and mostly
# "we" — the work was collaborative. The wording is Viki's; don't polish it.
title: "komoot"
order: 1
tag: "product design · acquisition (SEO) squad"
description: "As part of the growth team, I helped increase the signup rate 1.96× and the activation rate 2.04×."
years: "2024–25"
premise: "Enhancing user acquisition, activation, and user experience."
meta:
  - "product designer, acquisition (SEO) squad"
  - "jun 2024 – sep 2025"
  - "figma, dovetail"
# Renders at the default 5:3 coverRatio. The other three set 16:9.
cover: "../../assets/komoot/komoot-cover.webp"
coverAlt: "komoot Iceland hikes guide page shown in a browser window"
# Four, in this order: the two squad-level YoY figures first, then the two
# experiment results. The YoY pair also appears in Results, on purpose.
# +12% is the GUIDE page banner, +8% the TOUR page banner. Don't swap them.
# × is U+00D7, not the letter x.
metrics:
  - value: "1.96×"
    label: "signup rate increase (YoY)"
  - value: "2.04×"
    label: "activation rate increase (YoY)"
  - value: "+12%"
    label: "signups — guide page banner vs. control"
  - value: "+8%"
    label: "signups — tour page banner vs. control"
summary: >-
  Our squad owned komoot’s web journey from first visit to activation. I led the
  user research, owned design iterations and prototyping, and turned data and
  research insights into testable solutions. Most changes shipped behind an A/B test.
details:
  - label: "Context"
    body:
      - >-
        komoot is a route planner app offering tailored route recommendations for
        any activity, anywhere. With 22 million active users in 2025, it helps
        people find, plan, share and track outdoor adventures.
      - >-
        Our squad owned all of komoot’s landing pages and the web journey from
        first visit to activation, the seven-day explorer window. We worked closely
        with the data science and growth teams, who owned monetisation and
        retention, so analytics, research and A/B tests were part of how we made
        most decisions.
  - label: "My role"
    body: >-
      I was the product designer in the squad. I led the user research, owned the
      design iterations and prototyping, and worked with the team to turn what we
      learned into things we could actually test. I also contributed to the design
      system and to how the wider team ran research.
  - label: "Deep dive: guide and tour pages"
    body:
      - >-
        Guide and tour pages were our highest-traffic, highest-signup content type,
        bringing in 36% and 45% of all web signups. So when a change to how content
        was displayed meant we had to rethink these pages anyway, it seemed like a
        good place to spend our effort.
      - text: >-
          Our goals were to clearly communicate komoot’s value proposition and the
          benefits of creating an account, help people find the perfect route, and
          inspire them to go out within the next seven days.
        note: "See Guide page in selected screens"
  - label: "Process"
    body:
      - >-
        We started with product analytics, to see how the content changes had
        affected behaviour and our main KPIs. That told us what had moved but not
        why, so we followed up with qualitative research.
      - >-
        We ran ten unmoderated usability tests and interviews on mobile and ten on
        desktop. We matched the structure of an earlier study on purpose, so we
        could compare results instead of starting from scratch. From there I
        iterated design directions against our goals, and we scored them together
        on an impact-effort scale.
  - label: "What we learned"
    body:
      - >-
        We were surprised to learn that most people simply didn’t realise a komoot
        account was free. We confirmed our assumption that the signup popup was
        frustrating for most visitors, but removing it wasn’t possible at the time,
        so we focused on its timing instead.
      - >-
        We’d also assumed that komoot’s community and its user-generated content
        would be the most compelling reason to sign up. The A/B test suggested
        otherwise. People visiting the site for the first time intended to find a
        route, and were more motivated to create an account and see more content
        when they could see exactly how many routes they’d get access to. The rest
        of the research gave us useful material to work with:
    bullets:
      - "People paid the most attention to photos, using them to judge whether a route would be interesting"
      - "Star ratings and route stats built credibility and trust"
      - "People found the content useful and engaging despite the new limitations and the signup wall"
      - "The mobile version of the site was difficult to navigate"
  - label: "What we shipped"
    body:
      - >-
        We went for the overlap between what the research told us, what we were
        trying to achieve, and what didn’t need much engineering time. Almost
        everything shipped behind an A/B test.
      - text: >-
          We tested two versions of the end-of-page signup banner on guide pages,
          and Variation 1 brought in 12% more signups than the control. We rebuilt
          the signup banner on tour pages the same way, which came out 8% ahead of
          the control. Both shipped.
        note: "See Variations 1 and 2 in selected screens"
      - >-
        We also changed the timing and targeting of the initial signup popup, and
        rewrote the copy on buttons and signup modules so that a free account
        actually reads as free.
  - label: "What we left out"
    body:
      - >-
        We had to keep the scope tight, so quite a few things moved further down
        the roadmap. Removing the signup popup entirely, adding a way to filter
        routes, rethinking navigation across mobile and desktop, redesigning tour
        cards to lead with photos, and reworking the main CTAs on those cards all
        fell out of scope.
      - >-
        Navigation and the tour-card CTAs were the two I considered essential to
        improving the pages, and the research pointed to both. We couldn’t fit them
        into the quarter, but we started experiments on them the following quarter.
  - label: "Results"
    body: >-
      Across everything the squad did on the activation journey and on guide and
      tour pages over the year:
    bullets:
      - "18–20% of all komoot signups in 2024 came through web"
      - "Signup rate increased 1.96×"
      # The newline is deliberate and is rendered — .detail-body li is pre-line.
      - "Activation rate increased 2.04×\n(YoY growth of users coming from the web)"
  - label: "Other work in the squad"
    body: >-
      Guide and tour pages were one project among many. Over the following months
      we also picked up several of the things this deep dive had put on the list,
      and plenty that it hadn’t:
    bullets:
      - "Improved the CTAs on tour cards"
      - "Smoothed the redirects and transitions between logged-out and logged-in pages"
      - "Fixed site navigation on mobile and desktop"
      - "Experimented with how routes are saved and where people land after signing up, depending on the page they signed up from"
      - "Started on changes to how tours could be filtered"
      - "Started fixing the onboarding setup flows"
# Selected screens. `pageFigure` switches the section from the placeholder grid
# to the figure layout. Both `title` fields below are carried but not rendered —
# the "Guide page" and "Updated sign up module" headings were removed on purpose.
pageFigure:
  title: "Guide page"
  caption: >-
    Guide and tour pages were our highest-traffic, highest-signup content type,
    bringing in 36% and 45% of all web signups.
  alt: "Full-length komoot guide page for hikes in Iceland"
  src: "../../assets/komoot/komoot-guide-page.webp"
# Figure captions are switched off for now — each figure shows its kicker only.
# The text is kept below, commented out; uncomment a caption to bring it back.
figures:
  - kicker: "before / after"
    # caption: >-
    #   41% of all web signups came from this signup module at the end of the page.
    #   We improved the old inline link by making it more visible and by showing the
    #   content available after creating an account.
    alt: "Side-by-side comparison of the komoot signup module before and after"
    src: "../../assets/komoot/komoot-before-after.webp"
  - kicker: "design variations"
    # caption: >-
    #   Two signup module versions we tested for guide pages. Variation 1, leading
    #   with the number of routes, brought in 12% more signups than the control.
    alt: "Side-by-side comparison of signup banner variation 1 and variation 2"
    src: "../../assets/komoot/komoot-variants.webp"
  # Quoted on one line on purpose: this caption is the author's own edit and keeps
  # its double space before "which" and its straight apostrophe in "didn't".
  - kicker: "tour page sign up module"
    # caption: "Sign up module variant for tour pages  which we didn't ship in the end, showing the route details available after creating an account."
    alt: "Animated komoot tour page with a sign up module for waytypes, surfaces and tour profile"
    src: "../../assets/komoot/komoot-tour-surface.gif"
---
