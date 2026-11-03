# API contract — baseline v0.1.0

JSON requests use `Content-Type: application/json`. Protected requests use a signed OIDC access token in `Authorization: Bearer ...`. Paths are currently unversioned; the tagged v0.1.0 contract is the initial integration contract. Use additive changes across repositories and introduce `/api/v2` before breaking deployed consumers.

## Site service, port 8081

| Method | Path                                                                         | Access / result                                                                                                 |
| ------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | /api/site/public/settings                                                    | Public; headline ET/EN, leader and pricing                                                                      |
| GET    | /api/site/public/products                                                    | Public; products with stock > 0                                                                                 |
| GET    | /api/site/public/events                                                      | Public; closed event date ranges                                                                                |
| GET    | /api/site/public/availability?productId=...&start=...&quantity=1&extraDays=0 | Public; `available` boolean; start is an ISO instant                                                            |
| POST   | /api/site/public/bookings                                                    | Public; validated booking with server-calculated confirmation                                                   |
| GET    | /api/site/admin/state                                                        | SITE_ADMIN; settings, products, closures, bookings, revision                                                    |
| PUT    | /api/site/admin/settings                                                     | SITE_ADMIN; `{revision, settings}`; returns new state                                                           |
| PUT    | /api/site/admin/products                                                     | SITE_ADMIN; `{revision, products}`; returns new state                                                           |
| POST   | /api/site/admin/closures                                                     | SITE_ADMIN; `{kind, productId, from, to}`; kind event/rental, productId all or existing ID; inclusive ISO dates |
| DELETE | /api/site/admin/closures/{id}                                                | SITE_ADMIN; returns new state                                                                                   |

Booking body:

```json
{
  "productId": "veil-1",
  "start": "2027-06-19T07:00:00Z",
  "quantity": 1,
  "extraDays": 0,
  "name": "Example Couple",
  "email": "couple@example.com",
  "requestKey": "1b2b0ae8-b7e3-4a55-a605-a3f498f16c65"
}
```

Pickup must be 08:00–18:00 in Europe/Tallinn, in the future and within two years. A successful 201 returns `reference`, `start`, `customerEnd`, `total`. Identical retry with the same key returns the existing confirmation; changing input with that key or exhausting stock returns 409. The reservation blocks stock for 48 + 24 × extraDays hours; customer use lasts 36 + 24 × extraDays hours. Public responses contain no booking customer list.

## Wedding service, port 8082

| Method | Path                                       | Access / result                                                                                     |
| ------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| GET    | /api/weddings                              | PLANNER/CLIENT; only assigned weddings                                                              |
| GET    | /api/weddings/{id}                         | Assigned subject only; client response omits privateNote, plannerSub, clientSub                     |
| POST   | /api/weddings                              | PLANNER; `{names, date, venue, guests, clientSub, privateNote}`                                     |
| POST   | /api/weddings/{id}/tasks                   | Assigned PLANNER; `{title, date, group, assignee, description}`; group couple/planner               |
| PATCH  | /api/weddings/{id}/tasks/{taskId}          | Assigned user; `{revision, status}`; status Ootel/Töös/Valmis; clients can change couple tasks only |
| POST   | /api/weddings/{id}/tasks/{taskId}/comments | Assigned user; `{text}`; author comes from authenticated token                                      |
| POST   | /api/weddings/{id}/contacts                | Assigned PLANNER; `{name, role, email, phone, note}`                                                |

Mutations return the updated authorized wedding projection. Do not cache planner responses in a client-facing application. Query-string wedding IDs only select a record; they never confer access. A site's admin role alone gives no wedding rights.

Typical failures: 400 invalid input, 401 missing/invalid/expired token, 403 insufficient role or prohibited mutation, 404 nonexistent/unassigned resource, 409 stale revision or booking conflict. Domain errors have a `message` property; Spring Security errors may have an empty body. Frontends handle both.

Both services expose only `/actuator/health` publicly for readiness checks; actuator internals are not exposed. CORS origins are explicit configuration. Services are stateless with respect to authentication; no ambient session cookies are accepted, and CSRF is disabled for these bearer-token APIs.
