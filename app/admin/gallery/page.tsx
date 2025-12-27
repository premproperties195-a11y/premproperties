"use client";

import { useEffect, useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";
import { supabase } from "../../lib/supabase";

export default function GalleryAdmin() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (error) throw error;
            if (data?.data?.galleryImages) {
                setImages(data.data.galleryImages);
            }
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    const saveGalleryToDB = async (newImages: string[]) => {
        setStatus("Saving gallery...");
        try {
            // Get current data to merge
            const { data: existing } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            const updatedData = {
                ...(existing?.data || {}),
                galleryImages: newImages
            };

            const { error } = await supabase
                .from("site_content")
                .upsert({ id: "company", data: updatedData, updated_at: new Date().toISOString() });

            if (error) throw error;
            setImages(newImages);
            setStatus("Gallery updated successfully!");
            setTimeout(() => setStatus(""), 3000);
        } catch (err) {
            console.error("Failed to save gallery:", err);
            alert("Failed to save gallery changes to database.");
        }
    };

    const handleUploadSuccess = async (url: string) => {
        const updated = [url, ...images];
        await saveGalleryToDB(updated);
    };

    const handleBulkUpload = async (urls: string[]) => {
        const updated = [...urls, ...images];
        await saveGalleryToDB(updated);
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Remove this image from the gallery?")) return;
        const updated = images.filter(i => i !== url);
        await saveGalleryToDB(updated);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
                <p className="text-gray-600">Upload and manage general images for your website gallery</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Add New Images</h2>
                        <p className="text-gray-600 text-sm italic">These images will appear on the public Gallery page</p>
                    </div>
                    <div className="flex gap-4">
                        <CloudinaryUpload
                            onUploadSuccess={handleUploadSuccess}
                            buttonText="📸 Single Upload"
                            buttonClass="px-6 py-3 bg-gray-100 text-black font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200"
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
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4 font-bold border border-green-100">
                        ✅ {status}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold mb-6">Current Gallery</h2>
                {loading ? (
                    <p>Loading gallery...</p>
                ) : images.length === 0 ? (
                    <p className="text-gray-400 italic">No gallery images found. Upload some to get started!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((url, i) => (
                            <div key={i} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(url)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="Delete Image"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
