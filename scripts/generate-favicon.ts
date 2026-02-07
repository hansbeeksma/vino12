import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const APP_DIR = join(__dirname, "..", "app");
const PREVIEW_DIR = join(__dirname, "..", "favicon-previews");

function buildY(fontSize: number): number {
  const capHeight = fontSize * 0.70;
  return Math.round(((32 + capHeight) / 2) * 10) / 10;
}

function buildSvg(fontSize: number): string {
  const y = buildY(fontSize);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#FFFFFF"/>
  <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fontSize}" text-anchor="middle">
    <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
  </text>
</svg>`;
}

function buildComparisonHtml(): string {
  const fontSizes = [13, 14, 15, 16];

  const svgBlocks = fontSizes.map((fs) => {
    const y = buildY(fs);
    return `
    <div class="variant">
      <div class="label">font-size: ${fs}, y: ${y}</div>
      <div class="row">
        <div class="size-label">16px (tab)</div>
        <div class="icon-box" style="width:16px;height:16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#FFFFFF"/>
            <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fs}" text-anchor="middle">
              <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
            </text>
          </svg>
        </div>
        <div class="size-label">32px (retina)</div>
        <div class="icon-box" style="width:32px;height:32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#FFFFFF"/>
            <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fs}" text-anchor="middle">
              <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
            </text>
          </svg>
        </div>
        <div class="size-label">64px (zoom)</div>
        <div class="icon-box" style="width:64px;height:64px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#FFFFFF"/>
            <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fs}" text-anchor="middle">
              <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
            </text>
          </svg>
        </div>
        <div class="size-label">180px (apple)</div>
        <div class="icon-box" style="width:180px;height:180px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#FFFFFF"/>
            <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fs}" text-anchor="middle">
              <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
            </text>
          </svg>
        </div>
      </div>
    </div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 30px; background: #f0f0f0; font-family: sans-serif; }
    h1 { font-size: 18px; margin-bottom: 20px; }
    h2 { font-size: 14px; margin-top: 30px; }
    .variant { margin-bottom: 20px; padding: 15px; background: white; border: 2px solid #333; }
    .label { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
    .row { display: flex; align-items: center; gap: 15px; }
    .size-label { font-size: 11px; color: #666; width: 80px; text-align: right; }
    .icon-box { border: 1px solid #ccc; background: white; flex-shrink: 0; }
    .icon-box svg { display: block; }
    .tab-sim { display: flex; align-items: center; gap: 6px; background: #DEE1E6; padding: 6px 12px; border-radius: 8px 8px 0 0; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #333; margin-top: 8px; max-width: 200px; }
    .tab-sim .tab-icon { width: 16px; height: 16px; flex-shrink: 0; }
    .tab-sim .tab-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  </style>
</head>
<body>
  <h1>Favicon Font-Size Comparison: 13 / 14 / 15 / 16</h1>
  ${svgBlocks}

  <h2>Tab Simulation (Chrome macOS)</h2>
  ${fontSizes.map((fs) => {
    const y = buildY(fs);
    return `
  <div class="tab-sim">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" class="tab-icon">
      <rect width="32" height="32" fill="#FFFFFF"/>
      <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fs}" text-anchor="middle">
        <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
      </text>
    </svg>
    <span class="tab-text">Vino12 — 6 R... (fs=${fs})</span>
  </div>`;
  }).join("\n")}
</body>
</html>`;
}

async function main() {
  mkdirSync(PREVIEW_DIR, { recursive: true });

  const browser = await chromium.launch();

  // Step 1: Generate comparison at 2x DPR (retina-like)
  console.log("Generating comparison page (2x DPR)...");
  const ctx2x = await browser.newContext({ deviceScaleFactor: 2 });
  const compPage = await ctx2x.newPage();
  await compPage.setContent(buildComparisonHtml(), { waitUntil: "networkidle" });
  await compPage.waitForTimeout(500);
  await compPage.screenshot({ path: join(PREVIEW_DIR, "comparison-all.png"), fullPage: true });
  console.log("Saved: favicon-previews/comparison-all.png");
  await compPage.close();
  await ctx2x.close();

  // Step 2: Render each variant at actual 16x16 (1x DPR) for pixel-level inspection
  console.log("\nRendering 16x16 actual-tab previews (1x DPR)...");
  const ctx1x = await browser.newContext({ deviceScaleFactor: 1 });
  for (const fontSize of [13, 14, 15, 16]) {
    const y = buildY(fontSize);
    const html = `<!DOCTYPE html>
<html><head>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&display=swap" rel="stylesheet">
  <style>body{margin:0;padding:0;overflow:hidden;}</style>
</head><body>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#FFFFFF"/>
    <text x="16" y="${y}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${fontSize}" text-anchor="middle">
      <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
    </text>
  </svg>
</body></html>`;
    const page = await ctx1x.newPage();
    await page.setViewportSize({ width: 16, height: 16 });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(PREVIEW_DIR, `tab-16px-fs${fontSize}.png`), clip: { x: 0, y: 0, width: 16, height: 16 } });
    await page.close();
    console.log(`  Saved: tab-16px-fs${fontSize}.png`);
  }
  await ctx1x.close();

  // Step 3: Decide - use font-size 15 as the best balance
  // Reasoning:
  // - fs=12 (current): too small, text barely visible in tab
  // - fs=13: slightly bigger but still small relative to tab text
  // - fs=14: decent but still a bit small
  // - fs=15: text cap-height at 16px render = ~5.25px CSS = good proportion
  //          At retina (32 device px), text fills ~66% of height = natural look
  //          Not clipping, good margins, clearly readable
  // - fs=16: fills too much, previous attempt was rejected
  const CHOSEN_FS = 15;
  const chosenY = buildY(CHOSEN_FS);
  console.log(`\nChosen: font-size=${CHOSEN_FS}, y=${chosenY}`);

  // Step 4: Generate final production files
  console.log("\n--- Generating production files ---");

  // 4a: icon.svg
  const finalSvg = buildSvg(CHOSEN_FS);
  writeFileSync(join(APP_DIR, "icon.svg"), finalSvg);
  console.log("Written: app/icon.svg");

  // 4b: Render PNGs at 1x DPR for pixel-perfect output
  const pngCtx = await browser.newContext({ deviceScaleFactor: 1 });
  const pngs: { size: number; data: Buffer }[] = [];

  for (const size of [16, 32, 180]) {
    const html = `<!DOCTYPE html>
<html><head>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@700&display=swap" rel="stylesheet">
  <style>body{margin:0;padding:0;overflow:hidden;}</style>
</head><body>
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#FFFFFF"/>
    <text x="16" y="${chosenY}" font-family="'IBM Plex Mono',monospace" font-weight="700" font-size="${CHOSEN_FS}" text-anchor="middle">
      <tspan fill="#000000">V</tspan><tspan fill="#722F37">12</tspan>
    </text>
  </svg>
</body></html>`;

    const page = await pngCtx.newPage();
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: size, height: size }, type: "png" });
    pngs.push({ size, data: Buffer.from(buf) });
    console.log(`  Generated ${size}x${size} PNG (${buf.length} bytes)`);
    await page.close();
  }
  await pngCtx.close();

  // 4c: apple-icon.png
  const appleData = pngs.find((p) => p.size === 180)!;
  writeFileSync(join(APP_DIR, "apple-icon.png"), appleData.data);
  console.log("Written: app/apple-icon.png");

  // 4d: favicon.ico
  const icoImages = pngs.filter((p) => p.size <= 32);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoImages.length, 4);

  const dir = Buffer.alloc(16 * icoImages.length);
  let offset = 6 + dir.length;

  for (let i = 0; i < icoImages.length; i++) {
    const { size, data } = icoImages[i];
    const o = i * 16;
    dir.writeUInt8(size, o);
    dir.writeUInt8(size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  }

  writeFileSync(
    join(APP_DIR, "favicon.ico"),
    Buffer.concat([header, dir, ...icoImages.map((p) => p.data)])
  );
  console.log("Written: app/favicon.ico");

  console.log(`\n--- Final SVG (font-size: ${CHOSEN_FS}, y: ${chosenY}) ---`);
  console.log(finalSvg);

  await browser.close();
  console.log("\nAll done!");
}

main().catch(console.error);
