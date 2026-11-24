"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2, Camera } from "lucide-react";

interface GallerySectionProps {
  onOpenPhoto: (url: string, caption: string) => void;
}

export interface GalleryItem {
  _id?: string;
  src: string;
  category: "scenery" | "property" | "rooms" | "interior";
  title: string;
  subtitle: string;
  aspect: string; // Tailored aspect ratio for organic editorial masonry
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    src: "/photos/outside-cool-view.jpeg",
    category: "scenery",
    title: "Misty Mountain Panorama",
    subtitle: "Unobstructed view across the Ohiya pine valley",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/photos/2-member-room.jpeg",
    category: "rooms",
    title: "Double Room with Garden View",
    subtitle: "Crisp highland linens & private balcony",
    aspect: "aspect-[16/11]",
  },
  {
    src: "/photos/hero-1.jpg",
    category: "property",
    title: "Bungalow Garden & Gazebo",
    subtitle: "Peaceful morning tea spots amidst highland nature",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/photos/triblebedroom.jpg",
    category: "rooms",
    title: "Spacious Triple Bedroom",
    subtitle: "Ideal for friends & small trekking groups",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/photos/outside-view-2.jpeg",
    category: "property",
    title: "Outdoor Seating & Mountain Terrace",
    subtitle: "Fresh mountain breezes at 1,775m elevation",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/photos/hero-2.jpg",
    category: "scenery",
    title: "Morning Mist on Welimada Road",
    subtitle: "Gateway scenic drive toward Horton Plains",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/photos/inside-view.jpeg",
    category: "interior",
    title: "Living Area & Dining Table",
    subtitle: "Warm, cozy space for sharing meals and stories",
    aspect: "aspect-square",
  },
  {
    src: "/photos/2-member-room-2.jpeg",
    category: "rooms",
    title: "Sunlit Bedroom View",
    subtitle: "Natural highland light and private balcony",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/photos/outside-view-3.jpeg",
    category: "property",
    title: "Private Bungalow Grounds",
    subtitle: "Safe private parking and secluded gardens",
    aspect: "aspect-[16/11]",
  },
  {
    src: "/photos/wa-20.44.00.jpeg",
    category: "interior",
    title: "En-suite Bathroom & Modern Fittings",
    subtitle: "Hot water shower with reliable highland heating",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/photos/wa-20.52.41.jpeg",
    category: "scenery",
    title: "Cloud-Kissed Pine Forest",
    subtitle: "Tranquil hiking trail just outside the gate",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/photos/outside-view-5.jpeg",
    category: "property",
    title: "Veranda Overlooking the Hills",
    subtitle: "Watch the morning mist rise with Ceylon tea",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/photos/car-fleet.jpg",
    category: "scenery",
    title: "Dedicated On-Site Car",
    subtitle: "Comfortable transport for Horton Plains sunrise excursions",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/photos/scooter-fleet.jpg",
    category: "scenery",
    title: "On-Site Mountain Scooters",
    subtitle: "Exploring scenic winding tea roads and misty mountain passes",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/photos/sri-lankan-food.jpg",
    category: "interior",
    title: "Ceylon Breakfast & Lunch Feast",
    subtitle: "Crispy hoppers, pol sambol, dhal curry and fresh tea on the terrace",
    aspect: "aspect-[16/10]",
  },
  {
    src: "/photos/highland-hot-water.jpg",
    category: "interior",
    title: "Steaming Highland Hot Shower",
    subtitle: "Private en-suite comfort after chilly mountain treks",
    aspect: "aspect-[16/10]",
  },
];

export default function GallerySection({ onOpenPhoto }: GallerySectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "scenery" | "property" | "rooms" | "interior">("all");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);

  // Fetch dynamic gallery from backend
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setGalleryItems(data.items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic gallery:", err);
      }
    }
    fetchGallery();
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <section id="gallery" className="py-10 sm:py-16 lg:py-20 bg-[#FAF8F5] border-t border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 mb-2.5 text-[#243D2C]">
            <Camera className="w-3.5 h-3.5 text-[#C58E47]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Highland Visual Chronicles
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#17271D] tracking-tight mb-2.5 leading-tight">
            Not a Brochure.{" "}
            <span className="font-serif italic font-normal text-[#C58E47] inline-block mx-1">
              Just the Way It Looks.
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#7B887E] leading-relaxed max-w-2xl mx-auto">
            Candid, unedited glimpses of Dawn Breezy Bungalow, featuring crisp morning mist at 1,775m, cozy timber bedrooms, and peaceful mountain moments in Ohiya.
          </p>
        </div>

        {/* Category Filter Pills: Horizontally Swipeable on Mobile, Centered on Tablet/Desktop */}
        <div className="scroll-reveal flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 justify-start sm:justify-center px-1 mb-6 sm:mb-10">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-[#243D2C] text-white shadow-xs"
                : "bg-white text-[#7B887E] hover:text-[#1F2923] border border-[#E2E6E3]"
            }`}
          >
            All Moments ({galleryItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rooms")}
            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "rooms"
                ? "bg-[#243D2C] text-white shadow-xs"
                : "bg-white text-[#7B887E] hover:text-[#1F2923] border border-[#E2E6E3]"
            }`}
          >
            Guest Bedrooms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scenery")}
            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "scenery"
                ? "bg-[#243D2C] text-white shadow-xs"
                : "bg-white text-[#7B887E] hover:text-[#1F2923] border border-[#E2E6E3]"
            }`}
          >
            Highland Panoramas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("property")}
            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "property"
                ? "bg-[#243D2C] text-white shadow-xs"
                : "bg-white text-[#7B887E] hover:text-[#1F2923] border border-[#E2E6E3]"
            }`}
          >
            Veranda &amp; Garden
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("interior")}
            className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "interior"
                ? "bg-[#243D2C] text-white shadow-xs"
                : "bg-white text-[#7B887E] hover:text-[#1F2923] border border-[#E2E6E3]"
            }`}
          >
            Living &amp; Bath
          </button>
        </div>

        {/* Asymmetric 2-Column Mobile & 3/4-Column Desktop Editorial Masonry with Smooth Scroll Reveal */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-3.5 lg:gap-4 space-y-2.5 sm:space-y-3.5 lg:space-y-4">
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.src}-${idx}`}
              onClick={() => onOpenPhoto(item.src, item.subtitle ? `${item.title}. ${item.subtitle}` : item.title)}
              className={`scroll-reveal-img break-inside-avoid group relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-200 border border-[#EAE6DF] shadow-xs cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5`}
              style={{ transitionDelay: `${(idx % 4) * 85}ms` }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-65 group-hover:opacity-90 transition-opacity" />

              {/* Caption & Expand Action on Hover */}
              <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1.5 sm:p-2 rounded-full bg-black/45 text-white backdrop-blur-md shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-xs sm:text-sm md:text-base font-bold text-white leading-tight drop-shadow-sm">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
