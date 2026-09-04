#!/bin/bash
# First-time publish for NEW @intinya packages (not yet on npm)
# Requires npm login + 2FA (staged publishing can't create brand-new packages)
set -e

# These 17 packages have NEVER been published (npm 404). Staged publish can't create them.
PACKAGES=(
  native
  rich-text
  book-writer
  calendar
  charts
  collaboration
  kanban
  pdf-viewer
  slides
  spreadsheet
  motion
  motion-captions
  motion-effects
  motion-media
  motion-player
  motion-studio
  motion-three
)

echo "Publishing 17 NEW packages (requires 2FA)..."
for pkg in "${PACKAGES[@]}"; do
  echo ""
  echo "📤 $pkg..."
  cd "packages/$pkg"
  npm publish --tag alpha || { echo "❌ $pkg failed (may need OTP)"; }
  cd ../..
done
echo ""
echo "✅ Done. Verify: npm view @intinyagroup/native"