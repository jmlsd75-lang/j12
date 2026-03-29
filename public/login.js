import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== Firebase Config =====
const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.firebasestorage.app",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== DOM Elements =====
const preLogin = document.getElementById('preLogin');
const postLogin = document.getElementById('postLogin');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const freeBtn = document.getElementById('freeBtn');
const userNameDisplay = document.getElementById('userNameDisplay');
const ageBadge = document.getElementById('ageBadge');
const ageInputSection = document.getElementById('ageInputSection');
const ageInput = document.getElementById('ageInput');
const saveAgeBtn = document.getElementById('saveAgeBtn');

// ===== Login =====
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error("Login failed:", e);
        if (e.code !== 'auth/popup-closed-by-user') {
            alert("Login failed: " + e.message);
        }
    }
});

// ===== Save Age =====
saveAgeBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ageVal = ageInput.value.trim();
    if (!ageVal || isNaN(ageVal) || parseInt(ageVal) < 1) {
        alert("Please enter a valid age");
        return;
    }
    saveAgeBtn.textContent = "Saving...";
    saveAgeBtn.disabled = true;
    try {
        await setDoc(doc(db, "users", user.uid, "profile", "info"), {
            age: parseInt(ageVal),
            updatedAt: serverTimestamp()
        });
        ageBadge.textContent = "Age: " + ageVal;
        ageBadge.style.display = 'block';
        ageInputSection.classList.remove('active');
    } catch (e) {
        console.error("Save age error:", e);
        alert("Failed to save age");
    } finally {
        saveAgeBtn.textContent = "SAVE";
        saveAgeBtn.disabled = false;
    }
});

// ===== Logout + Delete User Registration =====
logoutBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Delete all subcollection documents
            const subcollections = ['logins', 'sessions', 'records', 'profile'];
            for (const sub of subcollections) {
                const q = query(collection(db, 'users', user.uid, sub));
                const snapshot = await getDocs(q);
                for (const d of snapshot.docs) {
                    await deleteDoc(doc(db, 'users', user.uid, sub, d.id));
                }
            }
            // Delete user document
            await deleteDoc(doc(db, 'users', user.uid));
            console.log("✅ User registration deleted from Firestore");
        } catch (e) {
            console.error("Delete error:", e);
        }
    }
    await signOut(auth);
});

// ===== Free button (delegated to free.js) =====
freeBtn.addEventListener('click', () => {
    if (typeof window.handleFree === 'function') {
        window.handleFree();
    } else {
        alert("Free module not loaded yet. Please wait.");
    }
});

// ===== Auth State Listener =====
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Show post-login UI
        preLogin.style.display = 'none';
        postLogin.style.display = 'flex';
        logoutBtn.style.display = 'block';
        freeBtn.style.display = 'flex';

        userNameDisplay.textContent = user.displayName;

        // Save login record
        try {
            await addDoc(collection(db, "users", user.uid, "logins"), {
                name: user.displayName,
                email: user.email,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Save login error:", e);
        }

        // Try to fetch age from profile
        try {
            const profileDoc = await getDoc(doc(db, "users", user.uid, "profile", "info"));
            if (profileDoc.exists() && profileDoc.data().age) {
                ageBadge.textContent = "Age: " + profileDoc.data().age;
                ageBadge.style.display = 'block';
                ageInputSection.classList.remove('active');
            } else {
                // Check health records as fallback
                const q = query(collection(db, "users", user.uid, "records"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                let foundAge = null;
                for (const d of snapshot.docs) {
                    if (d.data().age) {
                        foundAge = d.data().age;
                        break;
                    }
                }
                if (foundAge) {
                    ageBadge.textContent = "Age: " + foundAge;
                    ageBadge.style.display = 'block';
                    ageInputSection.classList.remove('active');
                    // Save to profile for next time
                    await setDoc(doc(db, "users", user.uid, "profile", "info"), {
                        age: foundAge,
                        updatedAt: serverTimestamp()
                    }).catch(() => {});
                } else {
                    // No age found — show input
                    ageBadge.style.display = 'none';
                    ageInputSection.classList.add('active');
                }
            }
        } catch (e) {
            console.error("Fetch age error:", e);
            ageBadge.style.display = 'none';
            ageInputSection.classList.add('active');
        }

        // Re-init lucide icons for new buttons
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } else {
        // Show pre-login UI
        preLogin.style.display = 'flex';
        postLogin.style.display = 'none';
        logoutBtn.style.display = 'none';
        freeBtn.style.display = 'none';
        ageBadge.style.display = 'none';
        ageInputSection.classList.remove('active');
        ageInput.value = '';
        userNameDisplay.textContent = '';
    }
});
