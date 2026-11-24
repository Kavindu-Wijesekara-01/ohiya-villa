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

    await page.screenshot({ path: `test-results/hero-nudged-${vp.name}.png` });
    await page.close();
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
