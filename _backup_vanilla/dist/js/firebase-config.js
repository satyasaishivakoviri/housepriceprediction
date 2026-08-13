// Firebase Configuration and Helpers
// ====================================
// INSTRUCTIONS: Replace the placeholder values below with your actual Firebase project credentials.
// Get these from: Firebase Console -> Project Settings -> Your apps -> Web app -> firebaseConfig

const firebaseConfig = {
    apiKey: "AIzaSyDOf8g0gVzyaTUxwVJIrSumVGw06MoQw1g",
    authDomain: "house-price-prediction-72b16.firebaseapp.com",
    projectId: "house-price-prediction-72b16",
    storageBucket: "house-price-prediction-72b16.firebasestorage.app",
    messagingSenderId: "931456015691",
    appId: "1:931456015691:web:779084698ee1ffabc89cce",
    measurementId: "G-8B4V16V2XM"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    serverTimestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ========== AUTH HELPERS ==========

// Sign Up with Email/Password
async function signUpWithEmail(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with display name
        await updateProfile(userCredential.user, { displayName: displayName });

        // Send Verification Email
        await sendEmailVerification(userCredential.user);

        // Create user document in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            name: displayName,
            email: email,
            is_verified: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign In with Email/Password
async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign In with Google
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        // Try to create/update user doc, but don't block login if it fails (e.g. offline)
        try {
            const userRef = doc(db, "users", result.user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    uid: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    is_verified: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
        } catch (firestoreError) {
            console.warn("Firestore profile sync failed (non-fatal):", firestoreError);
            // We continue because Auth succeeded
        }

        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Send Verification Email Helper
async function sendVerificationEmail() {
    const user = auth.currentUser;
    if (user) {
        try {
            await sendEmailVerification(user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false, error: "No user logged in" };
}

// Password Reset
async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign Out
async function logOut() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get Current User
function getCurrentUser() {
    return auth.currentUser;
}

// Auth State Listener
function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// ========== FIRESTORE HELPERS ==========

// Save Prediction
async function savePrediction(predictionData) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        const docRef = await addDoc(collection(db, "predictions"), {
            uid: user.uid,
            ...predictionData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get User Predictions
async function getUserPredictions(limitCount = 10) {
    const user = getCurrentUser();
    if (!user) return [];

    try {
        const q = query(
            collection(db, "predictions"),
            where("uid", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching predictions:", error);
        return [];
    }
}

// Save/Unsave Property (Toggle)
async function toggleSaveProperty(propertyId, propertyData) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const savedRef = doc(db, "savedHomes", `${user.uid}_${propertyId}`);

    try {
        const savedDoc = await getDoc(savedRef);
        if (savedDoc.exists()) {
            // Already saved, so unsave
            await deleteDoc(savedRef);
            return { success: true, saved: false };
        } else {
            // Not saved, so save
            await setDoc(savedRef, {
                uid: user.uid,
                propertyId: propertyId,
                ...propertyData,
                savedAt: serverTimestamp()
            });
            return { success: true, saved: true };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check if Property is Saved
async function isPropertySaved(propertyId) {
    const user = getCurrentUser();
    if (!user) return false;

    const savedRef = doc(db, "savedHomes", `${user.uid}_${propertyId}`);
    const savedDoc = await getDoc(savedRef);
    return savedDoc.exists();
}

// Get Saved Homes Count
async function getSavedHomesCount() {
    const user = getCurrentUser();
    if (!user) return 0;

    try {
        const q = query(collection(db, "savedHomes"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        return 0;
    }
}

// Get Predictions Count (Recent Searches)
async function getPredictionsCount() {
    const user = getCurrentUser();
    if (!user) return 0;

    try {
        const q = query(collection(db, "predictions"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        return 0;
    }
}

// Submit Contact Inquiry
async function submitInquiry(propertyId, message) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: "Not authenticated" };

    try {
        await addDoc(collection(db, "inquiries"), {
            uid: user.uid,
            propertyId: propertyId,
            message: message,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get All Saved Homes
async function getSavedHomes(limitCount = 20) {
    const user = getCurrentUser();
    if (!user) return [];

    try {
        const q = query(
            collection(db, "savedHomes"),
            where("uid", "==", user.uid),
            orderBy("savedAt", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching saved homes:", error);
        return [];
    }
}

// Export all functions to window for global access
window.firebaseHelpers = {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logOut,
    getCurrentUser,
    onAuthChange,
    savePrediction,
    getUserPredictions,
    toggleSaveProperty,
    isPropertySaved,
    getSavedHomesCount,
    getPredictionsCount,
    submitInquiry,
    getSavedHomes,
    sendVerificationEmail,
    resetPassword
};

console.log("Firebase initialized. Helpers available at window.firebaseHelpers");
