#!/bin/bash
# Publish all Intinya packages to npm
# Run: ./scripts/publish.sh

set -e

echo "📦 Publishing Intinya packages..."

# Check auth
echo "Checking npm auth..."
npm whoami || { echo "❌ Not logged in. Run 'npm login' first."; exit 1; }

# Publish in order (dependencies first)
PACKAGES=(
  "packages/tokens"
  "packages/grid-core"
  "packages/core"
  "packages/data-table"
  "packages/md3"
  "packages/flat"
  "packages/cli"
  "packages/editor-core"
  "packages/image-editor"
)

for pkg in "${PACKAGES[@]}"; do
  echo ""
  echo "📤 Publishing $pkg..."
  cd "$pkg"
  npm publish --tag alpha || { echo "❌ Failed to publish $pkg"; exit 1; }
  cd ../..
done

echo ""
echo "✅ All packages published successfully!"
echo ""
echo "Packages published:"
for pkg in "${PACKAGES[@]}"; do
  name=$(grep '"name"' "$pkg/package.json" | head -1 | sed 's/.*: "//;s/".*//')
  version=$(grep '"version"' "$pkg/package.json" | head -1 | sed 's/.*: "//;s/".*//')
  echo "  - $name@$version"
done
