import { NextResponse } from "next/server";
import { requestOTP } from "../../../../lib/authService";

export async function POST(request: Request) {
    try {
        const { email, type } = await request.json(); // type: 'member' | 'admin'
        const result = await requestOTP(email.toLowerCase(), type);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
