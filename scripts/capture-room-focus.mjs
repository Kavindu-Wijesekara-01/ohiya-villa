import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // Scroll to room 1 price specifically
  await page.evaluate(() => {
    const el = document.querySelector("#rooms");
    if (el) {
      const priceEls = el.querySelectorAll("span");
      for (const p of priceEls) {
        if (p.textContent && p.textContent.includes("$20")) {
          p.scrollIntoView({ behavior: "instant", block: "center" });
          break;
        }
      }
    }
  });

  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "test-results/room1-price-focus.png" });

  // Scroll to room 2 price
  await page.evaluate(() => {
    const el = document.querySelector("#rooms");
    if (el) {
      const priceEls = el.querySelectorAll("span");
      for (const p of priceEls) {
        if (p.textContent && p.textContent.includes("$23")) {
          p.scrollIntoView({ behavior: "instant", block: "center" });
          break;
        }
      }
    }
  });

  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "test-results/room2-price-focus.png" });

  await browser.close();
}

run();
