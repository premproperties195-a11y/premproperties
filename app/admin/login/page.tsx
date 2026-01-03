"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCompanyData } from "../../lib/data";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<any>(null);

    useEffect(() => {
        const loadCompany = async () => {
            const data = await fetchCompanyData();
            setCompany(data);
        };
        loadCompany();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                // Cookie is set by the server (httpOnly: false now)
                router.push("/admin/");
            } else {
                setError(data.error || "Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <img
                        src={company?.appearance?.logo || "/logo.png"}
                        alt="PREM Properties"
                        style={{ height: `${company?.appearance?.logoHeight || "96"}px` }}
                        className="w-auto object-contain mx-auto mb-6"
                    />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-600">PREM Properties Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Additional Login Options */}
                <div className="mt-6 space-y-3">
                    <div className="text-center">
                        <button
                            onClick={() => router.push('/forgot-password')}
                            className="text-sm text-gray-600 hover:text-[var(--primary)] font-medium transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-gray-500">OR</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/otp-login')}
                        className="w-full py-3 border-2 border-[var(--primary)] text-[var(--primary)] font-bold rounded-lg hover:bg-[var(--primary)] hover:text-black transition-all"
                    >
                        Login with OTP
                    </button>
                </div>

            </div>
        </div>
    );
}
