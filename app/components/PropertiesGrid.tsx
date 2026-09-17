"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

const normalizeFilterKey = (value: string | null | undefined) => {
    if (!value) return "";
    return String(value)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
};

const buildCategoryMatches = (value: string | null | undefined) => {
    const raw = normalizeFilterKey(value);
    if (!raw) return new Set<string>();

    const variants = new Set<string>([raw]);
    const compact = raw.replace(/\s+(plots?|houses?|apartments?|villas?|commercial|residential|land|agriculture|agricultural|farmland)$/, "");
    if (compact && compact !== raw) variants.add(compact);

    const aliases: Record<string, string[]> = {
        "agriculture land": ["agricultural land", "farm land", "farmland", "agri land"],
        "land": ["plots", "plot", "agriculture land", "agricultural land", "farm land", "farmland", "agri land"],
        "residential": ["residential plots", "plots", "residential plot"],
        "commercial": ["commercial plots", "commercial property", "commercial properties", "business property"],
        "villa": ["villas", "villa"],
    };

    Object.entries(aliases).forEach(([key, list]) => {
        if (raw.includes(key) || list.some((alias) => raw.includes(alias))) {
            variants.add(key);
            list.forEach((alias) => variants.add(alias.replace(/\s+/g, " ")));
        }
    });

    if (raw.includes(" and ")) {
        variants.add(raw.replace(/\s+and\s+/g, " "));
    }

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
        return Array.from(variants).some((variant) => variant === filterKey || filterKey.includes(variant) || variant.includes(filterKey));
    });
};

export default function PropertiesGrid({ properties: initialProperties }: { properties: any[] }) {
    const [properties, setProperties] = useState<any[]>(Array.isArray(initialProperties) ? initialProperties : []);
    const [activeFilter, setActiveFilter] = useState("All");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: propData, error: propError } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            const normalizedProperties = Array.isArray(propData) ? propData.map((p: any) => ({ ...p, id: String(p.id) })) : [];

            if (normalizedProperties.length || !propError) {
                setProperties(normalizedProperties);
            }

            const derivedCategories = Array.from(
                new Set(
                    normalizedProperties
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

        if (!Array.isArray(initialProperties) || initialProperties.length === 0) {
            fetchData();
        }
    }, [initialProperties]);

    const safeProperties = Array.isArray(properties) ? properties : [];

    const filteredProperties = useMemo(() => {
        return safeProperties.filter((project) => matchesFilter(project, activeFilter));
    }, [safeProperties, activeFilter]);

    const filters = useMemo(() => {
        const configuredFilters = Array.isArray(categories) ? categories.filter(Boolean) : [];
        return Array.from(new Set(["All", ...configuredFilters, "Rent"]))
            .filter((filter) => typeof filter === "string" && filter.trim().length > 0);
    }, [categories]);

    return (
        <section className="px-4 py-14 sm:px-6 md:py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap justify-center gap-3 sm:gap-4 sm:mb-12">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeFilter === filter
                                ? "bg-black text-white shadow-lg scale-105"
                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
                        <p className="text-xl font-bold text-gray-700">No properties found</p>
                        <p className="mt-2 text-sm text-gray-500">Try another category or switch back to All.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link href={`/properties/${project.id}`} className="group block h-full">
                                        <article className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden h-full flex flex-col">
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black rounded-sm shadow-sm">
                                                    {project.status}
                                                </div>
                                                <div className="absolute bottom-4 right-4 bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white rounded-sm shadow-sm">
                                                    {project.type}
                                                </div>
                                            </div>

                                            <div className="p-6 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-4">{project.location}</p>

                                                    <div className="flex gap-4 text-sm text-gray-600 mb-6">
                                                        {project.specs?.beds && <span>{project.specs.beds} Beds</span>}
                                                        {project.specs?.area && <span>• {project.specs.area}</span>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                                    <span className="text-lg font-bold text-[var(--primary-dark)]">
                                                        {project.price}
                                                    </span>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                                                        View Details &rarr;
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
}
