"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import CloudinaryUpload from "../../../components/CloudinaryUpload";
import { supabase } from "../../../lib/supabase";

const MapPicker = dynamic(() => import("../../../components/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[350px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map Picker...</div>
});

export default function PropertyEditClient({ id }: { id: string }) {
    const router = useRouter();
    const isNew = id === "new";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        type: "Buy",
        category: "Residential",
        status: "Available",
        image: "",
        images: [""],
        description: "",
        amenities: [""],
        specs: {
            area: "",
            beds: 0,
            baths: 0,
        },
        views: 0,
        map_address: "",
        latitude: null as number | null,
        longitude: null as number | null,
        rent_frequency: "Month",
        documents: [] as string[], // New field for original papers
    });
    const [categories, setCategories] = useState<string[]>(["Residential", "Commercial", "Villa", "Land"]);

    useEffect(() => {
        fetchSettings();
        if (!isNew) {
            fetchProperty();
        }
    }, [id]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (data && !error) {
                if (data.data.propertyConfig?.categories?.length > 0) {
                    setCategories(data.data.propertyConfig.categories);
                }
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProperty = async () => {
        try {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            // Defensive parsing for arrays
            const parseArray = (val: any) => {
                if (Array.isArray(val)) return val;
                if (typeof val === 'string' && val.trim() !== '') {
                    try {
                        const parsed = JSON.parse(val);
                        if (Array.isArray(parsed)) return parsed;
                    } catch (e) {
                        if (val.startsWith('{') && val.endsWith('}')) {
                            return val.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
                        }
                    }
                }
                return [];
            };

            // Ensure all fields have valid defaults to avoid "value should not be null" warnings
            const sanitizedData = {
                ...data,
                title: data.title || "",
                location: data.location || "",
                price: data.price || "",
                type: data.type || "Buy",
                category: data.category || "Residential",
                status: data.status || "Available",
                image: data.image || "",
                description: data.description || "",
                map_address: data.map_address || "",
                rent_frequency: data.rent_frequency || "Month",
                images: parseArray(data.images),
                amenities: parseArray(data.amenities),
                documents: parseArray(data.documents),
                specs: {
                    area: data.specs?.area || "",
                    beds: data.specs?.beds || 0,
                    baths: data.specs?.baths || 0,
                },
                latitude: data.latitude ?? null,
                longitude: data.longitude ?? null,
            };

            setFormData(sanitizedData);
        } catch (error) {
            console.error("Error fetching property:", error);
            alert("Failed to load property from database");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = { ...formData };
            delete (payload as any).created_at; // Don't manually update created_at
            delete (payload as any).id; // ID should managed by database or provided in the .eq() clause

            // Clean up empty strings in arrays before saving
            if (Array.isArray(payload.images)) {
                payload.images = payload.images.filter(img => img && img.trim() !== "");
            }
            if (Array.isArray(payload.amenities)) {
                payload.amenities = payload.amenities.filter(a => a && a.trim() !== "");
            }
            if (Array.isArray(payload.documents)) {
                payload.documents = payload.documents.filter(d => d && d.trim() !== "");
            }

            console.log("Saving Property Payload:", payload);

            let result;
            if (isNew) {
                result = await supabase.from("properties").insert([payload]).select();
            } else {
                result = await supabase.from("properties").update(payload).eq("id", id).select();
            }

            if (result.error) {
                console.group("Supabase Save Error Details");
                console.error("Message:", result.error.message);
                console.error("Details:", result.error.details);
                console.error("Hint:", result.error.hint);
                console.error("Code:", result.error.code);
                console.groupEnd();

                alert(`Save Failed!\n\nReason: ${result.error.message}\nDetails: ${result.error.details || 'None'}\nHint: ${result.error.hint || 'None'}`);
                throw result.error;
            }

            router.push("/admin/properties/");
        } catch (error: any) {
            console.error("Full Save Error Context:", error);
            if (!error.message?.includes("Save Failed")) {
                alert("Error saving property. This usually means a column is missing or a value is the wrong type. Check the browser console for the 'Saving Property Payload' and the error details.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: string) => {
        const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
        setFormData({
            ...formData,
            [field]: [...currentArray, ""],
        });
    };

    const removeArrayItem = (field: string, index: number) => {
        const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
        const newArray = currentArray.filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <Link href="/admin/properties" className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Back to Properties
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isNew ? "Add New Property" : "Edit Property"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {formData.type === "Buy" ? "Price *" : "Rent/Lease Amount *"}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder={formData.type === "Buy" ? "₹ 4.5 Cr" : "₹ 50,000"}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                required
                            />
                            {(formData.type === "Rent" || formData.type === "Lease") && (
                                <select
                                    value={formData.rent_frequency}
                                    onChange={(e) => setFormData({ ...formData, rent_frequency: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none bg-gray-50 font-bold"
                                >
                                    <option value="Month">/ Month</option>
                                    <option value="Year">/ Year</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        >
                            <option value="Buy">Buy</option>
                            <option value="Rent">Rent</option>
                            <option value="Lease">Lease</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status *</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        >
                            <option value="Available">Available</option>
                            <option value="Ready to Move">Ready to Move</option>
                            <option value="Under Construction">Under Construction</option>
                            <option value="New Launch">New Launch</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Main Image URL *</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                required
                            />
                            <CloudinaryUpload
                                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                buttonText="📸 Upload"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Map Address</label>
                        <input
                            type="text"
                            value={formData.map_address}
                            onChange={(e) => setFormData({ ...formData, map_address: e.target.value })}
                            placeholder="Full address for Google Maps"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none mb-4"
                        />
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-sm font-bold text-gray-700 mb-3">📍 Pin Exact Location</label>
                            <MapPicker
                                lat={formData.latitude}
                                lng={formData.longitude}
                                onChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Gallery Images */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gallery Images</label>
                        {formData.images.map((img, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={img}
                                    onChange={(e) => handleArrayChange("images", index, e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                />
                                <CloudinaryUpload
                                    onUploadSuccess={(url) => handleArrayChange("images", index, url)}
                                    buttonText="📸"
                                    buttonClass="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem("images", index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => addArrayItem("images")}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                            >
                                + Add Empty Row
                            </button>
                            <CloudinaryUpload
                                onUploadMany={(urls) => {
                                    const currentImages = formData.images.filter(img => img.trim() !== "");
                                    setFormData({ ...formData, images: [...currentImages, ...urls] });
                                }}
                                multiple={true}
                                buttonText="📂 Bulk Upload From Device"
                                buttonClass="px-4 py-2 bg-[var(--primary)] text-black rounded-lg hover:opacity-90 font-bold flex items-center gap-2"
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Amenities</label>
                        {formData.amenities.map((amenity, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={amenity}
                                    onChange={(e) => handleArrayChange("amenities", index, e.target.value)}
                                    placeholder="Swimming Pool"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem("amenities", index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem("amenities")}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                        >
                            + Add Amenity
                        </button>
                    </div>

                    {/* Specs */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Area</label>
                        <input
                            type="text"
                            value={formData.specs.area}
                            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, area: e.target.value } })}
                            placeholder="4500 Sq. Ft."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
                        <input
                            type="number"
                            value={formData.specs.beds}
                            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, beds: parseInt(e.target.value) || 0 } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bathrooms</label>
                        <input
                            type="number"
                            value={formData.specs.baths}
                            onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, baths: parseInt(e.target.value) || 0 } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Property Documents */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Original Papers / Documents (Member Only)</label>
                        <p className="text-xs text-gray-500 mb-4 italic">These documents will only be visible to logged-in members on the website.</p>
                        {formData.documents?.map((doc, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={doc}
                                    onChange={(e) => handleArrayChange("documents", index, e.target.value)}
                                    placeholder="https://... (PDF or Image URL)"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                                />
                                <CloudinaryUpload
                                    onUploadSuccess={(url) => handleArrayChange("documents", index, url)}
                                    buttonText="📄"
                                    buttonClass="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    resourceType="raw"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem("documents", index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="flex gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => addArrayItem("documents")}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold text-sm"
                            >
                                + Add Empty Row
                            </button>
                            <CloudinaryUpload
                                onUploadMany={(urls) => {
                                    const currentDocs = (formData.documents || []).filter(doc => doc.trim() !== "");
                                    setFormData({ ...formData, documents: [...currentDocs, ...urls] });
                                }}
                                multiple={true}
                                resourceType="raw"
                                buttonText="📂 Bulk Upload Documents"
                                buttonClass="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-bold text-sm flex items-center gap-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Property"}
                    </button>
                    <Link
                        href="/admin/properties"
                        className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
