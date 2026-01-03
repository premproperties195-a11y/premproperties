import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { generateResetToken } from '../../../lib/otp';
import { validateEmail } from '../../../lib/validation';

// Store reset tokens (use Redis in production)
const resetTokens = new Map<string, { email: string; expiry: Date }>();

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return NextResponse.json(
                { error: emailValidation.error },
                { status: 400 }
            );
        }

        // Check if user exists
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('email, username')
            .eq('email', emailValidation.sanitized)
            .single();

        if (error || !user) {
            // For security, don't reveal if email exists
            return NextResponse.json({
                success: true,
                message: 'If your email is registered, you will receive password reset instructions.'
            });
        }

        // Generate reset token
        const { token, expiry } = generateResetToken();
        resetTokens.set(token, {
            email: user.email,
            expiry
        });

        // Create reset link
        const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        // Send email (implement your email service)
        console.log(`Password reset link for ${user.email}: ${resetLink}`);

        // TODO: Replace with actual email service
        // await sendEmail({
        //     to: user.email,
        //     subject: 'Reset your PREM Properties password',
        //     html: `
        //         <h2>Password Reset Request</h2>
        //         <p>Click the link below to reset your password:</p>
        //         <a href="${resetLink}">Reset Password</a>
        //         <p>This link will expire in 1 hour.</p>
        //         <p>If you didn't request this, please ignore this email.</p>
        //     `
        // });

        return NextResponse.json({
            success: true,
            message: 'Password reset link sent to your email',
            // DEVELOPMENT ONLY
            devToken: process.env.NODE_ENV === 'development' ? token : undefined
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// Export resetTokens for use in reset-password route
export { resetTokens };
