/**
 * Shared in-memory store for password reset tokens.
 * NOTE: For production, this should be replaced with Redis or a database table
 * to ensure tokens persist across server restarts and multiple instances.
 */
export const resetTokens = new Map<string, { email: string; expiry: Date }>();
