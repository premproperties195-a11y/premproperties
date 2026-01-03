import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { hashPassword, validatePasswordStrength } from '../../../lib/password';

// Import resetTokens from forgot-password route
let resetTokens: Map<string, { email: string; expiry: Date }>;

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Reset token is required' },
                { status: 400 }
            );
        }

        // Lazy load resetTokens to avoid circular dependency
        if (!resetTokens) {
            const forgotPasswordModule = await import('../forgot-password/route');
            resetTokens = forgotPasswordModule.resetTokens;
        }

        // Verify token
        const tokenData = resetTokens.get(token);

        if (!tokenData) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 401 }
            );
        }

        // Check expiry
        if (new Date() > tokenData.expiry) {
            resetTokens.delete(token);
            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 401 }
            );
        }

        // Validate new password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { error: passwordValidation.message },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password in database
        const { error } = await supabase
            .from('admin_users')
            .update({ password: hashedPassword })
            .eq('email', tokenData.email);

        if (error) {
            console.error('Password update error:', error);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Delete used token
        resetTokens.delete(token);

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
