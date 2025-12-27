"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function FeaturedProjects({ projects: initialProjects }: { projects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [activeFilter, setActiveFilter] = useState("All");

  const [categories, setCategories] = useState<string[]>(["Residential", "Commercial"]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Properties
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propData && !propError) {
        setProjects(propData.map(p => ({ ...p, id: String(p.id) })));
      }

      // Fetch Categories from Settings
      const { data: settingsData } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "company")
        .single();

      if (settingsData?.data?.propertyConfig?.categories?.length > 0) {
        setCategories(settingsData.data.propertyConfig.categories);
      }
    };
    fetchData();
  }, []);

  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredProjects = safeProjects.filter((project) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Rent") return project.type === "Rent";
    return project.category === activeFilter;
  });

  // Limit to 3 items after filtering for the "preview" feel, or show all? 
  // Usually home page sections are previews. Let's show up to 3 or 6. 
  // Given user asked for "navigations like properties", maybe they want the interactivity.
  // I'll show up to 6 items to make it useful.
  const displayProjects = filteredProjects.slice(0, 3);

  const filters = ["All", ...categories, "Rent"];

  if (!safeProjects.length) return null;

  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-4">
              Our Projects
            </h2>
            <p className="text-gray-400 max-w-xl">
              Explore our portfolio of premium residential and commercial developments.
            </p>
          </div>
          <Link href="/properties" className="hidden md:block text-[var(--primary)] font-bold uppercase tracking-widest hover:text-white transition-colors border-b-2 border-[var(--primary)] pb-1 hover:border-white">
            View All Projects &rarr;
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeFilter === filter
                ? "bg-[var(--primary)] text-black shadow-lg scale-105"
                : "border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayProjects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <Link href={`/properties/${p.id}`} className="block h-full">
                  <div className="relative h-[300px] rounded-lg overflow-hidden bg-gray-800 mb-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 text-black text-xs font-bold uppercase tracking-wider">
                        {p.status || "For Sale"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{p.location}</p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayProjects.length === 0 && (
          <p className="text-gray-500 italic">No projects found in this category.</p>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href="/properties" className="px-8 py-3 bg-[var(--primary)] text-black font-bold uppercase tracking-wider">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
