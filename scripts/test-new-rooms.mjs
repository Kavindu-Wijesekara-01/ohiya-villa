import puppeteer from 'puppeteer-core';

async function testRooms() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Desktop (1440 x 900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/#rooms', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/desktop-rooms-new.png' });

  // Test Tablet (768 x 1024)
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/#rooms', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/tablet-rooms-new.png' });

  // Test Mobile (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/#rooms', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/mobile-rooms-new.png' });

  // Check overflow
  const metrics = await page.evaluate(() => {
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      roomsCount: document.querySelectorAll('#rooms .scroll-reveal.bg-white').length,
    };
  });

  console.log('Test Metrics:', JSON.stringify(metrics, null, 2));

  await browser.close();
  console.log('Screenshots captured successfully');
}

testRooms().catch((err) => {
  console.error(err);
  process.exit(1);
});
