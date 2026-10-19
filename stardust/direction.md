---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-18T11:43:22Z
  againstInput: https://www.about.hsbc.co.uk/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.about.hsbc.co.uk/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-18T11:43:22Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(4 entries, all deferred — nothing applied: pure replica for this run).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Scope decisions

- **Owner, 2026-10-18:** the 243 empty `/en/` locale shells are dropped from the roster
  (list + proposed 301 targets: `stardust/replica/descoped-en-shells.json`). The 14 `/en/`
  pages with content stay in the roster.
- The twin check found 26 en-GB press releases the sitemap omits; they were captured live and
  added (roster: 336 pages — article 310 · program 5 · static 7 · landing 6 · unique 4 ·
  listing 2 · form 2).
- Breakpoints: source breakpoints kept (no `--target-breakpoints`).

## Named deviations

- **Style census sample** (extract Phase 3): 35 representative pages × {1440, 360} instead of
  every captured page (≈ 3 h). Replaces: the all-pages census. Why: 280+ template-constant
  articles and 243 empty shells add no style evidence. Lives in:
  `stardust/.work/extract/census-urls.txt`.
- **Cross-page aggregation helpers** `stardust/.work/extract/aggregate.mjs` and `brand.mjs`
  compose `_brand-extraction.json` from the census + page JSON. Replaces: nothing shipped
  (extract has no aggregation instrument); evidence-only, no live fetches.
- **Sitemap decode**: the sitemap is UTF-16 with scheme-less `<loc>`; URLs were decoded and
  passed to `crawl.mjs --pages` instead of its own sitemap discovery.
- **Iteration-cap exception (owner, 2026-10-18):** A1 article gets a 4th gate round beyond the
  3-round cap ("Allow one more round"). Replaces: the cap's stop-and-log rule for this archetype only.
- **Delivery path (owner, 2026-10-18): split.** Stardust converts the gated prototypes into EDS
  block code + foundation styles; the project's xwalk tooling adds Universal Editor models and
  imports content into AEM author (`tools/importer/page-templates.json`). Replaces: stardust
  deploy's DA content transport for this repository.

## Named deviation — delivery gate origin (2026-10-19)

No published origin exists yet: content reaches AEM author only after the xwalk import is
uploaded. The delivery gate therefore runs on the local EDS render of the imported content
(`aem up --html-folder content`, mounted at `/content/…`), relayed through
`stardust/.work/deploy/doctype-relay.mjs` because the html-folder render omits `<!DOCTYPE html>`
(quirks mode) while `*.aem.page` serves standards mode. The published-origin gate (gate-all
`--stage delivered`) stays pending until the pages are previewed from AEM author.
