<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-10-18T11:05:00Z mode=descriptive input="https://www.about.hsbc.co.uk/ --prep --dynamics" read=stardust/current/_brand-extraction.json,stardust/current/_computed-styles.json,stardust/current/pages/*.json,application.css synthesized=none -->
---
name: About HSBC — HSBC UK
description: HSBC UK corporate information and press site (Sitecore "PWS171 StarterKit" theme)
colors:
  text-primary: "#333333"
  background: "#ffffff"
  surface: "#ededed"
  surface-dark: "#253038"
  surface-inverse: "#000000"
  border: "#d7d8d6"
  border-strong: "#505050"
  primary: "#da0011"
  primary-hover: "#de0011"
  scrim: "rgba(0, 0, 0, 0.7)"
typography:
  display:
    fontFamily: "univers-ultra-light, univers-thin, sans-serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "univers-thin, sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "univers-light, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1
  subtitle:
    fontFamily: "univers-regular, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.25
  label-strong:
    fontFamily: "univers-bold, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.34
  body-large:
    fontFamily: "univers-regular, sans-serif"
    fontSize: "18px"
    fontWeight: 400
  body:
    fontFamily: "univers-regular, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  caption:
    fontFamily: "univers-regular, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px"
  footer:
    backgroundColor: "{colors.surface-inverse}"
    textColor: "{colors.background}"
    typography: "{typography.caption}"
  share-bar:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.background}"
---

# Design System: About HSBC — HSBC UK (current state)

## Overview

**Creative North Star: "The Annual-Report Page"** — a sober, white, square-cornered corporate
publication. Large ultra-light Univers headlines over full-bleed photography, then long
single-column editorial text with a narrow right rail. Red is a signal, never a field.

This file is **descriptive**: it records what the live site renders (35 pages measured at
1440 and 360; 579 pages captured, 336 in the migration roster), not what it should become.

**Key Characteristics:**
- One typeface, Univers Next for HSBC, with weight expressed through separate font families
  (ultra-light → bold), each rendered at CSS `font-weight: 400`.
- Pure white canvas, `#333333` text, HSBC red `#da0011` only on the logo, the active-nav rule,
  primary buttons and link hover.
- Zero border radius anywhere; depth comes from one soft 5px shadow and dark overlays.
- Full-bleed hero image banner (≤ 485px tall) with a dark share bar overlapping its base edge.
- 12-column layout grid with named splits (`layout--9-3`, `6-3-3`, `6-6`, `3-3-3-3`, `4-4-4`).

## Colors

**The Red Signal Rule.** `#da0011` appears on fewer than 1% of painted elements (8 of ~4,600
weighted hits). It marks brand, the current primary-nav item, primary buttons and link hover
(`#333333 → #de0011`). It is never a section background.

- **text-primary `#333333`** — all body copy, headings and links (2,928 weighted hits).
- **background `#ffffff`** — page canvas and most cards.
- **surface `#ededed`** / **border `#d7d8d6`** — sidebar panels, table rules, hairlines.
- **surface-dark `#253038`** — share-actions bar and dark promo panels.
- **surface-inverse `#000000`** — top utility strip (Personal | Business) and footer.
- **scrim `rgba(0,0,0,0.7)`** — video play/pause control and image overlays.

## Typography

**The Thin Headline Rule.** Page titles are set in `univers-ultra-light` or `univers-thin`
at 56px (40–48px at 360). Section headings step down through `univers-thin 36px`,
`univers-light 30px` and `univers-regular 24px`; emphasis in body uses `univers-bold`.

- Scale (px): 56 → 48 → 40 → 36 → 30 → 24 → 18 → 16 → 14 → 12. Ratios 1.05–1.33: **ad-hoc**, no
  modular scale.
- Root font-size is 62.5% (1rem = 10px); components size in rem.
- Fonts ship as EOT/WOFF/TTF (no WOFF2) from `/assets/PWS171/fonts/`, no `font-display`.
  Licensed (Monotype "W02" web kit) — flag `private`.
- Icon font `pwsicons` supplies external-link (U+E900), download and internal-link glyphs.

## Layout

- Fixed "wedge" header: black utility strip, white bar with logo + primary nav
  (HSBC UK · News and media · Management team · History) + search; shrinks on scroll and
  collapses to a nav-tray below 960px.
- **Cap model (cap-probe, 7 archetypes, probe 2560):** shell `layout-container` max-width
  **1220px**; article/section main column `layout__primary` fixed **880px**; timeline copy
  module 680px; hero banner and cinemagraph full-bleed. Not consistent across archetypes
  (home and articles keep a fluid shell) — recorded in `DESIGN.json extensions.breakpoints`.
- Content sits in `layout-container` on a 12-column grid. Articles use **9 + 3**
  (main + right rail); listing and section pages add **6-3-3**, **3-3-3-3**, **4-4-4**.
- Source breakpoints are max-width and plentiful: 1220, 1200, 1120, 1080, 959, 800, 780, 650,
  640, 560 (plus a height-bound phone rule). The heaviest are 800, 1080 and 640.

## Elevation & Depth

- Header shadow: `0 1px 4px rgba(0,0,0,0.2)` on `#header`.
- Overlay shadow: `0 0 5px rgba(0,0,0,0.4)` (70 hits = one per page × width) on the
  consent modal dialog — a third-party overlay, not page chrome.
- Doormat/nav-tray: `0 4px 3px -3px rgba(0,0,0,0.3), inset 0 20px 4px -20px rgba(0,0,0,0.2)`.
- No other elevation; cards are flat with hairline borders.

## Shapes

**The Square Rule.** No element on any measured page has a non-zero border-radius.
Links are underlined with a 50% hard-stop linear-gradient (198 hits) rather than
`text-decoration`.

## Components

- **Header (wedge)** — system component on 310/310 content pages.
- **Hero image banner** (`header-area`) — full-bleed photo, max-height 485px, with
  **share actions** (X / Facebook / LinkedIn on `#253038`) overlapping its lower edge.
- **Page description** — date line, ultra-light H1, light standfirst.
- **Editorial text** (`text--editorial`, optional `text--dropcap`) — the article body;
  inline images, inline tables, factboxes, image-viewer (zoomable infographic).
- **Long-form promo** — image + heading + text tile (home and section pages).
- **Stats** (`floating-container`) — large-number fact panels.
- **Cinemagraph** — looping MP4 feature with play/pause on the home page.
- **Year accordion + tabular list** — news archive and bond-document tables.
- **Exec bio** — portrait + name + role rows (management team, timeline).
- **Media enquiries disclaimer** — press-contact block at the foot of every article.
- **Footer** — black strip: Accessibility · Privacy notice · Terms of use · Cookie notice ·
  Contact and support · © HSBC Group.

## Do's and Don'ts

Descriptive constraints observed on the live site:

- Do keep corners square and the canvas white.
- Do carry hierarchy with face weight (thin vs regular), not CSS font-weight.
- Do reserve red for brand marks, the active-nav rule, primary buttons and hover.
- Don't introduce rounded cards, gradients-as-fills or coloured section bands; none exist.
- Don't rely on alt text as captured: 98% of content images ship `alt=""`.
