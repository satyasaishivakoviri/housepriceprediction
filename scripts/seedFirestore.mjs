import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYZFsaFTy53mzc93yVvzQWaktmmkAGuxk",
  authDomain: "housepriceprediction-bad95.firebaseapp.com",
  projectId: "housepriceprediction-bad95",
  storageBucket: "housepriceprediction-bad95.firebasestorage.app",
  messagingSenderId: "614162595284",
  appId: "1:614162595284:web:a22ed05bd744e79be0ea41",
  measurementId: "G-VRG529QRY0"
};

const sampleProperties = [
    {
        id: "prop_1",
        name: "Palm Grove Luxury Estate",
        locality: "Bandra West",
        city: "Mumbai",
        price: 24500000,
        bedrooms: 3,
        bathrooms: 3,
        sqft: 1850,
        status: "Active",
        safetyScore: 94,
        pricePerSqft: 13243,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        description: "Sea-facing luxury apartment in heart of Bandra with Vastu compliant layout."
    },
    {
        id: "prop_2",
        name: "Jubilee Hills Grand Villa",
        locality: "Jubilee Hills",
        city: "Hyderabad",
        price: 48000000,
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3600,
        status: "Active",
        safetyScore: 96,
        pricePerSqft: 13333,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: "Gated community luxury villa with private pool, solar grid, and EV charging station."
    },
    {
        id: "prop_3",
        name: "Indiranagar Modern Duplex",
        locality: "Indiranagar",
        city: "Bangalore",
        price: 19500000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1550,
        status: "Active",
        safetyScore: 91,
        pricePerSqft: 12580,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        description: "Ultra-modern smart home with high tech automation near 100ft Road Indiranagar."
    },
    {
        id: "prop_4",
        name: "DLF Phase 5 Skyline Suite",
        locality: "DLF Phase 5",
        city: "Gurgaon",
        price: 32000000,
        bedrooms: 3,
        bathrooms: 3,
        sqft: 2200,
        status: "Active",
        safetyScore: 95,
        pricePerSqft: 14545,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        description: "High-rise luxury suite overlooking Golf Course Road with 24x7 security."
    },
    {
        id: "prop_5",
        name: "Koregaon Park Green Haven",
        locality: "Koregaon Park",
        city: "Pune",
        price: 16500000,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1300,
        status: "Active",
        safetyScore: 93,
        pricePerSqft: 12692,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        description: "Boutique residential apartment with serene tree-lined avenue views."
    }
];

const sampleUsers = [
    {
        id: "usr_1",
        name: "Trishank B",
        email: "saitrishankb9@gmail.com",
        role: "admin",
        status: "Active",
        created: new Date().toISOString()
    },
    {
        id: "usr_2",
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        role: "buyer",
        status: "Active",
        created: new Date().toISOString()
    },
    {
        id: "usr_3",
        name: "Ananya Iyer",
        email: "ananya.i@example.com",
        role: "seller",
        status: "Active",
        created: new Date().toISOString()
    }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedData() {
  console.log(`🚀 Seeding Firestore Database (projectId: ${firebaseConfig.projectId})...`);

  for (const prop of sampleProperties) {
    try {
      await setDoc(doc(db, "properties", prop.id), {
        ...prop,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Collection 'properties' -> Added: ${prop.name}`);
    } catch (err) {
      console.error(`❌ Property error: ${err.message}`);
    }
  }

  for (const user of sampleUsers) {
    try {
      await setDoc(doc(db, "users", user.id), {
        ...user,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Collection 'users' -> Added: ${user.name} (${user.role})`);
    } catch (err) {
      console.error(`❌ User error: ${err.message}`);
    }
  }

  console.log("\n🎉 Firestore Collections Successfully Seeded & Visible in Firebase Console!");
  process.exit(0);
}

seedData();
