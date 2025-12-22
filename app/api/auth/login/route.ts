import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersPath = path.join(process.cwd(), "app/data/users.json");

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Fallback to env for initial setup or read from users.json
        let users = [];
        if (fs.existsSync(usersPath)) {
            users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
        }

        const user = users.find((u: any) => u.email === email && u.password === password);

        // Also check against env as a safety measure
        const isMaster = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

        if (user || isMaster) {
            const role = user ? user.role : "super_admin";
            const permissions = user ? user.permissions : ["all"];

            const response = NextResponse.json({
                success: true,
                user: {
                    email,
                    role,
                    permissions
                }
            });

            // For simplicity in this demo environment, we store role in the cookie
            // In production, use a signed JWT
            const sessionValue = JSON.stringify({ authenticated: true, role, permissions });
            const encodedSession = Buffer.from(sessionValue).toString("base64");

            response.cookies.set("admin-session", encodedSession, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return response;
        }

        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
