"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { fetchCompanyData } from "../lib/data";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [company, setCompany] = useState<any>(null);

    const allNavItems = useMemo(() => [
        { label: "Dashboard", href: "/admin/", icon: "📊", permission: "all" },
        { label: "Users", href: "/admin/users/", icon: "🔑", role: "super_admin" },
        { label: "Members", href: "/admin/members/", icon: "🎖️", permission: "Properties" },
        { label: "Properties", href: "/admin/properties/", icon: "🏠", permission: "Properties" },
        { label: "Gallery", href: "/admin/gallery/", icon: "🖼️", permission: "Gallery" },
        { label: "Team", href: "/admin/team/", icon: "👥", permission: "Team" },
        { label: "Content", href: "/admin/content/", icon: "📝", permission: "Content" },
        { label: "Settings", href: "/admin/settings/", icon: "⚙️", permission: "Settings" },
        { label: "Media", href: "/admin/media/", icon: "🎥", permission: "Media" },
        { label: "Inquiries", href: "/admin/inquiries/", icon: "📩", permission: "Inquiries" },
    ], []);

    const navItems = useMemo(() => {
        if (!user) return [];
        return allNavItems.filter(item => {
            if (user.role === "super_admin") return true;
            if (item.role && item.role !== user.role) return false;
            if (item.permission && item.permission !== "all" && !user.permissions?.includes(item.permission)) return false;
            return true;
        });
    }, [user, allNavItems]);

    useEffect(() => {
        const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";
        const cookie = document.cookie.split("; ").find(row => row.startsWith("admin-session="));

        let isAuthenticated = false;
        let currentUserData = null;

        if (cookie) {
            try {
                const value = cookie.substring(cookie.indexOf("=") + 1);
                const decodedJson = atob(decodeURIComponent(value));
                currentUserData = JSON.parse(decodedJson);
                isAuthenticated = !!(currentUserData && currentUserData.authenticated);

                if (JSON.stringify(user) !== JSON.stringify(currentUserData)) {
                    setUser(currentUserData);
                }
            } catch (e) {
                console.error("Auth decoding error:", e);
                isAuthenticated = false;
            }
        }

        const loadCompany = async () => {
            const data = await fetchCompanyData();
            setCompany(data);
        };
        loadCompany();

        setIsLoaded(true);

        if (!isLoginPage) {
            if (!isAuthenticated) {
                router.push("/admin/login/");
                return;
            }

            // Enforcement of permissions for sub-admins
            if (currentUserData && currentUserData.role !== "super_admin") {
                const allowedPaths = allNavItems.filter(item => {
                    if (currentUserData.role === "super_admin") return true;
                    if (item.role && item.role !== currentUserData.role) return false;
                    if (item.permission && item.permission !== "all" && !currentUserData.permissions?.includes(item.permission)) return false;
                    return true;
                }).map(item => item.href);

                const currentPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
                const isAllowed = allowedPaths.some(path =>
                    currentPath === path || (path !== "/admin/" && currentPath.startsWith(path))
                );

                if (!isAllowed) {
                    router.push("/admin/");
                }
            }
        }
    }, [pathname, router]); // Optimized dependencies to prevent loops

    const handleLogout = () => {
        document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        setUser(null);
        router.push("/admin/login/");
    };

    const isLoginPage = pathname === "/admin/login/";
    const logoUrl = company?.appearance?.logo || "/logo.png";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 flex flex-col items-center text-center border-b border-gray-800">
                    <Link href="/">
                        <img
                            src={logoUrl}
                            alt="PREM Properties"
                            className="h-16 w-auto object-contain mb-4 invert brightness-0"
                        />
                    </Link>
                    <h1 className="text-xl font-bold">PREM Admin</h1>
                    <p className="text-gray-400 text-sm">Content Management</p>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
                    {isLoaded && navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                ? "bg-[var(--primary)] text-black font-bold"
                                : "hover:bg-gray-800"
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {isLoaded ? children : <div className="text-center py-12">Loading...</div>}
            </main>
        </div>
    );
}
