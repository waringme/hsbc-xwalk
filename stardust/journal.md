# Journal — about.hsbc.co.uk migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-18T11:25:00Z — extract prep — analysis-only capture of about.hsbc.co.uk + replica plan proposal

**Prompt:** Analyze the source site and propose an EDS design-migration plan; do not modify the repository yet.

**Decisions:**
- Flow `replica` (default, no redesign phrase), stamped in `state.json` with `flowSource: "default"`.
- Analysis artifacts kept under `stardust/` only (user-approved); no blocks, styles, scripts or content touched.
- Crawl fed by `--pages` from the decoded sitemap: it is UTF-16 with scheme-less `<loc>`, which the bundled discovery cannot read.
- Two sitemap-omitted pages (`/news-and-media`, `/search`) captured separately with the same crawler and merged.
- **Named deviation:** the style census ran on 35 representative pages × {1440, 360}, not all 553 (≈ 3 h). Sample: every non-article en-GB page, 1-in-20 articles, 5 `/en/` pages.
- Stopped after replica Phase 1; Phases 2–5 proposed in `stardust/migration-plan.md`, not executed.

**Artifacts touched:**
- stardust/state.json — created (flow, 553 typed pages)
- stardust/current/{pages/, assets/, _crawl-log.json, _computed-styles.json, _brand-extraction.json, PRODUCT.md, DESIGN.md, DESIGN.json, brand-review.html} — created
- stardust/migration-plan.md — created
- stardust/validation/brand-review/ — created

**Findings worth flagging:**
- crawl.mjs dismisses consent at domcontentloaded; Tealium's `.cookie-modal` renders later, so every screenshot carries the overlay. The census and cap-probe dismiss it via `button:has-text("Accept")`.
- 243 of 257 `/en/` URLs are empty shells; `/hsbc-uk` and `/hsbc-uk/community` duplicate `/`.
- The repo is xwalk; stardust deploy targets DA `.plain.html`, so delivery needs the xwalk model + import path.

**Open questions:**
- `/en/` scope and redirects; duplicate pages; register items R1–R4; search back end.

**Next:** on approval, `replica` Phase 2 (promote spec, register, dynamics gate), then recreate A1 (article).

---

## Preserve direction — spec promoted, /en/ shells descoped, register + dynamics gate written (2026-10-18)

**Prompt:** Drop the /en/ shells, then start replica Phase 2.

**Decisions:**
- 243 empty `/en/` shells removed from `state.json.pages[]`; list + proposed 301 targets in `stardust/replica/descoped-en-shells.json`; owner statement recorded as the one decided-out row.
- The twin check found 26 en-GB press releases missing from the sitemap (25 listed only as their `/en/` shell, 1 link-only); captured live with the same crawler. Roster: 336 pages (article 310).
- `current/PRODUCT.md` (counts, sitemap gaps, redirects) and `current/DESIGN.md` (counts) updated, then promoted verbatim to the root (`cmp` identical).
- Register: 4 entries, all `deferred` (alt text, container caps, timeline cap, source broken links) — pure replica for this run.
- Dynamics: detector on 10 archetype URLs (11 findings) + capture-class evidence → 14 curated rows, every row dispositioned; 3-item owner decision batch (tags/consent, Brightcove id, locale redirects + `/en/` group page).
- Setup hygiene applied now that root writes are authorized: `.gitignore` `# >>> stardust` block (.env), `.hlxignore` += `stardust/`.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json (root) — created (promoted)
- stardust/direction.md, stardust/replica/{inconsistency-register.md, descoped-en-shells.json, progress.json} — created
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md, stardust/dynamics/*, stardust/current/_dynamics.json — created
- stardust/state.json, stardust/current/{PRODUCT.md, DESIGN.md, _crawl-log.json, pages/, assets/screenshots/} — updated
- .gitignore, .hlxignore — updated

**Findings worth flagging:**
- The sitemap under-reports en-GB: 26 releases were reachable only via their empty `/en/` shell URL or by link.
- `.hlxignore` covers `*.md` but not root `DESIGN.json`, so EDS will serve `/DESIGN.json` publicly.
- Search probe "mortgage" = 132 results (10/page) on the source.

**Open questions:**
- Decision batch (tags/consent, Brightcove id, `/en/` redirects + group page); register R-01…R-04; font licensing.

**Next:** replica Phase 3 — recreate the article archetype first (310 pages).

---

## Recreate — A1 press-release prototype authored and gated to the 3-iteration cap (2026-10-18)

**Prompt:** Start Phase 3 with the press-release page.

**Decisions:**
- Archetype `news-and-media-100-year-biodiversity-bid-…` recreated as clean HTML from the captured DOM (text verbatim via `stardust/.work/replica/build-a1.py`) + values lifted from `application.css` and `measure.mjs` at 1440/360. Canon split: `prototypes/canon.css` (tokens, fonts, chrome, layout, text, share) + `prototypes/article.css`.
- Fonts policy: Univers Next for HSBC (licensed Monotype "W02" kit) not rehosted. Substitute = Noto Sans (OFL), chosen by width match over 7 open families (mean width error 1.8%); per-face `size-adjust` calibrated on the page's own text, `ascent/descent-override` pinned to the Univers faces' metrics. Brand family names stay first in every stack.
- Harvested: pwsicons icon font (HSBC site asset), X logo SVG, hero JPG, logo SVG.
- Gate (live vs `localhost:8791`): 1440 9.91 → 7.21 → 6.36% (Δh −107 → −17 → −9); 360 11.69 → 9.41 → 11.01% (Δh −104 → +2 → +73). Round 3 `--full`: content-diff 3 🔴 (unauthored leaving-confirmation modal), chrome-parity 8 deltas (footer offset + substitute widths), clip 0, overflow ok. Cap reached; not passing.

**Artifacts touched:**
- stardust/prototypes/{canon.css, article.css, news-and-media-100-year-…-proposed.html, assets/} — created
- stardust/replica/gates/news-and-media-100-year-…-{1440,360}/ — created
- stardust/replica/progress.json, stardust/state.json — updated

**Findings worth flagging:**
- Every remaining height delta traces to line-wrap forks from the substitute font; no layout value is off at both widths.
- gate.sh resolves `../diff` physically; a directory symlink to the plugin tree breaks `--full`. Per-file links under `/tmp/sd/scripts/{replica,diff,stardust}` work without copying into the project.

**Open questions:**
- Univers licence for the new domain (closes the wrap residuals); whether to spend a 4th round on the modal markup + copyright width.

**Next:** owner decision on fonts, then a confirmation round; or accept residuals and recreate the landing archetype.

---

## Source-fidelity gate — A1 press release passes on round 4 (owner exception) (2026-10-18)

**Prompt:** Allow one more round.

**Decisions:**
- Iteration-cap exception recorded in `direction.md`. Fixes came off the instruments: per-face size-adjust swept on line counts at both widths (Regular 100.3%, Light 95.4%); ascent/descent pinned to Univers; source layout model lifted as percentages (74.58% / 1.69% / 23.73%) with clearfix-equivalent `flow-root`; `.layout--9-3` 20px margin; last container carries the 82px footer gap; `sup` line-height follows the paragraph's unitless ratio.
- Chrome: header region compared with `--region header=#header|#header` (live has no `<header>`); skip-link bar, division-link spans and search-field offset re-authored; header crop 1.85% / 0.11%.
- Interaction parity: implemented only what fired live (external-link leaving lightbox; header search reveal) in `prototypes/interactions.js`; motion-compare 6 parity; consent class deferred to the tags decision.

**Artifacts touched:**
- stardust/prototypes/{canon.css, article.css, interactions.js, …-proposed.html} — updated/created
- stardust/replica/{progress.json, motion/…json, gates/…} — updated

**Findings worth flagging:**
- Live line-heights are unitless ratios: superscripts inherit 1.5 / 1.25 / 1.34 — a px line-height on `sup` costs ~1px per line.
- The source relies on clearfix `display:table` pseudo-elements for margin containment; `flow-root` reproduces it exactly.

**Open questions:**
- Owner approval of A1; font licence; tags/consent.

**Next:** on approval, recreate the landing archetype (home) on top of the canon.

---

## Recreate — A2 homepage prototype authored and gated (2026-10-18)

**Prompt:** Approve A1, start the homepage.

**Decisions:**
- A1 approved (owner). Canon grew cumulatively: shared hero / page description / text-heading rules moved from `article.css` to `canon.css` (article keeps `page-description--tertiary`); A1 re-gated after each canon change — unchanged at 5.56% / 8.18%.
- `landing.css` adds cinemagraph, full-width text, 6-6 image columns and long-form promo tiles; `build-a2.py` reuses the gated A1 chrome and takes all content from the captured home DOM.
- Gate: 1440 10.09 → 2.61 → 2.61 → 2.28% (Δh 0); 360 20.0 → 22.53 → 3.04 → 2.80% (Δh 0); 0 🔴; clip 0; cap PASS 9/9 @2560; prototype table 2/2 PASS. Round 4 was a structural fix after round 3 — one over the default cap, recorded.
- Interaction parity: live cinemagraph autoplays muted/looping — delivered (skipped under reduced motion, which is why gate captures show the poster on both sides); toggle pause/play; nav hover background. External promo tiles navigate (no lightbox).

**Findings worth flagging:**
- Generic `.layout__primary` rules leaked from the 9-3 lift into other layouts; scoping canon rules to their source layout class prevents cross-archetype regressions.
- The live nav-tray "Menu" label is `display:none` at ≤959px; leaving it rendered painted an "M" into every stitched seam.

**Open questions:**
- Owner approval of A2; font licence; tags/consent.

**Next:** on approval, the listing archetype (`/news-and-media`).

---

## Recreate — A3 news listing prototype authored and gated in 3 rounds (2026-10-18)

**Prompt:** Approve A2, start the news listing.

**Decisions:**
- A2 approved (owner). Base long-form promo card moved to canon (the listing's dated cards are the base; the home 6-6 overlap is a desktop variant) — A2 re-gated unchanged.
- `listing.css`: nested 4-4-4 grid (`layout--spaced` 72px vs default 20px; stacks ≤1080px), year accordion (closed + measured open state), media-contacts rail, archive table. `build-a3.py` re-authors the 323-entry archive (305 page links, 13 PDF downloads, 5 untitled) from extracted data.
- Second confirmation template found by content-diff: "You are about to e-mail us" (mailto links). The lightbox engine now serves both templates; A1 interaction parity re-checked.
- Gate: 1440 8.40 → 2.17 → 2.17% (Δh −35 → 0 → 0); 360 8.49 → 3.94 → 3.94% (Δh −62 → 0 → 0); 30 → 4 → 0 🔴; cap PASS; prototype table 3/3 PASS at both widths.

**Findings worth flagging:**
- The archive links 13 press releases as PDFs (`state.json site.documents`) — they need asset migration, not page import.
- Every archive page link is already in the roster (305/305).

**Open questions:**
- Owner approval of A3; font licence; tags/consent.

**Next:** on approval, the program archetype (`/hsbc-uk/inclusion`).

---

## Recreate — A4 section page (inclusion) authored with the generic builder and gated in 2 rounds (2026-10-18)

**Prompt:** Approve A3, continue.

**Decisions:**
- A3 approved (owner). New generic builder `.work/replica/build-page.mjs`: allow-listed re-author of the captured `<main>` (component classes kept, data/state/tracking attributes and scripts stripped, media re-pointed to local files), gated A1 chrome, share bar and footer templates only when the source page has them.
- `program.css`: editorial lists (li > p no bottom margin), rail image cap, factbox, 3-3-3-3 text-only tiles (stack ≤800px).
- Gate: 1440 6.90 → 4.49% (Δh −30 → 0); 360 12.93 → 8.33% (Δh −107 → +5); 4 → 0 🔴; cap PASS; prototype table 4/4 at both widths.
- Leaving-lightbox rule re-observed on live: all off-site links in page body and footer (promos included) except `*.hsbc.com`, which navigate. Encoded once in `interactions.js`; this also corrects A1, whose hsbc.com links previously opened the lightbox.

**Findings worth flagging:**
- `HSBC.domainWhitelist` is empty in the page config; the hsbc.com exception lives in the site script, so it was measured rather than read.

**Open questions:**
- Owner approval of A4; the `/en/` group page (decision batch 3).

**Next:** on approval, static (terms of use), then the two unique pages and search.

---

## Source-fidelity gate — A5–A8 (terms, timeline, team, search) gated; all 8 archetypes pass the prototype table (2026-10-18)

**Prompt:** Approve A4, do all 4 remaining page types.

**Decisions:**
- A4 approved (owner). The generic builder produced terms-of-use, history-timeline, management-team and search; new layers `static.css` (empty — canon covers it), `unique.css` (exec-bio, 6-3-3), `form.css` (in-page search, tabs, results summary).
- Canon additions: `.text h3`, last-paragraph margin, empty `.layout--full` margin, header search rules scoped under `.site-tools`. Two of them regressed A3/A4 in the full table (accordion h3, rail text); both were scoped and the regression cleared — the full table is the cross-archetype guard.
- Final prototype table: 8/8 PASS at 1440 and 360. Residuals: whole-line wrap forks from the substitute font on terms (−24 / +73px) and the timeline (+48px @360); terms cap-probe row failure is a module-root tie-break (wrapper cap equal).
- Round counts: A5 3, A6 3, A7 3, A8 4 (one over the default cap — structural fix).

**Open questions:**
- Owner approval of A5–A8; the `/en/` group page; font licence; tags/consent.

**Next:** Phase 5 handoff — sibling-variance per template, then migrate/deploy/rollout (xwalk delivery path to agree).

---

## handoff — press-release template delivered locally, split path (2026-10-19)
- C0 foundation ported from canon.css; header/footer template-slotted from imported /nav, /footer;
  hero restyled, new share block; section styles article-description, disclaimer.
- Import script (article-page) + nav/footer scripts; archetype imported via run-bulk-import.
- Local render was in quirks mode (no doctype) → doctype relay for gating (named deviation).
- Gate: 1440 5.56 % Δh 5, 360 8.16 % Δh 5, 0 🔴, cap PASS; parity with the prototype.
- Weight-pinning experiment reverted (needs per-weight size-adjust recalibration).
