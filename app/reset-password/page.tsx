"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({ type: '', message: '' });

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Invalid reset link. Please request a new password reset.' });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 8) {
            setStatus({ type: 'error', message: 'Password must be at least 8 characters long' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message });

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/admin/login');
                }, 3000);
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to reset password' });
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-gray-600">Enter your new password</p>
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

                    {/* Form */}
                    {token && status.type !== 'success' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    minLength={8}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    minLength={8}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

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
