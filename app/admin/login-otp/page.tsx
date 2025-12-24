"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchCompanyData } from "../../lib/data";

export default function AdminOTPLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"request" | "verify">("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const loadCompany = async () => {
            const data = await fetchCompanyData();
            setCompany(data);
        };
        loadCompany();
    }, []);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/otp/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, type: 'admin' }),
            });

            const data = await res.json();

            if (res.ok) {
                setMode("verify");
                setMessage({ type: 'success', text: "OTP sent to your admin email!" });
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to send OTP" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Request failed." });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, type: 'admin' }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/admin/");
            } else {
                setMessage({ type: 'error', text: data.error || "Invalid OTP" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Verification failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <img
                        src={company?.appearance?.logo || "/logo.png"}
                        alt="Logo"
                        style={{ height: "64px" }}
                        className="w-auto object-contain mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">Admin OTP Login</h1>
                    <p className="text-gray-500 text-sm">Secure access for management</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                {mode === "request" ? (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Login Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 text-center">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-center text-3xl font-black tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify & Login"}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link href="/admin/login" className="text-sm text-gray-400 hover:text-black">&larr; Back to Regular Login</Link>
                </div>
            </motion.div>
        </div>
    );
}
