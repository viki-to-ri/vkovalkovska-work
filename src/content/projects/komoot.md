---
# Copy rules for this case only: no em dashes in body copy (the screen captions
# keep theirs as separators), typographic apostrophes (’) throughout, and mostly
# "we" — the work was collaborative. The wording is Viki's; don't polish it.
title: "komoot"
order: 1
tag: "product design · acquisition (SEO) squad"
description: "As part of the growth team, I contributed to improving signup rate by 1.96× and activation rate by 2.04×."
years: "2024–25"
premise: "Enhancing user acquisition, activation, and user experience."
meta:
  - "product designer, acquisition (SEO) squad"
  - "jun 2024 – sep 2025"
  - "figma, dovetail"
# Experiment-level, not squad-level — the 1.96× / 2.04× figures live in Results.
# +12% is the GUIDE page banner, +8% the TOUR page banner. Don't swap them.
metrics:
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
        with the data science and growth teams who owned monetisation and
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
        Guide pages were our highest-traffic, highest-signup content type, with
        close to 60% of all web signups in June. So when a change to how content
        was displayed meant we had to rethink these pages anyway, it seemed like a
        good place to spend our effort.
      - >-
        Our goal was to clearly communicate komoot’s value proposition and the
        value of creating an account, help people find a perfect route, and
        inspire them to go out within the next 7 days.
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
        frustrating for most visitors, but removing it wasn’t possible at the
        time, so timing became the thing we could work on.
      - >-
        We’d also assumed that komoot’s community and its user-generated content
        would be the most compelling reason to sign up. The A/B test suggested
        otherwise. People were more motivated when they could see a clear number
        of routes they’d get access to. The rest of the research gave us useful
        material to work with:
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
      - >-
        We tested three versions of the end-of-page signup banner on guide pages,
        and variation 1 brought in 12% more signups than control. We rebuilt the
        signup banner on tour pages the same way, which came out 8% ahead of
        control. Both shipped.
      - >-
        We also changed the timing and targeting of the initial signup popup, and
        rewrote the copy on buttons and signup modules so that a free account
        actually reads as free.
  - label: "What we left out"
    body:
      - >-
        We had to keep the scope tight, so quite a few things moved further up the
        product timeline. Removing the signup popup entirely, filtering for
        logged-out visitors, rethinking navigation across mobile and desktop,
        redesigning tour cards to lead with photos, and reworking the main CTAs on
        those cards all came out of scope.
      - >-
        Navigation and the tour-card CTAs were the ones I thought were essential
        to improving the pages, and the research pointed at both. We couldn’t fit
        them into the quarter, but we opened experiments on them in the next one.
  - label: "Results"
    body: >-
      Across everything the squad did on the activation journey and on guide and
      tour pages over the year:
    bullets:
      - "18–20% of all komoot signups in 2024 came through web"
      - "Signup rate increased by 1.96×"
      - "Activation rate increased by 2.04× (YoY growth of users coming from web)"
  - label: "Other work in the squad"
    body: >-
      Guide and tour pages were one project among many. Over the next months we
      also picked up several of the things this deep dive had put on the list, and
      plenty that it hadn’t:
    bullets:
      - "Improved the CTAs on tour cards"
      - "Smoothed the redirects and transitions between logged-out and logged-in pages"
      - "Fixed site navigation on mobile and desktop"
      - "Experimented with how routes are saved, and where people land after signing up depending on the page they signed up from"
      - "Started on changes to how tours could be filtered"
      - "Started fixing the onboarding setup flows"
# Real assets are coming: three banner variants, a gif of the tour page experiment
# (needs a static poster frame for print/PDF), and the smart tour page on desktop
# and mobile.
screens:
  - caption: "signup banner — control"
  - caption: "signup banner — variation 1 (+12%)"
  - caption: "signup banner — variation 2"
  - caption: "tour page signup banner — experiment (gif)"
  - caption: "smart tour page, desktop"
  - caption: "smart tour page, mobile"
---
