<!-- stardust:provenance writtenBy=stardust:replica writtenAt=2026-10-18T11:45:00Z input="replica Phase 2" read=stardust/current/_brand-extraction.json,DESIGN.json,state.json synthesized=none -->
# Inconsistency register — about.hsbc.co.uk replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an
improvement. All entries are **deferred** until the owner decides: this run is a pure replica.

## R-01 — Content images ship empty alt text

- **Evidence:** 433 of 442 content images carry `alt=""` (`_brand-extraction.json § images`;
  aggregated from `stardust/current/pages/*.json § media.imgs`).
- **Finding:** accessibility defect — meaningful photography (CEO portrait, HQ, event photos)
  is announced as decorative.
- **Minimal change:** author alt text per image at import time; no visual change.
- **Status:** deferred
- **Where:** all page types (hero banners, promo tiles, exec bios, inline images)

## R-02 — Container caps differ between archetypes

- **Evidence:** cap-probe (DESIGN.json `extensions.breakpoints.capRegister`): shell fluid on
  `/` and articles, 1220px on `/news-and-media`, `/search` and others; main column 880px fixed.
- **Finding:** the same layout shell caps at different widths per template with no responsive
  cause.
- **Minimal change:** one shell cap (1220px) for every template; only visible above 1220px.
- **Status:** deferred
- **Where:** landing, article (wide viewports only)

## R-03 — Single 680px module cap on the timeline

- **Evidence:** cap-probe: `div.exec-bio > div.exec-bio__copy` capped 680px on
  `/history-timeline` only.
- **Finding:** one module caps narrower than its siblings in the same 880px column — intent or
  authoring slip.
- **Minimal change:** none until the owner confirms intent; kept as captured.
- **Status:** deferred
- **Where:** unique (history-timeline)

## R-04 — Broken internal links on the source

- **Evidence:** `state.json § site.sourceBrokenLinks` — `/privacy-policy` and
  `/privacy-statement` return 404; three links are malformed (relative mailto, scheme-less
  `www.hsbc.co.uk/international`, unresolved `~/link.aspx`).
- **Finding:** content defects carried by the source.
- **Minimal change:** repoint to `/privacy-notice`, `mailto:` and `https://` targets at import.
- **Status:** deferred
- **Where:** article, static
