"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  MessageSquareQuote,
  CheckCircle2,
  Award,
  Clock,
  PlusCircle,
  X,
  Send
} from "lucide-react";

interface ReviewItem {
  _id?: string;
  quote: string;
  author: string;
  origin: string;
  tag: string;
  rating?: number;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    quote:
      "The best location in Ohiya. Just a 3-minute stroll from the railway station. Susantha arranged our 5:30 AM vehicle to World’s End, and the hot water shower afterward was pure bliss.",
    author: "David & Elena",
    origin: "United Kingdom",
    tag: "Couples Trekking Stay",
    rating: 5,
  },
  {
    quote:
      "Waking up above the cloud canopy with a warm cup of Ceylon tea on the veranda was the highlight of our Sri Lankan trip. Genuine, humble hospitality and total peace.",
    author: "Kasun & Family",
    origin: "Colombo, Sri Lanka",
    tag: "Family Weekend",
    rating: 5,
  },
  {
    quote:
      "Clean, spacious rooms with private balconies facing the pine hills. No hassle with early trains or luggage. Susantha takes care of everything with quiet dedication.",
    author: "Marc & Sophie",
    origin: "France",
    tag: "Highland Rail Explorers",
    rating: 5,
  },
];

export default function HostAndReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [author, setAuthor] = useState("");
  const [origin, setOrigin] = useState("");
  const [tag, setTag] = useState("Couples Trekking Stay");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  // Fetch approved reviews from backend
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live reviews:", err);
      }
    }
    loadReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          origin,
          tag,
          rating,
          quote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setAuthor("");
        setOrigin("");
        setQuote("");
        setRating(5);
      } else {
        setSubmitError(data.message || "Failed to submit review.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  &ldquo;Every guest comes to Ohiya seeking something rare: true silence, misty dawn light, and restorative rest. I take personal care to ensure you feel welcome and comfortable, from greeting you at the station to preparing your sunrise trek.&rdquo;
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
                href="#contact"
                className="text-xs font-bold text-[#243D2C] hover:text-[#C58E47] underline underline-offset-4 transition-colors"
              >
                Message host Susantha
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

              {/* Guest Quotes Stack (Dynamic from Backend) */}
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {reviews.map((g, idx) => (
                  <div
                    key={g._id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F9F7] border border-[#EAE5DC] text-xs sm:text-sm text-[#1F2923]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#243D2C] bg-[#C58E47]/15 px-2.5 py-0.5 rounded-full border border-[#C58E47]/20">
                        {g.tag || "Highland Stay"}
                      </span>
                      <div className="flex text-[#C58E47]">
                        {[...Array(g.rating || 5)].map((_, i) => (
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

            {/* Bottom Actions: Leave a Review */}
            <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#4F6154] font-medium">
              <span>Verified guest experiences</span>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setSubmitError("");
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#243D2C] hover:bg-[#17271D] text-white font-semibold text-xs transition-all shadow-xs hover:scale-102 active:scale-98"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#C58E47]" />
                <span>Share Your Experience</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#243D2C] mb-2">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs sm:text-sm text-[#4F6154] leading-relaxed max-w-sm mx-auto mb-6">
                  Your comment has been submitted to Susantha. It will appear on our live guest wall once verified.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#243D2C] text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47]">
                    Guest Book
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                    Leave a Mountain Review
                  </h3>
                  <p className="text-xs text-[#7B887E] mt-0.5">
                    Share your experience at Dawn Breezy Bungalow with fellow travelers.
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. David & Elena"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Country / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. United Kingdom"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3.5 py-2 text-xs text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Trip Type
                      </label>
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl px-3 py-2 text-xs text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                      >
                        <option value="Couples Trekking Stay">Couples Trekking Stay</option>
                        <option value="Family Weekend">Family Weekend</option>
                        <option value="Highland Rail Explorers">Highland Rail Explorers</option>
                        <option value="Solo Nature Traveler">Solo Nature Traveler</option>
                        <option value="Horton Plains Expedition">Horton Plains Expedition</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                        Rating
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 focus:outline-hidden"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= rating
                                  ? "text-[#C58E47] fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2923] mb-1">
                      Your Review / Experience *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell future guests about your stay, Susantha's hospitality, Horton Plains morning transport, or the mountain views..."
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      className="w-full bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl p-3 text-xs text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                      required
                    />
                  </div>

                  {submitError && (
                    <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE5DC]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#4F6154]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-[#243D2C] hover:bg-[#17271D] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit for Host Approval</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
