require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/auth';

async function runHardenedVerification() {
    console.log('🛡️ Starting Hardened Authentication Verification...\n');

    const testEmail = `hardened_${Date.now()}@example.com`;

    // 1. Weak Password Rejection
    console.log('1. Testing Weak Password Rejection...');
    const signupWeak = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'weak' })
    });
    const weakJson = await signupWeak.json();
    if (signupWeak.status === 400 && weakJson.error.includes('uppercase')) {
        console.log('✅ Weak password rejected correctly.');
    } else {
        console.error('❌ Failed: Weak password was not rejected correctly.', signupWeak.status, weakJson);
    }

    // 2. Proper Signup
    console.log('\n2. Testing Complex Password Signup...');
    const signupRes = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'ComplexPassword@123' })
    });
    if (signupRes.status === 201) {
        console.log('✅ Signup Successful.');
    } else {
        console.error('❌ Signup Failed.', await signupRes.text());
    }

    // 3. Anti-Enumeration & HTTP-Only Cookie Login
    console.log('\n3. Testing Login (Cookie Detection)...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'ComplexPassword@123' })
    });

    const cookies = loginRes.headers.get('set-cookie');
    if (loginRes.status === 200 && cookies && cookies.includes('session_token')) {
        console.log('✅ Login Successful and Cookie Set.');
    } else {
        console.error('❌ Login Failed or Cookie Missing.', loginRes.status, cookies);
    }

    // 4. Anti-Enumeration: Wrong Password
    console.log('\n4. Testing Anti-Enumeration (Wrong Password)...');
    const wrongPassRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'WrongPassword@123' })
    });
    const wrongJson = await wrongPassRes.json();
    if (wrongPassRes.status === 401 && wrongJson.error === 'Invalid email or password') {
        console.log('✅ Correct Generic Error Message (Wrong Password).');
    } else {
        console.error('❌ Failed: Improper error message.', wrongJson);
    }

    // 5. Anti-Enumeration: Non-existent User
    console.log('\n5. Testing Anti-Enumeration (Fake Email)...');
    const fakeEmailRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent@example.com', password: 'SomePassword@123' })
    });
    const fakeJson = await fakeEmailRes.json();
    if (fakeEmailRes.status === 401 && fakeJson.error === 'Invalid email or password') {
        console.log('✅ Correct Generic Error Message (Fake Email).');
    } else {
        console.error('❌ Failed: Improper error message.', fakeJson);
    }

    console.log('\n🏁 Hardened Verification Complete.');
}

runHardenedVerification();
