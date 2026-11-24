import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 950 });

  // Prototype HTML modeling the mockup with our clean cutouts
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Design Prototype</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          background-color: #0b1710;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f1f5f2;
          margin: 0;
          padding: 0;
        }
        .font-serif {
          font-family: 'Cinzel', Georgia, serif;
        }
        .vehicle-drop-shadow {
          filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.65)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
        }
      </style>
    </head>
    <body class="p-8 md:p-14">
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-white mb-3.5 leading-tight">
            Beyond the bungalow
          </h2>
          <p class="text-xs sm:text-sm md:text-base text-stone-300 font-normal leading-relaxed">
            Skip third-party taxi delays and early morning bargaining. Our own car and scooters are parked on site and ready when you are.
          </p>
        </div>

        <!-- 2 Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          <!-- Card 1: Car -->
          <div class="relative flex flex-col justify-between rounded-3xl bg-[#111e16] border border-[#233b2a] p-6 sm:p-8 hover:border-[#c58e47]/50 transition-all duration-300 shadow-xl overflow-hidden group">
            <!-- Subtle atmospheric glow behind vehicle -->
            <div class="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#c58e47]/10 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Vehicle Image Stage -->
            <div class="relative w-full h-56 sm:h-64 flex items-center justify-center mb-4">
              <img 
                src="http://localhost:3000/photos/fleet/car-cutout.png" 
                alt="Private mountain tour car"
                class="max-h-full max-w-[85%] object-contain vehicle-drop-shadow transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <!-- Ground Contact Shadow -->
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/60 rounded-full blur-md"></div>
            </div>

            <!-- Card Body Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Badge -->
                <div class="mb-3">
                  <span class="inline-block text-[11px] sm:text-xs font-semibold text-[#e5b369] bg-[#c58e47]/15 border border-[#c58e47]/30 px-3 py-1 rounded-full">
                    1 dedicated on-site car
                  </span>
                </div>

                <!-- Title & Meta Row -->
                <div class="flex items-baseline justify-between gap-3 mb-2.5">
                  <h3 class="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    Private mountain tour car
                  </h3>
                  <span class="text-xs font-medium text-[#c58e47] shrink-0">
                    Seats 4-5 guests
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-normal">
                  Made for early-morning family and group trips, so you reach World&apos;s End and Baker&apos;s Falls before the clouds roll in.
                </p>

                <!-- Features Spec Points -->
                <div class="space-y-1.5 text-xs sm:text-sm text-white/90 font-medium mb-8">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#c58e47]"></span>
                    <span>5:30 AM sunrise departure</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#c58e47]"></span>
                    <span>11 km to the park gate (about 25 min)</span>
                  </div>
                </div>
              </div>

              <!-- Button Row -->
              <div class="flex justify-end pt-2">
                <a 
                  href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20book%20the%20on-site%20private%20tour%20car%20for%20my%20stay." 
                  class="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c58e47] hover:bg-[#d69f56] text-[#0b1710] font-semibold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 duration-200"
                >
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <!-- Card 2: Scooters -->
          <div class="relative flex flex-col justify-between rounded-3xl bg-[#111e16] border border-[#233b2a] p-6 sm:p-8 hover:border-[#c58e47]/50 transition-all duration-300 shadow-xl overflow-hidden group">
            <!-- Subtle atmospheric glow behind vehicle -->
            <div class="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#c58e47]/10 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Vehicle Image Stage -->
            <div class="relative w-full h-56 sm:h-64 flex items-center justify-center mb-4">
              <img 
                src="http://localhost:3000/photos/fleet/scooter-cutout.png" 
                alt="2 highland scooters"
                class="max-h-full max-w-[95%] object-contain vehicle-drop-shadow transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <!-- Ground Contact Shadow -->
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 h-4 bg-black/60 rounded-full blur-md"></div>
            </div>

            <!-- Card Body Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Badge -->
                <div class="mb-3">
                  <span class="inline-block text-[11px] sm:text-xs font-semibold text-[#e5b369] bg-[#c58e47]/15 border border-[#c58e47]/30 px-3 py-1 rounded-full">
                    2 on-site mountain scooters
                  </span>
                </div>

                <!-- Title & Meta Row -->
                <div class="flex items-baseline justify-between gap-3 mb-2.5">
                  <h3 class="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    2 highland scooters
                  </h3>
                  <span class="text-xs font-medium text-[#c58e47] shrink-0">
                    2 bikes ready
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-normal">
                  Perfect for couples, photographers and solo travellers who want to stop at misty pine curves, tea trails and viewpoints.
                </p>

                <!-- Features Spec Points -->
                <div class="space-y-1.5 text-xs sm:text-sm text-white/90 font-medium mb-8">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#c58e47]"></span>
                    <span>Ride at your own pace</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#c58e47]"></span>
                    <span>Helmets included, fuel support on request</span>
                  </div>
                </div>
              </div>

              <!-- Button Row -->
              <div class="flex justify-end pt-2">
                <a 
                  href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20rent%20the%20on-site%20mountain%20scooters%20for%20my%20stay." 
                  class="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c58e47] hover:bg-[#d69f56] text-[#0b1710] font-semibold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 duration-200"
                >
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: "test-results/prototype-desktop.png" });

  // Mobile screenshot
  await page.setViewport({ width: 390, height: 1200 });
  await page.screenshot({ path: "test-results/prototype-mobile.png" });

  await browser.close();
  console.log("Prototypes saved successfully!");
}

run().catch(console.error);
