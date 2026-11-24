import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function runTest() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    console.log(`[${vp.name}] Overflow:`, overflow);

    // Scroll to highlights section
    await page.evaluate(() => {
      const el = document.querySelector("section.bg-gradient-to-b");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Booking Bar + Highlights
    await page.screenshot({
      path: `test-results/highlights-${vp.name}.png`,
      fullPage: false,
    });

    // Scroll to Rooms section
    await page.evaluate(() => {
      const el = document.getElementById("rooms");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Rooms Section
    await page.screenshot({
      path: `test-results/rooms-${vp.name}.png`,
      fullPage: false,
    });

    // Check pricing text in the page
    const pricingData = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll("body *"))
        .map((el) => el.textContent || "")
        .filter((t) => t.includes("$20") || t.includes("$23") || t.includes("LKR"));
      return {
        hasDollar20: document.body.innerText.includes("$20"),
        hasDollar23: document.body.innerText.includes("$23"),
        hasLKR: document.body.innerText.includes("LKR"),
      };
    });
    console.log(`[${vp.name}] Pricing check:`, pricingData);

    await page.close();
  }

  await browser.close();
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
