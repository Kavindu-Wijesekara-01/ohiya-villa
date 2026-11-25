"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Users,
  Mountain,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Maximize2,
  Clock
} from "lucide-react";

interface RoomSectionProps {
  onSelectPhoto?: (photoUrl: string, caption: string) => void;
}

interface RoomPhoto {
  url: string;
  caption: string;
}

interface RoomItem {
  id: string;
  roomNumber: string;
  categoryTag: string;
  name: string;
  subtitle: string;
  description: string;
  photos: RoomPhoto[];
  specs: {
    bed: string;
    sleeps: string;
    outlook: string;
    bathroom: string;
  };
  amenities: string[];
  price: string;
  period: string;
  paymentBadge: string;
  whatsappMsg: string;
  goodToKnow: string[];
}

const DEFAULT_ROOMS: RoomItem[] = [
    {
      id: "double-room",
      roomNumber: "ROOM 01",
      categoryTag: "HIGHLAND ROOM • SLEEPS 2",
      name: "Double Room with Mountain View",
      subtitle: "A peaceful room with pine valley views",
      description:
        "Wake up to misty pine panoramas and the quiet mountain breeze at 1,775m elevation. Features crisp highland linens, warm timber accents, an en-suite private hot-water bathroom, and a scenic veranda terrace made for long mornings with hot Ceylon tea.",
      photos: [
        { url: "/photos/2-member-room.jpeg", caption: "Double Room Bed & Garden View" },
        { url: "/photos/2-member-room-2.jpeg", caption: "Sunlit Bedroom View" },
        { url: "/photos/wa-20.44.00.jpeg", caption: "En-suite Bathroom with Hot Water" },
        { url: "/photos/outside-view-2.jpeg", caption: "Veranda Terrace & Mountain Outlook" },
      ],
      specs: {
        bed: "1 Extra-Large Double Bed",
        sleeps: "2 Guests",
        outlook: "Mountain & Garden View",
        bathroom: "Private Hot-Water Bathroom",
      },
      amenities: [
        "Scenic Mountain & Valley View",
        "Private En-Suite Hot Water Shower",
        "Free High-Speed WiFi",
        "Private Mountain Veranda",
        "Tea & Coffee Kettle Facilities",
        "Fresh Highland Linens & Towels",
        "Free On-Site Secure Parking",
        "Daily Housekeeping & Host Care",
      ],
      price: "$20",
      period: "per night",
      paymentBadge: "CASH OR BANK TRANSFER ON ARRIVAL",
      whatsappMsg:
        "Hello Susantha, I would like to book the Double Room ($20/night) at Dawn Breezy Bungalow, Ohiya. Please confirm availability for my dates.",
      goodToKnow: [
        "Check-in: 1:00 PM • Flexible early check-in upon request",
        "Check-out: 11:00 AM",
        "Complimentary luggage assistance from Ohiya Station (200m / 3 min walk)",
        "On-site Car available for 5:30 AM Horton Plains sunrise excursions",
        "2 On-site Scooters available for scenic mountain trail hire",
        "Fresh home-cooked Sri Lankan meals available upon advance request",
      ],
    },
    {
      id: "triple-room",
      roomNumber: "ROOM 02",
      categoryTag: "TRIPLE HIGHLAND • SLEEPS 3",
      name: "Triple Room with Private Bathroom",
      subtitle: "Spacious comfort for friends & small families",
      description:
        "The ideal highland retreat for small trekking groups or families exploring Horton Plains. Designed with generous space, featuring one extra-large double bed and one single bed, private en-suite hot-water bathroom, and wide windows opening to cool mountain views.",
      photos: [
        { url: "/photos/triblebedroom.jpg", caption: "Spacious Triple Bedroom" },
        { url: "/photos/room-triple-1.jpg", caption: "Triple Bedroom Alternative View" },
        { url: "/photos/wa-20.44.02.jpeg", caption: "En-suite Bathroom" },
        { url: "/photos/outside-cool-view.jpeg", caption: "Garden & Mountain Panorama" },
      ],
      specs: {
        bed: "1 Double + 1 Single Bed",
        sleeps: "3 Guests",
        outlook: "Pine Hills & Garden Panorama",
        bathroom: "Private Hot-Water Bathroom",
      },
      amenities: [
        "Panoramic Hill & Valley View",
        "Private En-Suite Hot Water Shower",
        "Free High-Speed WiFi",
        "Wardrobe & Luggage Space",
        "Electric Kettle & Tea Setup",
        "Plush Highland Blankets & Linens",
        "Free On-Site Secure Parking",
        "Station Pick-Up & Guide Advice",
      ],
      price: "$23",
      period: "per night",
      paymentBadge: "CASH OR BANK TRANSFER ON ARRIVAL",
      whatsappMsg:
        "Hello Susantha, I would like to book the Triple Room ($23/night) at Dawn Breezy Bungalow, Ohiya. Please confirm availability for my dates.",
      goodToKnow: [
        "Check-in: 1:00 PM • Flexible arrival for highland train schedules",
        "Check-out: 11:00 AM",
        "Close 3-minute walking proximity to Ohiya Railway Station",
        "Direct 5:30 AM car departure to World's End and Baker's Falls",
        "Scooter hire available on-site for cruising scenic Welimada roads",
        "Cozy living room area available for group dining and tea",
      ],
    },
    {
      id: "full-bungalow",
      roomNumber: "ROOM 03",
      categoryTag: "WHOLE PROPERTY • SLEEPS 8 TO 10",
      name: "Full Bungalow Exclusive Stay",
      subtitle: "All 3 bedrooms, private living room & kitchen",
      description:
        "Enjoy private mountain comfort. Reserve the entire Dawn Breezy Bungalow exclusively for your family or hiking party. Includes all 3 bedrooms, 3 private en-suite hot-water bathrooms, private dining room, full kitchen, garden gazebo, and mountain parking.",
      photos: [
        { url: "/photos/outside-cool-view.jpeg", caption: "Bungalow Veranda & Mountain Vista" },
        { url: "/photos/hero-1.jpg", caption: "Bungalow Garden & Gazebo" },
        { url: "/photos/inside-view.jpeg", caption: "Living Area & Dining Table" },
        { url: "/photos/outside-view-3.jpeg", caption: "Private Bungalow Grounds & Parking" },
      ],
      specs: {
        bed: "3 Private Bedrooms",
        sleeps: "Up to 8 to 10 Guests",
        outlook: "360° Misty Mountain Horizon",
        bathroom: "3 Private En-Suite Bathrooms",
      },
      amenities: [
        "Exclusive Whole-House Privacy",
        "3 Private En-Suite Hot Showers",
        "Full Kitchen & Dining Area",
        "Private Veranda & Gazebo Garden",
        "High-Speed WiFi Across All Rooms",
        "Dedicated Host Support (Susantha)",
        "Spacious Private Vehicle Parking",
        "Station Luggage & Tour Coordination",
      ],
      price: "Custom Group Rate",
      period: "exclusive whole-house",
      paymentBadge: "BEST DIRECT LOCAL GROUP RATE",
      whatsappMsg:
        "Hello Susantha, I would like to inquire about booking the Full Bungalow (all 3 bedrooms) at Dawn Breezy Bungalow, Ohiya. Please share group rates and availability.",
      goodToKnow: [
        "Exclusive access to the entire bungalow grounds, veranda, and garden",
        "Kitchen available for self-catering or home-cooked meals by request",
        "Private parking for multiple cars and vans right on-site",
        "On-site Car & 2 Scooters ready for your group's Horton Plains safari",
        "Special custom rates for multi-night stays and group treks",
      ],
    },
  ];

export default function RoomsSection({ onSelectPhoto }: RoomSectionProps) {
  const [rooms, setRooms] = useState<RoomItem[]>(DEFAULT_ROOMS);

  useEffect(() => {
    let ignore = false;
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms((prev) =>
            prev.map((staticRoom) => {
              const dyn = data.rooms.find(
                (r: any) =>
                  r.roomId === staticRoom.id ||
                  r.roomId === staticRoom.id.replace("-room", "").replace("-bungalow", "")
              );
              if (!dyn) return staticRoom;
              return {
                ...staticRoom,
                name: dyn.name || staticRoom.name,
                subtitle: dyn.subtitle || staticRoom.subtitle,
                description: dyn.description || staticRoom.description,
                price: dyn.priceLabel || `$${dyn.pricePerNight}` || staticRoom.price,
                specs: dyn.specs || staticRoom.specs,
                amenities: Array.isArray(dyn.amenities) && dyn.amenities.length > 0 ? dyn.amenities : staticRoom.amenities,
                goodToKnow: Array.isArray(dyn.goodToKnow) && dyn.goodToKnow.length > 0 ? dyn.goodToKnow : staticRoom.goodToKnow,
              };
            })
          );
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  // Independent photo index state for each room
  const [photoIndices, setPhotoIndices] = useState<Record<string, number>>({
    "double-room": 0,
    "triple-room": 0,
    "full-bungalow": 0,
  });

  // Accordion state for "Good to Know" per room
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    "double-room": false,
    "triple-room": false,
    "full-bungalow": false,
  });

  const handlePrevPhoto = (roomId: string, max: number) => {
    setPhotoIndices((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + max) % max,
    }));
  };

  const handleNextPhoto = (roomId: string, max: number) => {
    setPhotoIndices((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % max,
    }));
  };

  const handleSelectThumbnail = (roomId: string, idx: number) => {
    setPhotoIndices((prev) => ({
      ...prev,
      [roomId]: idx,
    }));
  };

  const toggleAccordion = (roomId: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  return (
    <section id="rooms" className="py-10 sm:py-16 lg:py-20 bg-[#F8F9F7]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Heading with Editorial Boutique Styling */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-xs font-bold uppercase tracking-widest text-[#243D2C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Guest Bedrooms &amp; Full Villa</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#17271D] tracking-tight mb-3 leading-tight">
            Three Bedrooms. One Peaceful Mountain Home.{" "}
            <span className="font-serif italic font-normal text-[#A97633] inline-block mx-1">
              Nothing Else.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#3E5244] leading-relaxed max-w-2xl mx-auto">
            Thoughtfully designed bedrooms immersed in the tranquil misty pines of Ohiya. Wake up to crisp mountain air at 1,775m elevation, panoramic valley views, and piping hot Ceylon tea.
          </p>
        </div>

        {/* Alternating Editorial Room Cards (50/50 Split Showcase) */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {rooms.map((room, roomIdx) => {
            const currentPhotoIdx = photoIndices[room.id] || 0;
            const currentPhoto = room.photos[currentPhotoIdx];
            const isAccordionOpen = openAccordions[room.id] || false;
            const isReverse = roomIdx % 2 === 1; // Alternating layout on desktop

            return (
              <div
                key={room.id}
                className="editorial-card bg-white rounded-[28px] border border-[#E6DFD3] hover:border-[#DFB775]/80 overflow-hidden"
              >
                <div
                  className={`flex flex-col ${
                    isReverse ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-stretch`}
                >
                  {/* Column 1: Interactive Photo Showcase (50% on Desktop) */}
                  <div className="lg:w-1/2 p-3 sm:p-5 lg:p-7 flex flex-col bg-[#FAF7F1] border-b lg:border-b-0 border-[#EAE5DC]">
                    {/* Main Active Photo */}
                    <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] w-full rounded-[20px] overflow-hidden group shadow-md ring-1 ring-black/5 bg-gray-100">
                      <Image
                        src={currentPhoto.url}
                        alt={currentPhoto.caption}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-500 ease-out transform-gpu group-hover:scale-[1.02]"
                        priority={roomIdx === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D1912]/80 text-white border border-white/20 shadow-xs uppercase tracking-wider font-mono">
                          {room.roomNumber} • ON THE HILLS
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/65 text-white border border-white/15 font-mono">
                          0{currentPhotoIdx + 1} / 0{room.photos.length}
                        </span>
                      </div>

                      {/* Bottom Caption Overlay */}
                      <div className="absolute bottom-3.5 left-3.5 right-16">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-white/80 block mb-0.5">
                          {room.name}
                        </span>
                        <p className="font-serif italic text-lg sm:text-xl text-[#DFB775] font-normal [text-shadow:0_2px_8px_rgba(0,0,0,0.85)] truncate">
                          {currentPhoto.caption}
                        </p>
                      </div>

                      {/* Photo Navigation Arrows (< and >) */}
                      <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePrevPhoto(room.id, room.photos.length)}
                          className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-105 active:scale-95 shadow-md"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNextPhoto(room.id, room.photos.length)}
                          className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-105 active:scale-95 shadow-md"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo Zoom Modal Trigger */}
                      {onSelectPhoto && (
                        <button
                          type="button"
                          onClick={() => onSelectPhoto(currentPhoto.url, currentPhoto.caption)}
                          className="absolute top-3.5 right-16 w-7 h-7 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center border border-white/15 transition-colors"
                          aria-label="View photo in lightbox"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Previews (Row of 4 Photos) */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-3 sm:mt-3.5 flex-shrink-0">
                      {room.photos.map((p, pIdx) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => handleSelectThumbnail(room.id, pIdx)}
                          className={`relative h-16 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                            pIdx === currentPhotoIdx
                              ? "ring-2 ring-[#C58E47] scale-[1.03] shadow-md"
                              : "opacity-65 hover:opacity-100 hover:scale-[1.01]"
                          }`}
                        >
                          <Image
                            src={p.url}
                            alt={p.caption}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Room Details & Specs (50% on Desktop) */}
                  <div className="lg:w-1/2 p-4 sm:p-7 lg:p-10 flex flex-col justify-between">
                    <div>
                      {/* Eyebrow Tag */}
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C58E47] mb-1.5 block">
                        {room.roomNumber} • {room.categoryTag}
                      </span>

                      {/* Room Title */}
                      <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-bold text-[#243D2C] tracking-tight mb-1 leading-tight">
                        {room.name}
                      </h3>

                      {/* Haute-Couture Editorial Subtitle */}
                      <p className="font-serif italic text-lg sm:text-xl text-[#A97633] font-normal mb-3 sm:mb-4">
                        {room.subtitle}
                      </p>

                      {/* Description Paragraph - High-Legibility Modern Luxury Editorial */}
                      <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                        {room.description}
                      </p>

                      {/* 2x2 Quick Specs Grid with Divider */}
                      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 py-4 border-y border-[#EAE5DC] mb-6">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D50] flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-[#C58E47]" />
                            Bed
                          </span>
                          <p className="text-sm font-bold text-[#1F2923]">
                            {room.specs.bed}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D50] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#C58E47]" />
                            Sleeps
                          </span>
                          <p className="text-sm font-bold text-[#1F2923]">
                            {room.specs.sleeps}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D50] flex items-center gap-1.5">
                            <Mountain className="w-3.5 h-3.5 text-[#C58E47]" />
                            Outlook
                          </span>
                          <p className="text-sm font-bold text-[#1F2923]">
                            {room.specs.outlook}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A5D50] flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#C58E47]" />
                            Bathroom
                          </span>
                          <p className="text-sm font-bold text-[#1F2923]">
                            {room.specs.bathroom}
                          </p>
                        </div>
                      </div>

                      {/* Amenities List - Uncramped, Fully Visible without Ellipsis Truncation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                        {room.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#1F2923] leading-snug"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#C58E47] flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-[#243529]">{amenity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Direct Rates & Payment Badge */}
                      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF7F1] to-white border border-[#E6DDD0] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                        <div>
                          <span className="text-[11px] sm:text-xs text-[#4A5D50] block mb-0.5 font-bold uppercase tracking-wider">
                            Direct Booking Rate
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
                              {room.price}
                            </span>
                            <span className="text-xs sm:text-sm text-[#4A5D50] font-medium">
                              /{room.period.replace(/^per\s*/, "")}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-white border border-[#C58E47]/35 text-[10px] sm:text-[11px] font-bold text-[#243D2C] uppercase tracking-wider shadow-2xs">
                          {room.paymentBadge}
                        </span>
                      </div>
                    </div>

                    {/* Dual Action Buttons & Accordion */}
                    <div>
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mb-4">
                        <Link
                          href={`/booking?room=${room.id === "double-room" ? "double" : room.id === "triple-room" ? "triple" : "full"}`}
                          className="w-full sm:flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#C58E47] to-[#B37C35] hover:from-[#D4A362] hover:to-[#C58E47] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#C58E47]/20 hover:scale-102 active:scale-98 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Reserve This Room</span>
                        </Link>

                        <a
                          href="#contact"
                          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#FAF8F4] hover:bg-[#F2EFE8] text-[#243D2C] border border-[#E0D9CD] text-xs sm:text-sm font-semibold transition-all hover:scale-102 active:scale-98"
                        >
                          <Users className="w-4 h-4 text-[#C58E47]" />
                          <span>Room Inquiries</span>
                        </a>
                      </div>

                      {/* Collapsible "Good to Know" Accordion */}
                      <div className="border-t border-[#E2E6E3] pt-2">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(room.id)}
                          className="w-full min-h-[38px] flex items-center justify-between text-xs font-bold text-[#64748B] hover:text-[#243D2C] py-2 px-1 transition-colors uppercase tracking-wider rounded-lg hover:bg-[#F8F9F7]"
                          aria-expanded={isAccordionOpen}
                        >
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C58E47]" />
                            Good to know
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isAccordionOpen ? "rotate-180 text-[#C58E47]" : ""
                            }`}
                          />
                        </button>

                        {isAccordionOpen && (
                          <div className="mt-2.5 pt-2.5 border-t border-dashed border-[#E2E6E3] space-y-1.5 text-xs text-[#7B887E] animate-in fade-in duration-200">
                            {room.goodToKnow.map((item) => (
                              <div key={item} className="flex items-start gap-2">
                                <span className="text-[#C58E47] font-bold mt-0.5">•</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
