import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repos = JSON.parse(
  fs.readFileSync(path.join(root, "repositories.json"), "utf8"),
);
let fail = false;
for (const repo of repos) {
  const cwd = path.resolve(root, repo.directory);
  try {
    const head = execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
    }).trim();
    if (path.resolve(head) !== cwd)
      throw Error("Not an independent repository");
    const files = execFileSync("git", ["ls-files"], { cwd, encoding: "utf8" })
      .trim()
      .split("\n");
    for (const f of files) {
      if (
        /(^|\/)(node_modules|target|work|data|uploads|\.git)(\/|$)|(^|\/)\.env$|LOCAL-CREDENTIALS|ehe-realm\.json$|\.(sqlite|db|pem|key)$/.test(
          f,
        )
      )
        throw Error("Excluded runtime file is tracked: " + f);
      if (fs.statSync(path.join(cwd, f)).size > 95 * 1024 * 1024)
        throw Error("File exceeds GitHub preparation limit: " + f);
    }
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd,
      encoding: "utf8",
    }).trim();
    console.log(
      repo.name +
        ": " +
        files.length +
        " tracked files; " +
        (status ? "uncommitted changes" : "clean"),
    );
  } catch (e) {
    fail = true;
    console.error(repo.name + ": " + e.message);
  }
}
if (fail) process.exit(1);
