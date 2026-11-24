import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

async function testHeroAndNavbar() {
  console.log('--- Testing Modern Floating Navbar & Animated Hero ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Desktop Test (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Initial Hero State
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'hero-01-initial-state.png') });
  console.log('Saved hero-01-initial-state.png');

  // Wait 3.2 seconds for ticker text animation to transition to the next text
  console.log('Waiting 3.2s for text ticker animation...');
  await new Promise(r => setTimeout(r, 3200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'hero-02-ticker-animated.png') });
  console.log('Saved hero-02-ticker-animated.png');

  // Wait another 2.5s for background image transition
  console.log('Waiting 2.5s for background image crossfade...');
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'hero-03-bg-crossfaded.png') });
  console.log('Saved hero-03-bg-crossfaded.png');

  // Test Floating Scrolled Navbar
  console.log('Scrolling down to test scrolled modern floating navbar state...');
  await page.evaluate(() => window.scrollBy(0, 300));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'navbar-01-scrolled-floating.png') });
  console.log('Saved navbar-01-scrolled-floating.png');

  // Mobile Test (390x844 - iPhone 14/15/16)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'hero-mobile-01.png') });
  console.log('Saved hero-mobile-01.png');

  // Test Mobile Menu open
  const menuBtn = await page.$('button[aria-label="Open menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'navbar-mobile-drawer.png') });
    console.log('Saved navbar-mobile-drawer.png');
  }

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow:', overflow);

  await browser.close();
  console.log('--- Hero & Navbar Chrome Tests Completed! ---');
}

testHeroAndNavbar().catch(err => {
  console.error(err);
  process.exit(1);
});
