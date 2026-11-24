import puppeteer from 'puppeteer-core';

async function testTablet() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 768 x 1024 (iPad Mini / Portrait Tablet)
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/tablet-768-hero.png' });

  // Test 820 x 1180 (iPad Air / iPad 10th gen)
  await page.setViewport({ width: 820, height: 1180, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/tablet-820-hero.png' });

  // Evaluate Navbar, Hero, BookingBar bounding rects on 768x1024
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  const tabletDetails = await page.evaluate(() => {
    const nav = document.querySelector('header');
    const hero = document.querySelector('section');
    const h1 = hero ? hero.querySelector('h1') : null;
    const p = hero ? hero.querySelector('p') : null;
    const btns = hero ? hero.querySelectorAll('a[href*="wa.me"], a[href*="#rooms"]') : [];
    const bookingBar = document.querySelector('.scroll-reveal.w-full.max-w-5xl');

    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      navRect: nav ? nav.getBoundingClientRect() : null,
      h1Rect: h1 ? h1.getBoundingClientRect() : null,
      pRect: p ? p.getBoundingClientRect() : null,
      btnsTop: btns[0] ? btns[0].getBoundingClientRect().top : null,
      bookingBarRect: bookingBar ? bookingBar.getBoundingClientRect() : null,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('Tablet Details:', JSON.stringify(tabletDetails, null, 2));

  await browser.close();
}

testTablet().catch((err) => {
  console.error(err);
  process.exit(1);
});
