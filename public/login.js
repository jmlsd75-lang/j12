// Firebase (MODULAR CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence
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

setPersistence(auth, browserLocalPersistence);

// ── CHECK ADMIN ──
function isAdmin(email) {
    return ADMIN_EMAILS.includes(email);
}

// ── FIRESTORE USER SYNC ──
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

// ── LOGIN BUTTON ──
document.getElementById("googleLoginBtn").addEventListener("click", async () => {
    const btn = document.getElementById("googleLoginBtn");

    const old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Signing in...`;

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const dbData = await syncUser(user);

        const session = {
            email: user.email,
            name: user.displayName,
            isAdmin: isAdmin(user.email),
            db: dbData
        };

        localStorage.setItem("session", JSON.stringify(session));

        btn.innerHTML = "✓ Success";

        setTimeout(() => {
            if (isAdmin(user.email)) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "free.html";
            }
        }, 800);

    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = old;
        alert("Login failed: " + err.message);
    }
});
