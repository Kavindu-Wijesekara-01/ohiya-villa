import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Dancing_Script, Cinzel, Bodoni_Moda, Antonio } from "next/font/google";
import ScrollObserver from "@/components/ScrollObserver";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dawnbreezybungalow.com"),
  title: "Dawn Breezy Bungalow, Ohiya | Mountain Stay and Gateway to Horton Plains",
  description:
    "Quiet mountain stay on Welimada Road, Ohiya, Sri Lanka (also listed on Booking.com as Ohiya View Resort). 200m from Ohiya Station. Direct booking with no prepayment, hot water, free WiFi and private Horton Plains transport.",
  keywords: [
    "Dawn Breezy Bungalow",
    "Ohiya View Resort",
    "Ohiya bungalow",
    "Bungalow in Ohiya",
    "Horton Plains accommodation",
    "Ohiya Railway Station stay",
    "Welimada Road Ohiya",
    "Sri Lanka highland retreat",
    "Ohiya hotel booking",
  ],
  authors: [{ name: "Susantha Jayasiri" }],
  openGraph: {
    title: "Dawn Breezy Bungalow, Ohiya, Sri Lanka",
    description:
      "Wake up above the clouds in Ohiya. 200m from Ohiya Station, hot water, mountain views, and direct access to Horton Plains.",
    url: "https://dawnbreezybungalow.com",
    siteName: "Dawn Breezy Bungalow",
    images: [
      {
        url: "/photos/hero-1.jpg",
        width: 1200,
        height: 630,
        alt: "Dawn Breezy Bungalow Ohiya Scenic Highland View",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dawn Breezy Bungalow, Ohiya, Sri Lanka",
    description: "Peaceful mountain retreat 200m from Ohiya Railway Station. Direct rates and Horton Plains transport.",
    images: ["/photos/hero-1.jpg"],
  },
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cinzel.variable} ${bodoniModa.variable} ${antonio.variable} ${plusJakarta.variable} ${dancingScript.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F9F7] text-[#1F2923] font-sans selection:bg-[#C58E47]/20 selection:text-[#243D2C]">
        <ScrollObserver />
        {children}
      </body>
    </html>
  );
}
