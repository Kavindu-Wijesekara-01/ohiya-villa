import puppeteer from "puppeteer-core";
import fs from "fs";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ];

  const results = {};

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    
    // Capture console errors
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

    // 1. Overall overflow check
    const docOverflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      
      // Find all elements that overflow window width
      const overflowingElements = [];
      document.querySelectorAll("*").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winW + 1 || rect.left < -1) {
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || "").toString().slice(0, 80),
            right: rect.right,
            left: rect.left,
          });
        }
      });

      return {
        hasOverflow: docW > winW,
        scrollWidth: docW,
        windowWidth: winW,
        overflowCount: overflowingElements.length,
        overflowingElements: overflowingElements.slice(0, 10),
      };
    });

    // 2. Sections check
    const sections = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll("section, [id]").forEach((el) => {
        if (el.tagName === "SECTION" || ["hero", "rooms", "gallery", "transport", "facilities", "location", "reviews", "faq", "contact"].includes(el.id)) {
          const rect = el.getBoundingClientRect();
          list.push({
            id: el.id || el.tagName,
            top: rect.top + window.scrollY,
            height: rect.height,
          });
        }
      });
      return list;
    });

    results[vp.name] = {
      docOverflow,
      consoleErrors,
      sections,
    };

    // Full page screenshot
    await page.screenshot({
      path: `test-results/audit-full-${vp.name}.png`,
      fullPage: true,
    });

    // Section specific screenshots
    const sectionIds = ["rooms", "gallery", "transport", "facilities", "location", "contact"];
    for (const sId of sectionIds) {
      const el = await page.$(`#${sId}`);
      if (el) {
        await page.evaluate((element) => {
          element.scrollIntoView({ behavior: "instant", block: "start" });
        }, el);
        await new Promise((r) => setTimeout(r, 400));
        await page.screenshot({
          path: `test-results/audit-${sId}-${vp.name}.png`,
        });
      }
    }

    // Capture Meet Host & Reviews section
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h2"));
      const hostH2 = headings.find(h => h.textContent && (h.textContent.includes("Host") || h.textContent.includes("Susantha") || h.textContent.includes("Stories") || h.textContent.includes("Reviews")));
      if (hostH2) hostH2.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: `test-results/audit-reviews-${vp.name}.png`,
    });

    // Capture FAQ section
    await page.evaluate(() => {
      const faq = document.getElementById("faq");
      if (faq) faq.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: `test-results/audit-faq-${vp.name}.png`,
    });

    // Capture Footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: `test-results/audit-footer-${vp.name}.png`,
    });

    await page.close();
  }

  await browser.close();

  fs.writeFileSync("test-results/audit-metrics.json", JSON.stringify(results, null, 2), "utf-8");
  console.log("Audit complete. Results saved.");
}

runAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
