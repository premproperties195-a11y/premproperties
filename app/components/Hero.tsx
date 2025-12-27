"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Hero({ banner: initialBanner }: { banner?: any }) {
  const [banner, setBanner] = useState(initialBanner);

  useEffect(() => {
    const fetchLive = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'company')
        .single();

      if (data && !error) {
        setBanner(data.data.banners.home);
      }
    };
    fetchLive();
  }, []);
  // Use banner from settings or fallback to default
  const defaultBanner = {
    type: "video",
    url: "https://videos.pexels.com/video-files/5752729/5752729-hd_1920_1080_25fps.mp4",
    title: "Find Your Dream Home",
    subtitle: "Luxury properties in prime locations"
  };

  const currentBanner = banner || defaultBanner;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* BACKGROUND */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key="hero-slide"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Lighter overlay for clarity */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          {currentBanner.type === "video" ? (
            <video
              src={currentBanner.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentBanner.url}
              alt={currentBanner.title || "Luxury Home"}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <motion.div
          key={currentBanner.title + "-text"}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {currentBanner.tags && (
            <div className="flex gap-2 justify-center mb-6">
              {currentBanner.tags.split(",").map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h1
            className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight"
            style={{ color: currentBanner.titleColor || "#FFFFFF" }}
          >
            {currentBanner.title}
          </h1>
          {currentBanner.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
              {currentBanner.subtitle}
            </p>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <a
            href="#projects"
            className="inline-block px-12 py-4 bg-[var(--primary)] text-black font-bold text-lg rounded-sm hover:bg-white hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 uppercase tracking-widest"
          >
            Explore Projects
          </a>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-[10px] uppercase tracking-widest text-white/80">Scroll</div>
        <div className="w-[1px] h-12 bg-white/50" />
      </div>
    </section>
  );
}
