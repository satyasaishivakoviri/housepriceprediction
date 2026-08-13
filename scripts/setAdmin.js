// Script to set a user's role to 'admin' in Firestore
// Usage: node scripts/setAdmin.js

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
const db = admin.firestore(admin.app());
// Use named DB if specified
const firestore = dbId !== '(default)' 
    ? require('firebase-admin/firestore').getFirestore(admin.app(), dbId)
    : db;

const EMAIL = 'saitrishankb9@gmail.com';

async function setAdmin() {
    console.log(`🔍 Looking for user: ${EMAIL} in database: ${dbId}`);
    
    const userQuery = await firestore.collection('users').where('email', '==', EMAIL).limit(1).get();
    
    if (userQuery.empty) {
        console.log('❌ User not found in Firestore. They may need to sign up first.');
        process.exit(1);
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    console.log(`✅ Found user: ${userData.email} (current role: ${userData.role || 'user'})`);
    
    await firestore.collection('users').doc(userDoc.id).update({ role: 'admin' });
    console.log(`🔑 Role updated to: admin`);
    
    // Verify
    const updated = await firestore.collection('users').doc(userDoc.id).get();
    console.log(`✅ Verified role: ${updated.data().role}`);
}

setAdmin().then(() => process.exit(0)).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
