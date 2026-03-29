import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const postTitle = postLogin.querySelector('.system-title');
const lionContainer = postLogin.querySelector('.lion-container');

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

// ===== Logout — delete all user data then sign out =====
logoutBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            const subcollections = ['logins', 'sessions', 'records', 'profile'];
            for (const sub of subcollections) {
                const q = query(collection(db, 'users', user.uid, sub));
                const snapshot = await getDocs(q);
                for (const d of snapshot.docs) {
                    await deleteDoc(doc(db, 'users', user.uid, sub, d.id));
                }
            }
            await deleteDoc(doc(db, 'users', user.uid));
            console.log("✅ User data deleted from Firestore");
        } catch (e) {
            console.error("Delete error:", e);
        }
    }
    await signOut(auth);
});

// ===== Free button =====
freeBtn.addEventListener('click', () => {
    if (typeof window.handleFree === 'function') {
        window.handleFree();
    } else {
        alert("Free module not loaded yet.");
    }
});

// ===== Auth State =====
onAuthStateChanged(auth, async (user) => {
    if (user) {
        preLogin.style.display = 'none';
        postLogin.style.display = 'flex';
        logoutBtn.style.display = 'block';
        freeBtn.style.display = 'flex';

        if (postTitle) postTitle.style.display = 'none';
        if (lionContainer) lionContainer.style.display = 'none';

        try {
            await addDoc(collection(db, "users", user.uid, "logins"), {
                name: user.displayName,
                email: user.email,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Save login error:", e);
        }

    } else {
        preLogin.style.display = 'flex';
        postLogin.style.display = 'none';
        logoutBtn.style.display = 'none';
        freeBtn.style.display = 'none';
    }
});
