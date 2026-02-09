#!/usr/bin/env bash
# Test Conversion Funnel E2E
# Runs Playwright tests for conversion funnel tracking

set -euo pipefail

cd "$(dirname "$0")/.."

echo "🧪 Running Conversion Funnel E2E Tests"
echo "========================================"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "❌ Dev server not running on http://localhost:3000"
  echo ""
  echo "Please start the dev server first:"
  echo "  cd ~/Development/products/vino12"
  echo "  rm -rf .next  # Clear Turbopack cache if needed"
  echo "  npm run dev"
  echo ""
  exit 1
fi

echo "✓ Dev server is running"
echo ""

# Run the specific conversion funnel test
echo "Running conversion-funnel.spec.ts..."
echo ""

npx playwright test e2e/specs/conversion-funnel.spec.ts \
  --reporter=list \
  --project=chromium

echo ""
echo "✓ Tests complete!"
echo ""
echo "To see the HTML report:"
echo "  npm run e2e:report"
