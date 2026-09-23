// screenshot_projects.js — Headless browser screenshots for portfolio projects
// Run: node screenshot_projects.js

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'wwwroot', 'images', 'projects');

async function captureScreenshot(browser, url, outputPath, label) {
  console.log(`\n📸 Capturing: ${label}`);
  console.log(`   URL: ${url}`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  // Dismiss JS dialogs automatically
  page.on('dialog', async dialog => { await dialog.dismiss(); });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    // Extra wait for animations/fonts
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 88, fullPage: false });
    console.log(`   ✅ Saved to: ${outputPath}`);
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

(async () => {
  console.log('🚀 Starting headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // 1. Nexora Digital — serve from dist folder or local server
    const nexoraDistIndex = path.join(__dirname, '..', 'Nexora Digital', 'dist', 'index.html');
    const nexoraUrl = `file:///${nexoraDistIndex.replace(/\\/g, '/')}`;
    await captureScreenshot(
      browser,
      nexoraUrl,
      path.join(OUTPUT_DIR, 'nexora-digital.jpg'),
      'Nexora Digital'
    );

    // 2. NED Academy Website — must be running on port 5100
    const nedUrl = 'http://localhost:5100';
    console.log('\n⚠️  NED Academy screenshot requires server on port 5100...');
    await captureScreenshot(
      browser,
      nedUrl,
      path.join(OUTPUT_DIR, 'ned-academy.jpg'),
      'NED Academy Website'
    );

  } finally {
    await browser.close();
    console.log('\n✅ All screenshots complete!');
  }
})();
