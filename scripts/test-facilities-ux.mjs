import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

async function testFacilities() {
  console.log('--- Testing Redesigned Facilities Section on Chrome ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Desktop Test
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Scroll to facilities
  await page.evaluate(() => {
    const el = document.getElementById('facilities');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const facilitiesEl = await page.$('#facilities');
  if (facilitiesEl) {
    await facilitiesEl.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-facilities-redesign.png') });
    console.log('Saved desktop-facilities-redesign.png');
  }

  // Mobile Test (390x844 - iPhone 14/15/16)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  await page.evaluate(async () => {
    const el = document.getElementById('facilities');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    for (let i = 0; i < 8; i++) {
      window.scrollBy(0, 300);
      await new Promise(r => setTimeout(r, 60));
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileFacilitiesEl = await page.$('#facilities');
  if (mobileFacilitiesEl) {
    await mobileFacilitiesEl.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-facilities-redesign.png') });
    console.log('Saved mobile-facilities-redesign.png');
  }

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow:', overflow);

  await browser.close();
  console.log('--- Facilities Section Chrome Test Completed! ---');
}

testFacilities().catch(err => {
  console.error(err);
  process.exit(1);
});
