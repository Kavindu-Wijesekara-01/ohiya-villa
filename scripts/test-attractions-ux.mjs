import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runUXAudit() {
  console.log('=== Starting Chrome Browser UX & Responsiveness Audit ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => pageErrors.push(err.toString()));

  // ----------------------------------------------------
  // TEST 1: Desktop Viewport (1440x900) - Homepage Nearby Section
  // ----------------------------------------------------
  console.log('\n--- Test 1: Desktop Homepage Nearby Section ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Scroll to nearby section
  await page.evaluate(() => {
    const el = document.getElementById('nearby');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot of Nearby Section on Homepage
  const nearbyEl = await page.$('#nearby');
  if (nearbyEl) {
    await nearbyEl.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-01-nearby-section.png') });
    console.log('Saved desktop-01-nearby-section.png');
  }

  // Count attraction cards
  const cardCount = await page.evaluate(() => {
    return document.querySelectorAll('#nearby a[href^="/attractions/"]').length;
  });
  console.log(`Found ${cardCount} attraction links in Nearby section`);

  // Test Filters
  console.log('Testing Railway & Stations filter button...');
  const railwayBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('#nearby button'));
    return btns.find(b => b.innerText.includes('Railway'));
  });
  if (railwayBtn && railwayBtn.asElement()) {
    await railwayBtn.asElement().click();
    await new Promise(r => setTimeout(r, 300));
    const railwayCardCount = await page.evaluate(() => {
      return document.querySelectorAll('#nearby a[href^="/attractions/"]').length;
    });
    console.log(`Railway filter shows ${railwayCardCount} links`);
  }

  // Reset to All Highlights
  const allBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('#nearby button'));
    return btns.find(b => b.innerText.includes('All Highlights'));
  });
  if (allBtn && allBtn.asElement()) {
    await allBtn.asElement().click();
    await new Promise(r => setTimeout(r, 300));
  }

  // ----------------------------------------------------
  // TEST 2: Navigate to Ohiya Railway Station Page
  // ----------------------------------------------------
  console.log('\n--- Test 2: Dedicated Page - Ohiya Railway Station ---');
  await page.goto('http://localhost:3000/attractions/ohiya-railway-station', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot desktop full page
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'desktop-02-ohiya-station-page.png'),
    fullPage: true,
  });
  console.log('Saved desktop-02-ohiya-station-page.png');

  // Test Lightbox on Ohiya Station Page
  console.log('Testing Photo Lightbox modal on attraction page...');
  const galleryPhotos = await page.$$('button:has(img)');
  if (galleryPhotos.length > 0) {
    // Click the first photo to open Lightbox
    await galleryPhotos[0].click();
    await new Promise(r => setTimeout(r, 400));

    // Screenshot open lightbox
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'desktop-03-photo-lightbox-modal.png'),
    });
    console.log('Saved desktop-03-photo-lightbox-modal.png');

    // Close lightbox via Close button or Escape key
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
  }

  // ----------------------------------------------------
  // TEST 3: Dedicated Page - Horton Plains & World's End
  // ----------------------------------------------------
  console.log('\n--- Test 3: Dedicated Page - Horton Plains National Park ---');
  await page.goto('http://localhost:3000/attractions/horton-plains', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'desktop-04-horton-plains-page.png'),
    fullPage: true,
  });
  console.log('Saved desktop-04-horton-plains-page.png');

  // ----------------------------------------------------
  // TEST 4: Dedicated Page - Bambarakanda Falls
  // ----------------------------------------------------
  console.log('\n--- Test 4: Dedicated Page - Bambarakanda Falls ---');
  await page.goto('http://localhost:3000/attractions/bambarakanda-falls', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'desktop-05-bambarakanda-falls-page.png'),
    fullPage: true,
  });
  console.log('Saved desktop-05-bambarakanda-falls-page.png');

  // ----------------------------------------------------
  // TEST 5: Mobile Viewport (390x844 - iPhone 14/15/16)
  // ----------------------------------------------------
  console.log('\n--- Test 5: Mobile Viewport (390x844) Responsiveness ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // 5.1 Mobile Homepage Nearby Section
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(async () => {
    const el = document.getElementById('nearby');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    // Scroll completely through the page to trigger all DOM elements
    for (let i = 0; i < 20; i++) {
      window.scrollBy(0, 350);
      await new Promise(r => setTimeout(r, 60));
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileNearbyEl = await page.$('#nearby');
  if (mobileNearbyEl) {
    await mobileNearbyEl.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-01-nearby-cards.png') });
    console.log('Saved mobile-01-nearby-cards.png');
  }

  // Check horizontal overflow on mobile homepage
  const mobileHomeOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile homepage has horizontal overflow: ${mobileHomeOverflow}`);

  // 5.2 Mobile Dedicated Attraction Page (Horton Plains)
  await page.goto('http://localhost:3000/attractions/horton-plains', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Check horizontal overflow on mobile attraction page
  const mobileAttractionOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile Horton Plains page has horizontal overflow: ${mobileAttractionOverflow}`);

  // Screenshot Mobile Top (Hero & Badges)
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-02-horton-plains-hero.png'),
    fullPage: false,
  });
  console.log('Saved mobile-02-horton-plains-hero.png');

  // Screenshot Mobile Full Page
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-03-horton-plains-full.png'),
    fullPage: true,
  });
  console.log('Saved mobile-03-horton-plains-full.png');

  // 5.3 Mobile Dedicated Attraction Page (Ohiya Station)
  await page.goto('http://localhost:3000/attractions/ohiya-railway-station', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-04-ohiya-station-full.png'),
    fullPage: true,
  });
  console.log('Saved mobile-04-ohiya-station-full.png');

  // ----------------------------------------------------
  // TEST 6: Small Mobile Viewport (375x667 - iPhone SE)
  // ----------------------------------------------------
  console.log('\n--- Test 6: Small Mobile Viewport (375x667 - iPhone SE) ---');
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/attractions/devils-staircase', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  const seOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`iPhone SE Devil's Staircase page has horizontal overflow: ${seOverflow}`);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'mobile-05-devils-staircase-iphone-se.png'),
    fullPage: false,
  });
  console.log('Saved mobile-05-devils-staircase-iphone-se.png');

  // ----------------------------------------------------
  // TEST 7: Link & CTA Integrity Check
  // ----------------------------------------------------
  console.log('\n--- Test 7: Conversion Link Integrity ---');
  const linkStats = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return {
      totalLinks: links.length,
      waLinks: links.filter(a => a.href.includes('wa.me')).length,
      telLinks: links.filter(a => a.href.includes('tel:')).length,
      mapLinks: links.filter(a => a.href.includes('maps.google.com')).length,
    };
  });
  console.log('Link Verification Stats on Devil\'s Staircase page:', linkStats);

  console.log('\nConsole Errors:', consoleErrors);
  console.log('Page Errors:', pageErrors);

  await browser.close();
  console.log('\n=== All Chrome Browser Audits Completed Successfully! ===');
}

runUXAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
