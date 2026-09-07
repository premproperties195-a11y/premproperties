"use client";

import { useMemo, useState } from "react";

interface ReelItem {
  url?: string;
  title?: string;
}

export default function HomeReelsPreview({ reels = [] }: { reels?: ReelItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cleanedReels = useMemo(() => {
    return (Array.isArray(reels) ? reels : [])
      .filter((reel) => reel && reel.url && reel.url.trim())
      .slice()
      .reverse()
      .slice(0, 6);
  }, [reels]);

  if (!cleanedReels.length) return null;

  const visibleCount = 3;
  const totalPages = Math.ceil(cleanedReels.length / visibleCount);
  const currentPage = Math.min(currentIndex, Math.max(0, totalPages - 1));
  const start = currentPage * visibleCount;
  const visibleReels = cleanedReels.slice(start, start + visibleCount);

  const getMediaType = (url: string) => {
    if (!url) return "unknown";
    const lower = url.toLowerCase();
    if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("youtube-nocookie.com")) return "youtube";
    if (lower.includes("instagram.com") || lower.includes("instagr.am")) return "instagram";
    return "unknown";
  };

  const getYoutubeId = (url: string) => {
    if (!url) return "";
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
      /(?:v=|shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }

    return "";
  };

  const getInstagramShortcode = (url: string) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const keywordIndex = parts.findIndex((part) => ["reel", "p", "tv"].includes(part.toLowerCase()));
      if (keywordIndex >= 0 && parts[keywordIndex + 1]) return parts[keywordIndex + 1];
    } catch {
      // ignore malformed URL, fall back to regex below
    }

    const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([^/?]+)/i);
    return match?.[1] || "";
  };

  const getEmbedUrl = (url: string) => {
    const youtubeId = getYoutubeId(url);
    if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}?rel=0`;

    const shortcode = getInstagramShortcode(url);
    if (shortcode) return `https://www.instagram.com/reel/${shortcode}/embed/`;

    return "";
  };

  const getPreviewUrl = (url: string) => {
    const youtubeId = getYoutubeId(url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    if (getInstagramShortcode(url)) {
      return "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80";
    }

    return "";
  };

  return (
    <section className="py-8 md:py-14 bg-[#f7f7f5]">
      <div className="max-w-[820px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm mb-2 block">
              Social Feed
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-black">
              Reels & Shorts
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white text-lg font-bold disabled:opacity-40 hover:bg-[var(--primary)] hover:text-black transition-colors"
              aria-label="Previous reels"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
              className="w-10 h-10 rounded-full border border-gray-300 bg-white text-lg font-bold disabled:opacity-40 hover:bg-[var(--primary)] hover:text-black transition-colors"
              aria-label="Next reels"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-3 md:gap-4 transition-transform duration-300 justify-start">
            {visibleReels.map((reel, index) => {
              const mediaType = getMediaType(reel.url || "");
              const embedUrl = getEmbedUrl(reel.url || "");
              const previewUrl = getPreviewUrl(reel.url || "");

              return (
                <div
                  key={`${reel.url}-${index}`}
                  className="min-w-0 shrink-0 w-[180px] sm:w-[200px] md:w-[220px]"
                >
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative aspect-[4/5] bg-black overflow-hidden">
                      {embedUrl && mediaType === "youtube" ? (
                        <iframe
                          src={embedUrl}
                          title={reel.title || `Media ${index + 1}`}
                          className="w-full h-full border-0"
                          loading="lazy"
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt={reel.title || "Social media preview"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5d7a6] via-[#f0f0ee] to-[#dfe7ee] text-black font-bold">
                              {mediaType === "youtube" ? "YouTube" : mediaType === "instagram" ? "Instagram" : "Video"}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                          {reel.url ? (
                            <a
                              href={reel.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 flex items-center justify-center"
                              aria-label={`Open ${reel.title || "media"}`}
                            >
                              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-black text-2xl shadow-lg">
                                ▶
                              </span>
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>

                    <div className="px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-1">
                        {mediaType === "youtube" ? "YouTube Short" : mediaType === "instagram" ? "Instagram Reel" : "Video"}
                      </p>
                      <p className="text-sm font-bold text-gray-800 line-clamp-2">
                        {reel.title || "Featured media"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
