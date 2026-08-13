import { NextResponse } from 'next/server';
import { getGoogleAuthURL } from '@/lib/google';

export async function GET(req) {
    try {
        const mode = req.nextUrl.searchParams.get('mode') || 'login';
        const url = getGoogleAuthURL(mode);
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Google URL Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
