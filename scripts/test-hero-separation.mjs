import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Mobile View (390 x 844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'scripts/mobile-hero-separated.png' });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('section');
    const badge = hero.querySelector('.animate-in');
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    const btns = hero.querySelectorAll('a[href*="wa.me"], a[href*="#rooms"]');
    const btn1 = btns[0];
    const btn2 = btns[1];

    const rBadge = badge ? badge.getBoundingClientRect() : null;
    const rH1 = h1 ? h1.getBoundingClientRect() : null;
    const rP = p ? p.getBoundingClientRect() : null;
    const rBtn1 = btn1 ? btn1.getBoundingClientRect() : null;
    const rBtn2 = btn2 ? btn2.getBoundingClientRect() : null;

    return {
      windowHeight: window.innerHeight,
      badgeTop: rBadge ? Math.round(rBadge.top) : null,
      h1Top: rH1 ? Math.round(rH1.top) : null,
      pBottom: rP ? Math.round(rP.bottom) : null,
      firstBtnTop: rBtn1 ? Math.round(rBtn1.top) : null,
      lastBtnBottom: rBtn2 ? Math.round(rBtn2.bottom) : null,
      gapBetweenPAndBtns: rP && rBtn1 ? Math.round(rBtn1.top - rP.bottom) : null,
      spaceBelowBtns: rBtn2 ? Math.round(window.innerHeight - rBtn2.bottom) : null,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('Mobile Layout Metrics:', JSON.stringify(metrics, null, 2));

  // Test Desktop View (1440 x 900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/desktop-hero-separated.png' });

  // Test iPhone SE (375 x 667)
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/iphone-se-hero.png' });

  const metricsSE = await page.evaluate(() => {
    const hero = document.querySelector('section');
    const badge = hero.querySelector('.animate-in');
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    const btns = hero.querySelectorAll('a[href*="wa.me"], a[href*="#rooms"]');
    const btn1 = btns[0];
    const btn2 = btns[1];

    const rBadge = badge ? badge.getBoundingClientRect() : null;
    const rH1 = h1 ? h1.getBoundingClientRect() : null;
    const rP = p ? p.getBoundingClientRect() : null;
    const rBtn1 = btn1 ? btn1.getBoundingClientRect() : null;
    const rBtn2 = btn2 ? btn2.getBoundingClientRect() : null;

    return {
      windowHeight: window.innerHeight,
      badgeTop: rBadge ? Math.round(rBadge.top) : null,
      h1Top: rH1 ? Math.round(rH1.top) : null,
      pBottom: rP ? Math.round(rP.bottom) : null,
      firstBtnTop: rBtn1 ? Math.round(rBtn1.top) : null,
      lastBtnBottom: rBtn2 ? Math.round(rBtn2.bottom) : null,
      gapBetweenPAndBtns: rP && rBtn1 ? Math.round(rBtn1.top - rP.bottom) : null,
      spaceBelowBtns: rBtn2 ? Math.round(window.innerHeight - rBtn2.bottom) : null,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('iPhone SE Metrics:', JSON.stringify(metricsSE, null, 2));

  await browser.close();
  console.log('Screenshots saved successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
