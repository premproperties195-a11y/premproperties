import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { verifyOTP } from '../../../lib/otp';
import { validateEmail } from '../../../lib/validation';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json(
                { error: emailValidation.error },
                { status: 400 }
            );
        }

        if (!otp || otp.length !== 6) {
            return NextResponse.json(
                { error: 'Invalid OTP format' },
                { status: 400 }
            );
        }

        // Verify OTP
        const verification = verifyOTP(emailValidation.sanitized, otp);

        if (!verification.success) {
            return NextResponse.json(
                { error: verification.message },
                { status: 401 }
            );
        }

        // Get user data
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', emailValidation.sanitized)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create session
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

        const sessionValue = JSON.stringify({
            authenticated: true,
            userId: user.id,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            loginMethod: 'otp'
        });
        const encodedSession = Buffer.from(sessionValue).toString("base64");

        response.cookies.set("admin-session", encodedSession, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours
        });

        return response;

    } catch (error) {
        console.error('OTP login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
