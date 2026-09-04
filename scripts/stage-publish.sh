#!/bin/bash
# Stage-publish Intinya packages to npm.
#
# npm does NOT rewrite pnpm-style "workspace:*" dependency specifiers when it
# packs/publishes a package (verified with `npm pack`). If a tarball is staged
# with "workspace:*" intact, installing it fails with:
#   npm error Could not resolve dependency: workspace:* not found in registry
# So before publishing we rewrite workspace:* -> the current workspace version
# of each @intinyagroup/* dependency in every package's package.json.
#
# Publishing flow: npm stage publish -> approve on npmjs.com
# (Staged Packages) -> npm run stage:apply.
#
# Usage: ./scripts/stage-publish.sh [tag]
#   tag  npm dist-tag, default: alpha
#   --rewrite-only  only rewrite workspace deps, skip publishing (CI use)
set -euo pipefail

TAG="${1:-alpha}"
REWRITE_ONLY=0
if [ "${1:-}" = "--rewrite-only" ]; then
  REWRITE_ONLY=1
  TAG="alpha"
fi
PACKAGES=(
  tokens
  core
  grid-core
  data-table
  md3
  flat
  cli
  editor-core
  image-editor
  native
  rich-text
  motion
  motion-captions
  motion-effects
  motion-media
  motion-player
  motion-studio
  motion-three
  book-writer
  calendar
  charts
  collaboration
  kanban
  pdf-viewer
  slides
  spreadsheet
  react
)


rewrite_deps() {
  local pkg="$1"
  local pj="packages/$pkg/package.json"
  # Build a python script that replaces workspace:* with the resolved version
  # for every @intinyagroup/* dependency.
  python3 - "$pj" <<'PY'
import json, os, sys

pj = sys.argv[1]
with open(pj) as f:
    data = json.load(f)
versions = {}
for d in os.listdir("packages"):
    dpj = os.path.join("packages", d, "package.json")
    if os.path.isfile(dpj):
        with open(dpj) as f:
            pkg = json.load(f)
        versions[pkg["name"]] = pkg["version"]

changed = False
for key in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
    deps = data.get(key) or {}
    for dep, spec in deps.items():
        if spec == "workspace:*" or spec == "workspace:^" or spec == "workspace:~":
            resolved = versions.get(dep, "workspace:*")
            if resolved != "workspace:*":
                deps[dep] = resolved
                changed = True

if changed:
    with open(pj, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"  rewrote {pj}")
else:
    print(f"  ok     {pj} (no workspace deps)")
PY
}

echo "Rewriting workspace:* deps -> pinned versions..."
for pkg in "${PACKAGES[@]}"; do
  rewrite_deps "$pkg"
done

echo ""
if [ "$REWRITE_ONLY" = "1" ]; then
  echo "✅ workspace deps rewritten (--rewrite-only, skipping publish)."
  echo "Note: local package.json files are pinned; restore with: git checkout packages/*/package.json"
  exit 0
fi

echo "Staging publish ($TAG)..."
for pkg in "${PACKAGES[@]}"; do
  echo "📤 $pkg"
  (cd "packages/$pkg" && npm stage publish --tag "$TAG") || { echo "❌ Failed to stage $pkg"; exit 1; }
done

echo ""
echo "✅ All packages staged (tag: $TAG)."
echo "Approve at https://www.npmjs.com/settings/intinya/packages (Staged Packages)"
echo "then apply with: npm run stage:apply"
