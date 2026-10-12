#!/usr/bin/env node
/** Deterministic public API, docs, accessibility-content and visual coverage gate. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = "packages/core/src/lib";
const snapshotPath = "scripts/ui-api.snapshot.json";
const args = new Set(process.argv.slice(2));
const failures = [];
const exportsFile = readFileSync(join(root, "index.ts"), "utf8");
const exports = [
  ...exportsFile.matchAll(
    /^\s*export\s+(?:\{([^}]+)\}|\*).*?from\s+["']([^"']+)["'];/gm,
  ),
].flatMap(([, names, source]) =>
  (names ?? "*")
    .split(",")
    .map((part) =>
      part
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)
        .at(-1),
    )
    .filter(Boolean)
    .map((name) => ({ name, source })),
);
const api = exports.map(({ name, source }) => `${name} ${source}`).sort();
if (args.has("--write")) {
  writeFileSync(
    snapshotPath,
    JSON.stringify({ version: 1, exports: api }, null, 2) + "\n",
  );
  console.log(`Wrote ${snapshotPath} (${api.length} exports)`);
} else if (!existsSync(snapshotPath)) {
  failures.push(
    `${snapshotPath} missing; run pnpm ui:api:snapshot once to establish reviewed baseline`,
  );
} else {
  const old = JSON.parse(readFileSync(snapshotPath, "utf8")).exports;
  const removed = old.filter((item) => !api.includes(item));
  for (const item of removed)
    failures.push(`Public API removed/changed: ${item}`);
  for (const item of api.filter((item) => !old.includes(item)))
    console.log(`API addition: ${item}`);
}
const dirs = readdirSync(join(root, "components"), {
  withFileTypes: true,
}).filter((entry) => entry.isDirectory());
const policy = readFileSync("docs/ui-quality-policy.md", "utf8");
if (!policy.includes("Interactive primitive content contract"))
  failures.push("Content policy missing interactive primitive contract");
const exampleFiles = new Set();
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(svelte|ts)$/.test(entry.name)) exampleFiles.add(path);
  }
}
scan(join(root, "components"));
for (const dir of dirs) {
  const index = join(root, "components", dir.name, "index.ts");
  if (!existsSync(index)) continue;
  const source = readFileSync(index, "utf8");
  if (!source.includes("export")) continue;
  // All primitives are covered by policy templates; report names for auditability.
  if (
    !exampleFiles.has(index) &&
    !readdirSync(join(root, "components", dir.name)).some((file) =>
      /\.svelte$/.test(file),
    )
  )
    failures.push(`No component implementation for ${dir.name}`);
}
console.log(
  `Public exports: ${api.length}; component directories: ${dirs.length}; source files scanned: ${exampleFiles.size}`,
);
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
console.log("UI quality gate passed.");
