"use client";

import { useEffect, useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";
import { supabase } from "../../lib/supabase";

export default function TeamAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [team, setTeam] = useState<any[]>([]);
    const [allContent, setAllContent] = useState<any>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("data")
                .eq("id", "company")
                .single();

            if (error) throw error;
            if (data) {
                setAllContent(data.data);
                setTeam(data.data.team || []);
            }
        } catch (error) {
            console.error("Failed to fetch team:", error);
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
                team
            };

            const { error } = await supabase
                .from("site_content")
                .upsert({ id: "company", data: updatedData, updated_at: new Date().toISOString() });

            if (error) throw error;
            alert("Team updated successfully!");
        } catch (error) {
            console.error("Error updating team:", error);
            alert("Error updating team");
        } finally {
            setSaving(false);
        }
    };

    const addMember = () => {
        const newId = String(Math.max(...team.map(m => parseInt(m.id)), 0) + 1);
        setTeam([...team, {
            id: newId,
            name: "",
            role: "",
            image: "",
            bio: "",
        }]);
    };

    const removeMember = (id: string) => {
        if (confirm("Remove this team member?")) {
            setTeam(team.filter(m => m.id !== id));
        }
    };

    const updateMember = (id: string, field: string, value: string) => {
        setTeam(team.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
                    <p className="text-gray-600">Manage leadership team members</p>
                </div>
                <button
                    onClick={addMember}
                    className="bg-[var(--primary)] text-black px-6 py-3 rounded-lg font-bold hover:bg-black hover:text-white transition-colors"
                >
                    + Add Member
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {team.map((member) => (
                    <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold">Team Member #{member.id}</h3>
                            <button
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => updateMember(member.id, "name", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                                <input
                                    type="text"
                                    value={member.role}
                                    onChange={(e) => updateMember(member.id, "role", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={member.image}
                                        onChange={(e) => updateMember(member.id, "image", e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
                                    <CloudinaryUpload
                                        onUploadSuccess={(url) => updateMember(member.id, "image", url)}
                                        buttonText="📸 Upload"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={member.bio}
                                    onChange={(e) => updateMember(member.id, "bio", e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {team.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No team members. Click "Add Member" to get started.
                    </div>
                )}

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
