# Verification — 3 November 2026

## Passed

- All four React applications: TypeScript checking and Vite production build.
- Frontend domain tests: 9 passed across the four repositories. Includes preserved calculator totals, rental durations/pricing, Estonia winter/summer time conversion and client/planner task controls.
- Site service: 9 tests passed. Covers public/admin access, role separation, stale revisions, invalid pricing, inclusive rental closures, idempotency, simultaneous requests against one available item, CORS and signed-token validation.
- Wedding service: 9 tests passed. Covers anonymous rejection, client/planner ownership, private-note exclusion, forbidden actions, shared comments, stale status updates, invalid dates, site-admin separation and signed-token validation.
- JWT tests generate RSA signatures and use a local JWK endpoint. Valid tokens pass; wrong audience, issuer, expiry and signature are rejected. This verifies the configured decoder independently of the mock-authentication API tests.
- Both Maven `verify` builds completed and produced executable JARs.
- A running site-service smoke check returned HTTP 200 with `{"status":"UP"}` and nine catalogue products. This runtime check used a disposable H2 database.
- Docker Compose configuration passes `docker compose config --quiet` with generated local environment values.
- The preserved planning prototype's original `verify-flows.mjs` passed: project/task/comment creation, wedding isolation, private-note exclusion, client/admin export and reload persistence.
- All 46 archived original files match their recorded SHA-256 checksums.
- Git preparation checks cover separate repository roots, runtime/credential exclusions, common credential patterns and file sizes. Generated local credentials are ignored. Maven wrapper scripts are tracked as executable.

## Not verified

- The complete Docker/PostgreSQL/Keycloak stack was not started: Docker's Linux engine is not running on this machine. Compose validation does not prove successful image builds or container networking.
- Real PostgreSQL transaction behaviour and migrations require staging verification. Automated persistence/concurrency tests used H2 in PostgreSQL compatibility mode.
- Live identity-provider login, browser redirects, all four applications working together, mobile/responsive layout and accessibility have not been browser-verified. The available in-app preview browser could not reach the local frontend server.
- Image uploads, arbitrary legacy page-text editing, project/task/contact editing and HTML export remain pending migration, as detailed in `MIGRATION.md`.
- GitHub remote creation/push and GitHub Actions execution were not performed. Local passing builds are not a claim that a remote CI run occurred.

No deployment, original-source replacement or customer-data migration was performed. Initial repositories are for review and continued migration; this verification is not production sign-off.
