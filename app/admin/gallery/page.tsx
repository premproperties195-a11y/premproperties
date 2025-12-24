"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CloudinaryUpload from "../../components/CloudinaryUpload";

export default function GalleryAdmin() {
    const [generalImages, setGeneralImages] = useState<any[]>([]);
    const [propertyImages, setPropertyImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<'general' | 'property'>('general');
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setGeneralImages(data.general || []);
            setPropertyImages(data.properties || []);
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveGallery = async (newImages: string[]) => {
        setStatus("Saving changes...");
        try {
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images: newImages }),
            });

            if (!res.ok) throw new Error("Failed to save");

            setGeneralImages(newImages.map(url => ({ url, type: 'general' })));
            setStatus("Gallery updated!");
            setTimeout(() => setStatus(""), 3000);
        } catch (err) {
            console.error("Failed to save gallery:", err);
            alert("Failed to save gallery changes.");
            setStatus("");
        }
    };

    const handleUploadSuccess = async (url: string) => {
        const currentUrls = generalImages.map(img => img.url);
        const updated = [url, ...currentUrls];
        await saveGallery(updated);
    };

    const handleBulkUpload = async (urls: string[]) => {
        const currentUrls = generalImages.map(img => img.url);
        const updated = [...urls, ...currentUrls];
        await saveGallery(updated);
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Remove this image from the general gallery?")) return;
        const currentUrls = generalImages.map(img => img.url);
        const updated = currentUrls.filter(u => u !== url);
        await saveGallery(updated);
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery & Media</h1>
                <p className="text-gray-600">Overview of all visual assets across the website</p>
            </div>

            {/* View Switcher */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveView('general')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'general' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                >
                    General Gallery ({generalImages.length})
                </button>
                <button
                    onClick={() => setActiveView('property')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'property' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                >
                    Property Photos ({propertyImages.length})
                </button>
            </div>

            {activeView === 'general' ? (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                            <div>
                                <h2 className="text-xl font-bold">Add General Images</h2>
                                <p className="text-gray-600 text-sm italic">These images appear on the main website gallery page.</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <CloudinaryUpload
                                    onUploadSuccess={handleUploadSuccess}
                                    buttonText="📸 Single"
                                    buttonClass="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-black font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200"
                                />
                                <CloudinaryUpload
                                    onUploadMany={handleBulkUpload}
                                    multiple={true}
                                    buttonText="📂 Bulk Upload"
                                    buttonClass="px-6 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
                                />
                            </div>
                        </div>
                        {status && (
                            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4 font-bold border border-green-100 animate-pulse">
                                ⌛ {status}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        {loading ? (
                            <div className="flex flex-col items-center py-12 text-gray-400">
                                <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p>Loading...</p>
                            </div>
                        ) : generalImages.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 italic">No general gallery images found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {generalImages.map((img, i) => (
                                    <div key={i} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 transition-all hover:ring-2 hover:ring-[var(--primary)]">
                                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleDelete(img.url)}
                                                className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all shadow-lg transform hover:scale-110"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Property Catalog Photos</h2>
                        <p className="text-gray-500 text-sm">These photos are linked to specific properties. To edit or delete them, please visit the <Link href="/admin/properties" className="text-[var(--primary)] hover:underline font-bold">Properties Management</Link> section.</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {propertyImages.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                    <img src={img.url} alt={img.propertyTitle} className="w-full h-full object-cover" />

                                    {img.isMain && (
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--primary)] text-black text-[10px] font-bold rounded shadow-sm">
                                            MAIN
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                        <div className="text-white text-xs font-bold mb-3 line-clamp-2">
                                            {img.propertyTitle}
                                        </div>
                                        <Link
                                            href={`/admin/properties/${img.propertyId}`}
                                            className="px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-[var(--primary)] transition-colors"
                                        >
                                            Edit Property
                                        </Link>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-[10px] font-bold truncate group-hover:hidden">
                                        {img.propertyTitle}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
