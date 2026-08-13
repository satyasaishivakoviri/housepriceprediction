// =============================================
// HomieNest — Enterprise Mock Data Engine (Indian Context)
// Real property images via Unsplash + 99acres-style realistic data
// =============================================

import { properties as generatedProperties } from './generatedProperties';

// --- Properties (Real Indian Market Data) ---
export const properties = generatedProperties;

// =============================================
// MACHINE LEARNING ENGINE
// Multiple Linear Regression (Normal Equation)
// K-Means Clustering (Lloyd's Algorithm)
// Trained on properties dataset at module load
// =============================================

// --- Matrix Operations for Normal Equation ---
function _matTranspose(A) {
    const rows = A.length, cols = A[0].length;
    const T = [];
    for (let j = 0; j < cols; j++) {
        T[j] = [];
        for (let i = 0; i < rows; i++) T[j][i] = A[i][j];
    }
    return T;
}

function _matMultiply(A, B) {
    const rA = A.length, cA = A[0].length, cB = B[0].length;
    const C = Array.from({ length: rA }, () => new Array(cB).fill(0));
    for (let i = 0; i < rA; i++)
        for (let j = 0; j < cB; j++)
            for (let k = 0; k < cA; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}

function _matInverse(mat) {
    const n = mat.length;
    const aug = mat.map((row, i) => {
        const id = new Array(n).fill(0);
        id[i] = 1;
        return [...row, ...id];
    });
    for (let col = 0; col < n; col++) {
        let maxRow = col;
        for (let r = col + 1; r < n; r++)
            if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) maxRow = r;
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        if (Math.abs(aug[col][col]) < 1e-12) aug[col][col] = 1e-8;
        const scale = aug[col][col];
        for (let j = 0; j < 2 * n; j++) aug[col][j] /= scale;
        for (let r = 0; r < n; r++) {
            if (r === col) continue;
            const f = aug[r][col];
            for (let j = 0; j < 2 * n; j++) aug[r][j] -= f * aug[col][j];
        }
    }
    return aug.map(row => row.slice(n));
}

// --- Feature Normalization (Min-Max Scaling) ---
function _normParams(X) {
    const nF = X[0].length;
    const mins = new Array(nF).fill(Infinity);
    const maxs = new Array(nF).fill(-Infinity);
    for (const row of X) {
        for (let j = 0; j < nF; j++) {
            if (row[j] < mins[j]) mins[j] = row[j];
            if (row[j] > maxs[j]) maxs[j] = row[j];
        }
    }
    return { mins, maxs };
}

function _normRow(row, p) {
    return row.map((v, j) => {
        const range = p.maxs[j] - p.mins[j];
        return range === 0 ? 0 : (v - p.mins[j]) / range;
    });
}

// --- Model Evaluation Metrics ---
function _computeR2(yTrue, yPred) {
    const mean = yTrue.reduce((s, v) => s + v, 0) / yTrue.length;
    const ssTot = yTrue.reduce((s, v) => s + (v - mean) ** 2, 0);
    const ssRes = yTrue.reduce((s, v, i) => s + (v - yPred[i]) ** 2, 0);
    return ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
}

function _computeRMSE(yTrue, yPred) {
    const mse = yTrue.reduce((s, v, i) => s + (v - yPred[i]) ** 2, 0) / yTrue.length;
    return Math.sqrt(mse);
}

function _computeMAE(yTrue, yPred) {
    return yTrue.reduce((s, v, i) => s + Math.abs(v - yPred[i]), 0) / yTrue.length;
}

// =============================================
// MODEL TRAINING — Runs at module initialization
// Training data: properties dataset (500+ samples)
// Features: sqft, bedrooms, bathrooms, floor,
//           totalFloors, age, amenitiesCount,
//           propertyType, cityAvgRate
// Target: price
// =============================================

// Step 1: Compute city encodings (mean target encoding)
const _cityEncodings = {};
const _cityGroups = {};
properties.forEach(p => {
    if (!_cityGroups[p.city]) _cityGroups[p.city] = [];
    _cityGroups[p.city].push(p.pricePerSqft);
});
Object.keys(_cityGroups).forEach(city => {
    const arr = _cityGroups[city];
    _cityEncodings[city] = arr.reduce((s, v) => s + v, 0) / arr.length;
});

// Step 2: Extract feature vectors and labels
const _typeMap = { 'Apartment': 0, 'Villa': 1, 'Independent House': 2, 'Plot': 3 };
const _trainX = [];
const _trainY = [];
properties.forEach(p => {
    if (!p.price || !p.sqft || p.sqft === 0) return;
    _trainX.push([
        p.sqft,
        p.bedrooms || 2,
        p.bathrooms || (p.bedrooms || 2),
        p.floor || 1,
        p.totalFloors || 10,
        p.age || 0,
        (p.amenities || []).length,
        _typeMap[p.type] || 0,
        _cityEncodings[p.city] || 5000
    ]);
    _trainY.push(p.price);
});

// Step 3: Normalize features (Min-Max Scaling)
const _mlNormParams = _normParams(_trainX);
const _normTrainX = _trainX.map(row => _normRow(row, _mlNormParams));

// Step 4: Train Multiple Linear Regression — θ = (XᵀX + λI)⁻¹ · Xᵀy
// Ridge regularization (λ=0.01) prevents singular matrix
const _Xb = _normTrainX.map(row => [1, ...row]);
const _Xt = _matTranspose(_Xb);
const _XtX = _matMultiply(_Xt, _Xb);
// Add ridge regularization
for (let i = 0; i < _XtX.length; i++) _XtX[i][i] += 0.01;
const _XtX_inv = _matInverse(_XtX);
const _Xty = _matMultiply(_Xt, _trainY.map(v => [v]));
const _mlWeights = _matMultiply(_XtX_inv, _Xty).map(r => r[0]);

// Step 5: Compute evaluation metrics on training data
const _mlPredictions = _normTrainX.map(row => {
    const xb = [1, ...row];
    return xb.reduce((sum, v, i) => sum + v * _mlWeights[i], 0);
});

// Step 6: Run K-Means Clustering on properties for market segmentation
function _kMeansTrain(data, k, maxIter = 50) {
    const n = data.length;
    if (n === 0) return { centroids: [], labels: [] };
    // Initialize centroids using first k data points (deterministic)
    const centroids = data.slice(0, k).map(row => [...row]);
    let labels = new Array(n).fill(0);
    for (let iter = 0; iter < maxIter; iter++) {
        // Assignment step: assign each point to nearest centroid
        const newLabels = data.map(point => {
            let minDist = Infinity, bestC = 0;
            centroids.forEach((c, ci) => {
                const dist = point.reduce((s, v, j) => s + (v - c[j]) ** 2, 0);
                if (dist < minDist) { minDist = dist; bestC = ci; }
            });
            return bestC;
        });
        // Update step: recompute centroids
        const sums = centroids.map(c => new Array(c.length).fill(0));
        const counts = new Array(k).fill(0);
        newLabels.forEach((label, i) => {
            counts[label]++;
            data[i].forEach((v, j) => sums[label][j] += v);
        });
        let converged = true;
        for (let ci = 0; ci < k; ci++) {
            if (counts[ci] === 0) continue;
            for (let j = 0; j < centroids[ci].length; j++) {
                const newVal = sums[ci][j] / counts[ci];
                if (Math.abs(centroids[ci][j] - newVal) > 1e-6) converged = false;
                centroids[ci][j] = newVal;
            }
        }
        labels = newLabels;
        if (converged) break;
    }
    return { centroids, labels };
}

// Cluster properties into 3 market segments: Budget, Mid-Range, Premium
const _clusterInput = _normTrainX.map(row => [row[0], row[8]]); // sqft + cityRate
const _kmeansResult = _kMeansTrain(_clusterInput, 3);

// Sort clusters by centroid value to label them
const _clusterOrder = _kmeansResult.centroids
    .map((c, i) => ({ idx: i, val: c[1] }))
    .sort((a, b) => a.val - b.val)
    .map(c => c.idx);
const _segmentLabels = ['Budget', 'Mid-Range', 'Premium'];
const _clusterToSegment = {};
_clusterOrder.forEach((cIdx, sIdx) => { _clusterToSegment[cIdx] = _segmentLabels[sIdx]; });

// Export model performance metrics
export const modelMetrics = {
    algorithm: 'Multiple Linear Regression (Normal Equation with Ridge λ=0.01)',
    r2: parseFloat(_computeR2(_trainY, _mlPredictions).toFixed(4)),
    rmse: Math.round(_computeRMSE(_trainY, _mlPredictions)),
    mae: Math.round(_computeMAE(_trainY, _mlPredictions)),
    trainingSize: _trainY.length,
    featureCount: 9,
    features: ['sqft', 'bedrooms', 'bathrooms', 'floor', 'totalFloors', 'age', 'amenitiesCount', 'propertyType', 'cityAvgRate'],
    weights: _mlWeights.map(w => parseFloat(w.toFixed(2))),
    clustering: {
        algorithm: 'K-Means (Lloyd\'s Algorithm)',
        k: 3,
        segments: _segmentLabels,
        centroids: _kmeansResult.centroids.map(c => c.map(v => parseFloat(v.toFixed(4))))
    }
};

// Internal ML predict function
function _mlPredict(features) {
    const rawFeatures = [
        features.sqft || 1000,
        features.bedrooms || 2,
        features.bathrooms || (features.bedrooms || 2),
        features.floor || 1,
        features.totalFloors || 10,
        features.age || 0,
        (features.amenities || []).length,
        _typeMap[features.propertyType] || 0,
        _cityEncodings[features.city] || 5000
    ];
    const normalized = _normRow(rawFeatures, _mlNormParams);
    const xb = [1, ...normalized];
    return Math.max(0, xb.reduce((sum, v, i) => sum + v * _mlWeights[i], 0));
}

// Internal: classify a property into market segment
function _classifySegment(features) {
    const rawFeatures = [
        features.sqft || 1000,
        _cityEncodings[features.city] || 5000
    ];
    const norm = [
        (_mlNormParams.maxs[0] - _mlNormParams.mins[0]) === 0 ? 0 : (rawFeatures[0] - _mlNormParams.mins[0]) / (_mlNormParams.maxs[0] - _mlNormParams.mins[0]),
        (_mlNormParams.maxs[8] - _mlNormParams.mins[8]) === 0 ? 0 : (rawFeatures[1] - _mlNormParams.mins[8]) / (_mlNormParams.maxs[8] - _mlNormParams.mins[8])
    ];
    let minDist = Infinity, bestC = 0;
    _kmeansResult.centroids.forEach((c, i) => {
        const dist = (norm[0] - c[0]) ** 2 + (norm[1] - c[1]) ** 2;
        if (dist < minDist) { minDist = dist; bestC = i; }
    });
    return _clusterToSegment[bestC] || 'Mid-Range';
}

// --- Price History Generator ---
export function getPriceHistory(propertyId) {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return [];
    const base = prop.price;
    // Simulate slight fluctuation over last 12 months
    const History = [];
    const months = ["Mar '25", "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26"];
    months.forEach((m, i) => {
        // Random variability +/- 2% per month
        const factor = 1 + (Math.random() * 0.04 - 0.02);
        // Slight upward trend 0.5% per month
        const trend = 1 + (i * 0.005);
        History.push({ month: m, price: Math.round(base * 0.94 * trend * factor) });
    });
    return History;
}

// --- Tax History Generator ---
export function getTaxHistory(propertyId) {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return [];
    // Basic tax assumption ~0.1% of capital value per annum adjusted historically
    const annualTax = Math.round(prop.price * 0.001);
    return [
        { year: "2023", tax: Math.round(annualTax * 0.90), assessed: Math.round(prop.price * 0.85) },
        { year: "2024", tax: Math.round(annualTax * 0.95), assessed: Math.round(prop.price * 0.92) },
        { year: "2025", tax: annualTax, assessed: prop.price },
    ];
}

// --- Schools Nearby ---
export function getSchoolsNearby(locality) {
    const schools = {
        "Bandra West": [{ name: "St. Andrews High School", rating: 4.5, distance: "0.8 km", type: "ICSE" }, { name: "Arya Vidya Mandir", rating: 4.4, distance: "1.2 km", type: "CBSE" }, { name: "Dhribhai Ambani Intl", rating: 4.9, distance: "2 km", type: "IB" }],
        "Whitefield": [{ name: "The Deens Academy", rating: 4.6, distance: "1.5 km", type: "CBSE" }, { name: "Ryan International", rating: 4.0, distance: "2.5 km", type: "ICSE" }, { name: "Vydehi School of Excellence", rating: 4.3, distance: "1 km", type: "CBSE" }],
        "Lower Parel": [{ name: "DSB International", rating: 4.5, distance: "1.0 km", type: "IGCSE" }, { name: "JBCN International", rating: 4.2, distance: "1.5 km", type: "IB" }],
        "Worli": [{ name: "Podar International", rating: 4.4, distance: "2.0 km", type: "IB/CIE" }, { name: "Sacred Heart School", rating: 4.1, distance: "1.8 km", type: "State" }],
        "Gurgaon": [{ name: "The Shri Ram School", rating: 4.8, distance: "3 km", type: "ICSE" }, { name: "DPS Gurgaon", rating: 4.5, distance: "4 km", type: "CBSE" }, { name: "Heritage Xperiential", rating: 4.7, distance: "2.5 km", type: "IB" }],
        "Jubilee Hills": [{ name: "Jubilee Hills Public School", rating: 4.6, distance: "1.5 km", type: "CBSE" }, { name: "Bharatiya Vidya Bhavan", rating: 4.7, distance: "2 km", type: "CBSE" }],
        "Koregaon Park": [{ name: "The Bishop's School", rating: 4.5, distance: "1.0 km", type: "ICSE" }, { name: "St. Mary's School", rating: 4.3, distance: "2.5 km", type: "ICSE" }],
        "Adyar": [{ name: "The School KFI", rating: 4.8, distance: "2.0 km", type: "ICSE" }, { name: "St. Patrick's", rating: 4.4, distance: "1.5 km", type: "State" }],
        "Salt Lake": [{ name: "Our Lady Queen of the Missions", rating: 4.5, distance: "1.2 km", type: "ICSE" }, { name: "Salt Lake School", rating: 4.2, distance: "1.8 km", type: "CBSE" }],
    };
    // Fallback for unmapped localities
    return schools[locality] || [{ name: "Kendriya Vidyalaya", rating: 4.0, distance: "1.5 km", type: "CBSE" }, { name: "City International School", rating: 4.2, distance: "2.0 km", type: "ICSE" }, { name: "Local Public School", rating: 3.8, distance: "0.8 km", type: "State" }];
}

// --- Monthly EMI Estimate ---
export function getMonthlyEstimate(price) {
    const downPayment = Math.round(price * 0.2); // 20% down
    const loanAmount = price - downPayment;
    const rate = 8.75 / 100 / 12; // 8.75% home loan rate
    const tenureMonths = 240; // 20 years
    const emi = Math.round(loanAmount * rate * Math.pow(1 + rate, tenureMonths) / (Math.pow(1 + rate, tenureMonths) - 1));
    const insurance = Math.round(price * 0.0005 / 12); // Property insurance est
    const hoa = price > 50000000 ? 15000 : 5000;
    const tax = Math.round(price * 0.001 / 12); // Property tax monthly est
    return { emi, tax, insurance, hoa, total: emi + tax + insurance + hoa, downPayment, loanAmount };
}

// --- City Market Data (Data Intelligence · Q1 2026 verified) ---
// avgPrice = city avg rate × 1000 sqft (standard 2BHK benchmark)
// pricePerSqft matches prediction engine base rates
// growth rates from 99acres/Knight Frank India Reports 2025
export const cityData = [
    { city: "Mumbai", avgPrice: 14000000, pricePerSqft: 14000, growth: 5.2, inventory: 15200, demand: 96, supplyIndex: 55, avgDaysOnMarket: 45, absorptionRate: 68 },
    { city: "Bangalore", avgPrice: 9500000, pricePerSqft: 9500, growth: 13.0, inventory: 22000, demand: 94, supplyIndex: 78, avgDaysOnMarket: 35, absorptionRate: 82 },
    { city: "Gurgaon", avgPrice: 10000000, pricePerSqft: 10000, growth: 10.5, inventory: 11000, demand: 98, supplyIndex: 65, avgDaysOnMarket: 28, absorptionRate: 88 },
    { city: "Hyderabad", avgPrice: 7500000, pricePerSqft: 7500, growth: 8.0, inventory: 18500, demand: 95, supplyIndex: 82, avgDaysOnMarket: 30, absorptionRate: 85 },
    { city: "New Delhi", avgPrice: 9200000, pricePerSqft: 9200, growth: 5.5, inventory: 8500, demand: 88, supplyIndex: 45, avgDaysOnMarket: 60, absorptionRate: 60 },
    { city: "Pune", avgPrice: 7800000, pricePerSqft: 7800, growth: 7.8, inventory: 16000, demand: 85, supplyIndex: 72, avgDaysOnMarket: 40, absorptionRate: 75 },
    { city: "Chennai", avgPrice: 7000000, pricePerSqft: 7000, growth: 6.2, inventory: 12500, demand: 80, supplyIndex: 68, avgDaysOnMarket: 50, absorptionRate: 65 },
    { city: "Kolkata", avgPrice: 5500000, pricePerSqft: 5500, growth: 4.8, inventory: 14000, demand: 75, supplyIndex: 60, avgDaysOnMarket: 55, absorptionRate: 58 },
    { city: "Ahmedabad", avgPrice: 5800000, pricePerSqft: 5800, growth: 8.5, inventory: 11000, demand: 82, supplyIndex: 65, avgDaysOnMarket: 42, absorptionRate: 70 },
    { city: "Noida", avgPrice: 8500000, pricePerSqft: 8500, growth: 12.5, inventory: 19000, demand: 86, supplyIndex: 85, avgDaysOnMarket: 32, absorptionRate: 72 },
    { city: "Jaipur", avgPrice: 4800000, pricePerSqft: 4800, growth: 10.2, inventory: 8000, demand: 78, supplyIndex: 70, avgDaysOnMarket: 38, absorptionRate: 65 },
    { city: "Lucknow", avgPrice: 4200000, pricePerSqft: 4200, growth: 9.5, inventory: 7500, demand: 72, supplyIndex: 68, avgDaysOnMarket: 40, absorptionRate: 62 },
    { city: "Chandigarh", avgPrice: 7500000, pricePerSqft: 7500, growth: 7.2, inventory: 4500, demand: 85, supplyIndex: 55, avgDaysOnMarket: 45, absorptionRate: 75 },
    { city: "Surat", avgPrice: 4500000, pricePerSqft: 4500, growth: 11.8, inventory: 9000, demand: 80, supplyIndex: 75, avgDaysOnMarket: 35, absorptionRate: 78 },
    { city: "Indore", avgPrice: 4000000, pricePerSqft: 4000, growth: 12.2, inventory: 8500, demand: 84, supplyIndex: 80, avgDaysOnMarket: 30, absorptionRate: 82 },
    { city: "Coimbatore", avgPrice: 5200000, pricePerSqft: 5200, growth: 8.8, inventory: 6000, demand: 76, supplyIndex: 65, avgDaysOnMarket: 42, absorptionRate: 68 },
    { city: "Kochi", avgPrice: 5800000, pricePerSqft: 5800, growth: 6.5, inventory: 5500, demand: 70, supplyIndex: 62, avgDaysOnMarket: 48, absorptionRate: 60 },
    { city: "Thane", avgPrice: 10500000, pricePerSqft: 10500, growth: 8.8, inventory: 13500, demand: 90, supplyIndex: 75, avgDaysOnMarket: 38, absorptionRate: 70 },
    { city: "Navi Mumbai", avgPrice: 9500000, pricePerSqft: 9500, growth: 12.5, inventory: 14000, demand: 92, supplyIndex: 70, avgDaysOnMarket: 25, absorptionRate: 85 },
    { city: "Visakhapatnam", avgPrice: 4500000, pricePerSqft: 4500, growth: 10.5, inventory: 6500, demand: 74, supplyIndex: 72, avgDaysOnMarket: 40, absorptionRate: 64 },
    { city: "Nagpur", avgPrice: 3800000, pricePerSqft: 3800, growth: 7.5, inventory: 7000, demand: 68, supplyIndex: 65, avgDaysOnMarket: 44, absorptionRate: 58 },
    { city: "Ludhiana", avgPrice: 3500000, pricePerSqft: 3500, growth: 6.8, inventory: 5000, demand: 65, supplyIndex: 60, avgDaysOnMarket: 48, absorptionRate: 55 },
    { city: "Bhopal", avgPrice: 3200000, pricePerSqft: 3200, growth: 11.5, inventory: 4800, demand: 80, supplyIndex: 75, avgDaysOnMarket: 35, absorptionRate: 72 },
    { city: "Patna", avgPrice: 3500000, pricePerSqft: 3500, growth: 5.2, inventory: 3500, demand: 70, supplyIndex: 55, avgDaysOnMarket: 52, absorptionRate: 50 },
    { city: "Vadodara", avgPrice: 4000000, pricePerSqft: 4000, growth: 9.2, inventory: 6200, demand: 78, supplyIndex: 68, avgDaysOnMarket: 42, absorptionRate: 68 },
    { city: "Ghaziabad", avgPrice: 4800000, pricePerSqft: 4800, growth: 13.8, inventory: 15000, demand: 88, supplyIndex: 82, avgDaysOnMarket: 30, absorptionRate: 80 },
    { city: "Rajkot", avgPrice: 3500000, pricePerSqft: 3500, growth: 12.5, inventory: 5500, demand: 82, supplyIndex: 78, avgDaysOnMarket: 32, absorptionRate: 75 },
    { city: "Madurai", avgPrice: 3400000, pricePerSqft: 3400, growth: 8.5, inventory: 4200, demand: 72, supplyIndex: 65, avgDaysOnMarket: 45, absorptionRate: 62 },
    { city: "Raipur", avgPrice: 3000000, pricePerSqft: 3000, growth: 15.2, inventory: 3800, demand: 85, supplyIndex: 70, avgDaysOnMarket: 28, absorptionRate: 82 },
    { city: "Ranchi", avgPrice: 3000000, pricePerSqft: 3000, growth: 10.8, inventory: 3200, demand: 74, supplyIndex: 62, avgDaysOnMarket: 40, absorptionRate: 65 },
    { city: "Guwahati", avgPrice: 3500000, pricePerSqft: 3500, growth: 12.5, inventory: 2500, demand: 80, supplyIndex: 55, avgDaysOnMarket: 35, absorptionRate: 70 },
    { city: "Thiruvananthapuram", avgPrice: 4800000, pricePerSqft: 4800, growth: 7.5, inventory: 3000, demand: 75, supplyIndex: 60, avgDaysOnMarket: 48, absorptionRate: 65 },
    { city: "Vijayawada", avgPrice: 4200000, pricePerSqft: 4200, growth: 18.2, inventory: 4000, demand: 90, supplyIndex: 75, avgDaysOnMarket: 22, absorptionRate: 88 },
];

// --- Monthly Market Trends ---
export const monthlyTrends = [
    { month: "Mar", avgPrice: 12100, volume: 1520, views: 45500, inquiries: 3250 },
    { month: "Apr", avgPrice: 12250, volume: 1440, views: 43500, inquiries: 3050 },
    { month: "May", avgPrice: 12400, volume: 1620, views: 48500, inquiries: 3550 },
    { month: "Jun", avgPrice: 12350, volume: 1470, views: 46500, inquiries: 3150 },
    { month: "Jul", avgPrice: 12600, volume: 1570, views: 49500, inquiries: 3650 },
    { month: "Aug", avgPrice: 12800, volume: 1670, views: 52500, inquiries: 4050 },
    { month: "Sep", avgPrice: 12950, volume: 1820, views: 56500, inquiries: 4550 },
    { month: "Oct", avgPrice: 13200, volume: 2120, views: 65500, inquiries: 5250 },
    { month: "Nov", avgPrice: 13400, volume: 1920, views: 60500, inquiries: 4850 },
    { month: "Dec", avgPrice: 13600, volume: 1720, views: 55500, inquiries: 4250 },
    { month: "Jan", avgPrice: 13800, volume: 1970, views: 62500, inquiries: 4950 },
    { month: "Feb", avgPrice: 14050, volume: 2220, views: 70500, inquiries: 5650 },
];

// --- Clients (Indian Context) ---
export const clients = [
    { id: 1, name: "Rahul Khanna", email: "rahul.k@gmail.com", phone: "+91 98200 12345", budget: 35000000, preference: "Sea View Apartment", city: "Mumbai", status: "showing", lastContact: "2026-02-12", notes: "Prefers South Bombay or Bandra. Cash ready.", avatar: "RK", type: "buyer", leadScore: 88, source: "Website", urgency: "high", preApproved: true, interactions: 15, documentsCount: 2 },
    { id: 2, name: "Priya Desai", email: "priya.d@yahoo.in", phone: "+91 99800 54321", budget: 15000000, preference: "3 BHK close to IT Park", city: "Bangalore", status: "qualified", lastContact: "2026-02-10", notes: "Working in Whitefield. Needs ready to move.", avatar: "PD", type: "buyer", leadScore: 75, source: "Referral", urgency: "medium", preApproved: true, interactions: 8, documentsCount: 1 },
    { id: 3, name: "Vikram Malhotra", email: "vikram.m@outlook.com", phone: "+91 98110 98765", budget: 85000000, preference: "Farmhouse/Villa", city: "Delhi", status: "offer", lastContact: "2026-02-11", notes: "Looking for Chhattarpur Farms or Westend.", avatar: "VM", type: "buyer", leadScore: 92, source: "Direct", urgency: "high", preApproved: true, interactions: 20, documentsCount: 5 },
    { id: 4, name: "Anjali Gupta", email: "anjali.g@gmail.com", phone: "+91 98480 11223", budget: 22000000, preference: "Investment Property", city: "Hyderabad", status: "lead", lastContact: "2026-02-09", notes: "ROI focused. Interested in commercial spaces too.", avatar: "AG", type: "buyer", leadScore: 60, source: "Social Media", urgency: "low", preApproved: false, interactions: 3, documentsCount: 0 },
    { id: 5, name: "Rajesh Iyer", email: "r.iyer@gmail.com", phone: "+91 98840 33445", budget: 9500000, preference: "2 BHK OMR", city: "Chennai", status: "closed", lastContact: "2026-02-01", notes: "Deal closed at Hiranandani.", avatar: "RI", type: "buyer", leadScore: 100, source: "Website", urgency: "high", preApproved: true, interactions: 25, documentsCount: 8 },
    { id: 6, name: "Suresh Mehta", email: "suresh.invest@gmail.com", phone: "+91 98230 44556", budget: 45000000, preference: "Sell 4 BHK Koregaon Park", city: "Pune", status: "qualified", lastContact: "2026-02-13", notes: "Selling ancestral property. Wants quick liqudation.", avatar: "SM", type: "seller", leadScore: 85, source: "Direct", urgency: "high", preApproved: true, interactions: 10, documentsCount: 4 },
];

export const sellerLeads = [
    { id: 1, buyerName: "Rahul Khanna", budget: 35000000, preApproved: true, seriousness: 92, viewCount: 5, lastViewed: "2 hours ago", budgetMatch: "match", propertyId: 1 },
    { id: 2, buyerName: "Karan Johar", budget: 42000000, preApproved: true, seriousness: 88, viewCount: 3, lastViewed: "1 day ago", budgetMatch: "above", propertyId: 1 },
    { id: 3, buyerName: "Priya Desai", budget: 14000000, preApproved: true, seriousness: 65, viewCount: 2, lastViewed: "2 days ago", budgetMatch: "below", propertyId: 5 },
    { id: 4, buyerName: "Sneha Reddy", budget: 5000000, preApproved: false, seriousness: 35, viewCount: 1, lastViewed: "5 days ago", budgetMatch: "below", propertyId: 7 },
    { id: 5, buyerName: "Vikram Malhotra", budget: 85000000, preApproved: true, seriousness: 78, viewCount: 4, lastViewed: "3 hours ago", budgetMatch: "match", propertyId: 3 },
];

// --- Pipeline Stages ---
export const pipelineStages = ["lead", "qualified", "showing", "offer", "negotiation", "closed"];
export const pipelineLabels = { lead: "New Lead", qualified: "Qualified", showing: "Site Visit", offer: "Offer Made", negotiation: "Negotiation", closed: "Booked" };
export const pipelineColors = { lead: "#94a3b8", qualified: "#3b82f6", showing: "#f59e0b", offer: "#c93a2a", negotiation: "#8b5cf6", closed: "#22c55e" };

// --- Seller Pipeline ---
export const sellerPipelineStages = ["draft", "live", "offers_received", "under_contract", "sold"];
export const sellerPipelineLabels = { draft: "Draft", live: "Active Listing", offers_received: "Offers Received", under_contract: "Under Contract", sold: "Sold" };
export const sellerPipelineColors = { draft: "#94a3b8", live: "#3b82f6", offers_received: "#f59e0b", under_contract: "#8b5cf6", sold: "#22c55e" };

// --- Buyer saved searches etc ---
export const savedSearches = [
    { id: 1, name: "Bandra Sea View 3BHK", filters: { city: "Mumbai", bedrooms: 3, minPrice: 50000000 }, matches: 2, newMatches: 1, created: "2026-01-20" },
    { id: 2, name: "Whitefield Villas < 3Cr", filters: { city: "Bangalore", type: "Villa", maxPrice: 30000000 }, matches: 4, newMatches: 2, created: "2026-02-05" },
];

export const buyerOffers = [
    { id: 1, propertyId: 1, propertyName: "Lodha World One", offerPrice: 82000000, listPrice: 85000000, status: "negotiation", submittedDate: "2026-02-10", response: "Counter: 83.5 Cr" },
];

export const tourRequests = [
    { id: 1, propertyId: 5, propertyName: "Prestige Shantiniketan", date: "2026-02-22", time: "11:00 AM", status: "confirmed", agentName: "Arjun Reddy" },
    { id: 2, propertyId: 1, propertyName: "Lodha World One", date: "2026-02-18", time: "4:00 PM", status: "pending", agentName: "Simran Kaur" },
];

// --- Agent Tasks ---
export const agentTasks = [
    { id: 1, title: "Call Rahul re: Negotiation", priority: "high", dueDate: "2026-02-14", status: "pending", client: "Rahul Khanna", type: "call" },
    { id: 2, title: "Send Agreement Draft to Vikram", priority: "high", dueDate: "2026-02-15", status: "pending", client: "Vikram Malhotra", type: "document" },
    { id: 3, title: "Schedule site visit for Priya", priority: "medium", dueDate: "2026-02-16", status: "pending", client: "Priya Desai", type: "showing" },
];

// --- Agent Calendar ---
export const agentCalendar = [
    { id: 1, title: "Site Visit - Lodha", client: "Rahul Khanna", date: "2026-02-14", time: "11:00 AM", duration: "1h", type: "showing", color: "#3b82f6" },
    { id: 2, title: "Meeting w/ Legal Team", client: null, date: "2026-02-14", time: "3:00 PM", duration: "1.5h", type: "meeting", color: "#f59e0b" },
];

export const commissionHistory = [
    { id: 1, deal: "Hiranandani Glen Classic", client: "Rajesh Iyer", closedDate: "2026-02-01", dealValue: 9500000, commission: 190000, status: "paid" },
    { id: 2, deal: "Kalpataru Vista", client: "Amit Singh", closedDate: "2026-01-15", dealValue: 24000000, commission: 480000, status: "paid" },
];

export const agentDocuments = [
    { id: 1, name: "Sale Deed Draft.pdf", client: "Rahul Khanna", type: "legal", size: "2.4 MB", date: "2026-02-12" },
    { id: 2, name: "Property Card - Bandra.pdf", client: "Suresh Mehta", type: "legal", size: "1.1 MB", date: "2026-02-10" },
];

export const buyerFeedback = [
    { id: 1, propertyId: 1, propertyName: "Lodha World One", buyer: "Rahul Khanna", rating: 5, feedback: "Exceptional view and amenities. Price is on higher side.", date: "2026-02-14" },
];

// --- Seller Listing Scores ---
export function getListingScore(property) {
    const titleScore = Math.min(98, 60 + property.name.length * 2);
    const descScore = Math.min(95, 55 + property.amenities.length * 8);
    const photoScore = property.trending ? 88 : 65 + Math.floor(Math.random() * 20);
    const amenityScore = Math.min(100, property.amenities.length * 16);
    const completeness = Math.round((titleScore + descScore + photoScore + amenityScore) / 4);
    const suggestions = [];
    if (titleScore < 80) suggestions.push("Add location keywords to title");
    if (descScore < 80) suggestions.push("Expand description with neighborhood details");
    if (photoScore < 75) suggestions.push("Add professional photos");
    if (amenityScore < 80) suggestions.push("List more amenities (parking, security, etc.)");
    if (!property.openHouseDate) suggestions.push("Schedule an open house");
    return { titleScore, descScore, photoScore, amenityScore, completeness, suggestions };
}

// --- Helper Functions ---
export function formatPrice(price) {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
}

export function formatNumber(num) {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

export function getStatusColor(status) {
    const colors = { active: "#22c55e", pending: "#f59e0b", sold: "#94a3b8" };
    return colors[status] || "#94a3b8";
}

export function getStatusLabel(status) {
    const labels = { active: "Active", pending: "Under Offer", sold: "Sold" };
    return labels[status] || status;
}

// --- Core Machine Learning Implementations ---
// These functions are now ACTIVE and trained on the properties dataset.
// trainLinearRegression: Simple OLS (used for per-city trend analysis)
// trainMultipleLinearRegression: Normal Equation with Ridge (used in predictPrice)
// runKMeansClusteringML: Real K-Means for market segmentation

export function trainLinearRegression(data) {
    // Ordinary Least Squares: y = mx + c
    // Used for per-city price trend analysis
    const n = data.length;
    if (n === 0) return { m: 0, c: 0, r2: 0 };
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    data.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x; });
    const denom = (n * sumXX - sumX * sumX);
    const m = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const c = (sumY - m * sumX) / n;
    // Compute R² for model evaluation
    const meanY = sumY / n;
    const ssTot = data.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const ssRes = data.reduce((s, p) => s + (p.y - (m * p.x + c)) ** 2, 0);
    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
    return { m, c, r2 };
}

export function trainMultipleLinearRegression(featureMatrix, labels) {
    // Multiple Linear Regression using Normal Equation: θ = (XᵀX + λI)⁻¹ · Xᵀy
    // Returns learned weight vector
    const Xb = featureMatrix.map(row => [1, ...row]);
    const Xt = _matTranspose(Xb);
    const XtX = _matMultiply(Xt, Xb);
    for (let i = 0; i < XtX.length; i++) XtX[i][i] += 0.01; // Ridge λ
    const XtX_inv = _matInverse(XtX);
    const Xty = _matMultiply(Xt, labels.map(v => [v]));
    return _matMultiply(XtX_inv, Xty).map(r => r[0]);
}

export function runKMeansClusteringML(data, k = 3, maxIter = 50) {
    // Real K-Means Clustering using Lloyd's Algorithm
    // 1. Initialize K centroids
    // 2. Assign each point to nearest centroid (Euclidean distance)
    // 3. Recompute centroids as cluster means
    // 4. Repeat until convergence
    if (!data || data.length === 0) return { centroids: [], labels: [], iterations: 0 };
    const n = data.length;
    const dim = Array.isArray(data[0]) ? data[0].length : 2;
    // Normalize input if objects with score/budget (backward compat)
    const points = data.map(p => Array.isArray(p) ? p : [p.score || 0, p.budget || 0]);
    const centroids = points.slice(0, Math.min(k, n)).map(p => [...p]);
    let labels = new Array(n).fill(0);
    let iterations = 0;
    for (let iter = 0; iter < maxIter; iter++) {
        iterations++;
        const newLabels = points.map(pt => {
            let minD = Infinity, best = 0;
            centroids.forEach((c, ci) => {
                const d = pt.reduce((s, v, j) => s + (v - c[j]) ** 2, 0);
                if (d < minD) { minD = d; best = ci; }
            });
            return best;
        });
        const sums = centroids.map(c => new Array(c.length).fill(0));
        const counts = new Array(k).fill(0);
        newLabels.forEach((lbl, i) => {
            counts[lbl]++;
            points[i].forEach((v, j) => sums[lbl][j] += v);
        });
        let converged = true;
        for (let ci = 0; ci < k; ci++) {
            if (counts[ci] === 0) continue;
            for (let j = 0; j < centroids[ci].length; j++) {
                const nv = sums[ci][j] / counts[ci];
                if (Math.abs(centroids[ci][j] - nv) > 1e-6) converged = false;
                centroids[ci][j] = nv;
            }
        }
        labels = newLabels;
        if (converged) break;
    }
    return { centroids, labels, iterations };
}

// --- AI Prediction Logic (Real-World Market Data · Q1 2026) ---
// Base rates sourced from 99acres, Housing.com, NoBroker, MagicBricks averages
// Last calibrated: April 2026
export function predictPrice(features) {
    const { 
        city, sqft, bedrooms, floor, age, locality = "",
        bathrooms, balconies, totalFloors, unitPosition, parking, servantRoom, studyRoom,
        mainDoorFacing, parkFacing, gardenView, seaLakeView, roadView,
        amenities, builderReputation, reraApproved, gatedCommunity,
        distanceMetro, highwayAccess, airportDistance, propertyType
    } = features;

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: City-level average price per sqft (2025-2026 verified)
    // These are CITY AVERAGES for standard apartments, not locality peaks
    // ═══════════════════════════════════════════════════════════════
    const baseRates = {
        "Mumbai": 14000,       // MMR avg ~₹14,000 (99acres Q4 2025)
        "Bangalore": 9500,     // Avg ~₹9,500 (HT/99acres 2025)
        "Gurgaon": 10000,      // Avg ~₹10,000 (mid-range avg across sectors)
        "Hyderabad": 7500,     // Avg ~₹7,500 (city avg; Gachibowli ~₹11,000)
        "New Delhi": 9200,     // Delhi NCR avg ~₹9,167 (HT 2025)
        "Delhi": 9200,
        "Pune": 7800,          // Avg ~₹7,800 (99acres 2025)
        "Chennai": 7000,       // Avg ~₹7,000 (Housing.com 2025)
        "Kolkata": 5500,       // Avg ~₹5,500 (99acres 2025)
        "Ahmedabad": 5800,     // Avg ~₹5,800 (NoBroker 2025)
        "Noida": 8500,         // Avg ~₹8,500 (strong growth from infra)
        "Jaipur": 4800,        // Avg ~₹4,800
        "Lucknow": 4200,       // Avg ~₹4,200
        "Chandigarh": 7500,    // Avg ~₹7,500
        "Surat": 4500,         // Avg ~₹4,500
        "Indore": 4000,        // Avg ~₹4,000
        "Coimbatore": 5200,    // Avg ~₹5,200
        "Kochi": 5800,         // Avg ~₹5,800
        "Thane": 10500,        // Avg ~₹10,500 (close to Mumbai suburb rates)
        "Navi Mumbai": 9500,   // Avg ~₹9,500
        "Visakhapatnam": 4500, // Avg ~₹4,500
        "Nagpur": 3800,        // Avg ~₹3,800
        "Ludhiana": 3500,      // Avg ~₹3,500
        "Bhopal": 3200,        // Avg ~₹3,200
        "Patna": 3500,         // Avg ~₹3,500
        "Vadodara": 4000,      // Avg ~₹4,000
        "Ghaziabad": 4800,     // Avg ~₹4,800
        "Rajkot": 3500,        // Avg ~₹3,500
        "Madurai": 3400,       // Avg ~₹3,400
        "Raipur": 3000,        // Avg ~₹3,000
        "Ranchi": 3000,        // Avg ~₹3,000
        "Guwahati": 3500,      // Avg ~₹3,500
        "Thiruvananthapuram": 4800, // Avg ~₹4,800
        "Vijayawada": 4200     // Avg ~₹4,200
    };
    let rate = baseRates[city] || 4500;

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Locality-specific overrides (verified micro-market data)
    // Uses exact per-sqft rates where known, else category multipliers
    // ═══════════════════════════════════════════════════════════════
    if (locality) {
        const loc = locality.toLowerCase().trim();

        // --- LOCALITY RATE OVERRIDES (exact verified rates, 99acres/Housing.com/MagicBricks Q1 2026) ---
        const localityRates = {
            // ═══ Mumbai ═══
            "bandra west": 55000, "bandra east": 28000, "juhu": 45000,
            "worli": 48000, "lower parel": 35000, "andheri west": 22000,
            "andheri east": 16000, "powai": 18000, "colaba": 55000,
            "south bombay": 60000, "bkc": 35000, "goregaon": 14000,
            "malad": 13500, "borivali": 12000, "kandivali": 11000,
            "dahisar": 10000, "virar": 5500, "vasai": 5000,
            "malabar hill": 65000, "prabhadevi": 40000, "dadar": 25000,
            "sion": 18000, "chembur": 16000, "mulund": 13000,
            "thane west": 11000, "thane east": 9000, "ghatkopar": 17000,
            "vikhroli": 14000, "khar": 38000, "santacruz": 30000,
            "vile parle": 24000, "versova": 20000, "lokhandwala": 22000,
            "oshiwara": 18000, "matunga": 28000, "wadala": 18000,
            "sewri": 22000, "kurla": 14000, "bhandup": 11000,
            "dombivli": 7000, "kalyan": 6000, "panvel": 7500,
            "kharghar": 9500, "vashi": 12000, "nerul": 10000,
            "airoli": 10500, "belapur": 11000, "sanpada": 11500,
            // ═══ Bangalore ═══
            "koramangala": 14000, "indiranagar": 15000, "whitefield": 11500,
            "marathahalli": 9000, "electronic city": 6500, "sarjapur": 7500,
            "hsr layout": 12000, "jayanagar": 13000, "jp nagar": 10000,
            "hebbal": 9500, "yelahanka": 6500, "bannerghatta": 7000,
            "sadashivanagar": 18000, "rajajinagar": 11000, "malleshwaram": 14000,
            "basavanagudi": 12000, "btm layout": 9000, "bellandur": 8500,
            "devanahalli": 5500, "hennur": 7000, "thanisandra": 7500,
            "kr puram": 6500, "banashankari": 8500, "vijayanagar": 9000,
            "wilson garden": 10000, "richmond town": 16000, "ulsoor": 13000,
            "domlur": 13500, "old airport road": 12000, "frazer town": 11000,
            "mg road": 16000, "brigade road": 15000, "lavelle road": 20000,
            "cunningham road": 18000, "rt nagar": 8000, "nagarbhavi": 7000,
            "kanakapura road": 6500, "mysore road": 5500, "tumkur road": 5000,
            // ═══ Hyderabad ═══
            "gachibowli": 11000, "madhapur": 10000, "hitech city": 10500,
            "jubilee hills": 15000, "banjara hills": 16000, "kondapur": 8500,
            "kukatpally": 6500, "miyapur": 5500, "manikonda": 7000,
            "narsingi": 7500, "financial district": 9500, "kokapet": 8500,
            "secunderabad": 7000, "begumpet": 9000, "ameerpet": 7500,
            "somajiguda": 10000, "himayatnagar": 8500, "nampally": 7000,
            "dilsukhnagar": 5500, "lb nagar": 5000, "uppal": 5500,
            "kompally": 5000, "bachupally": 5500, "nallagandla": 7500,
            "tellapur": 7000, "mokila": 6000, "shamshabad": 5000,
            "attapur": 6000, "tolichowki": 6500, "mehdipatnam": 6500,
            "sainikpuri": 5500, "alwal": 5500, "malkajgiri": 6000,
            "tarnaka": 6500, "habsiguda": 7000, "ramanthapur": 6000,
            // ═══ Visakhapatnam ═══
            "rk beach": 9000, "r k beach": 9000, "ramakrishna beach": 9000,
            "lawsons bay colony": 10000, "lawsons bay": 10000,
            "mvp colony": 7500, "mvp": 7500,
            "rushikonda": 7000, "madhurawada": 5500, "gajuwaka": 3800,
            "seethammadhara": 7500, "siripuram": 8000, "dwaraka nagar": 7000,
            "waltair": 8500, "waltair uplands": 9500, "cbd": 6500,
            "nad junction": 4500, "nad": 4500, "pendurthi": 3500,
            "pedagantyada": 3800, "gopalapatnam": 4000, "arilova": 4200,
            "pm palem": 5000, "yendada": 6500, "kommadi": 5000,
            "maddilapalem": 5500, "akkayyapalem": 6000, "dondaparthy": 5800,
            "resapuvanipalem": 5500, "maharanipeta": 6000, "jagadamba": 5500,
            "ram nagar": 5000, "kancharapalem": 4500, "nak": 4000,
            "anakapalli": 3000, "bheemunipatnam": 4500, "bheemili": 4500,
            "vizag steel plant": 3500, "kurmannapalem": 4000,
            // ═══ Delhi NCR ═══
            "dwarka": 8500, "vasant kunj": 12000, "saket": 14000,
            "greater kailash": 18000, "defence colony": 22000,
            "hauz khas": 16000, "lajpat nagar": 11000,
            "connaught place": 30000, "cp": 30000, "khan market": 35000,
            "jor bagh": 40000, "golf links": 50000, "lutyens delhi": 55000,
            "chanakyapuri": 45000, "new friends colony": 16000,
            "panchsheel park": 20000, "green park": 14000,
            "south extension": 16000, "vasant vihar": 22000,
            "janakpuri": 9000, "rajouri garden": 10000, "pitampura": 9500,
            "rohini": 8000, "model town": 10000, "civil lines": 15000,
            "karol bagh": 12000, "paschim vihar": 9000, "mayur vihar": 9500,
            "east of kailash": 16000, "kalkaji": 12000, "nehru place": 11000,
            "preet vihar": 9000, "ip extension": 8500, "patparganj": 8500,
            // ═══ Gurgaon ═══
            "golf course road": 18000, "dlf phase 1": 14000, "dlf phase 5": 16000,
            "sohna road": 8000, "sector 49": 9000, "sector 57": 10000,
            "golf course extension": 14000, "sector 56": 11000,
            "sector 54": 12000, "sector 42": 10000, "sector 43": 11000,
            "sector 67": 9000, "sector 69": 9500, "sector 82": 8000,
            "sector 84": 7500, "sector 85": 7500, "sector 89": 7000,
            "sector 92": 7000, "sector 102": 6500, "sector 103": 6500,
            "sector 104": 7000, "sector 106": 6500, "sector 108": 6500,
            "sector 109": 6500, "sector 113": 6000, "manesar": 5000,
            "mg road gurgaon": 12000, "sushant lok": 13000, "palam vihar": 9000,
            "south city 1": 12000, "south city 2": 10000, "nirvana country": 11000,
            // ═══ Pune ═══
            "koregaon park": 14000, "viman nagar": 10500, "baner": 9000,
            "hinjewadi": 7500, "kharadi": 8500, "wakad": 7000,
            "hadapsar": 6500, "magarpatta": 9500,
            "kalyani nagar": 13000, "boat club road": 18000,
            "sb road": 12000, "fc road": 11000, "jm road": 10500,
            "aundh": 10000, "pashan": 8500, "bavdhan": 7500,
            "pimple saudagar": 8000, "pimple nilakh": 8500,
            "ravet": 6000, "pcmc": 6000, "chinchwad": 6500,
            "pimpri": 6000, "akurdi": 5500, "nigdi": 6000,
            "undri": 6000, "mohammadwadi": 6500, "kondhwa": 7000,
            "bibwewadi": 8000, "katraj": 6000, "dhankawadi": 5500,
            "warje": 7500, "kothrud": 10000, "deccan": 12000,
            "shivajinagar": 11000, "camp": 10000, "swargate": 8000,
            // ═══ Chennai ═══
            "adyar": 12000, "anna nagar": 10000, "velachery": 7500,
            "omr": 7000, "porur": 6000, "tambaram": 5000,
            "besant nagar": 14000, "t nagar": 13000,
            "mylapore": 14000, "ra puram": 16000, "nungambakkam": 15000,
            "boat club": 22000, "alwarpet": 16000, "gopalapuram": 13000,
            "kilpauk": 10000, "chetpet": 11000, "egmore": 9000,
            "ashok nagar": 9000, "vadapalani": 8000, "virugambakkam": 7500,
            "mogappair": 7000, "ambattur": 5500, "avadi": 4500,
            "chromepet": 6000, "pallavaram": 5500, "madipakkam": 6500,
            "sholinganallur": 7500, "siruseri": 6500, "thoraipakkam": 8000,
            "perungudi": 8000, "navalur": 7000, "padur": 6500,
            "ecr": 9000, "thiruvanmiyur": 10000, "palavakkam": 9500,
            "injambakkam": 8500, "neelankarai": 9000,
            // ═══ Kolkata ═══
            "salt lake": 7500, "new town": 6000, "rajarhat": 5500,
            "ballygunge": 10000, "alipore": 12000,
            "park street": 14000, "camac street": 13000, "park circus": 8000,
            "jodhpur park": 9000, "gariahat": 9000, "southern avenue": 11000,
            "bhowanipore": 9000, "elgin road": 12000, "hazra": 8500,
            "lake gardens": 8000, "jadavpur": 7000, "garia": 5500,
            "behala": 5000, "tollygunge": 7500, "kasba": 6500,
            "em bypass": 7000, "dum dum": 5000, "baranagar": 4500,
            "howrah": 4500, "shibpur": 5000,
            // ═══ Noida ═══
            "sector 150": 8000, "sector 137": 7500, "sector 75": 9000,
            "greater noida": 5000, "noida extension": 5500,
            "sector 44": 12000, "sector 18": 11000, "sector 50": 10000,
            "sector 62": 8000, "sector 63": 8500, "sector 76": 8000,
            "sector 78": 7500, "sector 93": 9000, "sector 93a": 9500,
            "sector 93b": 9500, "sector 128": 8000, "sector 129": 7000,
            "sector 143": 7500, "sector 168": 6500,
            "noida expressway": 8000, "yamuna expressway": 4500,
            // ═══ Ahmedabad ═══
            "sg highway": 7500, "prahlad nagar": 8000, "bodakdev": 8500,
            "satellite": 9000, "vastrapur": 8000, "ambawadi": 7500,
            "navrangpura": 7000, "paldi": 6500, "ellis bridge": 8000,
            "ashram road": 7000, "cg road": 8500, "law garden": 8000,
            "science city": 7000, "thaltej": 7500, "bopal": 5500,
            "south bopal": 6000, "shilaj": 5500, "ghatlodiya": 6000,
            "gota": 5500, "chandkheda": 5000, "motera": 5500,
            "maninagar": 5500, "vastral": 4000, "narol": 3500,
            // ═══ Jaipur ═══
            "c scheme": 8500, "vaishali nagar": 5500, "mansarovar": 5000,
            "malviya nagar": 6500, "tonk road": 5000, "jagatpura": 4500,
            "ajmer road": 4000, "jhotwara": 3800, "raja park": 6000,
            "bani park": 5500, "civil lines jaipur": 7000,
            "sodala": 4500, "pratap nagar": 4500, "sitapura": 4000,
            // ═══ Lucknow ═══
            "gomti nagar": 6000, "gomti nagar extension": 5000,
            "hazratganj": 7000, "aliganj": 5000, "indira nagar lucknow": 5500,
            "jankipuram": 4000, "alambagh": 4500, "mahanagar": 5500,
            "aminabad": 5000, "charbagh": 4500, "vikas nagar": 4500,
            "sushant golf city": 5500, "shaheed path": 4500,
            // ═══ Chandigarh ═══
            "sector 17": 12000, "sector 8": 11000, "sector 9": 10000,
            "sector 15": 10500, "sector 22": 9500, "sector 35": 9000,
            "sector 43 chandigarh": 8500, "sector 44 chandigarh": 9000,
            "manimajra": 6500, "zirakpur": 5500, "mohali": 6500,
            "kharar": 4500, "panchkula": 7000,
            // ═══ Surat ═══
            "vesu": 6000, "pal": 5500, "adajan": 5500,
            "athwa": 6500, "city light": 6000, "althan": 5000,
            "piplod": 5500, "dumas road": 5000, "new city light": 5500,
            "dindoli": 3500, "udhna": 3500, "varachha": 4000,
            // ═══ Indore ═══
            "vijay nagar": 5500, "palasia": 5000, "sapna sangeeta": 6000,
            "scheme 78": 5000, "scheme 140": 4500, "ab road": 4500,
            "rau": 3500, "bhawarkua": 4500, "nipania": 4000,
            // ═══ Coimbatore ═══
            "rs puram": 8000, "race course": 7500, "peelamedu": 5500,
            "saravanampatti": 5000, "singanallur": 5500, "gandhipuram": 6000,
            "ganapathy": 5500, "vadavalli": 4500, "thudiyalur": 4000,
            // ═══ Kochi ═══
            "marine drive kochi": 9000, "panampilly nagar": 8000,
            "kadavanthra": 7500, "edappally": 6500, "vyttila": 7000,
            "kakkanad": 5500, "aluva": 4500, "tripunithura": 5000,
            "fort kochi": 6500, "kaloor": 6500, "ernakulam": 7000,
            // ═══ Thane ═══
            "ghodbunder road": 9000, "majiwada": 10000, "pokhran road": 10500,
            "kolshet road": 11000, "patlipada": 9500, "manpada": 10000,
            "wagle estate": 8000, "vartak nagar": 8500, "brahmand": 9000,
            // ═══ Navi Mumbai ═══
            "palm beach road": 13000, "seawoods": 11000, "ulwe": 7000,
            "taloja": 5500, "ghansoli": 9000, "kopar khairane": 9500,
            // ═══ Nagpur ═══
            "civil lines nagpur": 6500, "dharampeth": 6000, "sadar": 5500,
            "sitabuldi": 5000, "manish nagar": 4500, "wardha road": 4000,
            "hingna road": 3500, "besa": 3500, "manewada": 4000,
            // ═══ Bhopal ═══
            "mp nagar": 5500, "arera colony": 5000, "hoshangabad road": 4000,
            "kolar road": 3500, "habibganj": 4500, "shahpura": 3800,
            // ═══ Ghaziabad ═══
            "indirapuram": 6500, "vaishali ghaziabad": 6000,
            "raj nagar extension": 4500, "crossings republik": 3800,
            "vasundhara": 5500, "kaushambi": 7000, "ahinsa khand": 6500,
            // ═══ Vadodara ═══
            "alkapuri": 6500, "race course vadodara": 5500, "gotri": 4500,
            "manjalpur": 4000, "vasna bhayli": 3500, "bill": 3500,
            // ═══ Thiruvananthapuram ═══
            "kowdiar": 8000, "vellayambalam": 7000, "vazhuthacaud": 6500,
            "pattom": 6000, "kesavadasapuram": 5500, "kazhakkoottam": 5000,
            "technopark": 5500, "sreekaryam": 4500, "ulloor": 5000,
            // ═══ Vijayawada ═══
            "benz circle": 6500, "governorpet": 5500, "labbipet": 5500,
            "moghalrajpuram": 5000, "patamata": 5000, "auto nagar": 4000,
            "gannavaram": 3500, "tadepalli": 4500, "mangalagiri": 4000,
            // ═══ Patna ═══
            "boring road": 5500, "fraser road": 5000, "bailey road": 5000,
            "kankarbagh": 4500, "rajendra nagar": 4000, "danapur": 3500,
            // ═══ Guwahati ═══
            "zoo road": 5000, "ganeshguri": 5500, "dispur": 5000,
            "beltola": 4500, "six mile": 4000, "paltan bazar": 4500,
            // ═══ Ranchi ═══
            "main road ranchi": 4500, "lalpur": 4000, "ashok nagar ranchi": 4000,
            "kanke road": 3800, "doranda": 3500, "ratu road": 3200,
            // ═══ Raipur ═══
            "shankar nagar raipur": 4500, "telibandha": 4500, "vip road raipur": 4000,
            "pandri": 3800, "tatibandh": 3500, "amanaka": 3500,
            // ═══ Rajkot ═══
            "kalawad road": 4500, "university road rajkot": 5000,
            "150 feet ring road": 4500, "gondal road": 4000,
            "raiya road": 4000, "jamnagar road": 3500,
            // ═══ Madurai ═══
            "anna nagar madurai": 4500, "kk nagar": 4000,
            "ss colony": 4000, "thirunagar": 3800, "vilangudi": 3500,
            // ═══ Ludhiana ═══
            "model town ludhiana": 5500, "sarabha nagar": 5000,
            "brs nagar": 4500, "dugri": 4000, "pakhowal road": 4500,
        };

        // Check for exact locality match first
        if (localityRates[loc]) {
            rate = localityRates[loc];
        } else {
            // Partial match search (e.g., user types "Bandra" → matches "bandra")
            const partialMatch = Object.keys(localityRates).find(k => 
                loc.includes(k) || k.includes(loc)
            );
            if (partialMatch) {
                rate = localityRates[partialMatch];
            } else {
                // Unknown locality: apply small deterministic variation (-3% to +5%)
                const hash = locality.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const variation = ((hash % 8) - 3) / 100;
                rate *= (1 + variation);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: Property type multiplier
    // ═══════════════════════════════════════════════════════════════
    if (propertyType === 'Villa') rate *= 1.25;
    else if (propertyType === 'Independent House') rate *= 1.1;
    else if (propertyType === 'Plot') rate *= 0.65; // Land only, no construction value

    // ═══════════════════════════════════════════════════════════════
    // STEP 4: Feature-based premium (additive, capped)
    // Each feature adds/subtracts a % premium, then capped at ±30%
    // ═══════════════════════════════════════════════════════════════
    let premiumPercent = 0;

    // Structure features
    if (bathrooms > bedrooms) premiumPercent += 1.5;
    if (balconies > 1) premiumPercent += 1;
    if (unitPosition === 'Corner') premiumPercent += 2;
    if (parking === 'Covered') premiumPercent += 3;
    else if (parking === 'Open') premiumPercent += 1;
    if (servantRoom === 'Yes') premiumPercent += 2;
    if (studyRoom === 'Yes') premiumPercent += 1.5;

    // Views & Directions (Vastu premium is real in Indian market)
    if (parkFacing === 'Yes') premiumPercent += 2;
    if (gardenView === 'Yes') premiumPercent += 1.5;
    if (seaLakeView === 'Yes') premiumPercent += 4;
    if (roadView === 'Yes') premiumPercent -= 1.5; // Main road noise discount
    if (mainDoorFacing === 'East' || mainDoorFacing === 'North') premiumPercent += 1;

    // Amenities (each adds 0.3%, specific ones add more)
    if (amenities && amenities.length > 0) {
        premiumPercent += (amenities.length * 0.3);
        if (amenities.includes('Swimming pool')) premiumPercent += 2;
        if (amenities.includes('Clubhouse')) premiumPercent += 1.5;
        if (amenities.includes('Gym')) premiumPercent += 1;
    }

    // Builder & Legal
    if (builderReputation === 'Premium') premiumPercent += 8;
    else if (builderReputation === 'Unknown') premiumPercent -= 4;
    if (reraApproved === 'Yes') premiumPercent += 1;
    if (gatedCommunity === 'Yes') premiumPercent += 2;

    // Connectivity
    if (distanceMetro < 1) premiumPercent += 3;
    else if (distanceMetro < 2) premiumPercent += 2;
    else if (distanceMetro > 10) premiumPercent -= 2;

    if (highwayAccess < 3) premiumPercent += 1.5;
    else if (highwayAccess > 15) premiumPercent -= 1.5;

    if (airportDistance < 10) premiumPercent += 1;

    // Floor rise: ~0.3% per floor above 5 (Indian market standard)
    if (floor > 5) premiumPercent += 0.3 * Math.min(floor - 5, 30);

    // BHK premium: larger homes command slightly higher per-sqft
    if (bedrooms >= 4) premiumPercent += 3;
    else if (bedrooms === 3) premiumPercent += 1;

    // Cap total feature premium at ±30% (prevents runaway inflation)
    premiumPercent = Math.max(-15, Math.min(30, premiumPercent));

    // Apply net feature premium
    rate = rate * (1 + (premiumPercent / 100));

    // ═══════════════════════════════════════════════════════════════
    // STEP 5: Depreciation (age-based, realistic Indian market)
    // New construction: 0 depreciation
    // 1-5 years: 0.3% per year (nearly new)
    // 5-15 years: 0.6% per year (moderate aging)
    // 15+ years: 1% per year (older buildings)
    // Capped at 35% max depreciation
    // ═══════════════════════════════════════════════════════════════
    let depreciation = 0;
    if (age <= 5) {
        depreciation = age * 0.3;
    } else if (age <= 15) {
        depreciation = (5 * 0.3) + ((age - 5) * 0.6);
    } else {
        depreciation = (5 * 0.3) + (10 * 0.6) + ((age - 15) * 1.0);
    }
    depreciation = Math.min(35, depreciation);
    rate = rate * (1 - (depreciation / 100));

    // ═══════════════════════════════════════════════════════════════
    // STEP 6: Hybrid ML + Rule-Based Final Calculation
    // The ML model provides a data-learned base prediction.
    // The rule-based rate provides domain-expert adjustments.
    // Final = weighted blend of both approaches.
    // ═══════════════════════════════════════════════════════════════
    const ruleBasedPrice = Math.round(rate * sqft);

    // Get ML model prediction (trained on properties dataset)
    const mlPrediction = _mlPredict(features);

    // Blend: 40% ML model + 60% Rule-based (rule-based has locality data ML lacks)
    const ML_WEIGHT = 0.4;
    const RULE_WEIGHT = 0.6;
    const predicted = Math.round(mlPrediction * ML_WEIGHT + ruleBasedPrice * RULE_WEIGHT);

    const low = Math.round(predicted * 0.92);   // -8% market variation
    const high = Math.round(predicted * 1.08);  // +8% market variation

    // Classify into market segment using K-Means
    const marketSegment = _classifySegment(features);

    // Dynamic confidence: factors in ML model R² + data specificity
    let confidence = 78; // base confidence
    // ML model contribution to confidence
    confidence += Math.round(modelMetrics.r2 * 10); // Higher R² → higher confidence
    if (locality) {
        const loc = locality.toLowerCase().trim();
        // Check if this locality has a known rate override (higher confidence for known areas)
        const localityRatesKeys = ["bandra west","bandra east","juhu","worli","lower parel","andheri west","andheri east","powai","colaba","south bombay","bkc","goregaon","malad","borivali","kandivali","malabar hill","prabhadevi","dadar","sion","chembur","mulund","ghatkopar","khar","santacruz","vile parle","versova","koramangala","indiranagar","whitefield","marathahalli","electronic city","sarjapur","hsr layout","jayanagar","jp nagar","sadashivanagar","malleshwaram","richmond town","lavelle road","gachibowli","madhapur","hitech city","jubilee hills","banjara hills","kondapur","kukatpally","secunderabad","begumpet","somajiguda","rk beach","lawsons bay colony","mvp colony","seethammadhara","siripuram","waltair","waltair uplands","arilova","rushikonda","madhurawada","dwarka","vasant kunj","saket","greater kailash","defence colony","hauz khas","connaught place","khan market","golf links","vasant vihar","golf course road","dlf phase 1","dlf phase 5","sushant lok","koregaon park","viman nagar","baner","hinjewadi","kalyani nagar","boat club road","kothrud","adyar","anna nagar","velachery","besant nagar","t nagar","mylapore","ra puram","nungambakkam","boat club","salt lake","new town","ballygunge","alipore","park street","sector 150","sector 137","sector 75","sector 44","sg highway","prahlad nagar","bodakdev","satellite","c scheme","gomti nagar","hazratganj","sector 17","marine drive kochi","rs puram","boring road"];
        if (localityRatesKeys.some(k => loc.includes(k) || k.includes(loc))) {
            confidence += 6;
        } else {
            confidence += 2;
        }
    }
    if (propertyType && propertyType !== 'Apartment') confidence += 1;
    if (builderReputation === 'Premium') confidence += 2;
    else if (builderReputation === 'Unknown') confidence -= 2;
    if (age <= 5) confidence += 2;
    confidence = Math.max(70, Math.min(95, confidence));

    return {
        predicted, low, high, confidence,
        pricePerSqft: Math.round(predicted / sqft),
        // ML metadata (for display in UI)
        mlPrediction: Math.round(mlPrediction),
        ruleBasedPrediction: ruleBasedPrice,
        marketSegment,
        modelR2: modelMetrics.r2,
        blendRatio: { ml: ML_WEIGHT, rules: RULE_WEIGHT }
    };
}

// --- Recommendations ---
export function getRecommendations(savedIds, maxBudget = 50000000) {
    const savedSet = Array.isArray(savedIds) ? new Set(savedIds) : (savedIds instanceof Set ? savedIds : new Set());
    // Simple mock logic: prioritize trending and active, different from saved
    return properties.filter(p => !savedSet.has(p.id) && p.status === 'active').sort(() => 0.5 - Math.random()).slice(0, 5);
}

export function getCompetitors(property) {
    return properties.filter(p => p.city === property.city && p.id !== property.id).slice(0, 3).map(p => ({
        ...p,
        priceDiff: ((p.pricePerSqft - property.pricePerSqft) / property.pricePerSqft * 100).toFixed(1)
    }));
}

export function simulatePriceChange(property, changePercent) {
    const newPrice = Math.round(property.price * (1 + changePercent / 100));
    return {
        newPrice,
        projectedViews: Math.round(property.views * (changePercent < 0 ? 1.2 : 0.8)),
        projectedInquiries: Math.round(property.inquiries * (changePercent < 0 ? 1.3 : 0.7)),
        marketPosition: changePercent < -5 ? "Competitive" : changePercent > 5 ? "Premium" : "Market Standard"
    };
}

// --- Buyer specific data ---

export const activityTimeline = [
    { id: 1, action: "Saved Property", detail: "Lodha World One", time: "2 hours ago", type: "save", icon: "bookmark" },
    { id: 2, action: "Scheduled Tour", detail: "Prestige Shantiniketan", time: "Yesterday", type: "tour", icon: "event" },
    { id: 3, action: "Price Drop Alert", detail: "Oberoi Sky City (₹ 2.8 Cr)", time: "2 days ago", type: "alert", icon: "notifications" },
    { id: 4, action: "Offer Submitted", detail: "Lodha World One", time: "4 days ago", type: "offer", icon: "gavel" },
    { id: 5, action: "Viewed Property", detail: "Rustomjee Paramount", time: "5 days ago", type: "view", icon: "visibility" },
];

export const notifications = [
    { id: 1, title: "Tour Confirmed", message: "Your visit to Prestige Shantiniketan is confirmed for Feb 22.", read: false, time: "1 hour ago", type: "tour" },
    { id: 2, title: "New Match", message: "3 new properties match your 'Sea View' search.", read: false, time: "5 hours ago", type: "search" },
    { id: 3, title: "Offer Update", message: "Seller countered your offer on Lodha World One.", read: true, time: "1 day ago", type: "offer" },
];

export const buyerPipelineStages = ["search", "touring", "offer_submitted", "under_contract", "closed"];
export const buyerPipelineLabels = { search: "Browsing", touring: "Touring", offer_submitted: "Offer", under_contract: "In Contract", closed: "Keys Handed" };
export const buyerPipelineColors = { search: "#3b82f6", touring: "#f59e0b", offer_submitted: "#c93a2a", under_contract: "#8b5cf6", closed: "#22c55e" };

export const neighborhoodScores = {
    "Lower Parel": { safety: 88, commute: 92, lifestyle: 95 },
    "Whitefield": { safety: 84, commute: 78, lifestyle: 85 },
    "Gurgaon": { safety: 82, commute: 88, lifestyle: 90 },
};
