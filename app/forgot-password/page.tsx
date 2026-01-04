"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });
    const [devToken, setDevToken] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: data.message
                });
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to send reset email' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                        <p className="text-gray-600">Enter your email to receive a password reset link</p>
                    </div>

                    {/* Status Messages */}
                    {status.message && (
                        <div className={`mb-6 p-4 rounded-lg ${status.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    {/* Dev Token Display */}
                    {devToken && (
                        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <p className="text-sm font-bold text-yellow-900 mb-2">🔧 Development Mode</p>
                            <p className="text-xs text-yellow-800 mb-2">Reset token:</p>
                            <code className="text-xs bg-yellow-100 p-2 rounded block break-all">{devToken}</code>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                placeholder="admin@prem.com"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/admin/login')}
                            className="text-sm text-gray-600 hover:text-[var(--primary)] font-medium"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
