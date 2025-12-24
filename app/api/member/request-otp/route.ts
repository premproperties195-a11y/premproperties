import { NextResponse } from "next/server";
import { requestOTP } from "../../../lib/authService";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const result = await requestOTP(email, 'member');

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("OTP API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
