<!-- stardust:provenance writtenBy=stardust:stardust writtenAt=2026-10-18T11:25:00Z mode=proposal input="Analyze the source site https://www.about.hsbc.co.uk/ and propose an EDS design-migration plan. Do not modify the repository yet" read=stardust/state.json,stardust/current/*,catalog/template-catalog.json,tools/importer/page-templates.json synthesized=plan (proposal, nothing executed) -->
# EDS design-migration plan — about.hsbc.co.uk (PROPOSAL, not executed)

**Flow: replica.** The design is kept and only the platform changes. Say "switch to redesign"
if the design should change. Replica runs its own preparation; no separate
`prepare-migration` step applies.

## 1. What the analysis found

| | |
|---|---|
| Pages captured live | 553 of 556 (sitemap 554 + 2 it omits: `/news-and-media`, `/search`). The 3 failures are intentional 400/403/404 pages. |
| Real content pages | **~310 en-GB pages**: 284 press releases, 26 other pages |
| `/en/` tree | 243 of 257 URLs render an empty shell (no title, no body). `/en/` itself is a distinct "About HSBC" group page. |
| Duplicates | `/hsbc-uk`, `/hsbc-uk/community` (+ `/en/` twins) serve the home page verbatim |
| Platform | Sitecore, PWS171 StarterKit theme, Tealium consent, Brightcove scripts, self-hosted MP4 |
| Design system | White canvas, `#333` text, HSBC red `#da0011` as a signal only, radius 0, one licensed typeface (Univers Next for HSBC, 7 faces, weight via face), ad-hoc type scale 56→12px, 1220px shell / 880px main column, no CSS tokens |

## 2. Archetypes (one recreated and gated per page type)

| # | Page type | Archetype URL | Pages it covers | Key modules |
|---|---|---|---|---|
| A1 | article | `/news-and-media/100-year-biodiversity-bid-…` | 284 | hero banner + page description, share bar, editorial text, media-enquiries block |
| A2 | landing | `/` | 3 en-GB + 3 `/en/` duplicates | hero + stats, cinemagraph video, services/HQ/CEO split, promo tiles |
| A3 | listing | `/news-and-media` | 1 (+ `/en/` shell) | featured news cards, year accordion 2020–2026, media-contacts rail, "Views on HSBC.com" row |
| A4 | program | `/hsbc-uk/inclusion` | 4 (+ 4 `/en/`) | 9+3 text + rail, factbox, 3-3-3-3 tiles; variants: bond programme (accordion + document table), fintechs, postcode data |
| A5 | static | `/terms-of-use` | 4 (+ 4 `/en/`) | long editorial text, inline tables (cookie notice) |
| A6 | unique | `/history-timeline`, `/management-team` | 2 (+ 2 `/en/`) | timeline entries, exec bios (6-3-3) |
| A7 | form | `/search` | 1 (+ `/en/search`) | search tabs + results (GET `?query=`) |
| A8 | landing (variant) | `/en/` | 1 | "About HSBC" promo grid; decide scope first (Q1) |

## 3. Proposed blocks (shared across the site)

From 15 module candidates (`stardust/current/DESIGN.json → extensions.modules`):

- **Chrome:** header (wedge nav + Personal | Business strip + search + mobile tray), footer.
- **hero-banner** (image + date + headline + standfirst), **share-actions**.
- **Default content** for editorial text (with dropcap, inline image and table variants), no block.
- **media-contacts** (press-contact block, on every article).
- **stats**, **promo-tiles**, **cinemagraph** (MP4 loop + play/pause), **news-cards**,
  **accordion** (year archive / documents), **document-table**, **exec-bio**,
  **image-viewer** (zoom lightbox), **search** (tabs + results), **carousel** (one article).

For this **xwalk** project each block also needs its `_<block>.json` component model and
filters for the Universal Editor (see § 6).

## 4. Phases

1. **Preserve direction (mechanical).** Promote `stardust/current/PRODUCT.md`, `DESIGN.md`
   and `DESIGN.json` to the project root as the target. Write `stardust/direction.md`. Build the
   inconsistency register (§ 5). Run the dynamics gate (§ 7).
2. **Recreate A1 → A8** as clean HTML/CSS prototypes. Use captured content verbatim and
   values lifted from `application.css`; never DOM copies. A1 goes first: it covers 92% of
   real pages.
3. **Source-fidelity gate per archetype at 1440 and 360:** pixel diff, content diff, visual
   diff, chrome parity and the content-cap row. Gate captures dismiss the cookie modal (the
   census and cap-probe already do).
4. **Handoff:**
   - Foundation (tokens, fonts, header/footer).
   - Each archetype delivered and re-gated on the preview origin.
   - Siblings imported at sibling tier, with a variance probe per template.
   - All-pages delivery gate: pixel ≤ 10%, |Δh| ≤ 5%, no clipped text, no missing links.

## 5. Inconsistency register: candidates for your decision

An empty register means a pure replica. These are the only changes I would propose:

- **R1 Alt text.** 98% of images ship `alt=""`. Keep as captured, or author alt text?
- **R2 Fonts.** Univers Next for HSBC is a licensed Monotype kit (WOFF only, no WOFF2).
  Self-host it under HSBC's licence, or use a metric-matched fallback with the brand family
  first in the stack?
- **R3 Breakpoints.** The source has ~10 max-width breakpoints. Keep them, or map to EDS
  mobile-first 600/900/1200 (`--target-breakpoints`)?
- **R4 Width caps.** Container caps differ between archetypes (fluid on home and articles,
  1220px elsewhere; 680px timeline copy). Keep as captured, or unify?

## 6. Delivery path for this repository (xwalk)

Stardust's deploy step produces EDS blocks and `.plain.html` content. In this environment
it stops before publishing. This repo is **xwalk**: content lives in AEM author
(`/content/hsbc-xwalk`) and is edited in the Universal Editor. Proposed split:

- **Stardust:** recreation + fidelity gates, block JS/CSS, foundation styles.
- **Xwalk tooling:**
  - Block component models (`_<block>.json`, `npm run build:json`, xwalk lint).
  - Content import through the existing importer pipeline: `tools/importer/page-templates.json`
    was already emitted by the site scope, with 7 templates.

## 7. Dynamic surface (to triage in Phase 1)

- Tealium tags + cookie consent (every page).
- Brightcove script (every page; no player found on the captured pages).
- Home MP4 cinemagraph.
- Site search `/search?query=` (needs a search back end or index on EDS).
- External-link "leaving this site" modal.
- Image-viewer lightbox.
- Share links.
- Year-accordion archive.

## 8. Open questions

- **Q1 Scope of `/en/`.** Leave out the 243 empty shells (recommended), with redirects to the
  en-GB twins? Is the `/en/` group page in scope?
- **Q2 Duplicates.** Redirect `/hsbc-uk` and `/hsbc-uk/community` to `/`, or keep them as
  separate copies?
- **Q3 Register.** Your call on R1–R4.
- **Q4 Search.** Which back end serves search on EDS?

## 9. Estimated effort shape

- 8 archetype prototypes; A1 and A2 carry most of the risk.
- About 14 blocks plus header and footer.
- About 310 pages imported (or 553 if the `/en/` shells stay).
- No code or content has been written yet. All analysis lives under `stardust/`.
