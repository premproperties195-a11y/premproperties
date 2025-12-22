"use client";

import { useEffect, useState } from "react";
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
