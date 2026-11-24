import puppeteer from 'puppeteer-core';

async function testSite() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Mobile (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'scripts/mobile-full-audit.png', fullPage: true });

  const mobileMetrics = await page.evaluate(() => {
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      sections: Array.from(document.querySelectorAll('section, footer')).map((s) => ({
        id: s.id || s.className.slice(0, 30),
        height: Math.round(s.getBoundingClientRect().height),
      })),
    };
  });

  console.log('Mobile Metrics:', JSON.stringify(mobileMetrics, null, 2));

  // Test Desktop (1440 x 900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'scripts/desktop-full-audit.png', fullPage: true });

  const desktopMetrics = await page.evaluate(() => {
    return {
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      title: document.title,
    };
  });

  console.log('Desktop Metrics:', JSON.stringify(desktopMetrics, null, 2));

  await browser.close();
  console.log('Full audit screenshots captured successfully');
}

testSite().catch((err) => {
  console.error(err);
  process.exit(1);
});
