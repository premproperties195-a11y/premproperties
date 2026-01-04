/**
 * Shared in-memory store for password reset tokens.
 * NOTE: For production, this should be replaced with Redis or a database table
 * to ensure tokens persist across server restarts and multiple instances.
 */
const globalForTokens = global as unknown as { resetTokens: Map<string, { email: string; expiry: Date }> };

export const resetTokens = globalForTokens.resetTokens || new Map<string, { email: string; expiry: Date }>();

if (process.env.NODE_ENV !== 'production') globalForTokens.resetTokens = resetTokens;
