import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // 1. Desktop Test
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 900 });
  await pageDesktop.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  await pageDesktop.evaluate(() => {
    const el = document.getElementById("transport");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  await pageDesktop.screenshot({ path: "test-results/transport-desktop.png" });

  // 2. Mobile Test
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844 });
  await pageMobile.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  await pageMobile.evaluate(() => {
    const el = document.getElementById("transport");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  await pageMobile.screenshot({ path: "test-results/transport-mobile-card1.png" });

  await pageMobile.evaluate(() => {
    window.scrollBy(0, 480);
  });
  await new Promise((r) => setTimeout(r, 400));
  await pageMobile.screenshot({ path: "test-results/transport-mobile-card2.png" });

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
