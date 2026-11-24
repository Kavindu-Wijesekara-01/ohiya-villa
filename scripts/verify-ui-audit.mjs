import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve('test-results/audit-verification');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('--- Launching Chrome for Full UI Audit Verification ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900, isMobile: false },
    { name: 'tablet', width: 820, height: 1180, isMobile: true },
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
  ];

  const results = {};

  for (const vp of viewports) {
    console.log(`\nAuditing Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch || false,
      deviceScaleFactor: vp.isMobile ? 2 : 1
    });

    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Check horizontal overflow
    const overflowMetrics = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const bodyWidth = document.body.scrollWidth;
      
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowingElements = [];
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 1) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? String(el.className).slice(0, 80) : '',
            right: rect.right,
            width: rect.width
          });
          if (overflowingElements.length >= 5) break;
        }
      }

      return {
        docWidth,
        winWidth,
        bodyWidth,
        hasOverflow: docWidth > winWidth + 1,
        overflowingElements
      };
    });

    // Check button touch targets and text legibility
    const buttonsAudit = await page.evaluate(() => {
      const buttonsAndLinks = Array.from(document.querySelectorAll('button, a'));
      const smallTargets = [];
      for (const btn of buttonsAndLinks) {
        const rect = btn.getBoundingClientRect();
        const text = btn.innerText ? btn.innerText.trim().slice(0, 30) : '';
        // If button is visible and has text, check min dimensions
        if (rect.width > 0 && rect.height > 0 && rect.height < 32 && text.length > 2) {
          smallTargets.push({
            text,
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          });
        }
      }
      return {
        totalButtons: buttonsAndLinks.length,
        smallTargets: smallTargets.slice(0, 10)
      };
    });

    console.log(`- Overflow check: ${overflowMetrics.hasOverflow ? 'FAILED' : 'PASSED (0px overflow)'}`);
    if (overflowMetrics.hasOverflow) {
      console.log('  Overflow elements:', overflowMetrics.overflowingElements);
    }
    console.log(`- Small button targets (<32px): ${buttonsAudit.smallTargets.length}`);
    if (buttonsAudit.smallTargets.length > 0) {
      console.log('  Small targets sample:', buttonsAudit.smallTargets);
    }
    console.log(`- Console errors: ${consoleLogs.length}`);

    // Helper safe screenshot to avoid Windows EBUSY / UNKNOWN file locks
    const safeScreenshot = async (target, filePath, opts = {}) => {
      try {
        await target.screenshot({ path: filePath, ...opts });
        return true;
      } catch (err) {
        console.warn(`  Warning: Could not write ${filePath}: ${err.message}`);
        return false;
      }
    };

    // Capture Full Page Screenshot
    const fullPagePath = path.join(OUT_DIR, `full-page-${vp.name}.png`);
    await safeScreenshot(page, fullPagePath, { fullPage: true });

    // Capture Hero Section Screenshot at Top (scrollY = 0)
    const heroEl = await page.$('section');
    if (heroEl) {
      const heroPath = path.join(OUT_DIR, `hero-top-${vp.name}.png`);
      await safeScreenshot(heroEl, heroPath);
      console.log(`- Saved hero top screenshot: ${heroPath}`);
    }

    // Scroll down 120px and capture Booking Bar Fade-Up Overlap
    await page.evaluate(() => window.scrollTo(0, 150));
    await new Promise(r => setTimeout(r, 800));
    const bookingBarEl = await page.$('.relative.z-30');
    if (bookingBarEl) {
      const barPath = path.join(OUT_DIR, `booking-bar-fadeup-${vp.name}.png`);
      await safeScreenshot(bookingBarEl, barPath);
      console.log(`- Saved booking bar fade-up screenshot: ${barPath}`);
    }
    // Scroll back to top for remainder checks
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));

    // Capture Individual Section Screenshots
    const sections = ['#rooms', '#gallery', '#transport', '#facilities', '#nearby', '#faq', '#contact'];
    for (const secId of sections) {
      const el = await page.$(secId);
      if (el) {
        // Scroll element into view so scroll-reveal triggers
        await el.scrollIntoView();
        // Give longer wait for #transport so 1600ms vehicle fade-up completes
        const waitMs = secId === '#transport' ? 2000 : 400;
        await new Promise(r => setTimeout(r, waitMs));
        const secPath = path.join(OUT_DIR, `sec-${secId.replace('#', '')}-${vp.name}.png`);
        await safeScreenshot(el, secPath);

        if (secId === '#transport') {
          const fleetGrid = await page.$('#transport .grid');
          if (fleetGrid) {
            const fleetPath = path.join(OUT_DIR, `fleet-vehicles-${vp.name}.png`);
            await safeScreenshot(fleetGrid, fleetPath);
            console.log(`- Saved fleet vehicles screenshot: ${fleetPath}`);
          }
        }
      }
    }

    // Capture Specific Featured Cards (Food Card & Room Card)
    const foodCard = await page.$('#facilities .group');
    if (foodCard) {
      await foodCard.scrollIntoView();
      await new Promise(r => setTimeout(r, 400));
      const foodCardPath = path.join(OUT_DIR, `card-food-${vp.name}.png`);
      await safeScreenshot(foodCard, foodCardPath);
      console.log(`- Saved food card screenshot: ${foodCardPath}`);
    }

    const roomCards = await page.$$('#rooms .scroll-reveal.bg-\\[\\#FAF9F5\\]');
    if (roomCards && roomCards.length > 0) {
      const lastRoom = roomCards[roomCards.length - 1]; // Full Bungalow
      await lastRoom.scrollIntoView();
      await new Promise(r => setTimeout(r, 400));
      const roomCardPath = path.join(OUT_DIR, `card-full-villa-${vp.name}.png`);
      await safeScreenshot(lastRoom, roomCardPath);
      console.log(`- Saved full villa room card screenshot: ${roomCardPath}`);
    }

    // Test Attraction Page (/attractions/ambewela-farms) for Navbar, Clear BG Photo & Fleet Showcase
    try {
      console.log(`- Navigating to attraction page: /attractions/ambewela-farms (${vp.name})...`);
      await page.goto('http://localhost:3000/attractions/ambewela-farms', { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));

      const attrHeroPath = path.join(OUT_DIR, `attraction-hero-${vp.name}.png`);
      await safeScreenshot(page, attrHeroPath);
      console.log(`- Saved attraction hero screenshot: ${attrHeroPath}`);

      const attrFleetEl = await page.$('.rounded-3xl.bg-\\[\\#0D1912\\]');
      if (attrFleetEl) {
        await attrFleetEl.scrollIntoView();
        await new Promise(r => setTimeout(r, 600));
        const attrFleetPath = path.join(OUT_DIR, `attraction-fleet-${vp.name}.png`);
        await safeScreenshot(attrFleetEl, attrFleetPath);
        console.log(`- Saved attraction fleet showcase screenshot: ${attrFleetPath}`);
      }
    } catch (e) {
      console.warn('  Warning: Could not capture attraction subpage:', e.message);
    }

    results[vp.name] = {
      overflow: overflowMetrics,
      buttons: buttonsAudit,
      errors: consoleLogs
    };

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(results, null, 2));
  console.log('\n--- UI Audit Scan Completed Successfully ---');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
