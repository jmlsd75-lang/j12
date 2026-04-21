// Firebase (MODULAR CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged // <--- Added this import
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── CONFIG ──
const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.firebasestorage.app",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAILS = [
    "jmlsd75@gmail.com",
    "mohd.khamis18.mk@gmail.com"
];

// ── INIT ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ── PERSISTENCE ──
// Keeps user logged in even after closing the browser
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to Local");
    })
    .catch((err) => {
        console.error("Persistence error:", err);
    });

// ─── HELPERS ───
function isAdmin(email) {
    return ADMIN_EMAILS.includes(email);
}

async function syncUser(user) {
    const ref = doc(db, "users", user.email);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        await updateDoc(ref, { lastVisit: serverTimestamp() });
        return snap.data();
    } else {
        const data = {
            email: user.email,
            name: user.displayName || "User",
            createdAt: serverTimestamp(),
            lastVisit: serverTimestamp(),
            lastPayment: null
        };
        await setDoc(ref, data);
        return data;
    }
}

// ─── LOGIN LOGIC (CENTRALIZED) ───
// Lock to prevent double-execution when login popup closes and observer fires
let isRedirecting = false;

async function processLogin(user) {
    if (isRedirecting) return;
    isRedirecting = true;

    const btn = document.getElementById("googleLoginBtn");

    try {
        // 1. Sync Data with Firestore
        const dbData = await syncUser(user);

        // 2. Create Session Object
        const session = {
            email: user.email,
            name: user.displayName,
            isAdmin: isAdmin(user.email),
            db: dbData
        };

        // 3. Save to LocalStorage (Your original requirement)
        localStorage.setItem("session", JSON.stringify(session));

        // 4. UI Feedback
        if (btn) {
            btn.innerHTML = "✓ Success";
            btn.disabled = true;
        }

        // 5. Redirect
        setTimeout(() => {
            const destination = isAdmin(user.email) ? "admin.html" : "free.html";
            window.location.href = destination;
        }, 800);

    } catch (error) {
        console.error("Login processing error:", error);
        isRedirecting = false; // Unlock on failure so they can try again
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Sign in with Google";
        }
        alert("Error preparing session: " + error.message);
    }
}

// ─── AUTH STATE OBSERVER ───
// This runs automatically when the page loads to check saved state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is already logged in, restore state and redirect
        processLogin(user);
    } else {
        // User is signed out, ensure button is ready
        isRedirecting = false;
        const btn = document.getElementById("googleLoginBtn");
        if (btn) {
            btn.disabled = false;
        }
    }
});

// ─── BUTTON CLICK HANDLER ───
document.getElementById("googleLoginBtn").addEventListener("click", async () => {
    const btn = document.getElementById("googleLoginBtn");
    const oldContent = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Signing in...`;

    try {
        // Trigger Google Popup
        await signInWithPopup(auth, provider);
        
        // Note: We do NOT need to manually call processLogin here.
        // The 'onAuthStateChanged' listener above will detect the login 
        // automatically and trigger processLogin for us.
        
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = oldContent;
        alert("Login failed: " + err.message);
    }
});
