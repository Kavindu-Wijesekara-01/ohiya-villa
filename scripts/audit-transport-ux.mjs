import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function runAudit() {
  console.log("Starting Chrome Browser UX Audit for Transport Section...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  fs.mkdirSync("test-results/audit", { recursive: true });

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900, isMobile: false },
    { name: "desktop-1920", width: 1920, height: 1080, isMobile: false },
    { name: "tablet-820", width: 820, height: 1180, isMobile: true },
    { name: "tablet-768", width: 768, height: 1024, isMobile: true },
    { name: "mobile-390", width: 390, height: 844, isMobile: true },
    { name: "mobile-sm-375", width: 375, height: 667, isMobile: true },
  ];

  for (const vp of viewports) {
    console.log(`Auditing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

    // Scroll to transport section and ensure all elements are visible
    await page.evaluate(async () => {
      const el = document.getElementById("transport");
      if (el) {
        el.scrollIntoView({ behavior: "instant" });
        // Make sure all scroll-reveal items inside transport become visible
        el.querySelectorAll(".scroll-reveal").forEach(item => {
          item.classList.add("is-visible");
        });
      }
    });

    await new Promise((r) => setTimeout(r, 400));

    // Capture screenshot of the transport section specifically
    const sectionHandle = await page.$("#transport");
    if (sectionHandle) {
      await sectionHandle.screenshot({ path: `test-results/audit/${vp.name}-transport.png` });
    }

    // Also on mobile, take viewports of Card 1 and Card 2 in-view as a user scrolls
    if (vp.isMobile && vp.name === "mobile-390") {
      await page.evaluate(() => {
        const el = document.getElementById("transport");
        el.scrollIntoView({ behavior: "instant" });
      });
      await new Promise((r) => setTimeout(r, 200));
      await page.screenshot({ path: "test-results/audit/mobile-card1-viewport.png" });

      await page.evaluate(() => {
        window.scrollBy(0, 520);
      });
      await new Promise((r) => setTimeout(r, 200));
      await page.screenshot({ path: "test-results/audit/mobile-card2-viewport.png" });
    }

    await page.close();
  }

  await browser.close();
  console.log("UX Audit completed successfully. All screenshots saved to test-results/audit/");
}

runAudit().catch(err => {
  console.error("Audit failed:", err);
  process.exit(1);
});
