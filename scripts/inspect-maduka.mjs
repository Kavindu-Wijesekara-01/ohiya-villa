import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://www.madukarestaurant.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.log('Navigation fallback:', e.message);
  }

  // Take desktop screenshot
  await page.screenshot({ path: 'scripts/maduka-desktop.png', fullPage: true });

  // Take mobile screenshot
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.screenshot({ path: 'scripts/maduka-mobile.png', fullPage: true });

  // Extract site structure
  const structure = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      classes: h.className
    }));

    const navLinks = Array.from(document.querySelectorAll('nav a, header a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));

    const sections = Array.from(document.querySelectorAll('section, main > div, header, footer')).map(s => ({
      tag: s.tagName,
      id: s.id,
      className: s.className,
      textPreview: s.innerText.slice(0, 100).replace(/\n/g, ' ')
    }));

    return {
      title: document.title,
      headings,
      navLinks,
      sections
    };
  });

  fs.writeFileSync('scripts/maduka-structure.json', JSON.stringify(structure, null, 2));
  console.log('Scraped successfully. Title:', structure.title);
  console.log('Headings count:', structure.headings.length);
  console.log('Headings:', structure.headings.slice(0, 15));

  await browser.close();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
