import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

    // Protect admin routes and admin API routes
    if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) && !isLoginPage) {
        const session = request.cookies.get("admin-session");

        try {
            if (!session) throw new Error("No session");

            // Robust decoding for URL-encoded cookies
            const decodedValue = decodeURIComponent(session.value);
            const decoded = JSON.parse(Buffer.from(decodedValue, "base64").toString("utf-8"));

            if (!decoded.authenticated) {
                throw new Error("Not authenticated");
            }
        } catch (error) {
            // For API requests, return a 401 instead of redirecting
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/admin/login/", request.url));
        }
    }

    // Redirect to dashboard if already logged in
    if (isLoginPage) {
        const session = request.cookies.get("admin-session");

        if (session) {
            try {
                const decodedValue = decodeURIComponent(session.value);
                const decoded = JSON.parse(Buffer.from(decodedValue, "base64").toString("utf-8"));
                if (decoded.authenticated) {
                    return NextResponse.redirect(new URL("/admin/", request.url));
                }
            } catch (e) {
                // Ignore decoding errors on login page
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
