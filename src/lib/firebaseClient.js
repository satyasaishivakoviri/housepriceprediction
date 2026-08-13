// Firebase Web SDK Configuration & Dynamic Firestore Client Helpers
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
    getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBYZFsaFTy53mzc93yVvzQWaktmmkAGuxk",
  authDomain: "housepriceprediction-bad95.firebaseapp.com",
  projectId: "housepriceprediction-bad95",
  storageBucket: "housepriceprediction-bad95.firebasestorage.app",
  messagingSenderId: "614162595284",
  appId: "1:614162595284:web:a22ed05bd744e79be0ea41",
  measurementId: "G-VRG529QRY0"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const dbClient = getFirestore(app);
export const authClient = getAuth(app);

// Initialize Analytics dynamically on client
export let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }).catch(() => {});
}

/**
 * Fetch all live properties from Firestore 'properties' collection
 */
export async function getLiveProperties() {
    try {
        const querySnapshot = await getDocs(collection(dbClient, "properties"));
        const propertiesList = [];
        querySnapshot.forEach((docSnap) => {
            propertiesList.push({ id: docSnap.id, ...docSnap.data() });
        });
        return propertiesList;
    } catch (error) {
        console.warn("Firestore fetch notice: Falling back to local state", error);
        return [];
    }
}

/**
 * Add a property live to Firestore 'properties' collection
 */
export async function addLiveProperty(propertyData) {
    try {
        const docRef = await addDoc(collection(dbClient, "properties"), {
            ...propertyData,
            createdAt: new Date().toISOString()
        });
        return { id: docRef.id, success: true };
    } catch (error) {
        console.error("Firestore add error:", error);
        return { success: false, error };
    }
}

/**
 * Delete a property from Firestore
 */
export async function deleteLiveProperty(propertyId) {
    try {
        await deleteDoc(doc(dbClient, "properties", propertyId));
        return { success: true };
    } catch (error) {
        console.error("Firestore delete error:", error);
        return { success: false, error };
    }
}

/**
 * Save user profile to Firestore 'users' collection
 */
export async function saveLiveUser(userData) {
    try {
        const userRef = doc(dbClient, "users", userData.uid || userData.email);
        await setDoc(userRef, {
            ...userData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Firestore user save error:", error);
        return { success: false, error };
    }
}
