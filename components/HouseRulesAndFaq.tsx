"use client";

import { useState } from "react";
import {
  Clock,
  Baby,
  UserCheck,
  Dog,
  CigaretteOff,
  Banknote,
  ChevronDown,
  HelpCircle,
  ShieldAlert
} from "lucide-react";

export default function HouseRulesAndFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const rules = [
    {
      icon: Clock,
      title: "Check-in & Check-out",
      desc: "Check-in: 14:00 to 23:00 | Check-out: 00:00 to 11:00",
      highlight: "Flexible on early/late train arrivals",
    },
    {
      icon: Baby,
      title: "Children Welcome",
      desc: "Children of any age are welcome. Cots and extra beds are not available.",
      highlight: "Family friendly",
    },
    {
      icon: UserCheck,
      title: "Age Restriction",
      desc: "No minimum age requirement for check-in.",
      highlight: "All travelers welcome",
    },
    {
      icon: Dog,
      title: "Pets Allowed",
      desc: "Pets are welcome to stay with you at no extra charge.",
      highlight: "100% Pet Friendly",
    },
    {
      icon: CigaretteOff,
      title: "Non-Smoking Property",
      desc: "Smoking is strictly prohibited inside all bedrooms and enclosed areas to keep the mountain air fresh.",
      highlight: "Pure pine air",
    },
    {
      icon: Banknote,
      title: "Payment Method",
      desc: "No prepayment or credit card required. Settle your stay conveniently upon arrival at the property.",
      highlight: "Zero booking fees",
    },
  ];

  const faqs = [
    {
      question: "How far is the bungalow from Ohiya Railway Station?",
      answer:
        "Just 200 meters (approx. 950 feet), a relaxed 3-minute walk along Welimada Road. You will not need a taxi or tuk-tuk from the station, and Susantha is happy to assist with your luggage on arrival.",
    },
    {
      question: "Can you arrange transport to Horton Plains National Park?",
      answer:
        "Yes, absolutely. We have an on-site Car and Motorbike specifically available for guests. Most guests take the early morning 5:30 AM trip to Horton Plains to catch World's End and Baker's Falls before cloud cover rolls in.",
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
        "At 1,770m altitude, Ohiya is refreshingly cool year-round. Daytime temperatures range between 18°C to 22°C (64°F to 72°F) and evening temperatures often drop to 10°C to 14°C (50°F to 57°F). We recommend bringing warm fleeces or jackets for the mornings and evenings.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="house-rules" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C58E47] mb-2 block">
            Clear Policies &amp; Helpful Guidance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243D2C] tracking-tight mb-4">
            House Rules &amp; Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#7B887E] leading-relaxed">
            Everything is transparent and straightforward so your stay in the highlands is restful and worry-free.
          </p>
        </div>

        {/* 1. House Rules Grid */}
        <div className="scroll-reveal mb-20">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-[#C58E47]" />
            <h3 className="font-serif text-2xl font-bold text-[#243D2C]">
              Bungalow Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule) => {
              const Icon = rule.icon;
              return (
                <div
                  key={rule.title}
                  className="bg-[#F8F9F7] rounded-2xl p-6 border border-[#E2E6E3] hover:border-[#C58E47]/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E6E3] flex items-center justify-center text-[#243D2C]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#243D2C] bg-[#C58E47]/15 px-2.5 py-0.5 rounded-full">
                      {rule.highlight}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#1F2923] mb-2">
                    {rule.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7B887E] leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. FAQ Accordion */}
        <div className="scroll-reveal max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8 text-center">
            <HelpCircle className="w-5 h-5 text-[#C58E47]" />
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
              Common Questions About Staying in Ohiya
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#F8F9F7] rounded-2xl border border-[#E2E6E3] overflow-hidden transition-colors"
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
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#7B887E] leading-relaxed border-t border-gray-100/60 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick contact support note */}
          <div className="mt-8 text-center text-xs text-[#7B887E]">
            Still have a question about train timings or hiking routes?{" "}
            <a
              href="#contact"
              className="font-bold text-[#243D2C] hover:text-[#C58E47] underline underline-offset-4"
            >
              Ask Susantha directly
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
