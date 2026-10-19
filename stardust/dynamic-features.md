<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated) · 2026-10-18T11:55:00Z · input stardust/dynamics/dynamic-features.generated-plan.json (11 rows) + capture evidence (stardust/current/pages/*.html class census) · target origin: not yet known (xwalk EDS) -->
# Dynamic features — about.hsbc.co.uk

## Listings contract

- **News listing `/news-and-media`** (A3): featured cards (latest 3) and a year accordion
  2020–2026 listing every press release. Each article page must emit
  `<meta name="publication-date">` (ISO date shown above the H1), `title`, `description`
  (standfirst) and `image` (hero). Index: `/query-index.json` filtered to
  `/news-and-media/*`, sorted by `publication-date` desc, grouped by year. Document-first: the
  listing document carries the year headings; the block reads the index for the rows.
- "Views on HSBC.com" row: three curated links to hsbc.com — authored content, not indexed.

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | s-site-search | header search + `/search?query=` results (tabs, 10/page) | S | 310/310 (form) · 2 results pages | index-backed | self | pending | search-index-backed | none — corpus = migrated pages | probe "mortgage" → 132 results; `stardust/.work/dynamics/search-probe.json` |
| 2 | l-news-archive | news listing: featured cards + year accordion | L | 1 (+ home teaser) | index-backed | self | pending | listing | none | `news-and-media.html` `.accordion`, `.layout--4-4-4` |
| 3 | m-cookie-consent | Tealium cookie modal (Accept / Decline / Manage) | M + T | 310/310 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | consent platform + Tealium profile on the new host | `.cookie-modal`, tags.tiqcdn.com |
| 4 | t-tealium | Tealium tag manager (`utag_data` settings object) | T + A | 310/310 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; utag profile/env | tags.tiqcdn.com, akamai.tiqcdn.com/location.js |
| 5 | m-leaving-confirmation | "You are leaving this site" modal on external links | M | 281 | rebuild-native | self | pending | chrome-interaction | none | `.leaving-confirmation` (281 pages) |
| 6 | m-chrome | header shrink-on-scroll, mobile nav-tray, search tray | M | 310/310 | rebuild-native | self | pending | chrome-interaction | none (motion-observe at Phase 4) | `.header--fixed/--shrunk`, `.nav-tray` |
| 7 | v-cinemagraph | home MP4 loop with play/pause, poster on pause | V | 5 (home + duplicates) | rebuild-native | self | pending | media-as-url | none | `/-/media/uk/images/260618-tracking-slow-motion.mp4` |
| 8 | v-brightcove | Brightcove script on every page; one empty `.video` container | V | 310 (script) · 1 container | static-snapshot | needs-human-capture | pending | media-as-url | player/video id for the Loughborough release (consent-gated in headless) | `sadmin.brightcove.com`; `news-and-media-hsbc-uk-to-open-new-branch-in-loughborough` |
| 9 | c-image-viewer | zoom lightbox for infographics | M | 3 | client-only | self | pending | client-only | none | `.image-viewer` |
| 10 | c-accordion | accordion (bond documents, archive) | M | 3 | client-only | self | pending | client-only | none | `.accordion` |
| 11 | r-share-actions | share to X / Facebook / LinkedIn | M | 249 | rebuild-native | self | pending | chrome-interaction | none | `.share-actions` |
| 12 | c-carousel | image carousel (one article) | M | 1 | client-only | self | pending | client-only | none | `.carousel` |
| 13 | i18n-locale | `/en/` tree: 14 content pages kept; 243 empty shells descoped | I18N | 257 | rebuild-native (redirects) | needs-business-decision | pending | locale-tree | redirect map for descoped shells; fate of `/en/` group page | `stardust/replica/descoped-en-shells.json` |
| 14 | x-banking-links | outbound links to hsbc.co.uk banking offers | X | 3 | static-snapshot | self | pending | — | none — plain links, no auth on this site | article bodies |

Noise dropped: `t-unknown-third-party-host-www-hsbc-com` (a plain link to hsbc.com, 1 page);
the four `i18n-locale-variants-*` rows merged into #13 (they are cross-site links to
business.hsbc.uk/en-gb).

## Decision batch

One message to the owner:

1. **Consent + tags (#3, #4):** on the new host, does the site keep Tealium (profile/env), and
   which consent platform renders the banner? Interim: no tags, no banner — the static path
   carries no tracking.
2. **Brightcove (#8):** the video id for the Loughborough release (or a decision to show a
   poster + link). Interim: the article ships without the player.
3. **Locale (#13):** confirm 301s from each descoped `/en/<path>` to its en-GB twin, and whether
   `/en/` (the "About HSBC" group page) stays.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| 243 `/en/` empty locale shells | render no title and no body on the source | owner, 2026-10-18: "drop the /en/ shells" |
