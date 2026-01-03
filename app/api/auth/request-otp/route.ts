import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { generateOTP, storeOTP } from '../../../lib/otp';
import { validateEmail } from '../../../lib/validation';

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
            // For security, don't reveal if email exists or not
            return NextResponse.json({
                success: true,
                message: 'If your email is registered, you will receive an OTP shortly.'
            });
        }

        // Generate OTP
        const otp = generateOTP(6);
        storeOTP(user.email, otp, 10); // Valid for 10 minutes

        // Send OTP via email (implement your email service)
        // For now, log it (REMOVE IN PRODUCTION!)
        console.log(`OTP for ${user.email}: ${otp}`);

        // TODO: Replace with actual email service
        // await sendEmail({
        //     to: user.email,
        //     subject: 'Your OTP for PREM Properties',
        //     html: `
        //         <h2>Login OTP</h2>
        //         <p>Your OTP is: <strong>${otp}</strong></p>
        //         <p>This OTP will expire in 10 minutes.</p>
        //     `
        // });

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
            // DEVELOPMENT ONLY - Remove in production!
            devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        console.error('Request OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
