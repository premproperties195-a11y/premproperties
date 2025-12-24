import { NextResponse } from "next/server";
import { requestPasswordReset } from "../../../lib/authService";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const result = await requestPasswordReset(email, 'member');

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, a reset link has been sent."
        });
    } catch (error) {
        console.error("Forgot Pwd API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
