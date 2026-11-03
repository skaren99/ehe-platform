# EHE Events — independent applications and services

Prepared 3 November 2026. **This is a Git-ready migration baseline, not a declaration of production readiness or full feature parity.** The original working code and mock-ups are preserved in `ehe-design-archive`; existing sites and original folders were not replaced or deployed.

## Repositories

Clone these as siblings. Each directory has its own Git history, build and ownership boundary. There are no Git submodules, shared source imports or parent npm workspace.

| Repository          | Responsibility                                                                      | Local URL             |
| ------------------- | ----------------------------------------------------------------------------------- | --------------------- |
| ehe-website         | Public React website, bilingual content, calculator, rentals, contact and portfolio | http://localhost:5173 |
| ehe-admin           | React site administration: content, prices, products, closures and bookings         | http://localhost:5174 |
| ehe-client-portal   | React wedding workspace for the assigned couple                                     | http://localhost:5175 |
| ehe-planner-portal  | React planner projects, tasks, comments and contacts                                | http://localhost:5176 |
| ehe-site-service    | Spring Boot content/catalogue/rental API; owns its PostgreSQL database              | http://localhost:8081 |
| ehe-wedding-service | Spring Boot wedding API; owns its PostgreSQL database                               | http://localhost:8082 |
| ehe-platform        | Local integration, identity configuration, architecture and handover                | This repository       |
| ehe-design-archive  | Original code, standalone prototypes and screenshot references                      | Reference only        |

## Run locally

Install Docker Desktop with its Linux engine running and Node 24 or newer. From this repository:

```sh
node scripts/setup-local.mjs
docker compose up --build -d
docker compose logs -f site-service wedding-service keycloak
```

The setup script generates unique local passwords and refuses to overwrite existing local configuration. It was already run in the prepared workspace: use the existing ignored `.env`, `keycloak/ehe-realm.json` and `LOCAL-CREDENTIALS.md` there. On a fresh clone, run the script once. No password is committed.

Open the URLs above using **localhost**, not `127.0.0.1`, because the OIDC redirect allowlists use localhost. Sign in as `admin`, `planner` or `couple` using the passwords in `LOCAL-CREDENTIALS.md`. Keycloak administration is at http://localhost:8180 with the `bootstrap` account. The sample planner and couple are assigned to the same sample wedding. The site admin has no wedding-data access.

The compose setup binds published ports to loopback. Keycloak uses development mode and a development-only realm. It is not a production hosting configuration. Each application can be deployed independently; sibling paths are required only for this local compose build. Private frontends do not depend on each other at runtime.

Stop the local stack without deleting data:

```sh
docker compose down
```

## Develop and test

React repositories: `npm ci`, `npm test`, `npm run build`, `npm run dev`. Each Vite server has a different fixed port. Keep the two APIs and identity provider running; stop the corresponding frontend container before running Vite on its port. Vite forwards `/api/site` to port 8081 and `/api/weddings` to port 8082. Copy `.env.example` to `.env` only to override defaults. Browser-facing Vite variables are public configuration, never secrets.

Java repositories: Java 21, then `./mvnw verify` on Linux/macOS or `.\mvnw.cmd verify` on Windows. Integration tests use disposable H2 databases and require no Docker. Production runtime uses PostgreSQL; database configuration comes from environment variables. Maven wrappers pin Maven 3.9.11.

Each frontend and service has its own GitHub Actions workflow and Dockerfile. React Docker builds take `VITE_*` build arguments for identity URLs and app origins. Rebuild frontend assets when these values change. Configure allowed redirect/logout origins in the identity provider and `CORS_ORIGINS` in the services at the same time.

## GitHub handover

Eight initial `main` branches are prepared using `skaren99 <karensaksakulm@gmail.com>`. They are independent repositories. No GitHub repository has been created, no remote configured, and no push performed.

1. Create eight empty GitHub repositories with the names in the table. Do not auto-create a README, license or `.gitignore`. Choose private visibility unless you have deliberately reviewed the source and photograph for public release.
2. Configure GitHub SSH authentication on your machine.
3. Preview the push targets from this repository:

```powershell
.\scripts\push-repositories.ps1 -Owner skaren99
```

4. When ready, run the same script with `-Push`. It preflights all repositories, rejects dirty trees or an unexpected origin, adds missing origins, and pushes `main` without force. It does not create the GitHub repositories.

You can also push one repository manually:

```sh
git remote add origin git@github.com:skaren99/ehe-website.git
git push -u origin main
```

Use `node scripts/check-repositories.mjs` to check repository separation and tracked runtime-file exclusions. `repositories.json` records the complete proposed remote mapping; these URLs are targets, not claims that the repositories already exist.

Read [ARCHITECTURE.md](ARCHITECTURE.md), [MIGRATION.md](MIGRATION.md), [API.md](API.md) and [VERIFICATION.md](VERIFICATION.md) before planning the next release. No license has been invented for the user's existing code or imagery.
