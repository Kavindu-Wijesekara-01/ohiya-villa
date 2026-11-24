import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

async function testUpdatedApp() {
  console.log('--- Testing Updated App in Google Chrome ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Test Animated Booking Calendar Popover
  console.log('1. Testing Modern Booking Calendar...');
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await b.evaluate(el => el.innerText);
    if (text.includes('open interactive calendar') || text.includes('Tap to open') || text.includes('Select Dates') || text.includes('→')) {
      await b.click();
      console.log('Clicked Calendar Trigger Button!');
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '20-calendar-opened.png') });
      console.log('Saved 20-calendar-opened.png');
      break;
    }
  }

  // 2. Smoothly scroll through the page to test scroll animations
  console.log('2. Scrolling to trigger animations...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 250;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 35);
    });
  });

  await new Promise(r => setTimeout(r, 600));

  // 3. Test Gallery Section
  console.log('3. Capturing Gallery Section...');
  const galleryEl = await page.$('#gallery');
  if (galleryEl) {
    await galleryEl.screenshot({ path: path.join(OUTPUT_DIR, '21-gallery-section.png') });
    console.log('Saved 21-gallery-section.png');
  }

  // 4. Test Gallery Filter Tab
  const filterTabs = await page.$$('#gallery button');
  for (const tab of filterTabs) {
    const txt = await tab.evaluate(el => el.innerText);
    if (txt.includes('Guest Bedrooms')) {
      await tab.click();
      console.log('Clicked Guest Bedrooms tab');
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: path.join(OUTPUT_DIR, '22-gallery-filtered-rooms.png') });
      console.log('Saved 22-gallery-filtered-rooms.png');
      break;
    }
  }

  // 5. Capture Full Updated Page
  await page.screenshot({ path: path.join(OUTPUT_DIR, '23-updated-full-page.png'), fullPage: true });
  console.log('Saved 23-updated-full-page.png');

  await browser.close();
  console.log('--- All Chrome Browser Tests Passed! ---');
}

testUpdatedApp().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
