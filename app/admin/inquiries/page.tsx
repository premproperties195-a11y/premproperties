"use client";

import { useEffect, useState, useMemo } from "react";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    property?: string;
    date: string;
    status: string;
}

import { supabase } from "../../lib/supabase";

export default function InquiriesAdmin() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [activeTab, setActiveTab] = useState<"new" | "contacted">("new");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setError(null);
            const { data, error: dbError } = await supabase
                .from("inquiries")
                .select("*")
                .order("date", { ascending: false });

            if (dbError) throw dbError;
            setInquiries(data || []);
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
            setError("Failed to load inquiries from database");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            console.log("Updating inquiry status:", { id, newStatus });

            const { data, error: dbError } = await supabase
                .from("inquiries")
                .update({ status: newStatus })
                .eq("id", id)
                .select();

            if (dbError) {
                console.error("Supabase update error:", dbError);
                throw dbError;
            }

            console.log("Status updated successfully:", data);
            setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
        } catch (error: any) {
            console.error("Error updating inquiry status:", error);
            alert(`Failed to update status: ${error.message || 'Unknown error'}\n\nCheck browser console for details.`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;

        try {
            const { error: dbError } = await supabase
                .from("inquiries")
                .delete()
                .eq("id", id);

            if (dbError) throw dbError;
            setInquiries(inquiries.filter(i => i.id !== id));
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            alert("Failed to delete inquiry");
        }
    };

    const filteredInquiries = useMemo(() => {
        return inquiries.filter(i => (i.status === activeTab || (!i.status && activeTab === "new")));
    }, [inquiries, activeTab]);

    if (loading) return <div className="text-center py-12">Loading...</div>;

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button onClick={fetchInquiries} className="px-6 py-2 bg-[var(--primary)] text-black font-bold rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiries</h1>
                <p className="text-gray-600">Manage messages from the contact form</p>
            </div>

            <div className="flex gap-2 mb-8 bg-gray-200 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("new")}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "new" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                >
                    New Requests
                </button>
                <button
                    onClick={() => setActiveTab("contacted")}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "contacted" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                >
                    Contacted
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Guest</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Contact Info</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Property</th>
                            <th className="px-6 py-4 font-bold text-gray-700">Message</th>
                            <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Loading inquiries...
                                </td>
                            </tr>
                        ) : filteredInquiries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                    No {activeTab} inquiries found.
                                </td>
                            </tr>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {inquiry.date ? new Date(inquiry.date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{inquiry.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div>{inquiry.email}</div>
                                        <div>{inquiry.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--primary)] uppercase tracking-wider">
                                        {inquiry.property || "General"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                        <div className="line-clamp-2 hover:line-clamp-none cursor-default">
                                            {inquiry.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex gap-4 justify-end">
                                            {activeTab === "new" ? (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry.id, "contacted")}
                                                    className="text-green-600 hover:text-green-800 font-bold text-sm"
                                                >
                                                    Mark Contacted
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusUpdate(inquiry.id, "new")}
                                                    className="text-orange-600 hover:text-orange-800 font-bold text-sm"
                                                >
                                                    Mark New
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(inquiry.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
