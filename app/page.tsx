"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyHighlights from "@/components/PropertyHighlights";
import RoomsSection from "@/components/RoomsSection";
import GallerySection from "@/components/GallerySection";
import TransportBanner from "@/components/TransportBanner";
import FacilitiesSection from "@/components/FacilitiesSection";
import LocationSection from "@/components/LocationSection";
import HostAndReviews from "@/components/HostAndReviews";
import FaqSection from "@/components/FaqSection";
import ContactAndFooter from "@/components/ContactAndFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PhotoLightbox from "@/components/PhotoLightbox";

const ALL_PHOTOS = [
  { url: "/photos/outside-cool-view.jpeg", caption: "Misty Mountain Panorama" },
  { url: "/photos/2-member-room.jpeg", caption: "Double Room with Garden View" },
  { url: "/photos/triblebedroom.jpg", caption: "Spacious Triple Bedroom" },
  { url: "/photos/hero-1.jpg", caption: "Bungalow Garden & Gazebo" },
  { url: "/photos/outside-view-2.jpeg", caption: "Outdoor Seating & Mountain Terrace" },
  { url: "/photos/inside-view.jpeg", caption: "Living Area & Dining Table" },
  { url: "/photos/hero-2.jpg", caption: "Morning Mist on Welimada Road" },
  { url: "/photos/2-member-room-2.jpeg", caption: "Sunlit Bedroom View" },
  { url: "/photos/outside-view-3.jpeg", caption: "Private Bungalow Grounds & Parking" },
  { url: "/photos/wa-20.44.00.jpeg", caption: "En-suite Bathroom with Hot Water" },
  { url: "/photos/wa-20.52.41.jpeg", caption: "Cloud-Kissed Pine Forest Trail" },
  { url: "/photos/outside-view-5.jpeg", caption: "Veranda Overlooking the Hills" },
  { url: "/photos/car-fleet.jpg", caption: "Dedicated On-Site Car for Horton Plains Tours" },
  { url: "/photos/scooter-fleet.jpg", caption: "On-Site Scooters Exploring Misty Highland Tea Roads" },
  { url: "/photos/sri-lankan-food.jpg", caption: "Authentic Home-Cooked Ceylon Breakfast & Lunch Feast" },
  { url: "/photos/highland-hot-water.jpg", caption: "En-suite Bathroom with Steaming Highland Hot Water" },
];

export default function Home() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);

  const handleOpenPhoto = (url: string, _caption: string) => {
    const idx = ALL_PHOTOS.findIndex((p) => p.url === url);
    if (idx !== -1) {
      setCurrentPhotoIndex(idx);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const handleClosePhoto = () => {
    setCurrentPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex !== null) {
      setCurrentPhotoIndex((currentPhotoIndex - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length);
    }
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex !== null) {
      setCurrentPhotoIndex((currentPhotoIndex + 1) % ALL_PHOTOS.length);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9F7] text-[#1F2923]">
      {/* Section 1: Sticky Navigation Bar */}
      <Navbar />

      {/* Section 2: Hero Section */}
      <Hero />

      {/* Section 3: Quick Property Highlights Strip */}
      <PropertyHighlights />

      {/* Section 4: Rooms & Direct Booking Rates */}
      <RoomsSection onSelectPhoto={handleOpenPhoto} />

      {/* New Dedicated Highland Visual Gallery */}
      <GallerySection onOpenPhoto={handleOpenPhoto} />

      {/* Section 5: Horton Plains Transport & Local Mobility Banner */}
      <TransportBanner />

      {/* Section 6: Facilities & Amenities */}
      <FacilitiesSection />

      {/* Section 7: Prime Location & Nearby Attractions */}
      <LocationSection />

      {/* Section 8: Meet Your Host & Guest Stories */}
      <HostAndReviews />

      {/* Section 9: Frequently Asked Questions */}
      <FaqSection />

      {/* Section 10: Contact Section & Footer */}
      <ContactAndFooter />

      {/* Floating Action Button: WhatsApp */}
      <FloatingWhatsApp />

      {/* Accessible Photo Lightbox Modal with Next/Prev Navigation */}
      <PhotoLightbox
        isOpen={currentPhotoIndex !== null}
        photoUrl={currentPhotoIndex !== null ? ALL_PHOTOS[currentPhotoIndex].url : null}
        caption={currentPhotoIndex !== null ? ALL_PHOTOS[currentPhotoIndex].caption : ""}
        onClose={handleClosePhoto}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />
    </main>
  );
}
