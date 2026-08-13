
import { db, auth } from '../src/lib/firebase.js';

async function resetFirebase() {
    console.log('🔥 Starting Firebase Reset...');

    try {
        // 1. Delete All Auth Users
        console.log('Deleting all Authentication users...');
        const listUsersResult = await auth.listUsers(1000);
        const uids = listUsersResult.users.map(user => user.uid);

        if (uids.length > 0) {
            await auth.deleteUsers(uids);
            console.log(`✅ Deleted ${uids.length} users from Authentication.`);
        } else {
            console.log('ℹ️  No users found in Authentication.');
        }

        // 2. Delete All Firestore Users
        console.log('Deleting all Firestore user documents...');
        const usersSnapshot = await db.collection('users').get();

        if (!usersSnapshot.empty) {
            const batch = db.batch();
            usersSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log(`✅ Deleted ${usersSnapshot.size} documents from 'users' collection.`);
        } else {
            console.log('ℹ️  No documents found in 'users' collection.');
        }

        console.log('✨ Firebase Reset Complete! Implementation is fresh.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Reset Failed:', error);
        process.exit(1);
    }
}

resetFirebase();
