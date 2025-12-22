import { cookies } from "next/headers";

export async function getMemberSession() {
    const cookieStore = cookies();
    const session = cookieStore.get("member-session");

    if (!session) return null;

    try {
        const decodedValue = decodeURIComponent(session.value);
        const decoded = JSON.parse(Buffer.from(decodedValue, "base64").toString("utf-8"));

        if (decoded && decoded.authenticated) {
            return decoded;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export async function isMember() {
    const session = await getMemberSession();
    return !!session;
}
