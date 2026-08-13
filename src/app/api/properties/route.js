import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

import { properties as mockProperties } from '@/lib/mockData';

export async function GET() {
    try {
        const snapshot = await db.collection('properties').get();
        if (!snapshot || snapshot.empty) {
            return NextResponse.json(mockProperties);
        }
        const properties = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(properties);
    } catch (error) {
        console.error('❌ API Error fetching properties (Falling back to local):', error);
        return NextResponse.json(mockProperties);
    }
}
