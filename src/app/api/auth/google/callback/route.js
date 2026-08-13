import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { signToken } from '@/lib/auth';
import { getGoogleUser } from '@/lib/google';
import { cookies } from 'next/headers';

export async function GET(req) {
    try {
        const code = req.nextUrl.searchParams.get('code');
        const state = req.nextUrl.searchParams.get('state');
        // 'state' parameter contains the mode ('login' or 'signup') passed from the URL route
        const mode = state || 'login';

        if (!code) {
            return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
        }

        // 1. Exchange Code & Get User Profile
        const isMock = req.headers.get('x-mock-auth') === 'true';
        let googleUser;
        try {
            googleUser = await getGoogleUser(code, isMock);
        } catch (error) {
            console.error('Google Exchange Error:', error);
            const baseUrl = req.nextUrl.origin;
            return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
        }

        const { email, id: googleId, picture, name } = googleUser;

        // 2. Sync with Firebase Authentication Service
        let userRecord;
        console.log(`[GoogleCallback] Processing: email=${email}, mode=${mode}`);
        try {
            userRecord = await auth.getUserByEmail(email);
            console.log(`[GoogleCallback] User found: uid=${userRecord.uid}`);

            // Google Auth Rule: Auto-verify email if it's not verified
            if (!userRecord.emailVerified) {
                await auth.updateUser(userRecord.uid, { emailVerified: true });
                console.log(`[GoogleCallback] Auto-verified email for ${email}`);
            }

            // STRICT MODE: If user EXISTS but we are in SIGNUP mode -> Error
            if (mode === 'signup') {
                console.warn(`[GoogleCallback] STRICT MODE BLOCKED: User exists, but mode is signup.`);
                const baseUrl = req.nextUrl.origin;
                return NextResponse.redirect(`${baseUrl}/login?error=account_exists`);
            }

        } catch (error) {
            console.log(`[GoogleCallback] Lookup Error: ${error.code}`);
            if (error.code === 'auth/user-not-found') {

                // STRICT MODE: If user MISSING but we are in LOGIN mode -> Error
                if (mode === 'login') {
                    const baseUrl = req.nextUrl.origin;
                    return NextResponse.redirect(`${baseUrl}/login?error=account_missing`);
                }

                // Auto-Signup: Create new user (ONLY if mode is 'signup' or default permissive)
                console.log(`Creating new Firebase user for ${email}`);
                try {
                    userRecord = await auth.createUser({
                        email,
                        displayName: name,
                        photoURL: picture,
                        emailVerified: true,
                    });
                } catch (createError) {
                    console.error('Error creating Firebase user:', createError);
                    throw createError;
                }
            } else {
                throw error;
            }
        }

        const uid = userRecord.uid;

        // 3. Find or Create Profile in Firestore using the UID
        const userDocRef = db.collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        let userData;

        if (!userDoc.exists) {
            // New User Scenario
            const role = email === 'saitrishankb9@gmail.com' ? 'admin' : 'user';

            userData = {
                uid,
                email,
                role, // Store role
                google_id: googleId,
                avatar_url: picture,
                name: name,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                password_hash: null,
            };
            await userDocRef.set(userData);
        } else {
            // Existing User Scenario: Update profile info
            await userDocRef.update({
                google_id: googleId,
                avatar_url: picture,
                updated_at: new Date().toISOString(),
            });
            const updatedDoc = await userDocRef.get();
            userData = updatedDoc.data();
        }

        // 4. Generate Token
        // Ensure role is passed (default to user if missing in old docs)
        const token = signToken({
            id: uid,
            email: userData.email,
            role: userData.role || 'user'
        });

        // 5. Redirect with Secure Cookie
        const baseUrl = req.nextUrl.origin;
        // Redirect with success flag
        const response = NextResponse.redirect(`${baseUrl}/login?login_success=true`);

        (await cookies()).set({
            name: 'session_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Google Callback Error:', error);
        const baseUrl = req.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
    }
}
