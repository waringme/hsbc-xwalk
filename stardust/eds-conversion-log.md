# EDS conversion log — about.hsbc.co.uk (replica, split delivery)

Delivery path: **split** (stardust/direction.md). Stardust converts the gated prototypes into
EDS blocks and foundation styles; the project's xwalk tooling owns the Universal Editor models
and imports content (tools/importer). Content is never hand-authored.

## C0 foundation (2026-10-19)

- `styles/styles.css` — canon tokens, content-box reset (the source lays out in content-box; every
  lifted width assumes it), `html { font-size: 62.5% }`, body gate + header reservation kept,
  section scaffold = one source `.layout-container` per section (1180 content + 20 gutters,
  wrappers at the 9-3 primary width 74.5763 %, rail empty), default content = the source's
  `.text.text--editorial`, section styles `article-description`, `disclaimer`.
- `styles/fonts.css` — Noto Sans substitutes (OFL) per Univers face, size-adjust + vertical
  metrics as gated. Univers Next for HSBC (Monotype) is NOT shipped; brand names lead every stack.
  `univers-fallback` (local Arial) covers first paint.
- `styles/lazy-styles.css` — the confirmation lightbox (built by the footer block).
- `scripts/scripts.js` — one project hook, `decorateExternalLinks`: off-site links in the page body
  get the source's glyph (aria-hidden) and its hidden "Opens in new window" hint (allowlisted
  generated text — the source CMS renders both for every such link).
- Favicon: `favicon.png` from the extract + one `<link rel="icon">` line in head.html.
- Runtime contract: `stardust/runtime-contract.json`.

## Chrome

- `header` — template-slotted from `/nav` (sections: skip links · divisions · brand logo ·
  primary nav with doormat sub-lists · search link). Search reveal + mobile tray are block JS.
  Generated attribute strings (allowlist): `aria-label` "Primary", "Menu".
- `footer` — template-slotted from `/footer` (utility links + copyright · leaving confirmation ·
  e-mail confirmation). The block hosts the lightbox engine: every off-site link in main and the
  footer except `*.hsbc.com` → leaving confirmation; `mailto:` → e-mail confirmation (observed
  live). Generated: `aria-label` "Close notification".
- Local preview only: the html-folder mount serves content under `/content/`, so both blocks
  resolve `/content/nav` / `/content/footer` there (`localRoot()`); production resolves `/nav`.

## Press-release template (article-page) — block inventory

| section | kind | name | tier | notes |
|---|---|---|---|---|
| banner | block | `hero` (D11, boilerplate name + model) | template-slotted | image only on articles; 22.57 % band clipped at 485px; eager LCP image. D1 advisory justified: bespoke banner geometry. |
| description | default content + style `article-description` | — | — | date `<p>`, `<h1>`, summary `<ul>` |
| description | block | `share` (new) | template-slotted | label + network links authored; block adds page URL to hrefs, icons inline. D1 advisory justified: bespoke widget. |
| body | default content | — | — | editorial text, `<sup>` footnote markers kept verbatim (semantic) |
| editor's notes | default content + style `disclaimer` | — | — | continues the body column |

Models: `blocks/share/_share.json` (richtext `text`); section style options added in
`models/_section.json`; `share` added to the section filter; `npm run build:json` clean.

## Import infrastructure

- `tools/importer/transformers/hsbc-cleanup.js` (chrome, nav tray, Tealium consent modal, empty
  rail columns, CMS glyph/hint spans, whitespace-only emphasis),
  `hsbc-sections.js` (section breaks + Section Metadata from `page-templates.json` sections).
- `tools/importer/parsers/hero.js`, `share.js` (xwalk field hints).
- `tools/importer/import-article-page.js` (template script), `import-nav.js` / `import-footer.js`
  via `chrome-lib.js` (source: /hsbc-uk/inclusion — it carries both confirmation templates).
- Imported: the archetype, `/nav`, `/footer`. `check-xwalk-jcr`: 3/3 convert. davids-model-lint:
  0 🔴, 3 🟡 (SVG logo — verified pure vector, 1.6 KB; hero/share D1 advisories justified above).

## Gate (local EDS render vs live) — 2026-10-19

| width | pixel | Δh | content 🔴 | clipped | overflow |
|---|---|---|---|---|---|
| 1440 | 5.56 % | 5 | 0 | 0 | ok |
| 360 | 8.16 % | 5 | 0 | 0 | ok |

Same numbers as the gated prototype (5.56 / 8.18). Cap-probe PASS at 2560. Interactions driven:
search reveal/close, current nav item, share hrefs, leaving lightbox open/proceed/cancel,
mobile tray — all pass, 0 page errors. Chrome crops: header 98.15 % (1440) / 100 % (360);
footer 95.97 % / 92.21 % — layout aligned, residual is glyph shape (Noto vs Univers on the
white-on-black bar) → tied to the Univers licence decision.

## Findings for the next person

- **Quirks mode in the local preview.** The html-folder render serves no `<!DOCTYPE html>`;
  the browser renders it in quirks mode (line-height quirk: −6px share bar, etc.). The gate runs
  through `stardust/.work/deploy/doctype-relay.mjs` (:8792 → :3000, prepends the doctype), which
  matches the published `*.aem.page` origin. Named deviation in direction.md.
- **Substitute weights.** The Noto file is one variable font; faces without a `font-weight`
  descriptor all draw at Regular (as gated). Pinning per-face weights measured 5.34 % at 1440 but
  re-wrapped 360 (Δh −65) because size-adjust was calibrated on Regular glyphs — reverted. To take
  it, recalibrate size-adjust per weight first.
- Stylelint standard forces kebab-case classes: BEM names from the prototypes became kebab
  (`share-actions__label__inner` → `share-label-inner`, etc.).
