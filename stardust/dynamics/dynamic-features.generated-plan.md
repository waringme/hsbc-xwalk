<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-18T11:46:49.129Z · input /backups/waringme/hsbc-xwalk/repo/stardust/current/_dynamics.json (10 pages, 11 findings) -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 10/10 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | i18n-locale-variants-en-gb-en-gb-en-gb-en-gb | I18N | locale variants en-gb,en-gb,en-gb,en-gb | 4/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 3 | i18n-locale-variants-en-gb-en-gb-en-gb | I18N | locale variants en-gb,en-gb,en-gb | 4/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 4 | i18n-locale-variants-en-gb-en-gb-en-gb-en-gb-en-gb | I18N | locale variants en-gb,en-gb,en-gb,en-gb,en-gb | 1/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 5 | i18n-locale-variants-en-gb-en-gb-en-gb-en | I18N | locale variants en-gb,en-gb,en-gb,en | 1/10 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 6 | m-modal-trigger-cookie-modal-show-chrome-only-button-content | M | modal trigger cookie-modal__show (chrome only) → button:content | 10/10 | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 7 | s-site-search-form-search | S | site search form → /search | 10/10 (reach 2/579) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 8 | t-tag-manager-tealium | T | tag manager: Tealium | 10/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | t-unknown-third-party-host-www-hsbc-com | T | unknown third-party host www.hsbc.com | 1/10 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 10 | v-video-brightcove | V | video: Brightcove | 10/10 | embed-passthrough | self | pending | media-as-url | none (player ids are public) |  |
| 11 | x-sign-in-account-links | X | sign-in / account links | 3/10 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 4 row(s) — read-settings, chrome-interaction, search-index-backed, media-as-url.
- **One owner decision batch:** 6 row(s) — scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **locale wave** — 4
- **tags** — 2
- **detect** — 1
- **interactive** — 1
- **search** — 1
- **media** — 1
- **register** — 1
