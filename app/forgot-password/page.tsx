"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPasswordPage() {
    const searchParams = useSearchParams();
    const [type, setType] = useState<'member' | 'admin'>('member');
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const t = searchParams.get("type");
        if (t === 'admin') setType('admin');
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const endpoint = type === 'admin' ? "/api/auth/password/forgot" : "/api/member/forgot-password";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "Reset link sent! Please check your email inbox and spam folder." });
            } else {
                setMessage({ type: 'error', text: data.error || "Something went wrong." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Request failed. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-24 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-bold mb-4">{type === 'admin' ? 'Admin ' : ''}Forgot Password</h1>
                        <p className="text-gray-500">Enter your email to receive a password reset link.</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[var(--primary)] hover:text-black transition-all duration-300 disabled:opacity-50 shadow-lg"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link href={type === 'admin' ? "/admin/login" : "/login"} className="text-gray-500 hover:text-black font-bold flex items-center justify-center gap-2">
                            &larr; Back to Login
                        </Link>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
