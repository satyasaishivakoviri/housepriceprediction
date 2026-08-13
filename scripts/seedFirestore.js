const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection } = require("firebase/firestore");
const { properties } = require("../src/lib/mockData");

const firebaseConfig = {
  apiKey: "AIzaSyBYZFsaFTy53mzc93yVvzQWaktmmkAGuxk",
  authDomain: "housepriceprediction-bad95.firebaseapp.com",
  projectId: "housepriceprediction-bad95",
  storageBucket: "housepriceprediction-bad95.firebasestorage.app",
  messagingSenderId: "614162595284",
  appId: "1:614162595284:web:a22ed05bd744e79be0ea41",
  measurementId: "G-VRG529QRY0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  console.log(`🚀 Starting Firestore Data Seed to Project: ${firebaseConfig.projectId}...`);
  console.log(`📦 Seeding ${properties.length} properties to 'properties' collection...`);

  for (const prop of properties) {
    try {
      const docRef = doc(db, "properties", prop.id.toString());
      await setDoc(docRef, {
        ...prop,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Saved: ${prop.name} (${prop.city})`);
    } catch (err) {
      console.error(`❌ Failed to save ${prop.name}:`, err.message);
    }
  }

  // Also seed initial sample user for Admin management
  try {
    const userRef = doc(db, "users", "admin_user");
    await setDoc(userRef, {
      id: "usr_admin",
      name: "Hackathon Admin",
      email: "admin@housepriceprediction.com",
      role: "admin",
      status: "Active",
      created: new Date().toISOString()
    });
    console.log(`✅ Saved sample Admin user to 'users' collection`);
  } catch (err) {
    console.error(`❌ User seed error:`, err.message);
  }

  console.log("🔥 Firestore Data Seeding Completed!");
  process.exit(0);
}

seedData();
