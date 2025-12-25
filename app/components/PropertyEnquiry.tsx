"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function PropertyEnquiry({ propertyTitle, initialViews }: { propertyTitle: string, initialViews: number }) {
    const [formState, setFormState] = useState({ name: "", phone: "", email: "" });
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [views, setViews] = useState(initialViews);

    // Simulate real-time view increment
    useEffect(() => {
        // Random increment to simulate live traffic
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setViews(v => v + 1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            if (!supabase) {
                alert("Database connection not available. Please try later.");
                setStatus("idle");
                return;
            }
            const { error } = await supabase
                .from("inquiries")
                .insert([{
                    name: formState.name,
                    phone: formState.phone,
                    email: formState.email,
                    property: propertyTitle,
                    message: `Inquiry for ${propertyTitle}`,
                    date: new Date().toISOString(),
                    status: 'new'
                }]);

            if (error) throw error;

            setStatus("success");
            setFormState({ name: "", phone: "", email: "" });
        } catch (error) {
            console.error("Error sending enquiry:", error);
            alert("Failed to send enquiry. Please try again.");
            setStatus("idle");
        }
    };

    return (
        <div className="sticky top-32 p-8 bg-white border border-gray-200 shadow-xl rounded-xl">

            {/* View Counter */}
            <div className="flex items-center gap-2 mb-6 text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-bold">{views.toLocaleString()} people viewing this property</span>
            </div>

            <h3 className="text-2xl font-bold mb-2">Interested?</h3>
            <p className="text-gray-500 mb-6 text-sm">Fill out the form below and our team will get back to you shortly.</p>

            {status === "success" ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center"
                >
                    <p className="text-4xl mb-2">✅</p>
                    <h4 className="font-bold mb-1">Enquiry Sent!</h4>
                    <p className="text-sm">The owner has been notified via email.</p>
                    <button onClick={() => setStatus("idle")} className="text-xs underline mt-4 hover:text-green-900">Send another</button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Name</label>
                        <input
                            required
                            type="text"
                            value={formState.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                            className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-[var(--primary)] transition-colors"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone</label>
                        <input
                            required
                            type="tel"
                            value={formState.phone}
                            onChange={e => setFormState({ ...formState, phone: e.target.value })}
                            className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-[var(--primary)] transition-colors"
                            placeholder="+91 Phone Number"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            value={formState.email}
                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                            className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-[var(--primary)] transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                    <button
                        disabled={status === "submitting"}
                        className="w-full py-4 bg-[var(--primary)] text-white font-bold uppercase tracking-wider rounded-md hover:bg-black transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === "submitting" ? "Sending..." : "Request Details"}
                    </button>
                </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-400 mb-2">Or call us directly at</p>
                <a href="tel:+916305203756" className="text-xl font-bold hover:text-[var(--primary)] transition-colors block">+91 888 557 5557</a>
            </div>
        </div>
    );
}
