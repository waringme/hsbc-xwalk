<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-10-18T11:10:00Z mode=descriptive input="https://www.about.hsbc.co.uk/ --prep --dynamics" read=stardust/current/pages/*.json,stardust/current/_brand-extraction.json,stardust/current/_crawl-log.json synthesized=Users,Product Purpose,Positioning,Product Principles (inferred from captured copy) -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred_ — basis: the news listing states "These press releases are intended
for UK journalists only", and every article ends in a "Media enquiries to:" block.

- **UK journalists and media** — the primary audience of the 310 press releases.
- **Investors and analysts** — Regulated Covered Bond Programme documents, postcode lending data.
- **Customers, job-seekers and the public** checking who HSBC UK is: services, headquarters,
  CEO, management team, history, inclusion and community work.

## Product Purpose

_provenance: inferred_ — basis: home meta description and section headings.

The corporate "About HSBC" site for HSBC UK Bank plc. It describes the bank's services,
headquarters, CEO, management team and history, and publishes the UK press-release archive
(2020 – 2026). It is an information and press site, not a banking tool: no sign-in, no
products to apply for. Personal and Business banking live on separate sites, reached from the
top utility strip.

## Positioning

_provenance: inferred_ — "We are opening up a world of opportunity, supporting the financial
health of individuals, businesses and communities across the UK – now and for the future."
(home, first paragraph).

## Capabilities and Constraints

- Sitecore-rendered (`/-/media/` media library, `sc_lang=en-GB`, PWS171 StarterKit theme).
- Site search at `/search` (GET `?query=`, tabbed results).
- Tealium tag management (`tags.tiqcdn.com`) drives the cookie-consent modal; Brightcove
  scripts are loaded on every page; the home feature is a self-hosted MP4 cinemagraph.
- External links trigger a "leaving this site" confirmation modal.
- The sitemap lists 554 URLs (UTF-16 encoded, `<loc>` values without a scheme). It omits
  the en-GB news listing `/news-and-media`, `/search`, and 26 en-GB press releases (25 listed
  only as their empty `/en/` shell, 1 reachable only by link). Observed redirects:
  `/cookie-policy` → `/cookie-notice`, `/en-gb/news-and-media` → `/news-and-media`.
- **Two locale trees.** The en-GB root carries the content. Of the 257 `/en/` URLs, 243 render
  an empty shell (no title, no body); `/en/` itself is a different "About HSBC" group page;
  `/en/hsbc-uk` and `/en/hsbc-uk/community` repeat the home page.
- `/hsbc-uk` and `/hsbc-uk/community` serve content identical to `/`.

## Brand Commitments

- **Register:** `brand` (corporate information + press; no product UI).
- **Identity:** HSBC masterbrand hexagon logo (SVG), HSBC red `#da0011`, Univers Next for HSBC
  (licensed web kit) as the only typeface.
- **Personality (observed):** sober, institutional, editorial, restrained — long-form text,
  thin large headlines, documentary photography.
- **Anti-references (observed absences):** no rounded UI, no gradients, no illustration,
  no marketing CTAs, no colour-blocked sections.

## Evidence on Hand

- `stardust/current/pages/` — 579 live-rendered page records (336 in roster after the /en/ shells were descoped) + settled DOM (`.html`).
- `stardust/current/assets/screenshots/` — 579 full-page captures (consent modal baked in).
- `stardust/current/assets/logo.svg`, `favicon.png`, `fonts/` (7 Univers Next WOFF faces).
- `stardust/current/_computed-styles.json` — census of 35 representative pages at 1440 + 360.
- `stardust/current/_brand-extraction.json`, `DESIGN.md`, `DESIGN.json`.
- **Absences:** 98% of content images carry `alt=""` — there is no alt-text corpus to reuse.
  No testimonials, pricing or product data exist on the site and must not be invented.

## Product Principles

_provenance: inferred_

1. Facts first: press releases and disclosures are published verbatim and dated.
2. Journalists must reach a named media contact from every release.
3. Corporate restraint: the brand speaks through typography and photography, not decoration.

## Accessibility & Inclusion

The site has an accessibility statement (`/accessibility`), skip links, and keyboard focus
traps on the nav tray. Observed gaps: empty alt text on 98% of content images; the consent
modal covers the first viewport until it is dismissed.
