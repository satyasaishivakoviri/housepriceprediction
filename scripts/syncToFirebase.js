require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const { properties } = require('../src/lib/generatedProperties');

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error("❌ Missing Firebase credentials in .env.local");
    process.exit(1);
}

// Initialize Admin SDK
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// If FIREBASE_DATABASE_ID is provided and not "(default)", use it. 
// Note: Firestore admin.firestore() defaults to "(default)".
const { getFirestore } = require('firebase-admin/firestore');
const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
const db = getFirestore(admin.app(), (dbId === '(default)') ? undefined : dbId);
console.log(`🚀 Starting sync to Firestore Database: ${dbId}`);

async function syncProperties() {
    const collection = db.collection('properties');
    const batchSize = 100;

    console.log(`📦 Found ${properties.length} properties to sync.`);

    for (let i = 0; i < properties.length; i += batchSize) {
        const batch = db.batch();
        const chunk = properties.slice(i, i + batchSize);

        chunk.forEach(prop => {
            const docRef = collection.doc(prop.id.toString());
            batch.set(docRef, {
                ...prop,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        await batch.commit();
        console.log(`✅ Synced batch ${Math.floor(i / batchSize) + 1} (${chunk.length} items)`);
    }

    console.log("🔥 Successfully synced all properties to Firebase Firestore!");
    process.exit(0);
}

syncProperties().catch(err => {
    console.error("❌ Sync failed:", err);
    process.exit(1);
});
