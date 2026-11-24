import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const sections = await page.$$('section');
  for (const el of sections) {
    const text = await el.evaluate(e => e.innerText);
    if (text.includes('Meet Your Host')) {
      await el.screenshot({ path: 'test-results/05b-host-and-reviews.png' });
      console.log('Saved 05b-host-and-reviews.png');
      break;
    }
  }
  await browser.close();
}

main();
