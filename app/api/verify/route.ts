import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get('admin-session');

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        try {
            // Decode session data
            const decodedJson = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
            const userData = JSON.parse(decodedJson);

            if (userData && userData.authenticated) {
                return NextResponse.json({
                    authenticated: true,
                    user: {
                        id: userData.userId,
                        email: userData.email,
                        role: userData.role,
                        permissions: userData.permissions
                    }
                });
            }
        } catch (e) {
            console.error('Verify API decoding error:', e);
        }

        return NextResponse.json({ authenticated: false }, { status: 401 });
    } catch (error) {
        console.error('Verify API error:', error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
