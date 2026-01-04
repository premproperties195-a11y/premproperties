import crypto from 'crypto';

/**
 * Generate a secure random OTP (One-Time Password)
 * @param length - Length of OTP (default: 6)
 * @returns Random OTP string
 */
export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

/**
 * Generate a secure password reset token
 * @returns Object with token and expiry
 */
export function generateResetToken(): { token: string; expiry: Date } {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // 1 hour expiry

    return { token, expiry };
}

/**
 * OTP storage interface (in-memory for development, use Redis in production)
 */
interface OTPRecord {
    otp: string;
    email: string;
    expiry: Date;
    attempts: number;
}

const globalForOTP = global as unknown as { otpStore: Map<string, OTPRecord> };

export const otpStore = globalForOTP.otpStore || new Map<string, OTPRecord>();

if (process.env.NODE_ENV !== 'production') globalForOTP.otpStore = otpStore;

/**
 * Store OTP for email verification
 * @param email - User email
 * @param otp - Generated OTP
 * @param validityMinutes - How long OTP is valid (default: 10 minutes)
 */
export function storeOTP(email: string, otp: string, validityMinutes: number = 10): void {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + validityMinutes);

    otpStore.set(email, {
        otp,
        email,
        expiry,
        attempts: 0
    });
}

/**
 * Verify OTP for email
 * @param email - User email
 * @param otp - OTP to verify
 * @returns Object with success status and message
 */
export function verifyOTP(email: string, otp: string): { success: boolean; message: string } {
    const record = otpStore.get(email);

    if (!record) {
        return { success: false, message: 'No OTP found for this email' };
    }

    // Check expiry
    if (new Date() > record.expiry) {
        otpStore.delete(email);
        return { success: false, message: 'OTP has expired' };
    }

    // Check attempts (max 5 attempts)
    if (record.attempts >= 5) {
        otpStore.delete(email);
        return { success: false, message: 'Too many failed attempts. Request new OTP.' };
    }

    // Verify OTP
    if (record.otp === otp) {
        otpStore.delete(email); // Remove after successful verification
        return { success: true, message: 'OTP verified successfully' };
    }

    // Increment attempts
    record.attempts++;
    otpStore.set(email, record);

    return {
        success: false,
        message: `Invalid OTP. ${5 - record.attempts} attempts remaining.`
    };
}

/**
 * Clean up expired OTPs (run periodically)
 */
export function cleanupExpiredOTPs(): void {
    const now = new Date();

    otpStore.forEach((record, email) => {
        if (now > record.expiry) {
            otpStore.delete(email);
        }
    });
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
}
