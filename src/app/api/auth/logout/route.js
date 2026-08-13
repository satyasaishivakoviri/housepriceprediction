import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    (await cookies()).set({
        name: 'session_token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Match login route for reliable clearing
        path: '/',
        maxAge: 0 // Expire immediately
    });

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
