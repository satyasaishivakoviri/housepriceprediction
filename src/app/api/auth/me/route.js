import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            cookieStore.delete('session_token');
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
        }

        const userDoc = await db.collection('users').doc(decoded.userId).get();

        if (!userDoc.exists) {
            cookieStore.delete('session_token');
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        return NextResponse.json({
            user: {
                id: userDoc.id,
                email: userData.email,
                avatar_url: userData.avatar_url,
                phone: userData.phone || '',
                name: userData.name || userData.email.split('@')[0],
                role: userData.role || 'buyer',
                preferences: userData.preferences || null,
                alternate_contact: userData.alternate_contact || '',
                company_name: userData.company_name || '',
                rera_license: userData.rera_license || '',
                created_at: userData.created_at,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Me API Error:', error);
        return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, role, preferences, alternate_contact, company_name, rera_license } = body;

        const updateData = {
            updated_at: new Date().toISOString(),
        };

        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;
        if (preferences !== undefined) updateData.preferences = preferences;
        if (alternate_contact !== undefined) updateData.alternate_contact = alternate_contact;
        if (company_name !== undefined) updateData.company_name = company_name;
        if (rera_license !== undefined) updateData.rera_license = rera_license;

        await db.collection('users').doc(decoded.userId).update(updateData);

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Update Profile API Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
