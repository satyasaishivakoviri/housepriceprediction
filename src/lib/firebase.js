import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Mock Firestore for Development/Testing without Keys
class MockFirestore {
    constructor() {
        this.data = {};
        console.log('⚠️  Mock Firestore Initialized');
    }

    collection(name) {
        return {
            add: async (doc) => {
                const id = Math.random().toString(36).substring(7);
                if (!this.data[name]) this.data[name] = {};
                this.data[name][id] = doc;
                return { id, get: async () => ({ exists: true, data: () => doc, id }) };
            },
            doc: (id) => {
                return {
                    set: async (doc) => {
                        if (!this.data[name]) this.data[name] = {};
                        this.data[name][id] = { ...this.data[name][id], ...doc };
                        return { id };
                    },
                    get: async () => {
                        const doc = this.data[name]?.[id];
                        return { exists: !!doc, data: () => doc, id };
                    },
                    update: async (updates) => {
                        if (!this.data[name] || !this.data[name][id]) throw new Error('Document not found');
                        this.data[name][id] = { ...this.data[name][id], ...updates };
                    }
                }
            },
            where: (field, op, value) => {
                return {
                    limit: (n) => ({
                        get: async () => {
                            const docs = Object.entries(this.data[name] || {})
                                .filter(([_, doc]) => {
                                    if (op === '==') return doc[field] === value;
                                    return false;
                                })
                                .map(([id, doc]) => ({ id, data: () => doc }));
                            return { empty: docs.length === 0, docs, size: docs.length };
                        }
                    })
                };
            }
        };
    }
}

// Mock Auth service
class MockAuth {
    constructor() {
        this.users = {};
    }
    async createUser(data) {
        const uid = 'mock-uid-' + Math.random().toString(36).substring(7);
        this.users[data.email] = { uid, ...data };
        return { uid };
    }
    async getUserByEmail(email) {
        const user = this.users[email];
        if (!user) throw { code: 'auth/user-not-found' };
        return user;
    }
    async updateUser(uid, data) {
        return { uid };
    }
}

let dbInstance;
let authInstance;

if (!admin.apps.length) {
    try {
        const hasValidKey = process.env.FIREBASE_PRIVATE_KEY && 
                            !process.env.FIREBASE_PRIVATE_KEY.includes('demo') && 
                            process.env.FIREBASE_PRIVATE_KEY.length > 100;

        if (process.env.USE_MOCK_DB === 'true') {
            console.warn('⚠️ Force using MOCK Services (USE_MOCK_DB=true).');
            dbInstance = new MockFirestore();
            authInstance = new MockAuth();
        } else if (process.env.FIREBASE_PROJECT_ID && hasValidKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });

            const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
            console.log(`✅ Firebase Admin Initialized. Connecting to: ${dbId}`);

            dbInstance = getFirestore(admin.app(), dbId);
            authInstance = getAuth(admin.app());

        } else {
            dbInstance = new MockFirestore();
            authInstance = new MockAuth();
        }
    } catch (error) {
        console.error('❌ Firebase Init Error:', error);
        dbInstance = new MockFirestore();
        authInstance = new MockAuth();
    }
} else {
    try {
        const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
        dbInstance = getFirestore(admin.app(), dbId);
        authInstance = getAuth(admin.app());
    } catch (e) {
        dbInstance = new MockFirestore();
        authInstance = new MockAuth();
    }
}

export const db = dbInstance;
export const auth = authInstance;
