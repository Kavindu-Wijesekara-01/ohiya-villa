import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Users\\LENOVO\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Overlapping Mockup Match</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          background-color: #0d1912;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f1f5f2;
          margin: 0;
          padding: 0;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .vehicle-shadow {
          filter: drop-shadow(0 14px 22px rgba(0, 0, 0, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.45));
        }
      </style>
    </head>
    <body class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-20 sm:mb-24">
          <h2 class="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal tracking-tight text-white mb-3 leading-tight">
            Beyond the bungalow
          </h2>
          <p class="text-xs sm:text-sm md:text-base text-[#D4DEC9]/80 font-normal leading-relaxed">
            Skip third-party taxi delays and early morning bargaining. Our own car and scooters are parked on site and ready when you are.
          </p>
        </div>

        <!-- 2 Cards Grid with Vehicle Pop-out Overlap -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-24 md:gap-x-7 lg:gap-x-9 items-stretch pt-6">
          
          <!-- Card 1: Car -->
          <div class="relative rounded-[28px] bg-[#122218] border border-[#233f2c]/80 px-6 sm:px-8 pb-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#c58e47]/60 group">
            
            <!-- Vehicle Stage (Pop-out overflow) -->
            <div class="relative -mt-16 sm:-mt-20 md:-mt-24 h-52 sm:h-60 lg:h-64 flex flex-col items-center justify-end mb-4 pointer-events-none">
              <!-- Atmospheric warmth behind car -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-[#c58e47]/15 rounded-full blur-3xl -z-10"></div>
              
              <img 
                src="http://localhost:3000/photos/fleet/car-cutout.png" 
                alt="Private mountain tour car"
                class="max-h-[92%] w-auto object-contain vehicle-shadow transition-transform duration-500 ease-out group-hover:scale-104 z-10"
              />
              <!-- Grounding shadow -->
              <div class="w-48 sm:w-56 h-3 bg-black/80 rounded-full blur-md -mt-2.5"></div>
            </div>

            <!-- Card Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Badge -->
                <div class="mb-3.5">
                  <span class="inline-block text-[11px] sm:text-xs font-semibold text-[#e1ab60] bg-[#c58e47]/15 border border-[#c58e47]/30 px-3 py-1 rounded-full">
                    1 dedicated on-site car
                  </span>
                </div>

                <!-- Title & Meta Row -->
                <div class="flex items-baseline justify-between gap-2 mb-2.5">
                  <h3 class="font-serif text-xl sm:text-2xl font-semibold text-white tracking-normal">
                    Private mountain tour car
                  </h3>
                  <span class="text-xs font-medium text-[#d4a362] shrink-0">
                    Seats 4-5 guests
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-[#c7d1c9] leading-relaxed mb-6 font-normal">
                  Made for early-morning family and group trips, so you reach World&apos;s End and Baker&apos;s Falls before the clouds roll in.
                </p>

                <!-- Spec Lines -->
                <div class="space-y-1.5 text-xs sm:text-sm text-stone-200 font-medium mb-7">
                  <p>5:30 AM sunrise departure</p>
                  <p>11 km to the park gate (about 25 min)</p>
                </div>
              </div>

              <!-- Button Row -->
              <div class="flex justify-end pt-2">
                <a 
                  href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20book%20the%20on-site%20private%20tour%20car%20for%20my%20stay." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c58e47] hover:bg-[#d69f56] text-[#0d1912] font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 duration-200"
                >
                  Book on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <!-- Card 2: Scooters -->
          <div class="relative rounded-[28px] bg-[#122218] border border-[#233f2c]/80 px-6 sm:px-8 pb-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#c58e47]/60 group">
            
            <!-- Vehicle Stage (Pop-out overflow) -->
            <div class="relative -mt-16 sm:-mt-20 md:-mt-24 h-52 sm:h-60 lg:h-64 flex flex-col items-center justify-end mb-4 pointer-events-none">
              <!-- Atmospheric warmth behind scooters -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-[#c58e47]/15 rounded-full blur-3xl -z-10"></div>
              
              <img 
                src="http://localhost:3000/photos/fleet/scooter-cutout.png" 
                alt="2 highland scooters"
                class="max-h-[95%] w-auto object-contain vehicle-shadow transition-transform duration-500 ease-out group-hover:scale-104 z-10"
              />
              <!-- Grounding shadow -->
              <div class="w-60 sm:w-72 h-3.5 bg-black/80 rounded-full blur-md -mt-2.5"></div>
            </div>

            <!-- Card Content -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Badge -->
                <div class="mb-3.5">
                  <span class="inline-block text-[11px] sm:text-xs font-semibold text-[#e1ab60] bg-[#c58e47]/15 border border-[#c58e47]/30 px-3 py-1 rounded-full">
                    2 on-site mountain scooters
                  </span>
                </div>

                <!-- Title & Meta Row -->
                <div class="flex items-baseline justify-between gap-2 mb-2.5">
                  <h3 class="font-serif text-xl sm:text-2xl font-semibold text-white tracking-normal">
                    2 highland scooters
                  </h3>
                  <span class="text-xs font-medium text-[#d4a362] shrink-0">
                    2 bikes ready
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs sm:text-sm text-[#c7d1c9] leading-relaxed mb-6 font-normal">
                  Perfect for couples, photographers and solo travellers who want to stop at misty pine curves, tea trails and viewpoints.
                </p>

                <!-- Spec Lines -->
                <div class="space-y-1.5 text-xs sm:text-sm text-stone-200 font-medium mb-7">
                  <p>Ride at your own pace</p>
                  <p>Helmets included, fuel support on request</p>
                </div>
              </div>

              <!-- Button Row -->
              <div class="flex justify-end pt-2">
                <a 
                  href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20rent%20the%20on-site%20mountain%20scooters%20for%20my%20stay." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c58e47] hover:bg-[#d69f56] text-[#0d1912] font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 duration-200"
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
  await page.screenshot({ path: "test-results/overlap-desktop.png" });

  await page.setViewport({ width: 390, height: 1450 });
  await page.screenshot({ path: "test-results/overlap-mobile.png" });

  await browser.close();
  console.log("Saved fixed overlap screenshots!");
}

run().catch(console.error);
