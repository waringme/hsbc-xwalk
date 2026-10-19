<!-- stardust provenance: skill=stardust:dynamics · phase=triage plan · 2026-10-18T11:55:00Z · input stardust/dynamic-features.md -->
# Dynamic features — implementation plan (about.hsbc.co.uk)

Static first, then wire: every page ships as a working static page before any phase below
replaces a degradation with live behaviour.

| phase | rows | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| chrome | #5, #6, #11 | header (shrink, nav-tray, search tray), leaving-confirmation modal, share links in block JS | none (chrome) | motion-observe parity per archetype; 1440 + 360 | — | S |
| interactive | #9, #10, #12 | image-viewer, accordion, carousel blocks (client-only) | block rows as authored | click/keyboard smoke; motion-compare | — | S |
| media | #7 | cinemagraph block: MP4 url + poster, play/pause, reduced-motion pause | video link + poster image rows | autoplay/loop observed live = build | — | S |
| listing | #2 | `helix-query.yaml` (news index: title, description, image, publication-date) + news-listing block | article metadata per Listings contract | index count = 310 articles; year groups match source | — | M |
| search | #1 | search block over `/query-index.json` (tabs, 10/page) | none | `search-query` "mortgage": count vs source 132 (parity note: corpus = migrated pages), top titles | — | M |
| tags | #3, #4 | `scripts/site-config.js` (disabled) for Tealium + consent | none | no third-party request before consent | **yes — batch 1** | S |
| media-owner | #8 | Brightcove embed for one article | player + video id | player renders | **yes — batch 2** | XS |
| locale | #13 | redirect map (243 × 301) via the redirects sheet | none | each `/en/<path>` → 301 → twin | **yes — batch 3** | XS |

The gate condition holds: every row in `dynamic-features.md` has a disposition.
