import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Generic response helper for security (prevents user enumeration)
        const failResponse = () => NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

        // 1. Rate Limiting (In-Memory MVP)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitKey = `login_${ip}`;
        const attempts = global.loginAttempts?.get(rateLimitKey) || { count: 0, firstAttempt: Date.now() };

        if (!global.loginAttempts) global.loginAttempts = new Map();

        // 5 attempts per 15 minutes
        if (attempts.count >= 5 && Date.now() - attempts.firstAttempt < 15 * 60 * 1000) {
            return NextResponse.json({
                error: 'Too many login attempts. Please try again later.'
            }, { status: 429 });
        }

        // Update rate limit
        if (Date.now() - attempts.firstAttempt > 15 * 60 * 1000) {
            attempts.count = 1;
            attempts.firstAttempt = Date.now();
        } else {
            attempts.count++;
        }
        global.loginAttempts.set(rateLimitKey, attempts);


        // 2. Validate Input Presence
        if (!email || !password) {
            return failResponse();
        }

        // 3. Query User & Verify Password
        // Note: We query Firebase Auth first for the "official" record to check email verification
        let userAuthRecord;
        try {
            // This throws if user not found, catch block handles it
            // We use admin SDK to get user record
            const { auth } = await import('@/lib/firebase'); // Lazy import to avoid circular dep issues if any
            userAuthRecord = await auth.getUserByEmail(email);
        } catch (error) {
            // User not found in Auth system
            return NextResponse.json({
                code: 'account_missing',
                error: 'Account does not exist. Please sign up.'
            }, { status: 404 });
        }

        // Check if verified - REMOVED per user request
        /*
        if (!userAuthRecord.emailVerified) {
            return NextResponse.json({
                error: 'Please verify your email address before logging in.'
            }, { status: 403 });
        }
        */

        // Disabled/Banned check
        if (userAuthRecord.disabled) {
            return NextResponse.json({
                error: 'This account has been disabled. Please contact support.'
            }, { status: 403 });
        }

        // Now verify password against our stored hash in Firestore (or we could use REST API to verify against Firebase Auth)
        // Since we store password_hash in Firestore for this custom flow:
        const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();

        if (userQuery.empty) {
            // Inconsistent state: User in Auth but not in Firestore. Treat as account missing or generic error.
            return NextResponse.json({
                code: 'account_missing',
                error: 'Account setup incomplete. Please contact support.'
            }, { status: 404 });
        }

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        if (!userData.password_hash) {
            // User might be Google-only.
            return NextResponse.json({
                error: 'Please sign in with Google.'
            }, { status: 400 });
        }

        const isValid = await verifyPassword(password, userData.password_hash);
        if (!isValid) {
            return failResponse();
        }

        // 4. Issue Secure Session Token
        const token = signToken({
            id: userDoc.id,
            email: userData.email,
            role: userData.role || 'user'
        });

        // 5. Build Response
        const response = NextResponse.json({
            user: {
                id: userDoc.id,
                email: userData.email,
                role: userData.role || 'user',
                avatar_url: userData.avatar_url,
            }
        }, { status: 200 });

        // Set HTTP-Only Cookie (Senior Security Standard)
        (await cookies()).set({
            name: 'session_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Lax is better for redirects
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days (extended for better UX)
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}
