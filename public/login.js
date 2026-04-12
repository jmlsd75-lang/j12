// ============================================================
// auth.js — Global Login Handler
// Logic: If Google is already logged in on the device, 
// skip password and enter immediately.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ── Admin List ──
const ADMIN_EMAILS = [
  "jmlsd75@gmail.com",
  "mohd.khamis18.mk@gmail.com"
];

// ── Initialize ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 1. KEEP SESSION ALIVE
// This keeps the user logged in even if they close the browser tab
// on that specific device.
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence enabled: User stays logged in on this device."))
  .catch((err) => console.error("Persistence error:", err));

// ── Helpers ──
function getDestination(email) {
  return ADMIN_EMAILS.includes(email) ? "admin.html" : "free.html";
}

// ── Firestore Sync ──
async function syncUserToFirestore(user) {
  if (!user?.email) return null;

  const userRef = doc(db, "users", user.email);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    await updateDoc(userRef, { lastVisit: serverTimestamp() });
    return { ...snap.data(), lastVisit: new Date().toISOString() };
  } else {
    const newUser = {
      email: user.email,
      username: user.displayName || "User",
      lastPayment: null,
      lastPaymentAmount: 0,
      lastVisit: new Date().toISOString(),
      spaceUsed: 0
    };
    await setDoc(userRef, { ...newUser, lastVisit: serverTimestamp() });
    return newUser;
  }
}

// ── LOGIN FUNCTION ──
async function handleGoogleLogin() {
  const btn = document.getElementById("googleLoginBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "Connecting...";
  }

  try {
    // ⚡ THE KEY TO "NO VERIFY" ⚡
    // This redirects to Google. 
    // If the device is already logged into Google (PC or Phone), 
    // Google will NOT ask for a password. It just says "Welcome back".
    await signInWithRedirect(auth, provider);
  } catch (error) {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "Sign in with Google";
    }
    console.error("Login Error:", error);
    alert("Login failed. Please try again.");
  }
}

// ── LOGOUT ──
async function handleLogout() {
  await signOut(auth);
  localStorage.removeItem("userSession");
  window.location.href = "index.html";
}

// ── AUTH OBSERVER (The Brain) ──
// This runs automatically when any page loads.
onAuthStateChanged(auth, async (user) => {
  // 1. Handle Redirect Result (User just came back from Google)
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("User verified via Google:", result.user.email);
      // We proceed to the logic below
    }
  } catch (e) {
    // Ignore harmless errors
  }

  // 2. Handle Active User
  if (user) {
    // If we are on the Login Page (index.html), move them to Dashboard
    if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
      
      console.log("User is active. Syncing data...");
      
      // Sync with DB
      const dbData = await syncUserToFirestore(user);
      
      // Prepare Session
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        isAdmin: ADMIN_EMAILS.includes(user.email),
        // DB Fields
        username: dbData?.username,
        spaceUsed: dbData?.spaceUsed || 0,
        lastPayment: dbData?.lastPayment
      };

      // Save to Browser Storage
      localStorage.setItem("userSession", JSON.stringify(userData));

      // Redirect to correct page
      const destination = getDestination(user.email);
      console.log("Redirecting to:", destination);
      window.location.href = destination;
    }
  }
});

// Expose functions to HTML buttons
window.handleGoogleLogin = handleGoogleLogin;
window.handleLogout = handleLogout;
