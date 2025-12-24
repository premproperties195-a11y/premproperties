"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState<'member' | 'admin'>('member');
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const t = searchParams.get("token");
        const e = searchParams.get("email");
        const role = searchParams.get("type");
        if (t) setToken(t);
        if (e) setEmail(e);
        if (role === 'admin') setType('admin');
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const endpoint = type === 'admin' ? "/api/admin/reset-password" : "/api/member/reset-password";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "Password reset successful! Redirecting to login..." });
                setTimeout(() => router.push(type === 'admin' ? "/admin/login" : "/login"), 3000);
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to reset password." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Request failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <section className="pt-32 pb-24 px-6 text-center">
                <h1 className="text-2xl font-bold text-red-500">Invalid Reset Link</h1>
                <p className="mt-4">Please request a new reset link from the login page.</p>
            </section>
        );
    }

    return (
        <section className="pt-32 pb-24 px-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold mb-4">{type === 'admin' ? 'Admin ' : ''}Reset Password</h1>
                    <p className="text-gray-500">Creating a secure password for <span className="font-bold text-black">{email}</span></p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[var(--primary)] hover:text-black transition-all duration-300 disabled:opacity-50 shadow-lg"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                <ResetPasswordContent />
            </Suspense>
            <Footer />
        </main>
    );
}
