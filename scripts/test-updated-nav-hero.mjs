import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

async function testUpdatedNavAndHero() {
  console.log('--- Testing updated Glass Navbar, Prominent Logo, and Scrolled Glass Look ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Desktop Test (1440x900) - Unscrolled
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-glass-nav-unscrolled.png') });
  console.log('Saved desktop-glass-nav-unscrolled.png');

  // Desktop Test - Scrolled 600px
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-glass-nav-scrolled.png') });
  console.log('Saved desktop-glass-nav-scrolled.png');

  // Verify Navbar properties in scrolled state
  const navStyle = await page.evaluate(() => {
    const navPill = document.querySelector('header div');
    const brandSpan = Array.from(document.querySelectorAll('header span')).find(s => s.textContent.includes('Dawn Breezy'));
    return {
      navBg: navPill ? window.getComputedStyle(navPill).backgroundColor : null,
      backdropFilter: navPill ? window.getComputedStyle(navPill).backdropFilter : null,
      brandFontFamily: brandSpan ? window.getComputedStyle(brandSpan).fontFamily : null,
      brandFontSize: brandSpan ? window.getComputedStyle(brandSpan).fontSize : null,
      brandColor: brandSpan ? window.getComputedStyle(brandSpan).color : null,
      hasOhiyaText: Array.from(document.querySelectorAll('header span')).some(s => s.textContent.includes('1,775m'))
    };
  });
  console.log('Scrolled Nav Elements Style:', navStyle);

  // Mobile iPhone 14/15/16 Test (390x844) - Unscrolled
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-glass-nav-unscrolled.png') });
  console.log('Saved mobile-glass-nav-unscrolled.png');

  // Mobile Scrolled 500px
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-glass-nav-scrolled.png') });
  console.log('Saved mobile-glass-nav-scrolled.png');

  // Open mobile drawer on scrolled state
  const menuBtn = await page.$('button[aria-label="Open menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-drawer-glass.png') });
    console.log('Saved mobile-drawer-glass.png');
  }

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile 390px overflow check:', mobileOverflow);

  await browser.close();
  console.log('--- All Glass Navbar Tests Completed Successfully ---');
}

testUpdatedNavAndHero().catch(err => {
  console.error(err);
  process.exit(1);
});
