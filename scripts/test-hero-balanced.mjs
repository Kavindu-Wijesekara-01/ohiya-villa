import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const vps = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  for (const vp of vps) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // Measure positions
    const metrics = await page.evaluate(() => {
      const p = document.querySelector("#hero p");
      const btns = document.querySelector("#hero a");
      const pRect = p ? p.getBoundingClientRect() : null;
      const btnsRect = btns ? btns.getBoundingClientRect() : null;
      return {
        pBottom: pRect ? pRect.bottom : 0,
        btnsTop: btnsRect ? btnsRect.top : 0,
        gap: pRect && btnsRect ? btnsRect.top - pRect.bottom : 0,
      };
    });
    console.log(`[${vp.name}] Gap between description & buttons:`, metrics);

    await page.screenshot({ path: `test-results/hero-balanced-${vp.name}.png` });
    await page.close();
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
