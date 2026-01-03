"use client";

import { useEffect, useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";
import { supabase } from "../../lib/supabase";

export default function GalleryAdmin() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setError("");
            console.log("Fetching gallery images from database...");

            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (error) {
                console.error("Supabase fetch error:", error);
                throw new Error(error.message);
            }

            console.log("Database response:", data);

            if (data?.data?.galleryImages && Array.isArray(data.data.galleryImages)) {
                console.log(`Found ${data.data.galleryImages.length} gallery images`);
                setImages(data.data.galleryImages);
            } else {
                console.log("No gallery images found, starting fresh");
                setImages([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch gallery:", err);
            setError(`Failed to load gallery: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const saveGalleryToDB = async (newImages: string[]) => {
        setSaving(true);
        setStatus("Saving to database...");
        setError("");

        try {
            console.log("Saving gallery images to database:", newImages.length, "images");

            // Get current data to merge
            const { data: existing, error: fetchError } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (fetchError) {
                console.error("Fetch error:", fetchError);
                throw new Error(`Fetch failed: ${fetchError.message}`);
            }

            console.log("Current database data:", existing);

            const updatedData = {
                ...(existing?.data || {}),
                galleryImages: newImages
            };

            console.log("Updating with new data:", updatedData);

            const { data: result, error: saveError } = await supabase
                .from("site_content")
                .update({
                    data: updatedData,
                    updated_at: new Date().toISOString()
                })
                .eq("id", "company")
                .select();

            if (saveError) {
                console.error("Save error:", saveError);
                throw new Error(`Save failed: ${saveError.message}`);
            }

            console.log("Save successful:", result);

            setImages(newImages);
            setStatus(`✅ Saved ${newImages.length} images to database!`);
            setTimeout(() => setStatus(""), 5000);
        } catch (err: any) {
            console.error("Failed to save gallery:", err);
            setError(`Failed to save: ${err.message || 'Unknown error'}. Check console for details.`);
            setStatus("");
            alert(`Gallery save failed!\n\n${err.message}\n\nImages are uploaded to Cloudinary but not saved to database. Check browser console for details.`);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadSuccess = async (url: string) => {
        console.log("Single upload success:", url);
        setStatus("Processing upload...");
        const updated = [url, ...images];
        await saveGalleryToDB(updated);
    };

    const handleBulkUpload = async (urls: string[]) => {
        console.log("Bulk upload success:", urls.length, "images");
        setStatus("Processing bulk upload...");
        const updated = [...urls, ...images];
        await saveGalleryToDB(updated);
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Remove this image from the gallery?")) return;
        const updated = images.filter(i => i !== url);
        await saveGalleryToDB(updated);
    };

    const handleClearAll = async () => {
        if (!confirm(`Remove ALL ${images.length} images? This cannot be undone.`)) return;
        await saveGalleryToDB([]);
    };

    const handleManualSave = async () => {
        await saveGalleryToDB(images);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
                <p className="text-gray-600">Upload and manage images for your website gallery</p>
                <div className="flex gap-4 mt-2 text-sm">
                    <p className="text-gray-500">📊 Total: <span className="font-bold text-[var(--primary)]">{images.length}</span></p>
                    {saving && <p className="text-blue-600 font-bold animate-pulse">⏳ Saving...</p>}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    <p className="font-bold text-lg mb-2">⚠️ Error</p>
                    <p className="text-sm mb-3">{error}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchImages}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 text-sm"
                        >
                            Retry Loading
                        </button>
                        <button
                            onClick={handleManualSave}
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-sm"
                            disabled={saving}
                        >
                            Try Saving Again
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Add New Images</h2>
                        <p className="text-gray-600 text-sm">Images appear on public Gallery page</p>
                    </div>
                    <div className="flex gap-3">
                        <CloudinaryUpload
                            onUploadSuccess={handleUploadSuccess}
                            buttonText="📸 Single"
                            buttonClass="px-5 py-3 bg-gray-100 text-black font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-300"
                        />
                        <CloudinaryUpload
                            onUploadMany={handleBulkUpload}
                            multiple={true}
                            buttonText="📂 Bulk Upload"
                            buttonClass="px-5 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all shadow-md"
                        />
                        <button
                            onClick={handleManualSave}
                            disabled={saving || images.length === 0}
                            className="px-5 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Manually save current images to database"
                        >
                            💾 Save Now
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                {status && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4 font-bold border border-green-200 animate-in fade-in flex items-center gap-2">
                        <span>{status}</span>
                        {saving && <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"></div>}
                    </div>
                )}

                {/* Upload Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-bold text-blue-900 mb-2">💡 Tips:</p>
                    <ul className="text-blue-700 space-y-1 list-disc list-inside">
                        <li>Images auto-save after upload</li>
                        <li>Use "Save Now" if auto-save fails</li>
                        <li>Recommended: 1920x1080px or larger</li>
                        <li>Check browser console (F12) for error details</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Current Gallery ({images.length})</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchImages}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            disabled={loading}
                        >
                            🔄 Refresh
                        </button>
                        {images.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors text-sm border border-red-200"
                                disabled={saving}
                            >
                                🗑️ Clear All
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[var(--primary)]"></div>
                        <p className="mt-4 text-gray-500">Loading gallery...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-gray-500 font-bold mb-2">No gallery images yet</p>
                        <p className="text-gray-400 text-sm">Upload some images above to get started!</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-500 mb-4 italic bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                            💡 <strong>Important:</strong> If images disappear after refresh, click "Save Now" button above or check for errors in browser console (F12).
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {images.map((url, i) => (
                                <div key={i} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-[var(--primary)] transition-all shadow-sm hover:shadow-lg">
                                    <img
                                        src={url}
                                        alt={`Gallery ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs">
                                            <p className="font-bold">Image #{i + 1}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(url)}
                                            disabled={saving}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg hover:scale-110 transform disabled:opacity-50"
                                            title="Delete Image"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
