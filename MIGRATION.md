# Migration inventory and remaining work

## Source inventory

- `C:/Users/Karen/OneDrive/Documents/ChatGPT/Pulmaprojekt/pulmaplaan`: latest branded client and planner HTML prototypes plus build/edit scripts. Its generated `dist` files are the actual runnable sources, so they are preserved in the archive despite normal build-output ignores.
- `.../Pulmaprojekt/ehe-homepage-mockup`: EHE homepage design, supplied wedding photograph and promotion scripts.
- `C:/Users/Karen/Documents/Codex/2026-09-20/bui`: full bilingual public site, calculator, rental booking backend and website administration, discovered through references in the mock-up scripts.
- Standalone HTML files and four PNG previews in the current workspace are preserved.
- 46 original files are copied byte-for-byte into `ehe-design-archive`, with original paths and SHA-256 hashes in its manifest. No old Git history was rewritten. The eight prepared repositories start fresh histories; the original `pulmaplaan` repository still retains its previous history.
- Existing deployment tarballs remain untouched in the original workspace. Hosting identities, databases, credentials, sessions and runtime uploads were not imported. Custom prices/content stored only in runtime `work/settings.json`, and existing customer bookings, still require an explicit data migration.

## Feature matrix

| Existing capability                                  | Prepared React / Spring baseline                                                  | Remaining work                                                      |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Homepage visual design, photograph, ET/EN navigation | Real React components using the current design/content                            | Browser visual QA and marketing prerendering                        |
| Service calculator                                   | Original calculation rules ported to ES module; API-configured prices             | Compare all workbook scenarios and refine UI parity                 |
| Rental catalogue                                     | Public catalogue; admin edits names/descriptions/category/price/stock             | Image upload, image reorder and gallery migration                   |
| Rental bookings                                      | API-backed reservation, stock check, server pricing, idempotent retry             | Availability-calendar UI, abuse controls, existing SQLite migration |
| Event/rental closures                                | Site admin creates/removes inclusive ranges; booking API enforces rental closures | Original calendar display polish                                    |
| Site text editing                                    | Bilingual homepage headline and leader description                                | Arbitrary page-text editing, hero/portrait media management         |
| Admin password screen                                | Replaced with centralized OIDC sign-in                                            | Configure production account recovery and identity administration   |
| Booking overview                                     | Authenticated site-admin list                                                     | Filtering/pagination and operational reporting                      |
| Contact email draft                                  | Retained; opens user's mail app                                                   | No automatic sending was added                                      |
| Portfolio and wedding story                          | Existing couple/photo and placeholders carried over                               | Confirm remaining copy, dates, suppliers and photos                 |
| Planner project creation                             | Persistent projects assigned to planner and one client subject                    | Existing project import, edit/archive, stage and budget management  |
| Tasks                                                | Planner creation; shared list, filters, completion, revision checks               | Edit/delete/reassign existing tasks and advanced filters            |
| Comments / activity                                  | Shared persisted comments and task-status history                                 | Full audit history for every entity change                          |
| Contacts                                             | Planner adds, couple/planner reads                                                | Edit/delete contacts                                                |
| Private notes                                        | Present in planner response; excluded from client API                             | Editing notes after project creation                                |
| Standalone client/planner HTML exports               | Original implementation preserved in archive                                      | Secure export/import design for API-backed records                  |
| Per-wedding separation                               | Enforced server-side by authenticated subject                                     | Multi-user wedding membership and invitation workflow               |

## Cutover sequence

1. Push the prepared source repositories and use them for review. Keep the original app as the feature reference.
2. Complete the pending feature parity work above and browser tests using a running staging stack.
3. Replace the document storage with normalized tables where workload or reporting requires it. Define a reversible migration for SQLite bookings, custom settings, uploaded media and browser-only wedding records; retain IDs and existing prices.
4. Reconcile imported record counts and representative totals. Verify rental overlap behaviour and wedding access with separate real accounts. Do not import credentials or localStorage ownership as trusted identity.
5. Deploy behind HTTPS, configure production OIDC clients, backups and monitoring; validate rollback before switching public domains.

The new baseline does not claim to have migrated live data or to provide complete legacy feature parity. It is safe to review independently because no existing code or deployment was replaced.
