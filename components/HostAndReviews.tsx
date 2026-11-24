import Image from "next/image";
import { Star, ShieldCheck, Heart, MessageSquareQuote, CheckCircle2, Award, Clock } from "lucide-react";

export default function HostAndReviews() {
  const guestHighlights = [
    {
      quote:
        "The best location in Ohiya. Just a 3-minute stroll from the railway station. Susantha arranged our 5:30 AM vehicle to World’s End, and the hot water shower afterward was pure bliss.",
      author: "David & Elena",
      origin: "United Kingdom",
      tag: "Couples Trekking Stay",
    },
    {
      quote:
        "Waking up above the cloud canopy with a warm cup of Ceylon tea on the veranda was the highlight of our Sri Lankan trip. Genuine, humble hospitality and total peace.",
      author: "Kasun & Family",
      origin: "Colombo, Sri Lanka",
      tag: "Family Weekend",
    },
    {
      quote:
        "Clean, spacious rooms with private balconies facing the pine hills. No hassle with early trains or luggage. Susantha takes care of everything with quiet dedication.",
      author: "Marc & Sophie",
      origin: "France",
      tag: "Highland Rail Explorers",
    },
  ];

  return (
    <section id="reviews" className="py-10 sm:py-16 lg:py-20 bg-[#F8F9F7]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header with Warm Boutique Editorial Aesthetic */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 mb-2.5 text-[#243D2C]">
            <Award className="w-3.5 h-3.5 text-[#C58E47]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Authentic Highland Hospitality
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#17271D] tracking-tight mb-3 leading-tight">
            You Arrive as a Guest.{" "}
            <span className="font-serif italic font-normal text-[#A97633]">
              You Leave as Family.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#3E5244] leading-relaxed max-w-2xl mx-auto font-normal">
            Personal care and warm mountain hospitality from lifelong host Susantha Jayasiri, ensuring your Horton Plains trek and Ohiya stay feel truly like home.
          </p>
        </div>

        {/* 2-Column Luxury Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-stretch mb-8 sm:mb-10">
          {/* Left Column: Host Profile Card */}
          <div className="lg:col-span-6 scroll-reveal bg-[#FAF9F5]/80 rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#EAE5DC] shadow-xs flex flex-col justify-between hover-lift">
            <div>
              {/* Host Avatar & Details */}
              <div className="flex items-center gap-5 mb-7">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C58E47]/30 shadow-md bg-[#243D2C] flex-shrink-0">
                  <Image
                    src="/logo.jpeg"
                    alt="Host Susantha Jayasiri"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#243D2C] text-white">
                      Dedicated Host
                    </span>
                    <span className="text-xs text-[#4F6154] font-medium">English &amp; Sinhala</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
                    Susantha Jayasiri
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#4F6154] font-medium mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#C58E47]" />
                    <span>10+ Years Highland Hospitality Experience</span>
                  </div>
                </div>
              </div>

              {/* Personal Welcome Quote */}
              <div className="relative bg-[#F8F9F7] rounded-2xl p-6 sm:p-7 border border-[#E2E6E3] mb-7">
                <MessageSquareQuote className="w-8 h-8 text-[#C58E47]/25 absolute top-5 right-5" />
                <p className="font-serif italic text-base sm:text-lg text-[#1F2923] leading-relaxed">
                  &ldquo;Every guest comes to Ohiya seeking something rare: true silence, misty dawn light, and restorative rest. I take personal pride in making sure your stay feels effortless, from greeting you at the station to preparing your sunrise trek.&rdquo;
                </p>
              </div>

              {/* Verified Host Commitments */}
              <div className="space-y-3 text-xs sm:text-sm text-[#1F2923]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  <span>Personal station greeting &amp; luggage assistance on request</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  <span>Direct coordination for private Horton Plains sunrise trips</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  <span>Warm Ceylon tea and fresh home-cooked meals upon request</span>
                </div>
              </div>
            </div>

            {/* Direct Host Contact Link */}
            <div className="mt-8 pt-6 border-t border-[#EAE5DC] flex items-center justify-between">
              <span className="text-xs text-[#4F6154] font-medium">
                Direct questions about your arrival?
              </span>
              <a
                href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20have%20a%20question%20about%20staying%20at%20Dawn%20Breezy%20Bungalow."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#243D2C] hover:text-[#C58E47] underline underline-offset-4 transition-colors"
              >
                Chat directly on WhatsApp →
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Verified Reviews */}
          <div className="lg:col-span-6 scroll-reveal bg-[#FAF9F5]/80 rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#EAE5DC] shadow-xs flex flex-col justify-between hover-lift">
            <div>
              {/* Top Score Badge Banner */}
              <div className="flex items-center justify-between gap-4 mb-7 pb-6 border-b border-[#EAE5DC]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C58E47] block mb-1">
                    Couples Choice Award
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#243D2C]">
                    9.2 / 10 Location Rating
                  </h3>
                  <p className="text-xs text-[#4F6154] mt-0.5 font-medium">
                    Recognized for serene tranquility and immediate railway proximity
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#243D2C] text-white flex-shrink-0 shadow-sm">
                  <Star className="w-5 h-5 fill-current text-[#D4A362]" />
                  <span className="font-serif text-2xl font-bold">9.2</span>
                </div>
              </div>

              {/* Guest Quotes Carousel/Stack */}
              <div className="space-y-4">
                {guestHighlights.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F9F7] border border-[#EAE5DC] text-xs sm:text-sm text-[#1F2923]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#243D2C] bg-[#C58E47]/15 px-2.5 py-0.5 rounded-full border border-[#C58E47]/20">
                        {g.tag}
                      </span>
                      <div className="flex text-[#C58E47]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="italic text-[#243529] font-normal leading-relaxed mb-2 text-[13px] sm:text-sm">
                      &ldquo;{g.quote}&rdquo;
                    </p>
                    <div className="text-[11px] font-semibold text-[#4F6154]">
                      {g.author} • <span className="font-normal text-[#4F6154]">{g.origin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#4F6154] font-medium">
              <span>Verified guest experiences</span>
              <span className="font-semibold text-[#243D2C]">100% Authentic Stays</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
