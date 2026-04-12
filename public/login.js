// ============================================================
// login.js — Google Login (Redirect Flow)
// Enables "No Verify" on Mobile if already logged in on PC
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

// ── Admin emails ──
const ADMIN_EMAILS = [
  "jmlsd75@gmail.com",
  "mohd.khamis18.mk@gmail.com"
];

// ── Initialize ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ⚡ CRITICAL FOR PC -> PHONE SYNC ⚡
// We use 'LOCAL' persistence. This tells the browser to save the login state
// aggressively. If the user moves between devices (PC to Phone), this 
// combined with the Redirect Flow ensures Google recognizes the session.
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence: LOCAL (Syncs PC -> Phone)"))
  .catch((err) => console.error("Persistence error:", err));

// ── Routing helpers ──
function getDestination(email) {
  return ADMIN_EMAILS.includes(email) ? "admin.html" : "free.html";
}

function isAdmin(email) {
  return ADMIN_EMAILS.includes(email);
}

// ── Firestore: Sync User Data ──
async function syncUserToFirestore(authUser) {
  if (!authUser || !authUser.email) return null;

  const userRef = doc(db, "users", authUser.email);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // Update last visit time
    await updateDoc(userRef, {
      lastVisit: serverTimestamp()
    });
    
    const existing = snapshot.data();
    console.log("Firestore user updated:", authUser.email);
    return { ...existing, lastVisit: new Date().toISOString() };
  } else {
    // Create new user
    const newUserData = {
      email: authUser.email,
      username: authUser.displayName || "User",
      lastPayment: null,
      lastPaymentAmount: 0,
      lastVisit: new Date().toISOString(),
      spaceUsed: 0
    };

    await setDoc(userRef, {
      ...newUserData,
      lastVisit: serverTimestamp()
    });

    console.log("Firestore user created:", authUser.email);
    return newUserData;
  }
}

// ── LOGIN FUNCTION ──
// Uses REDIRECT instead of Popup. 
// Redirect works better on mobile and respects Google's "Trusted Device" status.
async function handleGoogleLogin() {
  const btn = document.getElementById("googleLoginBtn");
  if (!btn) return;

  // UI Feedback
  btn.disabled = true;
  btn.innerHTML = '<div class="btn-spinner"></div> Authenticating...';

  // Add spinner CSS if not present
  if (!document.getElementById("spinnerCSS")) {
    const s = document.createElement("style");
    s.id = "spinnerCSS";
    s.textContent = `.btn-spinner{width:22px;height:22px;border:3px solid #e0e0e0;border-top-color:#4285F4;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(s);
  }

  try {
    // 1. Redirect to Google
    // If the user is logged in on their PC (same Google account),
    // Google will skip the password screen here and bounce back immediately.
    await signInWithRedirect(auth, provider);
    
  } catch (error) {
    // Handle errors (popup blocked, network issues)
    btn.disabled = false;
    btn.innerHTML = `Sign in with Google`;
    
    let msg = "Login failed. Try again.";
    if (error.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled.";
    else if (error.code === "auth/invalid-client") msg = "Invalid client configuration.";
    
    showError(msg);
    console.error("Login error:", error.code, error.message);
  }
}

// ── LOGOUT ──
async function handleLogout() {
  try {
    await signOut(auth);
    localStorage.removeItem("userSession");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// ── Error Helper ──
function showError(message) {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "loginError";
  div.style.cssText = "color:#ff6b6b;font-size:13px;margin-top:14px;padding:10px 14px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.25);border-radius:8px;text-align:center;animation:errorIn .3s ease";
  div.textContent = message;

  const btn = document.getElementById("googleLoginBtn");
  if (btn) btn.parentNode.insertBefore(div, btn.nextSibling);

  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transition = "opacity 0.3s";
    setTimeout(() => div.remove(), 300);
  }, 5000);

  if (!document.getElementById("errorCSS")) {
    const s = document.createElement("style");
    s.id = "errorCSS";
    s.textContent = "@keyframes errorIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}";
    document.head.appendChild(s);
  }
}

// ── MAIN AUTH OBSERVER ──
// This runs on page load to check if user is logged in
onAuthStateChanged(auth, async (user) => {
  
  // 1. Check for Redirect Result (Did we just come back from Google?)
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Login success via Redirect (PC/Mobile Sync):", result.user.email);
      // The observer below will handle the actual redirection logic
    }
  } catch (error) {
    // Ignore harmless errors
    if (error.code !== 'auth/cancelled-popup-request') {
      console.log("Redirect check:", error.code);
    }
  }

  // 2. Handle Active User (Redirecting them to the correct page)
  if (user) {
    // Only redirect if we are currently on the login page (index.html)
    const isLoginPage = window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/");

    if (isLoginPage) {
      console.log("User authenticated. Syncing data...");
      
      // Sync to Firestore to get latest permissions/data
      const firestoreData = await syncUserToFirestore(user);

      // Create Session Object
      const userData = {
        name: user.displayName || "User",
        email: user.email,
        photo: user.photoURL || "",
        uid: user.uid,
        isAdmin: isAdmin(user.email),
        loginTime: new Date().toISOString(),
        
        // Firestore Data
        username: firestoreData?.username || user.displayName || "User",
        lastPayment: firestoreData?.lastPayment || null,
        lastPaymentAmount: firestoreData?.lastPaymentAmount || 0,
        lastVisit: firestoreData?.lastVisit || new Date().toISOString(),
        spaceUsed: firestoreData?.spaceUsed || 0
      };

      // Save to LocalStorage
      localStorage.setItem("userSession", JSON.stringify(userData));
      
      // Notify App
      window.dispatchEvent(new CustomEvent("loginSuccess", { detail: userData }));
      
      // Redirect
      console.log(`Redirecting verified user to: ${getDestination(user.email)}`);
      window.location.href = getDestination(user.email);
    }
  }
});

// ── Global Exports ──
window.handleGoogleLogin = handleGoogleLogin;
window.handleLogout = handleLogout;
