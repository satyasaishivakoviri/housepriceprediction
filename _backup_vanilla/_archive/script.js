// Main App Initialization
function initApp() {
    console.log('App Initialized/Navigated');

    // --- Button Group Selection Logic ---
    function setupSelectionGroup(groupId, inputId) {
        const group = document.getElementById(groupId);
        if (!group) return;

        const buttons = group.querySelectorAll('.selectable-btn');
        const hiddenInput = document.getElementById(inputId);

        // Remove old listeners to prevent duplication if re-running
        buttons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Re-select fresh buttons
        const freshButtons = group.querySelectorAll('.selectable-btn');
        freshButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                freshButtons.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white', 'border-primary', 'selected');
                    b.classList.add('bg-slate-50', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-white', 'border-slate-200', 'dark:border-slate-700');
                });

                btn.classList.remove('bg-slate-50', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-white', 'border-slate-200', 'dark:border-slate-700');
                btn.classList.add('bg-primary', 'text-white', 'border-primary', 'selected');

                if (hiddenInput) {
                    hiddenInput.value = btn.getAttribute('data-value');
                }
            });
        });
    }

    setupSelectionGroup('bedrooms-group', 'bedrooms');
    setupSelectionGroup('bathrooms-group', 'bathrooms');

    // --- Form Submission Logic ---
    const calculateBtn = document.getElementById('calculate-btn');

    if (calculateBtn) {
        // Clone to remove old listeners
        const newCalculateBtn = calculateBtn.cloneNode(true);
        calculateBtn.parentNode.replaceChild(newCalculateBtn, calculateBtn);

        newCalculateBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const location = document.getElementById('location').value;
            const area = document.getElementById('area').value;
            const bedrooms = document.getElementById('bedrooms').value;
            const bathrooms = document.getElementById('bathrooms').value;

            if (!area || !location) {
                alert('Please enter location and square footage.');
                return;
            }

            // UI Loading state
            const originalText = newCalculateBtn.innerHTML;
            newCalculateBtn.innerText = 'Calculating...';
            newCalculateBtn.disabled = true;

            const formData = {
                area: area,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                location: location
            };

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    // Save prediction to Firestore if user is logged in
                    try {
                        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
                        const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                        const { getFirestore, addDoc, collection, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

                        const firebaseConfig = {
                            apiKey: "AIzaSyDOf8g0gVzyaTUxwVJIrSumVGw06MoQw1g",
                            authDomain: "house-price-prediction-72b16.firebaseapp.com",
                            projectId: "house-price-prediction-72b16",
                            storageBucket: "house-price-prediction-72b16.firebasestorage.app",
                            messagingSenderId: "931456015691",
                            appId: "1:931456015691:web:779084698ee1ffabc89cce"
                        };

                        const app = initializeApp(firebaseConfig);
                        const auth = getAuth(app);
                        const user = auth.currentUser;

                        if (user) {
                            const db = getFirestore(app);
                            await addDoc(collection(db, "predictions"), {
                                uid: user.uid,
                                location: formData.location,
                                area: formData.area,
                                bedrooms: formData.bedrooms,
                                bathrooms: formData.bathrooms,
                                price: data.prediction,
                                createdAt: serverTimestamp()
                            });
                            console.log("Prediction saved to Firestore");
                        }
                    } catch (firebaseErr) {
                        console.log("Firebase save skipped:", firebaseErr.message);
                    }

                    // Use Router for navigation if available
                    if (window.router) {
                        window.router.navigate(`/results?price=${data.prediction}`);
                    } else {
                        window.location.href = `/results?price=${data.prediction}`;
                    }
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Connection error. Ensure app.py is running.');
            } finally {
                newCalculateBtn.innerHTML = originalText;
                newCalculateBtn.disabled = false;
            }
        });
    }
}

// Attach to window and run on load
window.initApp = initApp;
document.addEventListener('DOMContentLoaded', initApp);
