import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactAndFooter from "@/components/ContactAndFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AttractionDetailView from "@/components/AttractionDetailView";
import { ATTRACTIONS, getAttractionBySlug, getAllAttractionSlugs } from "@/data/attractions";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllAttractionSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);

  if (!attraction) {
    return {
      title: "Attraction Not Found | Dawn Breezy Bungalow Ohiya",
    };
  }

  return {
    title: `${attraction.name} (${attraction.sinhalaName}) | Dawn Breezy Bungalow Ohiya`,
    description: `${attraction.shortDescription} Located ${attraction.distance} from Dawn Breezy Bungalow in Ohiya, Sri Lanka. Complete visitor guide, real photos, and transport details.`,
    openGraph: {
      title: `${attraction.name} | Nearby Dawn Breezy Bungalow Ohiya`,
      description: attraction.shortDescription,
      images: [
        {
          url: attraction.heroImage,
          width: 1200,
          height: 800,
          alt: attraction.name,
        },
      ],
    },
  };
}

export default async function AttractionPage({ params }: PageProps) {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);

  if (!attraction) {
    notFound();
  }

  const otherAttractions = ATTRACTIONS.filter((a) => a.slug !== slug);

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Navbar />
      <AttractionDetailView
        attraction={attraction}
        otherAttractions={otherAttractions}
      />
      <ContactAndFooter />
      <FloatingWhatsApp />
    </main>
  );
}
