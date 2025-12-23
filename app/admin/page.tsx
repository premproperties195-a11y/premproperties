"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        properties: 0,
        team: 0,
        inquiries: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [pCount, iCount, contentRes] = await Promise.all([
                supabase.from('properties').select('*', { count: 'exact', head: true }),
                supabase.from('inquiries').select('*', { count: 'exact', head: true }),
                supabase.from('site_content').select('data').eq('id', 'company').single()
            ]);

            setStats({
                properties: pCount.count || 0,
                inquiries: iCount.count || 0,
                team: contentRes.data?.data?.team?.length || 0
            });
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        }
    };

    const quickLinks = [
        { title: "Manage Properties", href: "/admin/properties", icon: "🏠", color: "bg-blue-500" },
        { title: "Team Members", href: "/admin/team", icon: "👥", color: "bg-green-500" },
        { title: "Edit Content", href: "/admin/content", icon: "📝", color: "bg-purple-500" },
        { title: "Upload Media", href: "/admin/media", icon: "🖼️", color: "bg-orange-500" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600">Welcome to PREM Properties Admin Panel</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Total Properties</div>
                    <div className="text-4xl font-bold text-[var(--primary)]">{stats.properties}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Team Members</div>
                    <div className="text-4xl font-bold text-[var(--primary)]">{stats.team}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Inquiries</div>
                    <div className="text-4xl font-bold text-[var(--primary)]">{stats.inquiries}</div>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                        >
                            <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                {link.icon}
                            </div>
                            <h3 className="font-bold text-gray-900">{link.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* View Site Link */}
            <div className="mt-8 bg-gray-900 text-white p-6 rounded-xl">
                <h3 className="font-bold mb-2">View Live Website</h3>
                <p className="text-gray-400 text-sm mb-4">See how your changes look on the public site</p>
                <Link
                    href="/"
                    target="_blank"
                    className="inline-block bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors"
                >
                    Open Website →
                </Link>
            </div>
        </div>
    );
}
