import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('test-results');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('--- Launching Chrome for Comprehensive UX & Browser Audit ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  const errors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  // 1. Desktop Test
  console.log('--- 1. Desktop Viewport (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Smooth scroll down to trigger observers and lazy loading
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture Full Desktop View
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-desktop-full.png'), fullPage: true });
  console.log('Saved 01-desktop-full.png');

  // Capture Section Screenshots
  const sections = [
    { id: '#rooms', name: '02-section-rooms.png' },
    { id: '#transport', name: '03-section-transport.png' },
    { id: '#facilities', name: '04-section-facilities.png' },
    { id: '#nearby', name: '05-section-nearby.png' },
    { id: '#house-rules', name: '06-section-house-rules.png' },
    { id: '#contact', name: '07-section-contact.png' },
  ];

  for (const s of sections) {
    const el = await page.$(s.id);
    if (el) {
      await el.screenshot({ path: path.join(OUTPUT_DIR, s.name) });
      console.log(`Saved ${s.name}`);
    }
  }

  // 2. Mobile Test
  console.log('--- 2. Mobile Viewport (390x844 - iPhone 14/15/16) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Mobile Top Screenshot
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08-mobile-hero.png'), fullPage: false });

  // Mobile Menu Test
  const menuBtn = await page.$('button[aria-label="Open menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09-mobile-menu-drawer.png') });
  }

  // Mobile Full Page Screenshot
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10-mobile-full.png'), fullPage: true });
  console.log('Saved mobile screenshots');

  // 3. Verification of all interactive links & phone numbers
  const verification = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const waLinks = links.filter(a => a.href.includes('wa.me'));
    const telLinks = links.filter(a => a.href.includes('tel:'));
    const bookingCta = links.filter(a => a.innerText.toLowerCase().includes('book') || a.innerText.toLowerCase().includes('reserve'));
    
    return {
      waLinksCount: waLinks.length,
      telLinksCount: telLinks.length,
      bookingCtaCount: bookingCta.length,
      hasPrimaryPhone: telLinks.some(a => a.href.includes('94714194368') || a.href.includes('94751172079') || a.href.includes('070605670')),
      hasWaPrimary: waLinks.some(a => a.href.includes('94714194368')),
    };
  });

  console.log('Conversion & CTA Links Verification:', JSON.stringify(verification, null, 2));

  await browser.close();
  console.log('--- All Chrome Browser Audits Completed! ---');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
