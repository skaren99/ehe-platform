import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", "keycloak/ehe-realm.json", "LOCAL-CREDENTIALS.md"])
  if (fs.existsSync(path.join(root, file)))
    throw Error(
      file + " already exists; existing configuration has been preserved.",
    );
const password = () => randomBytes(24).toString("base64url");
const values = {
  SITE_DB_PASSWORD: password(),
  WEDDING_DB_PASSWORD: password(),
  KEYCLOAK_ADMIN_PASSWORD: password(),
  ADMIN_PASSWORD: password(),
  PLANNER_PASSWORD: password(),
  COUPLE_PASSWORD: password(),
};
let realm = fs.readFileSync(
  path.join(root, "keycloak/realm.template.json"),
  "utf8",
);
for (const key of ["ADMIN_PASSWORD", "PLANNER_PASSWORD", "COUPLE_PASSWORD"])
  realm = realm.replaceAll("__" + key + "__", values[key]);
fs.writeFileSync(path.join(root, "keycloak/ehe-realm.json"), realm, {
  mode: 0o600,
});
fs.writeFileSync(
  path.join(root, ".env"),
  Object.entries(values)
    .filter(([k]) =>
      [
        "SITE_DB_PASSWORD",
        "WEDDING_DB_PASSWORD",
        "KEYCLOAK_ADMIN_PASSWORD",
      ].includes(k),
    )
    .map(([k, v]) => k + "=" + v)
    .join("\n") + "\n",
  { mode: 0o600 },
);
fs.writeFileSync(
  path.join(root, "LOCAL-CREDENTIALS.md"),
  "# Local development accounts only\n\n" +
    Object.entries(values)
      .filter(
        ([k]) =>
          k.includes("ADMIN") ||
          k === "PLANNER_PASSWORD" ||
          k === "COUPLE_PASSWORD",
      )
      .map(([k, v]) => "- " + k + ": `" + v + "`")
      .join("\n") +
    "\n\nApplication usernames: admin, planner, couple. Keycloak bootstrap administrator: bootstrap.\nThese generated files are ignored by Git. Never deploy this development realm publicly.\n",
  { mode: 0o600 },
);
console.log(
  "Local configuration generated. Read LOCAL-CREDENTIALS.md for development sign-ins.",
);
