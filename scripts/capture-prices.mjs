import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  // Scroll to booking bar and rooms pricing
  const bookingBar = await page.$("div.max-w-5xl");
  if (bookingBar) {
    await bookingBar.scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: "test-results/booking-bar-desktop.png" });
  }

  // Scroll to room 1 price area
  await page.evaluate(() => {
    window.scrollBy(0, 1100);
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "test-results/room-price-desktop.png" });

  // Now mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    window.scrollBy(0, 550);
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "test-results/booking-bar-mobile.png" });

  await page.evaluate(() => {
    window.scrollBy(0, 1400);
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "test-results/room-price-mobile.png" });

  await browser.close();
}

run();
