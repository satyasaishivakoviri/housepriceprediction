const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function listUsers() {
    console.log('--- Fetching Registered Users ---');
    try {
        // Initialize Firebase Admin (Assuming service account is in env or typical location)
        // Since we are running in the same repo, we'll try to use the existing config logic
        // This is a simplified version for quick listing
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        if (!process.apps || process.apps.length === 0) {
            initializeApp({
                credential: cert(serviceAccount)
            });
        }

        const db = getFirestore();
        const snapshot = await db.collection('users').get();

        if (snapshot.empty) {
            console.log('No users found in the "users" collection.');
            return;
        }

        console.log(`Total Users: ${snapshot.size}\n`);
        console.log('EMAILS:');
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- ${data.email} (UID: ${doc.id})`);
        });

    } catch (error) {
        console.error('Error fetching users:', error.message);
        console.log('\nTIP: Ensure your .env.local has the FIREBASE_SERVICE_ACCOUNT variable configured.');
    }
}

listUsers();
