"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK_REVIEWS = [
  {
    name: "Abhishek dhiman",
    rating: 5,
    text: "I had a fantastic experience with Prem Properties. If you're looking for a reliable property dealer in Mohali, I highly recommend the team.",
    date: "2024-09-20",
  },
  {
    name: "Himani Soni",
    rating: 5,
    text: "The location is fantastic, with easy access to local shops, restaurants, and parks, making it convenient for daily activities.",
    date: "2024-09-20",
  },
  {
    name: "Parth Mehta",
    rating: 5,
    text: "Prem Properties is hands down the best property dealer in Mohali. They understood my requirements perfectly and helped me find the right fit.",
    date: "2024-09-19",
  },
  {
    name: "Aarav Sharma",
    rating: 5,
    text: "Professional team, clear communication, and a seamless process from inquiry to final property selection. Highly recommended.",
    date: "2024-09-15",
  },
  {
    name: "Nikita Verma",
    rating: 5,
    text: "Their market knowledge and honest guidance made my decision easy. The experience was smooth and trustworthy throughout.",
    date: "2024-09-10",
  },
];

async function fetchGoogleReviews(placeId?: string, apiKey?: string) {
  if (!placeId || !apiKey) return [];

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,reviews,user_ratings_total&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error("Google reviews fetch failed:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const reviews = Array.isArray(data?.result?.reviews) ? data.result.reviews : [];

    return reviews
      .filter((review: any) => review?.text)
      .slice(0, 5)
      .map((review: any) => ({
        name: review.author_name || "Google Reviewer",
        rating: Number(review.rating || 5),
        text: review.text || "",
        date: review.time ? new Date(review.time * 1000).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      }));
  } catch (error) {
    console.error("Google reviews error:", error);
    return [];
  }
}

export default function GoogleReviews({
  placeId,
  apiKey,
  reviews,
}: {
  placeId?: string;
  apiKey?: string;
  reviews?: Array<{ name?: string; rating?: number; text?: string; date?: string; author_name?: string }>;
}) {
  const [reviewList, setReviewList] = useState<any[]>(() => {
    const normalized = Array.isArray(reviews) && reviews.length > 0
      ? reviews
          .filter((review) => review && (review.text || review.author_name || review.name))
          .map((review) => ({
            name: review.name || review.author_name || "Google Reviewer",
            rating: Number(review.rating || 5),
            text: review.text || "",
            date: review.date || new Date().toISOString().slice(0, 10),
          }))
      : FALLBACK_REVIEWS;

    return normalized;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      const fetched = await fetchGoogleReviews(placeId, apiKey);
      if (fetched.length > 0) {
        setReviewList(fetched);
      }
    };

    if (reviewList.length === FALLBACK_REVIEWS.length && (!reviews || reviews.length === 0)) {
      loadReviews();
    }
  }, [apiKey, placeId, reviews]);

  useEffect(() => {
    if (reviewList.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [reviewList.length]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector("article");
    if (!card) return;

    const offset = card.getBoundingClientRect().width + 24;
    scrollRef.current.scrollTo({
      left: activeIndex * offset,
      behavior: "smooth",
    });
  }, [activeIndex, reviewList.length]);

  const goToSlide = (direction: "prev" | "next") => {
    setActiveIndex((prev) => {
      if (direction === "prev") return (prev - 1 + reviewList.length) % reviewList.length;
      return (prev + 1) % reviewList.length;
    });
  };

  return (
    <section className="py-14 bg-[var(--background)] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-[var(--primary)] sm:text-4xl md:mb-10 md:text-6xl">
          What Our Clients Say
        </h2>

        <div className="relative">
          <div className="flex items-center justify-end gap-3 mb-4">
            <button
              type="button"
              aria-label="Previous reviews"
              onClick={() => goToSlide("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7d7d7] bg-white text-2xl text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => goToSlide("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7d7d7] bg-white text-2xl text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              ›
            </button>
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-6 min-w-max">
              {reviewList.map((review: any, index: number) => {
                const initial = (review.name || "G").charAt(0).toUpperCase();
                const stars = Array.from({ length: Math.min(5, Number(review.rating || 5)) });
                const reviewDate = review.date || "2024-09-20";

                return (
                  <article
                    key={`${review.name}-${index}`}
                    className="snap-start w-[290px] bg-white border border-[#e7e7e7] rounded-[22px] p-4 shadow-[0_3px_20px_rgba(0,0,0,0.04)] transition-all duration-300 sm:w-[340px] lg:w-[380px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${index % 3 === 0 ? "bg-[#7a3ce8] text-white" : index % 3 === 1 ? "bg-[#7cc7ef] text-[#0f172a]" : "bg-[#f7a3a3] text-[#111827]"}`}>
                        {initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-[1.6rem] font-bold text-[#1b1b1b] leading-tight truncate">{review.name}</h3>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ecf4ff] text-sm font-bold text-[#1b73e8]">
                            G
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#4b5563]">1 review • 0 photos</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3 text-[#f5b400] text-xl">
                      {stars.map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                      <span className="ml-2 text-base font-medium text-[#4b5563]">{reviewDate}</span>
                    </div>

                    <p className="mt-5 text-lg leading-8 text-[#2f2f2f]">
                      {review.text || "Excellent service and communication throughout the process."}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {reviewList.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => setActiveIndex(dotIndex)}
                aria-label={`Go to review ${dotIndex + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === dotIndex ? "w-10 bg-[var(--primary)]" : "w-2.5 bg-[#d0d0d0]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
