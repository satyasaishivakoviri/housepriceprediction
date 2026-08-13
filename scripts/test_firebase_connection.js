require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

console.log('Testing Firebase Connection (Named DB)...');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
const DATABASE_ID = 'newhouseprice'; // Detected from screenshot
console.log('Target Database:', DATABASE_ID);

async function testConnection() {
    try {
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
            });
        }

        // Explicitly connect to the named database
        const db = getFirestore(admin.app(), DATABASE_ID);

        const testRef = db.collection('test_connection').doc('ping');
        await testRef.set({ timestamp: new Date().toISOString(), status: 'ok', db: DATABASE_ID });
        console.log(`✅ Firebase Connection Successful to '${DATABASE_ID}'! Wrote to test_connection/ping`);
    } catch (error) {
        console.error('❌ Firebase Connection Failed:');
        console.error(JSON.stringify(error, null, 2));
    }
}

testConnection();
