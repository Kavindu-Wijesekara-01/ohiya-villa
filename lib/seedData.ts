import connectToDatabase from "./mongodb";
import GalleryItem from "@/models/GalleryItem";
import Review from "@/models/Review";
import Room from "@/models/Room";

export const DEFAULT_GALLERY_ITEMS = [
  {
    src: "/photos/outside-cool-view.jpeg",
    category: "scenery",
    title: "Misty Mountain Panorama",
    subtitle: "Unobstructed view across the Ohiya pine valley",
    aspect: "aspect-[4/5]",
    order: 1,
    isVisible: true,
  },
  {
    src: "/photos/2-member-room.jpeg",
    category: "rooms",
    title: "Double Room with Garden View",
    subtitle: "Crisp highland linens & private balcony",
    aspect: "aspect-[16/11]",
    order: 2,
    isVisible: true,
  },
  {
    src: "/photos/hero-1.jpg",
    category: "property",
    title: "Bungalow Garden & Gazebo",
    subtitle: "Peaceful morning tea spots amidst highland nature",
    aspect: "aspect-[4/3]",
    order: 3,
    isVisible: true,
  },
  {
    src: "/photos/triblebedroom.jpg",
    category: "rooms",
    title: "Spacious Triple Bedroom",
    subtitle: "Ideal for friends & small trekking groups",
    aspect: "aspect-[3/4]",
    order: 4,
    isVisible: true,
  },
  {
    src: "/photos/outside-view-2.jpeg",
    category: "property",
    title: "Outdoor Seating & Mountain Terrace",
    subtitle: "Fresh mountain breezes at 1,775m elevation",
    aspect: "aspect-[16/10]",
    order: 5,
    isVisible: true,
  },
  {
    src: "/photos/hero-2.jpg",
    category: "scenery",
    title: "Morning Mist on Welimada Road",
    subtitle: "Gateway scenic drive toward Horton Plains",
    aspect: "aspect-[4/5]",
    order: 6,
    isVisible: true,
  },
  {
    src: "/photos/inside-view.jpeg",
    category: "interior",
    title: "Living Area & Dining Table",
    subtitle: "Warm, cozy space for sharing meals and stories",
    aspect: "aspect-square",
    order: 7,
    isVisible: true,
  },
  {
    src: "/photos/2-member-room-2.jpeg",
    category: "rooms",
    title: "Sunlit Bedroom View",
    subtitle: "Natural highland light and private balcony",
    aspect: "aspect-[4/3]",
    order: 8,
    isVisible: true,
  },
  {
    src: "/photos/outside-view-3.jpeg",
    category: "property",
    title: "Private Bungalow Grounds",
    subtitle: "Safe private parking and secluded gardens",
    aspect: "aspect-[16/11]",
    order: 9,
    isVisible: true,
  },
  {
    src: "/photos/wa-20.44.00.jpeg",
    category: "interior",
    title: "En-suite Bathroom & Modern Fittings",
    subtitle: "Hot water shower with reliable highland heating",
    aspect: "aspect-[3/4]",
    order: 10,
    isVisible: true,
  },
  {
    src: "/photos/wa-20.52.41.jpeg",
    category: "scenery",
    title: "Cloud-Kissed Pine Forest",
    subtitle: "Tranquil hiking trail just outside the gate",
    aspect: "aspect-[4/5]",
    order: 11,
    isVisible: true,
  },
];

export const DEFAULT_REVIEWS = [
  {
    quote:
      "The best location in Ohiya. Just a 3-minute stroll from the railway station. Susantha arranged our 5:30 AM vehicle to World’s End, and the hot water shower afterward was pure bliss.",
    author: "David & Elena",
    origin: "United Kingdom",
    tag: "Couples Trekking Stay",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    quote:
      "Waking up above the cloud canopy with a warm cup of Ceylon tea on the veranda was the highlight of our Sri Lankan trip. Genuine, humble hospitality and total peace.",
    author: "Kasun & Family",
    origin: "Colombo, Sri Lanka",
    tag: "Family Weekend",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    quote:
      "Clean, spacious rooms with private balconies facing the pine hills. No hassle with early trains or luggage. Susantha takes care of everything with quiet dedication.",
    author: "Marc & Sophie",
    origin: "France",
    tag: "Highland Rail Explorers",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
];

export const DEFAULT_ROOMS = [
  {
    roomId: "double",
    roomNumber: "ROOM 01",
    categoryTag: "HIGHLAND ROOM • SLEEPS 2",
    name: "Double Room with Mountain View",
    subtitle: "A peaceful room with pine valley views",
    description:
      "Wake up to misty pine panoramas and the quiet mountain breeze at 1,775m elevation. Features crisp highland linens, warm timber accents, an en-suite private hot-water bathroom, and a scenic veranda terrace made for long mornings with hot Ceylon tea.",
    pricePerNight: 20,
    priceLabel: "$20",
    capacity: "Up to 2 Guests",
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
    features: [
      "King size bed with plush mountain blankets",
      "Private en-suite bathroom with steaming hot water",
      "Private veranda overlooking misty pine valley",
      "Electric tea kettle and Ceylon tea selection",
      "Complimentary high-speed WiFi",
    ],
    goodToKnow: [
      "Check-in: 1:00 PM • Flexible early check-in upon request",
      "Check-out: 11:00 AM",
      "Complimentary luggage assistance from Ohiya Station (200m / 3 min walk)",
      "On-site Car available for 5:30 AM Horton Plains sunrise excursions",
      "2 On-site Scooters available for scenic mountain trail hire",
      "Fresh home-cooked Sri Lankan meals available upon advance request",
    ],
    order: 1,
    isActive: true,
  },
  {
    roomId: "triple",
    roomNumber: "ROOM 02",
    categoryTag: "TRIPLE HIGHLAND • SLEEPS 3",
    name: "Triple Room with Private Bathroom",
    subtitle: "Spacious comfort for friends & small families",
    description:
      "The ideal highland retreat for small trekking groups or families exploring Horton Plains. Designed with generous space, featuring one extra-large double bed and one single bed, private en-suite hot-water bathroom, and wide windows opening to cool mountain views.",
    pricePerNight: 23,
    priceLabel: "$23",
    capacity: "Up to 3 Guests",
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
    features: [
      "1 Double bed + 1 Single bed setup",
      "Private en-suite hot-water bathroom",
      "Wide windows with panoramic garden & hill view",
      "Electric tea kettle and tea station",
      "Complimentary high-speed WiFi",
    ],
    goodToKnow: [
      "Check-in: 1:00 PM • Flexible arrival for highland train schedules",
      "Check-out: 11:00 AM",
      "Close 3-minute walking proximity to Ohiya Railway Station",
      "Direct 5:30 AM car departure to World's End and Baker's Falls",
      "Scooter hire available on-site for cruising scenic Welimada roads",
      "Cozy living room area available for group dining and tea",
    ],
    order: 2,
    isActive: true,
  },
  {
    roomId: "full",
    roomNumber: "ROOM 03",
    categoryTag: "WHOLE PROPERTY • SLEEPS 8 TO 10",
    name: "Full Bungalow Exclusive Stay",
    subtitle: "All 3 bedrooms, private living room & kitchen",
    description:
      "Enjoy private mountain comfort. Reserve the entire Dawn Breezy Bungalow exclusively for your family or hiking party. Includes all 3 bedrooms, 3 private en-suite hot-water bathrooms, private dining room, full kitchen, garden gazebo, and mountain parking.",
    pricePerNight: 65,
    priceLabel: "$65",
    capacity: "Up to 10 Guests",
    specs: {
      bed: "3 Complete Bedrooms (Sleeps 10)",
      sleeps: "8 to 10 Guests",
      outlook: "360° Mountain, Forest & Ridge Panorama",
      bathroom: "3 Private En-Suite Hot Bathrooms",
    },
    amenities: [
      "Private 3-Bedroom Villa Reservation",
      "3 Private En-Suite Hot Bathrooms",
      "Exclusive Living & Dining Salons",
      "High-Speed WiFi Across All Rooms",
      "Full Kitchen & Tea Station Facilities",
      "Private Verandas & Pine Valley Views",
      "Lawn Gardens & Outdoor Mountain Gazebo",
      "Private Vehicle Parking for Multiple Cars",
    ],
    features: [
      "All 3 bedrooms with private hot-water bathrooms",
      "Spacious living room, dining area and private veranda",
      "Kitchen access, private garden and outdoor gazebo",
      "Dedicated parking for up to 3 vehicles",
      "Host Susantha on site for meals & Horton Plains transport",
    ],
    goodToKnow: [
      "Check-in: 1:00 PM • Round the clock access for late train arrivals",
      "Check-out: 11:00 AM",
      "Complete exclusive privacy for your family or trekking party",
      "Private parking for multiple cars and vans right on-site",
      "On-site Car & 2 Scooters ready for your group's Horton Plains safari",
      "Dedicated local chef service for authentic Ceylon breakfasts & dinners",
    ],
    order: 3,
    isActive: true,
  },
];

export async function ensureDefaultData() {
  await connectToDatabase();

  const galleryCount = await GalleryItem.countDocuments();
  if (galleryCount === 0) {
    await GalleryItem.insertMany(DEFAULT_GALLERY_ITEMS);
    console.log("Seeded default gallery items");
  }

  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    await Review.insertMany(DEFAULT_REVIEWS);
    console.log("Seeded default reviews");
  }

  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    await Room.insertMany(DEFAULT_ROOMS);
    console.log("Seeded default room items");
  }
}
