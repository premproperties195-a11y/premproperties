import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black text-center p-6">
            <h2 className="text-6xl font-bold mb-4 text-[var(--primary)]">404</h2>
            <h3 className="text-2xl font-bold mb-6">Page Not Found</h3>
            <p className="text-gray-500 mb-8">Could not find requested resource</p>
            <Link href="/" className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-[var(--primary)] transition-colors">
                Return Home
            </Link>
        </div>
    );
}
