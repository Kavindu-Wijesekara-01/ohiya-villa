import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  await page.evaluate(() => {
    const cards = document.querySelectorAll("#rooms .rounded-3xl");
    if (cards.length > 0) {
      cards[0].scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: "test-results/desktop-room-card-full.png" });

  // Also check Room 2 (alternating layout)
  await page.evaluate(() => {
    const cards = document.querySelectorAll("#rooms .rounded-3xl");
    if (cards.length > 1) {
      cards[1].scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: "test-results/desktop-room2-card-full.png" });

  await browser.close();
}

run();
