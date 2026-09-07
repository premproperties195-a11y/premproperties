import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "../../../lib/supabase";
import { verifyPassword } from "../../../lib/password";

const getLocalUsersFilePath = () => {
    const configuredPath = process.env.USERS_DATA_PATH;
    if (configuredPath) return configuredPath;
    return path.join(process.cwd(), "app", "data", "users.json");
};

const readLocalUsers = () => {
    try {
        const usersPath = getLocalUsersFilePath();
        if (!fs.existsSync(usersPath)) return [];

        const raw = fs.readFileSync(usersPath, "utf-8");
        const users = raw ? JSON.parse(raw) : [];
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("Local admin users read error:", error);
        return [];
    }
};

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Import security utilities
        const { checkRateLimit } = await import("../../../lib/validation");

        // Rate limiting - max 5 login attempts per 15 minutes per IP
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
        const rateLimit = checkRateLimit(`login_${ip}`, 5, 900000);
        
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.` },
                { status: 429 }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        let user: any = null;

        // Query admin_users from Supabase
        const { data: supabaseUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!error && supabaseUser) {
            user = supabaseUser;
        } else {
            const localUsers = readLocalUsers();
            const localUser = localUsers.find((item: any) => item.email?.toLowerCase() === String(email).trim().toLowerCase());
            if (localUser) {
                user = localUser;
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password using bcrypt
        // NOTE: If password is not hashed yet (plain text), we compare directly
        // This provides backward compatibility during migration
        let isValidPassword = false;
        const storedPassword = user.password || "";

        if (storedPassword.startsWith('$2')) {
            isValidPassword = await verifyPassword(password, storedPassword);
        } else {
            isValidPassword = password === storedPassword;
            if (user.email) {
                console.warn('Plain text password detected for user:', user.email);
            }
        }

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Successful login
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                permissions: user.permissions
            }
        });

        // Create session cookie
        const sessionValue = JSON.stringify({
            authenticated: true,
            userId: user.id,
            email: user.email,
            role: user.role,
            permissions: user.permissions
        });
        const encodedSession = Buffer.from(sessionValue).toString("base64");

        response.cookies.set("admin-session", encodedSession, {
            httpOnly: true, // Prevent JavaScript access (XSS protection)
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict", // CSRF protection
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
