#!/usr/bin/env node
// checks dist/ size of each workspace package against scripts/bundle-budgets.json
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const budgets = JSON.parse(readFileSync("scripts/bundle-budgets.json", "utf8"));
const packagesDir = "packages";

let exitCode = 0;

function dirSizeKB(dir) {
  let total = 0;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      total += dirSizeKB(full);
    } else {
      total += statSync(full).size;
    }
  }
  return total / 1024;
}

console.log("Bundle Budget Report");
console.log("─".repeat(70));
console.log(
  "Package".padEnd(38) +
    "Size (KB)".padStart(10) +
    "  " +
    "Status".padStart(10),
);
console.log("─".repeat(70));

for (const [pkgName, budget] of Object.entries(budgets)) {
  const dirName =
    pkgName === "@intinyagroup/ui"
      ? "core"
      : pkgName.replace("@intinyagroup/", "");
  const distDir = join(packagesDir, dirName, "dist");

  if (!readdirSync(packagesDir).includes(dirName)) {
    continue;
  }

  if (!statSync(distDir, { throwIfNoEntry: false })?.isDirectory?.()) {
    console.log(
      `${pkgName.padEnd(38)}${"N/A".padStart(10)}  ${"skip".padStart(10)}`,
    );
    continue;
  }

  const sizeKB = dirSizeKB(distDir);
  let status = "OK";

  if (sizeKB > budget.maxSizeKb) {
    status = "EXCEED";
    exitCode = 1;
  } else if (sizeKB > budget.warningSizeKb) {
    status = "WARN";
  }

  const sizeStr = sizeKB.toFixed(1);
  console.log(
    `${pkgName.padEnd(38)}${sizeStr.padStart(10)}  ${status.padStart(10)}`,
  );
}

console.log("─".repeat(70));

if (exitCode !== 0) {
  console.error("\nSome packages exceeded their bundle budgets!");
  process.exit(exitCode);
} else {
  console.log("\nAll packages within budgets.");
}
