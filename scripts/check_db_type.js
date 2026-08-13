require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

console.log('🔍 Diagnosing Database Type...\n');

// Initialize App
if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    let finalKey = privateKey;
    try {
        if (privateKey && privateKey.trim().startsWith('{')) {
            finalKey = JSON.parse(privateKey).private_key || privateKey;
        }
    } catch (e) { }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: finalKey,
        }),
        // Realtime DB URL format provided it exists
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
    });
}

async function checkFirestore() {
    console.log('1️⃣  Checking Cloud Firestore...');
    try {
        const db = admin.firestore();
        await db.collection('test').doc('ping').set({ t: Date.now() });
        console.log('✅ Cloud Firestore is ACTIVE and Working!');
        return true;
    } catch (error) {
        console.log(`❌ Cloud Firestore Error: ${error.code} - ${error.message}`);
        if (error.code === 5) {
            console.log('   (Code 5 NOT_FOUND means the Firestore Database instance does not exist)');
        }
        return false;
    }
}

async function checkRealtimeDB() {
    console.log('\n2️⃣  Checking Realtime Database...');
    try {
        const db = admin.database();
        await db.ref('test/ping').set({ t: Date.now() });
        console.log('✅ Realtime Database is ACTIVE and Working!');
        return true;
    } catch (error) {
        console.log(`❌ Realtime Database Error: ${error.code} - ${error.message}`);
        return false;
    }
}

async function run() {
    const hasFirestore = await checkFirestore();
    const hasRTDB = await checkRealtimeDB();

    console.log('\n📊 Diagnosis Result:');
    if (hasFirestore) {
        console.log('You have Cloud Firestore. The previous error might have been a fluke.');
    } else if (hasRTDB) {
        console.log('You have REALTIME DATABASE, but NOT Cloud Firestore.');
        console.log('My code is currently written for Cloud Firestore.');
    } else {
        console.log('Neither database seems to be accessible.');
    }
}

run();
