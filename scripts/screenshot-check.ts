import { chromium } from "playwright";

const BASE = "https://vino12.com";
const OUT = "/tmp/vino12-screenshots";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const { mkdirSync } = await import("fs");
  mkdirSync(OUT, { recursive: true });

  // 1. Homepage full page
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/01-homepage.png`, fullPage: true });
  console.log("📸 01-homepage.png");

  // 2. Collection grid (scroll to it)
  await page.locator("#collectie").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/02-collection-grid.png` });
  console.log("📸 02-collection-grid.png");

  // 3. Individual wine card close-up (first card)
  const firstCard = page.locator("a[href^='/wijn/']").first();
  await firstCard.screenshot({ path: `${OUT}/03-wine-card-closeup.png` });
  console.log("📸 03-wine-card-closeup.png");

  // 4. Check image rendering in all cards
  const cards = page.locator("a[href^='/wijn/'] img");
  const cardCount = await cards.count();
  console.log(`\nFound ${cardCount} card images. Checking dimensions...\n`);

  for (let i = 0; i < Math.min(cardCount, 12); i++) {
    const img = cards.nth(i);
    const box = await img.boundingBox();
    const alt = await img.getAttribute("alt");
    if (box) {
      const ratio = box.height / box.width;
      const fits = box.width > 50 && box.height > 50;
      console.log(
        `${fits ? "✅" : "❌"} ${alt?.substring(0, 30).padEnd(30)} ${Math.round(box.width)}×${Math.round(box.height)}px (ratio ${ratio.toFixed(2)})`
      );
    } else {
      console.log(`❌ ${alt?.substring(0, 30).padEnd(30)} — not visible`);
    }
  }

  // 5. Wine detail page
  await page.goto(`${BASE}/wijn/pinot-noir-bourgogne`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/04-wine-detail.png` });
  console.log("\n📸 04-wine-detail.png");

  // Check detail image dimensions
  const detailImg = page.locator("img[alt*='Pinot Noir']").first();
  const detailBox = await detailImg.boundingBox();
  if (detailBox) {
    console.log(`Detail image: ${Math.round(detailBox.width)}×${Math.round(detailBox.height)}px`);
  }

  // 6. Mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator("#collectie").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/05-mobile-grid.png` });
  console.log("📸 05-mobile-grid.png");

  await browser.close();
  console.log(`\nScreenshots saved to ${OUT}/`);
}

main().catch(console.error);
