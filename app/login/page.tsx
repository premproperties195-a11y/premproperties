"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MemberLoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"password" | "otp" | "otp-verify">("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch("/api/member/session");
            const data = await res.json();
            if (data.authenticated) {
                router.push("/");
            }
        };
        checkSession();
    }, [router]);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/member/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "/";
            } else {
                setMessage({ type: 'error', text: data.error || "Login failed" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/member/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMode("otp-verify");
                setMessage({ type: 'success', text: "OTP sent to your email!" });
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to send OTP" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Request failed. Check if DB supports OTP." });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/member/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "/";
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
        <main className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-24 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-bold mb-4">Member Login</h1>
                        <p className="text-gray-500">Access exclusive property documents and details.</p>
                    </div>

                    <div className="flex gap-4 mb-8 bg-gray-50 p-1 rounded-xl">
                        <button
                            onClick={() => { setMode("password"); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'password' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => { setMode("otp"); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode.startsWith('otp') ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                        >
                            OTP Login
                        </button>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    {mode === "password" && (
                        <form onSubmit={handlePasswordLogin} className="space-y-6">
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

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Password</label>
                                    <Link href="/forgot-password" title="Forgot Password Page" className="text-xs text-[var(--primary)] font-bold hover:underline">Forgot password?</Link>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                {loading ? "Authenticating..." : "Login to Member Area"}
                            </button>
                        </form>
                    )}

                    {mode === "otp" && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
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
                                <p className="mt-2 text-[10px] text-gray-400 font-medium">We will send a 6-digit verification code to your registered email.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[var(--primary)] hover:text-black transition-all duration-300 disabled:opacity-50 shadow-lg"
                            >
                                {loading ? "Sending Code..." : "Send Verification Code"}
                            </button>
                        </form>
                    )}

                    {mode === "otp-verify" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-500">Entering code for <span className="font-bold text-black">{email}</span></p>
                                <button type="button" onClick={() => setMode("otp")} className="text-xs text-blue-600 hover:underline">Change email</button>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-center uppercase tracking-widest">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all text-center text-3xl font-black tracking-[1rem]"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-black transition-all duration-300 disabled:opacity-50 shadow-lg"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have a member account? <br />
                        <span className="text-black font-bold">Please contact your relationship manager.</span>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
