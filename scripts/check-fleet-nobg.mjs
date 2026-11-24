import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          background-color: #142319;
          margin: 0;
          padding: 40px;
          color: white;
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
          gap: 40px;
          align-items: center;
        }
        .row {
          display: flex;
          gap: 30px;
          justify-content: center;
          align-items: flex-start;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(197, 142, 71, 0.3);
          border-radius: 24px;
          padding: 24px;
          width: 500px;
          text-align: center;
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <h2>Checking car-fleet-nobg.png and scooter-fleet-nobg.png</h2>
      <div class="row">
        <div class="card">
          <h3>car-fleet-nobg</h3>
          <img src="http://localhost:3000/photos/fleet/car-fleet-nobg.png" />
          <h4 style="margin-top:20px;">original car-fleet.jpg</h4>
          <img src="http://localhost:3000/photos/car-fleet.jpg" />
        </div>
        <div class="card">
          <h3>scooter-fleet-nobg</h3>
          <img src="http://localhost:3000/photos/fleet/scooter-fleet-nobg.png" />
          <h4 style="margin-top:20px;">original scooter-fleet.jpg</h4>
          <img src="http://localhost:3000/photos/scooter-fleet.jpg" />
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: "test-results/check-fleet-nobg.png" });

  await browser.close();
  console.log("Screenshot saved to test-results/check-fleet-nobg.png");
}

run().catch(console.error);
