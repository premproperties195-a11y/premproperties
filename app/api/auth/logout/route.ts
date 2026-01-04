import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Explicitly clear the cookie by setting it with a past expiry and correct path
    response.cookies.set('admin-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: -1 // Expire immediately
    });

    return response;
}
