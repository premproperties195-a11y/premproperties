import { cookies } from "next/headers";

export async function getSession() {
    const cookieStore = cookies();
    const session = cookieStore.get("admin-session");

    if (!session) return null;

    try {
        // Use decodeURIComponent in case the cookie was URL-encoded by the browser
        const decodedValue = decodeURIComponent(session.value);
        const decoded = JSON.parse(Buffer.from(decodedValue, "base64").toString("utf-8"));
        return decoded;
    } catch (e) {
        console.error("Session decode error:", e);
        return null;
    }
}

export async function hasPermission(permission: string) {
    const session = await getSession();
    if (!session || !session.authenticated) return false;

    if (session.role === "super_admin") return true;

    // permissions are stored as an array of strings like ["Properties", "Media"]
    return session.permissions.includes(permission);
}

export async function isSuperAdmin() {
    const session = await getSession();
    return session && session.authenticated && session.role === "super_admin";
}
