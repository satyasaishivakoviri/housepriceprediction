require('dotenv').config({ path: '.env.local' });
const BASE_URL = 'http://localhost:3000/api/auth';
// Note: The main app automatically picks up FIREBASE_DATABASE_ID from .env.local via src/lib/firebase.js

async function runVerification() {
    console.log('🚀 Starting Authentication Backend Verification...\n');

    // 1. Signup
    console.log('1. Testing Signup...');
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        const signupRes = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const signupData = await signupRes.json();
        if (signupRes.status === 201) {
            console.log('✅ Signup Successful:', signupData.user.email);
        } else {
            console.error('❌ Signup Failed:', signupData);
        }

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginData = await loginRes.json();
        let token = '';

        if (loginRes.status === 200) {
            console.log('✅ Login Successful. Token received.');
            token = loginData.token;
        } else {
            console.error('❌ Login Failed:', loginData);
            return; // Stop if login fails
        }

        // 3. Protected Route (Me)
        console.log('\n3. Testing Protected Route (/me)...');
        const meRes = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const meData = await meRes.json();
        if (meRes.status === 200) {
            console.log('✅ Protected Route Access Successful:', meData.user.email);
        } else {
            console.error('❌ Protected Route Failed:', meData);
        }

        // 4. Google OAuth Mock
        console.log('\n4. Testing Google OAuth Callback (Mock)...');
        const googleRes = await fetch(`${BASE_URL}/google/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-mock-auth': 'true' // Trigger Mock Mode
            },
            body: JSON.stringify({ code: 'mock_auth_code' })
        });

        const googleData = await googleRes.json();
        if (googleRes.status === 200) {
            console.log('✅ Google Auth Successful:', googleData.user.email);
            console.log('   Token:', googleData.token ? 'Received' : 'Missing');
        } else {
            console.error('❌ Google Auth Failed:', googleData);
        }

    } catch (error) {
        console.error('🚨 Verification Error:', error);
    }
}

runVerification();
