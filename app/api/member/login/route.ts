import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!supabase) return NextResponse.json({ error: "Database not connected" }, { status: 503 });

        const { data: member, error } = await supabase
            .from("members")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (error || !member) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (member.password !== password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

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
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
