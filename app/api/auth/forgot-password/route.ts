import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { generateResetToken } from '../../../lib/otp';
import { validateEmail } from '../../../lib/validation';
import { resetTokens } from '../../../lib/tokens';


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

        // Send email using real service
        try {
            const { sendPasswordResetEmail } = await import('../../../lib/email');
            await sendPasswordResetEmail(user.email, resetLink);
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
            // Still return success to client for security (don't reveal if email was valid or sent)
        }

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


