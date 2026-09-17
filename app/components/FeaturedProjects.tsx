"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const normalizeFilterKey = (value: string | null | undefined) => {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const buildCategoryMatches = (value: string | null | undefined) => {
  const raw = normalizeFilterKey(value);
  if (!raw) return new Set<string>();

  const variants = new Set<string>([raw]);
  const compact = raw.replace(/\s+(plots?|houses?|apartments?|villas?|commercial|residential|land|agriculture|agricultural|farmland)$/, "");
  if (compact && compact !== raw) variants.add(compact);

  const aliasGroups: Record<string, string[]> = {
    "agriculture land": ["agricultural land", "farm land", "farmland", "agri land", "agricultural lands", "farm lands"],
    "land": ["plots", "plot", "agriculture land", "agricultural land", "farm land", "farmland", "agri land"],
    "residential plots": ["residential plot", "plots", "plot"],
    "flats and apartments": ["flat and apartment", "flats", "apartment", "apartments", "flat", "apartment homes"],
    "villas": ["villa"],
    "commercial properties": ["commercial property", "commercial plots", "commercial plot", "commercial"],
    "independent houses": ["independent house", "independent homes", "independent home"],
    "residential": ["residential plots", "residential plot", "plots", "plot"],
    "commercial": ["commercial plots", "commercial plot", "commercial property", "commercial properties"],
  };

  Object.entries(aliasGroups).forEach(([key, list]) => {
    if (raw.includes(key) || list.some((alias) => raw.includes(alias))) {
      variants.add(key);
      list.forEach((alias) => variants.add(normalizeFilterKey(alias)));
    }
  });

  if (raw.includes(" and ")) {
    variants.add(raw.replace(/\s+and\s+/g, " "));
  }

  const singularized = new Set<string>();
  Array.from(variants).forEach((item) => {
    singularized.add(item);
    if (item.endsWith("ies") && item.length > 4) singularized.add(item.slice(0, -3) + "y");
    if (item.endsWith("ses") && item.length > 4) singularized.add(item.slice(0, -2));
    if (item.endsWith("s") && item.length > 3) singularized.add(item.slice(0, -1));
  });

  Array.from(singularized).forEach((item) => variants.add(item));

  return variants;
};

const matchesFilter = (project: any, filter: string) => {
  if (filter === "All") return true;

  if (filter === "Rent") {
    return normalizeFilterKey(project?.type) === "rent" || normalizeFilterKey(project?.listing_type) === "rent";
  }

  const filterKey = normalizeFilterKey(filter);
  if (!filterKey) return false;

  const candidateValues = [
    project?.category,
    project?.property_type,
    project?.listing_type,
    project?.type,
    project?.title,
    project?.location,
  ];

  return candidateValues.some((value) => {
    const variants = buildCategoryMatches(value);
    return Array.from(variants).some((variant) => {
      if (!variant) return false;
      return variant === filterKey || filterKey.includes(variant) || variant.includes(filterKey);
    });
  });
};

export default function FeaturedProjects({ projects: initialProjects }: { projects: any[] }) {
  const [projects, setProjects] = useState<any[]>(Array.isArray(initialProjects) ? initialProjects : []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const nextProps = Array.isArray(initialProjects) && initialProjects.length > 0
        ? initialProjects.map((p: any) => ({ ...p, id: String(p.id) }))
        : [];

      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      const normalizedProjects = Array.isArray(propData) && propData.length > 0
        ? propData.map((p: any) => ({ ...p, id: String(p.id) }))
        : nextProps;

      if (normalizedProjects.length) {
        setProjects(normalizedProjects);
      }

      const derivedCategories = Array.from(
        new Set(
          normalizedProjects
            .map((p: any) => p.category || p.property_type || p.type)
            .filter((value: string | undefined) => typeof value === "string" && value.trim().length > 0)
            .map((value: string) => value.trim())
        )
      );

      const { data: settingsData } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "company")
        .single();

      const configuredCategories = settingsData?.data?.propertyConfig?.categories;
      const nextCategories = Array.isArray(configuredCategories) && configuredCategories.some(Boolean)
        ? Array.from(new Set(configuredCategories.map((item: string) => String(item).trim()).filter(Boolean)))
        : derivedCategories;

      setCategories(nextCategories);
    };

    fetchData();
  }, [initialProjects]);

  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredProjects = useMemo(() => {
    return safeProjects.filter((project) => matchesFilter(project, activeFilter));
  }, [safeProjects, activeFilter]);

  const displayProjects = filteredProjects.slice(0, 3);

  const filters = useMemo(() => {
    const configuredFilters = Array.isArray(categories) ? categories.filter(Boolean) : [];
    return Array.from(new Set(["All", ...configuredFilters, "Rent"]))
      .filter((filter) => typeof filter === "string" && filter.trim().length > 0);
  }, [categories]);

  if (!safeProjects.length) return null;

  return (
    <section id="projects" className="py-14 bg-[#0a0a0a] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-sans font-bold text-white sm:text-4xl md:text-5xl">
              Our Projects
            </h2>
            <p className="max-w-xl text-sm text-gray-400 sm:text-base">
              Explore our portfolio of premium residential and commercial developments.
            </p>
          </div>
          <Link href="/properties" className="hidden md:block text-[var(--primary)] font-bold uppercase tracking-widest hover:text-white transition-colors border-b-2 border-[var(--primary)] pb-1 hover:border-white">
            View All Projects &rarr;
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
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

        {displayProjects.length === 0 ? (
          <p className="text-gray-500 italic">No projects found in this category.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
