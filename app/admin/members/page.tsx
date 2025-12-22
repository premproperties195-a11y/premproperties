"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
    id: string;
    name: string;
    email: string;
    password?: string;
    created_at: string;
}

export default function MemberManagement() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        password: ""
    });

    const router = useRouter();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch("/api/admin/members");
            if (res.status === 401) {
                router.push("/admin/login/");
                return;
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setMembers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/admin/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMember)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMembers([data, ...members]);
            setIsModalOpen(false);
            setNewMember({ name: "", email: "", password: "" });
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm("Are you sure you want to delete this member? They will lose access to all documents.")) return;
        try {
            const res = await fetch("/api/admin/members", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setMembers(members.filter(m => m.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8">Loading members...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
                    <p className="text-gray-600">Create client accounts for document viewing access</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-black transition-all shadow-lg"
                >
                    + Create New Member
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 italic">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Name</th>
                            <th className="p-4 font-bold text-gray-600">Email</th>
                            <th className="p-4 font-bold text-gray-600">Joined Date</th>
                            <th className="p-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium">{member.name}</td>
                                <td className="p-4 text-gray-600">{member.email}</td>
                                <td className="p-4 text-sm text-gray-400">
                                    {new Date(member.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                                    >
                                        Remove Access
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                                    No members found. Create one to allow document access.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 bg-blue-50 border-b border-blue-100">
                            <h2 className="text-xl font-bold text-blue-900">Add New Member</h2>
                        </div>
                        <form onSubmit={handleCreateMember} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Client Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. John Doe"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMember.name}
                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="client@example.com"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMember.email}
                                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newMember.password}
                                    onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                                >
                                    Create Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
