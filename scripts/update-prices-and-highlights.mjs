import fs from "fs";

// 1. Update PropertyHighlights.tsx
const propertyHighlightsContent = `"use client";

import { Train, Car, Flame, Wifi, ShieldCheck, Sparkles } from "lucide-react";

export default function PropertyHighlights() {
  const highlights = [
    {
      icon: Train,
      badge: "3 Min Walk",
      title: "200m to Ohiya Station",
      description: "Effortless 3-minute stroll from the railway platform with luggage assistance.",
    },
    {
      icon: Car,
      badge: "On-Site Fleet",
      title: "1 Car & 2 Scooters",
      description: "Private car for 5:30 AM Horton Plains tours plus 2 mountain scooters for scenic trails.",
    },
    {
      icon: Flame,
      badge: "Highland Heat",
      title: "Highland Hot Water",
      description: "3 private en-suite bathrooms equipped with reliable, soothing hot showers at 1,775m.",
    },
    {
      icon: Wifi,
      badge: "High Speed",
      title: "Free High-Speed WiFi",
      description: "Fast mountain wireless throughout all bedrooms, living lounge, and tea veranda.",
    },
    {
      icon: ShieldCheck,
      badge: "Local Care",
      title: "24-Hour Hospitality",
      description: "Susantha's warm, attentive host care, home-cooked Ceylon meals, and trekking advice.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F3F5F2] via-[#FAFAF8] to-[#F8F9F7] border-y border-[#E2E6E3] py-12 sm:py-16 relative overflow-hidden">
      {/* Subtle ambient blur behind cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C58E47]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="scroll-reveal text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-[11px] font-bold uppercase tracking-widest text-[#243D2C] mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C58E47]" />
            <span>Essential Highland Comforts</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#243D2C] tracking-tight">
            Designed for an Unhurried Mountain Stay
          </h2>
        </div>

        {/* 5-Card Responsive Luxury Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="scroll-reveal group relative bg-white rounded-2xl p-5 border border-[#E4E8E5] hover:border-[#C58E47]/60 shadow-xs hover:shadow-xl hover:shadow-[#243D2C]/8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                style={{ transitionDelay: \`\${idx * 60}ms\` }}
              >
                {/* Ambient hover glow inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6EE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Bar: Icon Badge + Micro Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FAF5EE] to-[#ECE5D8] border border-[#DFCBB5]/60 flex items-center justify-center text-[#9E6D30] group-hover:bg-[#243D2C] group-hover:text-[#D4A362] group-hover:border-[#243D2C] group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#243D2C]/5 text-[#243D2C] border border-[#243D2C]/10 group-hover:bg-[#C58E47]/15 group-hover:text-[#9E6D30] group-hover:border-[#C58E47]/30 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-base sm:text-[15px] font-bold text-[#1F2923] group-hover:text-[#243D2C] tracking-tight mb-1.5 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#718075] group-hover:text-[#526056] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Gold Accent Bar */}
                <div className="relative z-10 mt-4 pt-3 border-t border-[#F0F2EE]">
                  <div className="w-6 group-hover:w-12 h-0.5 bg-[#C58E47]/40 group-hover:bg-[#C58E47] rounded-full transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync("components/PropertyHighlights.tsx", propertyHighlightsContent, "utf-8");
console.log("Updated components/PropertyHighlights.tsx");

// 2. Update RoomsSection.tsx: change prices to USD $20 and $23
let roomsContent = fs.readFileSync("components/RoomsSection.tsx", "utf-8");

roomsContent = roomsContent.replace(
  /price:\s*"LKR 6,000"/g,
  'price: "$20"'
);
roomsContent = roomsContent.replace(
  /Double Room \(LKR 6,000\/night\)/g,
  "Double Room ($20/night)"
);

roomsContent = roomsContent.replace(
  /price:\s*"LKR 7,000"/g,
  'price: "$23"'
);
roomsContent = roomsContent.replace(
  /Triple Room \(LKR 7,000\/night\)/g,
  "Triple Room ($23/night)"
);

fs.writeFileSync("components/RoomsSection.tsx", roomsContent, "utf-8");
console.log("Updated components/RoomsSection.tsx");

// 3. Update ModernBookingBar.tsx: change prices to USD $20 and $23
let bookingBarContent = fs.readFileSync("components/ModernBookingBar.tsx", "utf-8");

// Update ROOM_OPTIONS
bookingBarContent = bookingBarContent.replace(
  /pricePerNight:\s*6000,\s*priceLabel:\s*"LKR 6,000"/g,
  'pricePerNight: 20,\n    priceLabel: "$20"'
);
bookingBarContent = bookingBarContent.replace(
  /pricePerNight:\s*7000,\s*priceLabel:\s*"LKR 7,000"/g,
  'pricePerNight: 23,\n    priceLabel: "$23"'
);

// Update WhatsApp estimated total
bookingBarContent = bookingBarContent.replace(
  /`Estimated Total: LKR \$\{\(selectedRoom\.pricePerNight \* nights\)\.toLocaleString\(\)\}`/g,
  '`Estimated Total: $${selectedRoom.pricePerNight * nights}`'
);

// Update Desktop button text
bookingBarContent = bookingBarContent.replace(
  /`Reserve • LKR \$\{\(selectedRoom\.pricePerNight \* nights\)\.toLocaleString\(\)\}`/g,
  '`Reserve • $${selectedRoom.pricePerNight * nights}`'
);

fs.writeFileSync("components/ModernBookingBar.tsx", bookingBarContent, "utf-8");
console.log("Updated components/ModernBookingBar.tsx");

// 4. Update DirectBookingWidget.tsx if it exists
if (fs.existsSync("components/DirectBookingWidget.tsx")) {
  let directBookingContent = fs.readFileSync("components/DirectBookingWidget.tsx", "utf-8");
  directBookingContent = directBookingContent.replace(/LKR 6,000/g, "$20");
  directBookingContent = directBookingContent.replace(/LKR 7,000/g, "$23");
  fs.writeFileSync("components/DirectBookingWidget.tsx", directBookingContent, "utf-8");
  console.log("Updated components/DirectBookingWidget.tsx");
}
