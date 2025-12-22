"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6 text-center">
            <h2 className="text-4xl font-bold mb-4 text-red-500">Something went wrong!</h2>
            <p className="text-gray-600 mb-8 max-w-lg">
                {error.message || "An unexpected error occurred."}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded hover:bg-black transition-colors"
                >
                    Try again
                </button>
                <button
                    onClick={() => window.location.href = "/"}
                    className="px-6 py-3 border-2 border-black font-bold rounded hover:bg-black hover:text-white transition-colors"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
