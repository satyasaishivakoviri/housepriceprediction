import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { hashPassword, validatePasswordStrength } from '@/lib/auth';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // 1. Validate Email Input
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 2. Validate Password Complexity (Senior Security Requirement)
        if (!validatePasswordStrength(password)) {
            return NextResponse.json({
                error: 'Password must be at least 8 characters long and include: 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character.'
            }, { status: 400 });
        }

        // 3. Duplication Check (Senior Security Requirement)
        const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
        if (!userQuery.empty) {
            return NextResponse.json({
                code: 'account_exists',
                error: 'User already exists, please log in.'
            }, { status: 409 });
        }

        // 4. Create User in Firebase Authentication Service
        let userRecord;
        try {
            userRecord = await auth.createUser({
                email,
                password,
                displayName: email.split('@')[0],
                emailVerified: true, // Auto-verified per user request
            });

            // Verification Link Generation REMOVED
            // const verificationLink = await auth.generateEmailVerificationLink(email);
            // console.log(...)

        } catch (authError) {
            console.error('Firebase Auth Signup Error:', authError);
            if (authError.code === 'auth/email-already-exists') {
                // Auto-Fix: Check if this is an "orphaned" account (Auth exists, but Firestore doesn't)
                try {
                    const existingUser = await auth.getUserByEmail(email);
                    const existingUserDoc = await db.collection('users').doc(existingUser.uid).get();

                    if (!existingUserDoc.exists) {
                        console.log(`[AutoFix] Found orphaned Auth record for ${email}. Deleting to allow fresh signup.`);
                        await auth.deleteUser(existingUser.uid);

                        // Retry creation
                        userRecord = await auth.createUser({
                            email,
                            password,
                            displayName: email.split('@')[0],
                            emailVerified: true,
                        });
                    } else {
                        // Truly exists
                        return NextResponse.json({
                            code: 'account_exists',
                            error: 'This email is already registered. Please log in instead.'
                        }, { status: 409 });
                    }
                } catch (retryError) {
                    console.error('Auto-fix failed:', retryError);
                    return NextResponse.json({
                        code: 'account_exists',
                        error: 'This email is already registered. Please log in instead.'
                    }, { status: 409 });
                }
            } else {
                throw authError;
            }
        }

        // 5. Hash Password (for custom fallback storage)
        const hashedPassword = await hashPassword(password);

        // 6. Save Profile in Firestore
        // Admin Logic: Auto-assign admin role to specific email
        const role = email === 'saitrishankb9@gmail.com' ? 'admin' : 'user';

        const newUser = {
            uid: userRecord.uid,
            email,
            role, // Store role
            password_hash: hashedPassword,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`,
            google_id: null,
        };

        await db.collection('users').doc(userRecord.uid).set(newUser);

        // 7. Response (Sanitized)
        return NextResponse.json({
            user: {
                id: userRecord.uid,
                email: newUser.email,
                role: newUser.role,
                avatar_url: newUser.avatar_url,
                created_at: newUser.created_at,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
