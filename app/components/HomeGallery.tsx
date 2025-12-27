"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HomeGalleryProps {
    properties: any[];
    galleryImages?: string[];
}

export default function HomeGallery({ properties = [], galleryImages = [] }: HomeGalleryProps) {
    // Only using general gallery images as per user request
    const combined = (galleryImages || []).slice(0, 6);

    // Fallback if no images are found
    if (combined.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[var(--primary)] font-bold uppercase tracking-widest text-sm mb-4 block">
                        Visual Tour
                    </span>
                    <h2 className="text-4xl md:text-5xl font-sans font-bold text-black">
                        Our Gallery
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                    {combined.map((src, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-lg overflow-hidden group ${i === 0 || i === 3 ? "md:col-span-2 md:row-span-2" : ""
                                }`}
                        >
                            <img
                                src={src}
                                alt={`Gallery Image ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/gallery" className="px-8 py-3 bg-[var(--primary)] text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                        View Full Gallery
                    </Link>
                </div>
            </div>
        </section>
    );
}
