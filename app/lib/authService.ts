import { supabase } from "./supabase";
import fs from "fs";
import path from "path";
import { generateOTP, generateResetToken, sendEmail } from "./authUtils";

const usersPath = path.join(process.cwd(), "app/data/users.json");

export async function requestOTP(email: string, type: 'member' | 'admin') {
    console.log(`[AUTH] Requesting OTP for ${email} (${type})`);
    let userExists = false;
    let userName = 'User';

    const cleanEmail = email.trim().toLowerCase();

    if (type === 'admin') {
        try {
            const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
            const admin = users.find((u: any) => u.email.toLowerCase() === cleanEmail);
            if (admin || cleanEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
                userExists = true;
                userName = admin?.username || 'Admin';
            }
        } catch (e) {
            console.error("[AUTH] Error reading users.json:", e);
        }
    } else {
        if (!supabase) return { error: "Database not connected. Contact admin." };
        const { data, error } = await supabase.from("members").select("name").eq("email", cleanEmail).single();
        if (data && !error) {
            userExists = true;
            userName = data.name;
        } else if (error) {
            console.warn("[AUTH] Member check error:", error.message);
        }
    }

    if (!userExists) {
        console.warn(`[AUTH] Attempted OTP request for non-existent ${type}: ${cleanEmail}`);
        return { error: "No account found with this email. Please contact support to register." };
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (!supabase) return { error: "Database not connected" };
    const { error: tokenError } = await supabase
        .from("auth_tokens")
        .upsert({
            email: cleanEmail,
            code: otp,
            type: `${type}_otp`,
            expiry: expiry.toISOString()
        }, { onConflict: 'email,type' });

    if (tokenError) {
        console.error("[AUTH] Critical: Could not save OTP to auth_tokens table.", tokenError);
        return { error: "Login system error. Admin: Ensure 'auth_tokens' table is created in Supabase." };
    }

    console.log(`[AUTH] OTP Generated for ${cleanEmail}: ${otp}`);

    await sendEmail({
        to: cleanEmail,
        subject: `Login Verification Code - PREM Properties`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #f2a602; text-align: center;">PREM Properties</h2>
                <h3 style="color: #333;">Verification Code</h3>
                <p>Hello ${userName},</p>
                <p>Use the following code to log in to your account:</p>
                <div style="font-size: 36px; font-weight: 800; background: #f8f8f8; padding: 20px; text-align: center; letter-spacing: 8px; border-radius: 8px; border: 1px solid #eee; color: #000; margin: 25px 0;">
                    ${otp}
                </div>
                <p style="color: #666; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this, please ignore this email.</p>
            </div>
        `
    });

    return { success: true };
}

export async function verifyOTP(email: string, code: string, type: 'member' | 'admin') {
    const cleanEmail = email.trim().toLowerCase();
    console.log(`[AUTH] Verifying OTP for ${cleanEmail} (${type})`);

    if (!supabase) return { error: "Database not connected" };
    const { data, error } = await supabase
        .from("auth_tokens")
        .select("*")
        .eq("email", cleanEmail)
        .eq("code", code)
        .eq("type", `${type}_otp`)
        .single();

    if (error || !data) {
        console.warn(`[AUTH] Invalid OTP attempt for ${cleanEmail}`);
        return { error: "Invalid verification code" };
    }

    if (new Date(data.expiry) < new Date()) {
        console.warn(`[AUTH] Expired OTP attempt for ${cleanEmail}`);
        return { error: "Verification code has expired" };
    }

    // Clear OTP
    await supabase.from("auth_tokens").delete().eq("id", data.id);
    console.log(`[AUTH] OTP Verified successfully for ${cleanEmail}`);

    return { success: true };
}

export async function requestPasswordReset(email: string, type: 'member' | 'admin') {
    const cleanEmail = email.trim().toLowerCase();
    console.log(`[AUTH] Requesting Password Reset for ${cleanEmail} (${type})`);

    let userExists = false;
    let userName = 'User';

    if (type === 'admin') {
        try {
            const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
            const admin = users.find((u: any) => u.email.toLowerCase() === cleanEmail);
            if (admin || cleanEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
                userExists = true;
                userName = admin?.username || 'Admin';
            }
        } catch (e) { }
    } else {
        if (!supabase) return { error: "Database not connected" };
        const { data } = await supabase.from("members").select("name").eq("email", cleanEmail).single();
        if (data) {
            userExists = true;
            userName = data.name;
        }
    }

    if (!userExists) {
        console.warn(`[AUTH] Reset requested for non-existent ${type}: ${cleanEmail}`);
        return { success: true, hidden: true };
    }

    const token = generateResetToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (!supabase) return { error: "Database not connected" };
    const { error: tokenError } = await supabase
        .from("auth_tokens")
        .upsert({
            email: cleanEmail,
            code: token,
            type: `${type}_reset`,
            expiry: expiry.toISOString()
        }, { onConflict: 'email,type' });

    if (tokenError) {
        console.error("[AUTH] Critical: Could not save Reset Token to auth_tokens table.", tokenError);
        return { error: "Database error. Please check 'auth_tokens' table." };
    }

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}&type=${type}`;
    console.log(`[AUTH] Reset Link Generated: ${resetLink}`);

    await sendEmail({
        to: cleanEmail,
        subject: "Reset Your Password - PREM Properties",
        html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #f2a602; text-align: center;">Password Reset</h2>
                <p>Hello ${userName},</p>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${resetLink}" style="background: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Set New Password</a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.5;">This link will expire in 1 hour. If you link expires, you'll need to request a new one.</p>
                <p style="color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 25px;">If you didn't request this change, you can safely ignore this email.</p>
            </div>
        `
    });

    return { success: true };
}

export async function verifyResetToken(email: string, token: string, type: 'member' | 'admin') {
    const cleanEmail = email.trim().toLowerCase();
    if (!supabase) return { error: "Database not connected" };
    const { data, error } = await supabase
        .from("auth_tokens")
        .select("*")
        .eq("email", cleanEmail)
        .eq("code", token)
        .eq("type", `${type}_reset`)
        .single();

    if (error || !data) return { error: "Invalid or expired reset link" };
    if (new Date(data.expiry) < new Date()) return { error: "Reset link has expired" };

    return { success: true, tokenId: data.id };
}

export async function finalizePasswordReset(email: string, tokenId: string, newPassword: string, type: 'member' | 'admin') {
    const cleanEmail = email.trim().toLowerCase();
    console.log(`[AUTH] Finalizing password reset for ${cleanEmail} (${type})`);

    if (type === 'admin') {
        try {
            const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
            const index = users.findIndex((u: any) => u.email.toLowerCase() === cleanEmail);
            if (index !== -1) {
                users[index].password = newPassword;
                fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
            } else if (cleanEmail === process.env.ADMIN_EMAIL?.toLowerCase()) {
                return { error: "Master admin password is set in .env and cannot be changed here." };
            } else {
                return { error: "User record not found." };
            }
        } catch (e) {
            return { error: "System error: could not update local storage." };
        }
    } else {
        if (!supabase) return { error: "Database not connected" };
        const { error: updateError } = await supabase
            .from("members")
            .update({ password: newPassword })
            .eq("email", cleanEmail);

        if (updateError) return { error: "Failed to update member password in database." };
    }

    // 2. Delete the token
    await supabase.from("auth_tokens").delete().eq("id", tokenId);
    console.log(`[AUTH] Password reset completed for ${cleanEmail}`);

    return { success: true };
}
