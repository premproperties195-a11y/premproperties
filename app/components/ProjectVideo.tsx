"use client";

import { motion } from "framer-motion";

export default function ProjectVideo({ src }: { src?: string }) {
    // Use a nice placeholder if no src is provided
    const videoSrc = src || "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-modern-city-skyline-at-sunset-1002-large.mp4";

    return (
        <div className="relative w-full h-full bg-black">
            <video
                className="w-full h-full object-cover opacity-100"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
        </div>
    );
}
