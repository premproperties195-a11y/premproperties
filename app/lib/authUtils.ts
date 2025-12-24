import { supabase } from "./supabase";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Generate a random 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a random 32-character reset token
export function generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Create real email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Real email service
export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    console.log(`[EMAIL] Sending email to ${to}...`);

    // Fallback if SMTP is not configured
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
        console.warn("-----------------------------------------");
        console.warn("SMTP NOT CONFIGURED. LOGGING EMAIL CONTENT:");
        console.warn(`TO: ${to}`);
        console.warn(`SUBJECT: ${subject}`);
        console.warn(`BODY: ${html}`);
        console.warn("-----------------------------------------");
        return { success: true, mocked: true };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"PREM Properties" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`[EMAIL] Email sent! ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending email:", error);
        throw error;
    }
}
