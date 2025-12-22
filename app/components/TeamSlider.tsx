"use client";

import { motion } from "framer-motion";
import companyData from "../data/company.json";

export default function TeamSlider() {
  const team = companyData.team || [];

  if (!team.length) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The visionaries behind our landmark developments.
          </p>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
          {team.map((member, i) => (
            <div
              key={member.id || i}
              className="flex-shrink-0 w-[280px] snap-center group"
            >
              <div className="relative h-[380px] rounded-sm overflow-hidden mb-4 bg-gray-800">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="text-white text-xl font-bold">{member.name}</p>
                  <p className="text-[var(--primary)] text-sm uppercase tracking-wider mt-1">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
