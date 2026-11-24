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
    const el = document.getElementById("rooms");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  await pageDesktop.screenshot({ path: "test-results/rooms-desktop-expanded.png" });

  // Measure heights of image and column
  const desktopMetrics = await pageDesktop.evaluate(() => {
    const card = document.querySelector("#rooms .scroll-reveal");
    const photoContainer = card ? card.querySelector(".relative.flex-1") : null;
    const thumbs = card ? card.querySelector(".grid.grid-cols-4") : null;
    return {
      photoHeight: photoContainer ? photoContainer.getBoundingClientRect().height : 0,
      thumbsTop: thumbs ? thumbs.getBoundingClientRect().top : 0,
      photoBottom: photoContainer ? photoContainer.getBoundingClientRect().bottom : 0,
      gap: thumbs && photoContainer ? thumbs.getBoundingClientRect().top - photoContainer.getBoundingClientRect().bottom : 0,
    };
  });
  console.log("Desktop metrics:", desktopMetrics);

  // 2. Mobile Test
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844 });
  await pageMobile.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  await pageMobile.evaluate(() => {
    const el = document.getElementById("rooms");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 600));

  await pageMobile.screenshot({ path: "test-results/rooms-mobile-expanded.png" });

  const mobileMetrics = await pageMobile.evaluate(() => {
    const card = document.querySelector("#rooms .scroll-reveal");
    const photoContainer = card ? card.querySelector(".relative.flex-1") : null;
    const thumbs = card ? card.querySelector(".grid.grid-cols-4") : null;
    return {
      photoHeight: photoContainer ? photoContainer.getBoundingClientRect().height : 0,
      gap: thumbs && photoContainer ? thumbs.getBoundingClientRect().top - photoContainer.getBoundingClientRect().bottom : 0,
    };
  });
  console.log("Mobile metrics:", mobileMetrics);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
