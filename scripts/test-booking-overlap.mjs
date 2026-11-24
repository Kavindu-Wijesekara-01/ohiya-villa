import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

async function testBookingOverlap() {
  console.log('--- Testing Modern Booking Bar Overlap and Clean Design ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Desktop (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-booking-overlap.png') });
  console.log('Saved desktop-booking-overlap.png');

  // Mobile (390x844 - iPhone 14/15/16)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-booking-overlap.png') });
  console.log('Saved mobile-booking-overlap.png');

  // Mobile scrolled down to booking bar
  await page.evaluate(() => window.scrollBy(0, 260));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-booking-scrolled.png') });
  console.log('Saved mobile-booking-scrolled.png');

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile 390px overflow check:', mobileOverflow);

  await browser.close();
  console.log('--- Overlap Tests Completed Successfully ---');
}

testBookingOverlap().catch(err => {
  console.error(err);
  process.exit(1);
});
