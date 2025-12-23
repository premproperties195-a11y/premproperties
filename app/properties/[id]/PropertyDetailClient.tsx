"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import PropertyEnquiry from "../../components/PropertyEnquiry";
import { supabase } from "../../lib/supabase";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("../../components/PropertyMap"), {
    ssr: false,
    loading: () => <div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function PropertyDetailClient({ initialProperty }: { initialProperty: any }) {
    const [property, setProperty] = useState(initialProperty);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Unified parsing helper to handle JSON strings, Postgres arrays, and actual arrays
    const parseArray = (val: any): string[] => {
        if (!val) return [];

        // If it's already an array, check if items are strings or objects with urls
        if (Array.isArray(val)) {
            return val.map(item => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') {
                    return item.url || item.secure_url || item.link || JSON.stringify(item);
                }
                return String(item);
            }).filter(s => s && s.trim() !== "");
        }

        if (typeof val === 'string') {
            const trimmed = val.trim();
            if (!trimmed) return [];

            // Handle JSON array
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    return parseArray(parsed); // Recurse to handle object items
                } catch (e) { }
            }
            // Handle Postgres array format {item1,item2}
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                return trimmed.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
            }
            // Handle comma-separated list
            if (trimmed.includes(',') && !trimmed.startsWith('http')) {
                return trimmed.split(',').map(s => s.trim());
            }
            // Single item string
            return [trimmed];
        }

        // If it's an object but not an array (e.g. single JSONB object)
        if (typeof val === 'object') {
            const url = val.url || val.secure_url || val.link;
            return url ? [url] : [];
        }

        return [];
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check member session
                const memberRes = await fetch("/api/member/session");
                const memberData = await memberRes.json();
                const authenticated = !!memberData.authenticated;
                setIsMember(authenticated);
                console.log("DEBUG: Member authenticated status:", authenticated, memberData);

                // Check admin session (from cookies)
                const isAdminSession = document.cookie.split('; ').some(row => row.startsWith('admin-session='));
                setIsAdmin(isAdminSession);
                console.log("DEBUG: Admin session status:", isAdminSession);
            } catch (e) {
                console.error("Auth check failed:", e);
                setIsMember(false);
                setIsAdmin(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchLive = async () => {
            if (!initialProperty?.id) return;

            // Try fetching with both string and number ID just in case
            const propertyId = isNaN(Number(initialProperty.id)) ? initialProperty.id : Number(initialProperty.id);

            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', propertyId)
                .single();

            if (data && !error) {
                console.log("DEBUG: Live property data fetched:", data);
                setProperty({
                    ...data,
                    id: String(data.id),
                });
            } else if (error) {
                console.error("DEBUG: Live fetch error:", error);
            }
        };
        fetchLive();
    }, [initialProperty.id]);

    const docs = parseArray(property?.documents);
    const galleryImages = parseArray(property?.images);

    console.log("DEBUG: Render state - isMember:", isMember, "isAdmin:", isAdmin, "docsCount:", docs.length, "rawDocs:", property?.documents);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Image */}
            <section className="relative h-[60vh] md:h-[70vh] w-full">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto text-white">
                        <span className="px-3 py-1 bg-[var(--primary)] text-black text-xs font-bold uppercase rounded-sm mb-3 inline-block">
                            {property.status}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-2 shadow-sm">{property.title}</h1>
                        <p className="text-xl opacity-90">{property.location}</p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Property Documents - Member Only (Admins can also see) - TOP PRIORITY VISIBILITY */}
                    {(isMember || isAdmin) && (
                        <div id="property-documents-section" className="p-8 bg-green-50 border-2 border-green-200 rounded-2xl shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-4 py-1 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-lg animate-pulse">
                                Authenticated Member Access
                            </div>
                            <h2 className="text-3xl font-serif font-bold mb-6 flex items-center gap-3 text-green-900">
                                📑 Verified Property Documents
                            </h2>
                            {docs.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {docs.map((doc: string, i: number) => (
                                        <a
                                            key={i}
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-5 bg-white hover:bg-green-100 rounded-xl border border-green-100 transition-all group hover:scale-[1.03] shadow-sm cursor-pointer"
                                        >
                                            <div className="w-14 h-14 flex-shrink-0 bg-green-50 rounded-lg overflow-hidden flex items-center justify-center border border-green-200">
                                                {doc.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i) ? (
                                                    <img src={doc} className="w-full h-full object-cover" alt="Preview" />
                                                ) : (
                                                    <span className="text-4xl text-green-600 font-bold">📄</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-gray-900 truncate">Official Record {i + 1}</p>
                                                <p className="text-[10px] text-green-700 uppercase font-black tracking-widest mt-1">Legally Verified Document</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shadow-inner">
                                                &darr;
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-green-200 rounded-xl bg-white/50">
                                    <p className="text-green-800 font-bold text-lg mb-2">No documents available yet</p>
                                    <p className="text-green-600/70 text-sm">Our team is currently verifying and uploading the original papers for this property.</p>
                                </div>
                            )}
                            {console.log("DEBUG: Rendering Documents section. Count:", docs.length)}
                        </div>
                    )}

                    {!isMember && !isAdmin && docs.length > 0 && (
                        <div className="p-10 bg-gray-900 border-2 border-[var(--primary)] rounded-3xl text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] opacity-10 rounded-full blur-3xl"></div>
                            <span className="text-5xl mb-6 block drop-shadow-lg">🔒</span>
                            <h3 className="text-2xl font-bold text-white mb-3">Premium Member Content</h3>
                            <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">View original papers, survey reports, and official documentation for this premium property.</p>
                            <Link href="/login" className="px-10 py-4 bg-[var(--primary)] text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-white hover:scale-110 transition-all inline-block shadow-[0_0_20px_rgba(255,166,0,0.3)]">
                                Login to Access Papers
                            </Link>
                        </div>
                    )}

                    {/* Key Specs */}
                    <div className="grid grid-cols-3 gap-4 p-6 bg-gray-900 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Price</p>
                            <p className="text-xl md:text-2xl font-bold text-[var(--primary)]">{property.price}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Type</p>
                            <p className="text-xl font-bold text-white">{property.category}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Area</p>
                            <p className="text-xl font-bold text-white">{property.specs?.area}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">About the Property</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                            {property.amenities?.map((amenity: string) => (
                                <div key={amenity} className="flex items-center gap-2 text-gray-700">
                                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {galleryImages.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {galleryImages.map((img: string, i: number) => (
                                    <img key={i} src={img} alt="Gallery" className="rounded-lg hover:opacity-90 transition-opacity cursor-pointer aspect-video object-cover shadow-md" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Form */}
                <div>
                    <PropertyEnquiry propertyTitle={property.title} initialViews={500} />
                </div>
            </div>

            {/* LOCATION MAP */}
            <section className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8">Property Location</h2>
                    <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        <PropertyMap
                            lat={property.latitude}
                            lng={property.longitude}
                            address={property.map_address || property.location}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
