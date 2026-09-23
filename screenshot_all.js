const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, 'wwwroot', 'images', 'projects');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture(browser, url, filename, label, waitForSelector) {
  console.log(`\n========================================`);
  console.log(`📸 Capturing: ${label}`);
  console.log(`   URL: ${url}`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  page.on('dialog', async d => { await d.dismiss(); });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: 5000 }).catch(() => {});
    }
    await new Promise(r => setTimeout(r, 2000));
    const dest = path.join(OUT_DIR, filename);
    await page.screenshot({ path: dest, type: 'jpeg', quality: 90, fullPage: false });
    const stat = fs.statSync(dest);
    console.log(`   ✅ SUCCESS: ${filename} (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`   ❌ ERROR capturing ${label}:`, err.message);
  } finally {
    await page.close();
  }
}

(async () => {
  console.log('🚀 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    // 1. Nexora Digital (port 5173)
    await capture(browser, 'http://localhost:5173', 'nexora-digital.jpg', 'Nexora Digital Agency Platform');

    // 2. NED Academy Website & Admissions (port 5100)
    await capture(browser, 'http://localhost:5100', 'ned-academy-website.jpg', 'NED Academy Admissions & Public Portal');

    // 3. NED Academy UMS Management (port 5150)
    await capture(browser, 'http://localhost:5150', 'ned-academy-system.jpg', 'NED Academy Management System (UMS)');

  } finally {
    await browser.close();
    console.log('\n🏁 Finished capturing all project screenshots.');
  }
})();
