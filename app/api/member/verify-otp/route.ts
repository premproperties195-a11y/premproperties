import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyOTP } from "../../../lib/authService";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        // 1. Verify via AuthService
        const result = await verifyOTP(email, otp, 'member');
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        // 2. Success - Get member data to create session
        const { data: member, error } = await supabase
            .from("members")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (error || !member) {
            return NextResponse.json({ error: "User record not found after verification." }, { status: 404 });
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
        console.error("Member OTP Verify Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
