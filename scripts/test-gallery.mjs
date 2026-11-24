import puppeteer from 'puppeteer-core';

async function testGallery() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Mobile (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/#gallery', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/mobile-gallery-mosaic.png' });

  // Test Tablet (768 x 1024)
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/#gallery', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/tablet-gallery-mosaic.png' });

  // Test Desktop (1440 x 900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/#gallery', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: 'scripts/desktop-gallery-mosaic.png' });

  const metrics = await page.evaluate(() => {
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      photoCount: document.querySelectorAll('#gallery .break-inside-avoid').length,
    };
  });

  console.log('Gallery Test Metrics:', JSON.stringify(metrics, null, 2));

  await browser.close();
  console.log('Gallery screenshots captured successfully');
}

testGallery().catch((err) => {
  console.error(err);
  process.exit(1);
});
