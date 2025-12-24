import { NextResponse } from "next/server";
import { verifyResetToken, finalizePasswordReset } from "../../../lib/authService";

export async function POST(request: Request) {
    try {
        const { email, token, newPassword } = await request.json();

        // 1. Verify token
        const verification = await verifyResetToken(email, token, 'member');
        if (verification.error) {
            return NextResponse.json({ error: verification.error }, { status: 400 });
        }

        // 2. Update password
        const result = await finalizePasswordReset(email, verification.tokenId!, newPassword, 'member');
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Reset Pwd API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
