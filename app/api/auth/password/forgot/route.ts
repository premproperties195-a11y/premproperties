import { NextResponse } from "next/server";
import { requestPasswordReset } from "../../../../lib/authService";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        // Since it's /api/auth/password/forgot (usually for admins or generic), we'll try admin first
        const result = await requestPasswordReset(email.toLowerCase(), 'admin');

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Reset link sent successfully." });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
