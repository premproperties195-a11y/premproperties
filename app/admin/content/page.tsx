"use client";

import { useEffect, useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";
import { supabase } from "../../lib/supabase";

export default function ContentAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<any>({
        company: {
            name: "",
            tagline: "",
            aboutShort: "",
            aboutLong: "",
            vision: "",
            mission: "",
            aboutImage: "",
            reels: [{ url: "", title: "" }],
            stats: [
                { label: "", value: "" },
                { label: "", value: "" },
                { label: "", value: "" },
            ],
        },
        contact: {
            phone: "",
            email: "",
            address: "",
            whatsapp: "",
        },
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (error) throw error;
            if (data) {
                setContent(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch content:", error);
        } finally {
            setLoading(false);
        }
    };

    const addReel = () => {
        const currentReels = Array.isArray(content.company?.reels) ? content.company.reels : [];
        const updatedReels = [{ url: "", title: "" }, ...currentReels];
        setContent({
            ...content,
            company: { ...content.company, reels: updatedReels }
        });
    };

    const updateReel = (index: number, field: string, value: string) => {
        const currentReels = Array.isArray(content.company?.reels) ? content.company.reels : [];
        const updatedReels = [...currentReels];
        updatedReels[index] = { ...updatedReels[index], [field]: value };
        setContent({
            ...content,
            company: { ...content.company, reels: updatedReels }
        });
    };

    const removeReel = (index: number) => {
        const currentReels = Array.isArray(content.company?.reels) ? content.company.reels : [];
        const updatedReels = currentReels.filter((_: any, i: number) => i !== index);
        setContent({
            ...content,
            company: { ...content.company, reels: updatedReels.length ? updatedReels : [{ url: "", title: "" }] }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Get existing data first to merge
            const { data: existing } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            const updatedData = {
                ...(existing?.data || {}),
                ...content
            };

            const { error } = await supabase
                .from("site_content")
                .upsert({ id: "company", data: updatedData, updated_at: new Date().toISOString() });

            if (error) throw error;
            alert("Content updated successfully!");
        } catch (error) {
            console.error("Error updating content:", error);
            alert("Error updating content");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
                <p className="text-gray-600">Edit company information and contact details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6">Company Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                value={content.company?.name || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, name: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                            <input
                                type="text"
                                value={content.company?.tagline || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, tagline: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                            <textarea
                                value={content.company?.aboutShort || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, aboutShort: e.target.value }
                                })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Description</label>
                            <textarea
                                value={content.company?.aboutLong || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, aboutLong: e.target.value }
                                })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mission</label>
                            <textarea
                                value={content.company?.mission || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, mission: e.target.value }
                                })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Vision</label>
                            <textarea
                                value={content.company?.vision || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    company: { ...content.company, vision: e.target.value }
                                })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">About Section Image</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="url"
                                    value={content.company?.aboutImage || ""}
                                    onChange={(e) => setContent({
                                        ...content,
                                        company: { ...content.company, aboutImage: e.target.value }
                                    })}
                                    placeholder="https://example.com/about-image.jpg"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                                <div className="shrink-0">
                                    <CloudinaryUpload
                                        onUploadSuccess={(url) => setContent({
                                            ...content,
                                            company: { ...content.company, aboutImage: url }
                                        })}
                                        buttonText="📁"
                                        resourceType="image"
                                    />
                                </div>
                            </div>
                            {content.company?.aboutImage && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 h-32 w-60">
                                    <img src={content.company.aboutImage} alt="About preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <label className="block text-sm font-bold text-gray-700">Instagram Reels / YouTube Shorts</label>
                                <button
                                    type="button"
                                    onClick={addReel}
                                    className="px-4 py-2 rounded-lg bg-black text-white text-sm font-bold hover:bg-[var(--primary)] hover:text-black transition-colors"
                                >
                                    + Add Reel
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(Array.isArray(content.company?.reels) ? content.company.reels : []).map((reel: any, index: number) => (
                                    <div key={`${reel.url || 'new'}-${index}`} className="flex gap-3 items-start rounded-xl border border-gray-200 p-3 bg-gray-50">
                                        <div className="flex-1 grid md:grid-cols-[1.4fr_0.6fr] gap-3">
                                            <input
                                                type="url"
                                                value={reel.url || ""}
                                                onChange={(e) => updateReel(index, "url", e.target.value)}
                                                placeholder="https://www.instagram.com/reel/... or https://youtu.be/... or https://youtube.com/shorts/..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={reel.title || ""}
                                                onChange={(e) => updateReel(index, "title", e.target.value)}
                                                placeholder="Reel title"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeReel(index)}
                                            className="px-3 py-2 text-sm font-bold text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-bold mb-4">Statistics</h3>
                        {content.company?.stats?.map((stat: any, index: number) => (
                            <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => {
                                        const newStats = [...content.company.stats];
                                        newStats[index].label = e.target.value;
                                        setContent({
                                            ...content,
                                            company: { ...content.company, stats: newStats }
                                        });
                                    }}
                                    placeholder="Label"
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                        const newStats = [...content.company.stats];
                                        newStats[index].value = e.target.value;
                                        setContent({
                                            ...content,
                                            company: { ...content.company, stats: newStats }
                                        });
                                    }}
                                    placeholder="Value"
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6">Contact Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={content.contact?.phone || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, phone: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={content.contact?.email || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, email: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Link</label>
                            <input
                                type="url"
                                value={content.contact?.whatsapp || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, whatsapp: e.target.value }
                                })}
                                placeholder="https://wa.me/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                            <input
                                type="text"
                                value={content.contact?.address || ""}
                                onChange={(e) => setContent({
                                    ...content,
                                    contact: { ...content.contact, address: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
