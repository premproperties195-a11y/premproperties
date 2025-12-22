"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function PropertiesAdmin() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProperties(data || []);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;

        try {
            const { error } = await supabase
                .from("properties")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchProperties();
        } catch (error) {
            console.error("Error deleting property:", error);
            alert("Error deleting property");
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
                    <p className="text-gray-600">Manage your property listings</p>
                </div>
                <Link
                    href="/admin/properties/new"
                    className="bg-[var(--primary)] text-black px-6 py-3 rounded-lg font-bold hover:bg-black hover:text-white transition-colors"
                >
                    + Add Property
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Property</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Views</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {properties.map((property: any) => (
                            <tr key={property.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={property.image} alt={property.title} className="w-16 h-16 object-cover rounded-lg" />
                                        <div>
                                            <div className="font-bold text-gray-900">{property.title}</div>
                                            <div className="text-sm text-gray-500">{property.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{property.location}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{property.price}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                        {property.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{property.views || 0}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/properties/${property.id}`}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-bold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {properties.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No properties found. Add your first property!
                    </div>
                )}
            </div>
        </div>
    );
}
