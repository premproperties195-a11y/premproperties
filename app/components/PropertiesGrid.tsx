"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function PropertiesGrid({ properties: initialProperties }: { properties: any[] }) {
    const [properties, setProperties] = useState(initialProperties);
    const [activeFilter, setActiveFilter] = useState("All");

    const [categories, setCategories] = useState<string[]>(["Residential", "Commercial"]);

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) return;
            // Fetch Properties
            const { data: propData, error: propError } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (propData && !propError) {
                setProperties(propData.map(p => ({ ...p, id: String(p.id) })));
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

    const filteredProperties = properties.filter((project) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Rent") return project.type === "Rent";
        // Flexible category matching
        return project.category === activeFilter;
    });

    const filters = ["All", ...categories, "Rent"];

    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
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

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                                        {/* Image */}
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

                                        {/* Content */}
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
            </div>
        </section>
    );
}
