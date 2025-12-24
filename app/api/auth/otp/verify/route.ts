import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyOTP } from "../../../../lib/authService";
import { supabase } from "../../../../lib/supabase";

const usersPath = path.join(process.cwd(), "app/data/users.json");

export async function POST(request: Request) {
    try {
        const { email, otp, type } = await request.json();

        const result = await verifyOTP(email.toLowerCase(), otp, type);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        // Success - Set Session
        if (type === 'admin') {
            const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
            const admin = users.find((u: any) => u.email === email.toLowerCase());

            const role = admin ? admin.role : "super_admin";
            const sessionValue = JSON.stringify({ authenticated: true, role, permissions: ["all"] });
            const encodedSession = Buffer.from(sessionValue).toString("base64");

            cookies().set("admin-session", encodedSession, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            });
        } else {
            const { data: member } = await supabase.from("members").select("*").eq("email", email.toLowerCase()).single();
            if (member) {
                const sessionData = {
                    id: member.id,
                    email: member.email,
                    name: member.name,
                    authenticated: true,
                    role: "member"
                };
                const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString("base64");
                cookies().set("member-session", sessionValue, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Verify OTP API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
