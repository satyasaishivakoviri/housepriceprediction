
const fs = require('fs');
const path = require('path');

// --- 1. CONFIGURATION: CITIES & LOCALITIES (Real Market Data) ---
const CITIES = {
    "Mumbai": {
        localities: [
            { name: "Bandra West", priceRange: [45000, 85000], type: "Luxury" },
            { name: "Lower Parel", priceRange: [35000, 65000], type: "Luxury" },
            { name: "Worli", priceRange: [40000, 75000], type: "Luxury" },
            { name: "Andheri West", priceRange: [22000, 35000], type: "Premium" },
            { name: "Powai", priceRange: [20000, 32000], type: "Premium" },
            { name: "Malad West", priceRange: [15000, 22000], type: "Mid-Range" },
            { name: "Borivali East", priceRange: [16000, 24000], type: "Mid-Range" },
            { name: "Goregaon East", priceRange: [18000, 28000], type: "Premium" },
            { name: "Chembur", priceRange: [19000, 29000], type: "Premium" },
            { name: "Thane West", priceRange: [10000, 18000], type: "Budget" }
        ],
        lat: 19.0760, lng: 72.8777
    },
    "Bangalore": {
        localities: [
            { name: "Whitefield", priceRange: [6500, 10500], type: "Mid-Range" },
            { name: "Indiranagar", priceRange: [12000, 22000], type: "Luxury" },
            { name: "Koramangala", priceRange: [11000, 20000], type: "Luxury" },
            { name: "Electronic City", priceRange: [4500, 7500], type: "Budget" },
            { name: "HSR Layout", priceRange: [8000, 14000], type: "Premium" },
            { name: "Sarjapur Road", priceRange: [5500, 9500], type: "Mid-Range" },
            { name: "Bellandur", priceRange: [6000, 11000], type: "Mid-Range" },
            { name: "Hebbal", priceRange: [9000, 16000], type: "Premium" },
            { name: "Jayanagar", priceRange: [10000, 18000], type: "Premium" },
            { name: "Yelahanka", priceRange: [5000, 8500], type: "Budget" }
        ],
        lat: 12.9716, lng: 77.5946
    },
    "Delhi NCR": {  // Merging Delhi, Gurgaon, Noida for breadth
        localities: [
            { name: "Vasant Vihar (Delhi)", priceRange: [35000, 65000], type: "Luxury" },
            { name: "Greater Kailash (Delhi)", priceRange: [25000, 45000], type: "Luxury" },
            { name: "Dwarka (Delhi)", priceRange: [8000, 14000], type: "Mid-Range" },
            { name: "DLF Phase 5 (Gurgaon)", priceRange: [18000, 35000], type: "Luxury" },
            { name: "Golf Course Road (Gurgaon)", priceRange: [22000, 42000], type: "Luxury" },
            { name: "Sohna Road (Gurgaon)", priceRange: [7000, 12000], type: "Mid-Range" },
            { name: "Sector 150 (Noida)", priceRange: [6500, 9500], type: "Budget" },
            { name: "Sector 44 (Noida)", priceRange: [10000, 16000], type: "Premium" },
            { name: "Saket (Delhi)", priceRange: [18000, 30000], type: "Premium" },
            { name: "Cyber City (Gurgaon)", priceRange: [15000, 25000], type: "Premium" }
        ],
        lat: 28.6139, lng: 77.2090
    },
    "Hyderabad": {
        localities: [
            { name: "Jubilee Hills", priceRange: [20000, 45000], type: "Luxury" },
            { name: "Banjara Hills", priceRange: [18000, 40000], type: "Luxury" },
            { name: "Gachibowli", priceRange: [8000, 15000], type: "Premium" },
            { name: "Hitech City", priceRange: [9000, 16000], type: "Premium" },
            { name: "Kondapur", priceRange: [7000, 12000], type: "Mid-Range" },
            { name: "Manikonda", priceRange: [5500, 9500], type: "Budget" },
            { name: "Kukatpally", priceRange: [6000, 10000], type: "Mid-Range" },
            { name: "Miyapur", priceRange: [4500, 7500], type: "Budget" }
        ],
        lat: 17.3850, lng: 78.4867
    },
    "Pune": {
        localities: [
            { name: "Koregaon Park", priceRange: [15000, 25000], type: "Luxury" },
            { name: "Kalyani Nagar", priceRange: [12000, 20000], type: "Premium" },
            { name: "Hinjewadi", priceRange: [5500, 8500], type: "Budget" },
            { name: "Wakad", priceRange: [6000, 9000], type: "Mid-Range" },
            { name: "Baner", priceRange: [7500, 12000], type: "Premium" },
            { name: "Viman Nagar", priceRange: [9000, 14000], type: "Premium" },
            { name: "Hadapsar", priceRange: [6000, 10000], type: "Mid-Range" },
            { name: "Kharadi", priceRange: [7000, 11000], type: "Mid-Range" }
        ],
        lat: 18.5204, lng: 73.8567
    },
    "Chennai": {
        localities: [
            { name: "Boat Club Road", priceRange: [25000, 45000], type: "Luxury" },
            { name: "Poes Garden", priceRange: [20000, 40000], type: "Luxury" },
            { name: "Adyar", priceRange: [12000, 20000], type: "Premium" },
            { name: "Velachery", priceRange: [6500, 10000], type: "Mid-Range" },
            { name: "OMR", priceRange: [4500, 7500], type: "Budget" },
            { name: "Anna Nagar", priceRange: [11000, 18000], type: "Premium" },
            { name: "Besant Nagar", priceRange: [13000, 22000], type: "Premium" },
            { name: "Porur", priceRange: [5000, 8000], type: "Budget" }
        ],
        lat: 13.0827, lng: 80.2707
    },
    "Kolkata": {
        localities: [
            { name: "Ballygunge", priceRange: [10000, 18000], type: "Luxury" },
            { name: "Alipore", priceRange: [12000, 22000], type: "Luxury" },
            { name: "Salt Lake", priceRange: [6000, 11000], type: "Premium" },
            { name: "New Town", priceRange: [4500, 7500], type: "Mid-Range" },
            { name: "Rajarhat", priceRange: [4000, 6500], type: "Budget" },
            { name: "Tollygunge", priceRange: [5000, 9000], type: "Mid-Range" }
        ],
        lat: 22.5726, lng: 88.3639
    },
    "Ahmedabad": {
        localities: [
            { name: "Sindhu Bhavan Road", priceRange: [7000, 12000], type: "Luxury" },
            { name: "Satellite", priceRange: [5500, 9000], type: "Premium" },
            { name: "Prahlad Nagar", priceRange: [6000, 9500], type: "Premium" },
            { name: "Bopal", priceRange: [3500, 6000], type: "Budget" },
            { name: "Gota", priceRange: [3000, 5500], type: "Budget" },
            { name: "Bodakdev", priceRange: [6500, 11000], type: "Premium" }
        ],
        lat: 23.0225, lng: 72.5714
    }
};

const BUILDERS = ["Lodha", "Godrej", "Prestige", "DLF", "Sobha", "Oberoi Realty", "Hiranandani", "Brigade", "Puravankara", "Mahindra Lifespaces", "Tata Housing", "Kalpataru", "Rustomjee", "Shapoorji Pallonji", "Runwal"];
const SUFFIXES = ["Residency", "Gardens", "Greens", "Heights", "Towers", "City", "Park", "Meadows", "Enclave", "World", "Exotica", "Splendour", "Grande", "Vistas", "Hills"];
const AMENITIES_POOL = ["Pool", "Gym", "Clubhouse", "Park", "Security", "Parking", "Lift", "Power Backup", "Spa", "Tennis Court", "Jogging Track", "Banquet Hall", "Library", "Mini Theatre", "Squash Court", "Yoga Deck"];

// --- 2. HELPERS ---
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickMultiple = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};

// --- 3. GENERATOR LOGIC ---
function generateProperties(count = 500) {
    const properties = [];
    let id = 1;

    // Distribute count across cities roughly
    const cityNames = Object.keys(CITIES);

    cityNames.forEach(city => {
        const cityData = CITIES[city];
        cityData.localities.forEach(loc => {
            // Generate approx number of props per locality
            const numProps = rand(5, 12);

            for (let i = 0; i < numProps; i++) {
                const builder = pick(BUILDERS);
                const suffix = pick(SUFFIXES);
                const name = `${builder} ${suffix}`;

                const bhk = rand(1, 5); // 1 to 5 BHK
                const sqftBase = bhk === 1 ? rand(550, 750) : bhk === 2 ? rand(900, 1300) : bhk === 3 ? rand(1400, 2000) : bhk === 4 ? rand(2200, 3500) : rand(3800, 6000);

                // Price Calculation
                const [minRate, maxRate] = loc.priceRange;
                const pricePerSqft = rand(minRate, maxRate);
                // Add some variation based on random 'premium' factor (floor rise, view etc)
                const finalRate = Math.round(pricePerSqft * (1 + (Math.random() * 0.2 - 0.1)));
                const price = Math.round(finalRate * sqftBase);

                // Derived attributes
                const floor = rand(1, 40);
                const totalFloors = floor + rand(2, 20);
                const age = rand(0, 15);
                const status = Math.random() > 0.8 ? "pending" : "active";
                const isTrending = Math.random() > 0.85;
                const isNew = age === 0 && Math.random() > 0.5;
                const hasPriceDrop = !isNew && Math.random() > 0.9;

                const amenities = pickMultiple(AMENITIES_POOL, rand(4, 10));

                // Lat/Lng jitter for map distribution (approx 1-2km spread)
                const latJitter = (Math.random() - 0.5) * 0.04;
                const lngJitter = (Math.random() - 0.5) * 0.04;

                const openHouseDate = Math.random() > 0.8 ?
                    new Date(2026, 1, 14 + rand(1, 14)).toISOString().split('T')[0] : null;

                properties.push({
                    id: id++,
                    name: name,
                    city: city === "Delhi NCR" ? (loc.name.includes("Noida") ? "Noida" : loc.name.includes("Gurgaon") ? "Gurgaon" : "Delhi") : city,
                    locality: loc.name.split(" (")[0], // Clean locality name
                    price: price,
                    pricePerSqft: finalRate,
                    sqft: sqftBase,
                    bedrooms: bhk,
                    bathrooms: bhk >= 3 ? bhk : bhk, // Approx logic
                    type: bhk > 3 || loc.type === "Luxury" ? (Math.random() > 0.7 ? "Villa" : "Apartment") : "Apartment",
                    floor: floor,
                    totalFloors: totalFloors,
                    age: age,
                    amenities: amenities,
                    status: status,
                    views: rand(100, 5000),
                    inquiries: rand(5, 100),
                    daysListed: rand(1, 45), // More fresh listings
                    openHouseDate: openHouseDate,
                    image: `https://images.unsplash.com/photo-${pick(['1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1564013799919-ab600027ffc6', '1512917774080-9991f1c4c750', '1580587771525-78b9dba3b914'])}?w=800&h=600&fit=crop`, // Reusing unsplash IDs for now
                    lat: cityData.lat + latJitter,
                    lng: cityData.lng + lngJitter,
                    trending: isTrending,
                    newListing: isNew,
                    priceDropped: hasPriceDrop,
                    saves: rand(10, 500),
                    ctr: (Math.random() * 10 + 2).toFixed(1),
                    impressions: rand(1000, 50000),
                    hoaMonthly: loc.type === "Luxury" ? rand(8000, 25000) : rand(2000, 6000),
                    marketTemp: loc.type === "Luxury" ? "hot" : "warm",
                    rentEstimate: Math.round(price * 0.0025), // Approx 3% rental yield annual -> 0.25% monthly
                    resalePotential: rand(70, 98),
                    safetyScore: rand(75, 95),
                    commuteScore: rand(60, 95)
                });
            }
        });
    });

    return properties;
}

const allProps = generateProperties();
console.log(`Generated ${allProps.length} properties.`);
console.log(JSON.stringify(allProps.slice(0, 2), null, 2));

// Export if needed, but for now we'll just copy-paste or write to file
const outputContent = `export const properties = ${JSON.stringify(allProps, null, 4)};`;
fs.writeFileSync(path.join(__dirname, '../src/lib/generatedProperties.js'), outputContent);
console.log("Wrote to src/lib/generatedProperties.js");
