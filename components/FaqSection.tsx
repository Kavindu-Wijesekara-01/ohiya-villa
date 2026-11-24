"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How far is the bungalow from Ohiya Railway Station?",
      answer:
        "Just 200 meters (approx. 950 feet) — a relaxed 3-minute walk along Welimada Road. You won't need a taxi or tuk-tuk from the station, and Susantha is happy to assist with your luggage if needed.",
    },
    {
      question: "Can you arrange transport to Horton Plains National Park?",
      answer:
        "Yes, absolutely. We have a dedicated on-site private Car (perfect for families and early morning Horton Plains tours) as well as 2 on-site Scooters for couples and solo adventurers. Most guests take the 5:30 AM sunrise car tour to reach World's End and Baker's Falls before morning mist rolls in.",
    },
    {
      question: "Is parking and high-speed WiFi completely free?",
      answer:
        "Yes! We provide free on-site private parking directly in front of the bungalow (no reservation needed) as well as complimentary high-speed WiFi covering all rooms and common living spaces.",
    },
    {
      question: "Do all rooms have private bathrooms with hot water?",
      answer:
        "Yes, every single one of our 3 bedrooms has its own en-suite private bathroom with a hot-water shower system, modern bidet spray, fresh towels, and complimentary toiletries.",
    },
    {
      question: "Are home-cooked meals available at the bungalow?",
      answer:
        "Yes, warm home-cooked Sri Lankan meals (rice and curry, roti, tea) can be prepared upon request, and you also have access to the kitchen, electric kettle, and tea/coffee supplies.",
    },
    {
      question: "What is the weather and temperature like in Ohiya?",
      answer:
        "At 1,770m altitude, Ohiya is refreshingly cool year-round. Daytime temperatures range between 18°C–22°C (64°F–72°F) and evening/night temperatures often drop to 10°C–14°C (50°F–57°F). We recommend bringing warm fleeces or jackets for the mornings and evenings.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="scroll-reveal text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 mb-2.5 text-[#243D2C]">
            <HelpCircle className="w-3.5 h-3.5 text-[#C58E47]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Highland Travel Guidance
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243D2C] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#3E5244] leading-relaxed font-normal">
            Helpful answers to make your arrival, mountain excursions, and stay completely smooth.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="scroll-reveal space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="scroll-reveal bg-[#FAF9F5] rounded-2xl border border-[#EAE5DC] hover:border-[#DFB775]/60 overflow-hidden transition-all duration-300"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#243D2C]"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#1F2923] hover:text-[#C58E47] transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-[#E2E6E3] flex items-center justify-center flex-shrink-0 text-[#243D2C] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#243D2C] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] border-t border-[#EAE5DC] animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick contact support note */}
        <div className="scroll-reveal mt-10 text-center text-xs sm:text-sm text-[#4F6154] font-medium">
          Have another question about your travel plans?{" "}
          <a
            href="https://wa.me/94714194368"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#243D2C] hover:text-[#C58E47] underline underline-offset-4"
          >
            Ask Susantha directly on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
