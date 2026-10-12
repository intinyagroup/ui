import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const snapshot = JSON.parse(
  readFileSync("scripts/ui-api.snapshot.json", "utf8"),
);
test("API snapshot has versioned, unique sorted exports", () => {
  assert.equal(snapshot.version, 1);
  assert.ok(snapshot.exports.length > 0);
  assert.deepEqual(snapshot.exports, [...new Set(snapshot.exports)].sort());
});
test("content policy defines localization and interactive accessibility contract", () => {
  const policy = readFileSync("docs/ui-quality-policy.md", "utf8");
  for (const phrase of [
    "locale-neutral defaults",
    "accessible name",
    "controlled and uncontrolled",
    "RTL",
    "reduced motion",
  ]) {
    assert.ok(policy.includes(phrase), `Missing policy requirement: ${phrase}`);
  }
});
