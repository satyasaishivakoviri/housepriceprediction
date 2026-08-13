
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
    try {
        // 1. Verify Admin Session
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            // Strict Admin Check
            console.warn(`[AdminAPI] Unauthorized access attempt by ${decoded?.email || 'unknown'}`);
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Fetch Stats
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());

        // Sort by date desc
        users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const stats = {
            totalUsers: usersSnapshot.size,
            users: users, // For MVP we return full list, for scale we would paginate
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
