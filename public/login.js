
// ============================================================
// login.js — Google Login + Firestore User Sync + Routing
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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

// ── Firebase Configuration ──
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ── Admin List ──
// Add email addresses here to grant admin access
const ADMIN_EMAILS = [
  "jmlsd75@gmail.com",
  "mohd.khamis18.mk@gmail.com"
];

// ── Initialize Firebase ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Set auth persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Auth persistence set to LOCAL"))
  .catch((err) => console.error("❌ Persistence error:", err));

// ── Routing Logic ──
/**
 * Determines if the given email is an admin.
 */
function isAdminUser(email) {
  return ADMIN_EMAILS.includes(email);
}

/**
 * Returns the destination URL based on user email.
 */
function getRedirectPage(email) {
  return isAdminUser(email) ? "admin.html" : "free.html";
}

// ── Firestore Sync ──
/**
 * Creates or updates the user document in Firestore.
 * Returns the merged user data object.
 */
async function syncUserWithFirestore(authUser) {
  const userRef = doc(db, "users", authUser.email);
  const docSnapshot = await getDoc(userRef);

  if (docSnapshot.exists()) {
    // User exists: Update last visit timestamp
    await updateDoc(userRef, {
      lastVisit: serverTimestamp()
    });
    console.log(`🔄 Updated existing user: ${authUser.email}`);
    return docSnapshot.data();
  } else {
    // New user: Create document with defaults
    const newUserData = {
      email: authUser.email,
      username: authUser.displayName || "User",
      lastPayment: null,
      lastPaymentAmount: 0,
      spaceUsed: 0,
      createdAt: serverTimestamp(), // Useful for tracking
      lastVisit: serverTimestamp()
    };

    await setDoc(userRef, newUserData);
    console.log(`🆕 Created new user: ${authUser.email}`);
    return newUserData;
  }
}

// ── Login Handler ──
window.handleGoogleLogin = async function () {
  const loginBtn = document.getElementById("googleLoginBtn");
  
  // Guard clause if button doesn't exist
  if (!loginBtn) return;

  // UI Loading State
  const originalBtnContent = loginBtn.innerHTML;
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<div class="btn-spinner"></div> Signing in...';

  // Inject Spinner CSS dynamically if needed
  if (!document.getElementById("spinnerCSS")) {
    const style = document.createElement("style");
    style.id = "spinnerCSS";
    style.textContent = `
      .btn-spinner {
        width: 20px; height: 20px;
        border: 3px solid #e0e0e0;
        border-top-color: #4285F4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  try {
    // 1. Authenticate with Google
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Sync Data with Firestore
    const firestoreData = await syncUserWithFirestore(user);

    // 3. Construct Full User Session Object
    const sessionData = {
      auth: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isAdmin: isAdminUser(user.email)
      },
      db: {
        username: firestoreData.username || user.displayName,
        lastPayment: firestoreData.lastPayment,
        lastPaymentAmount: firestoreData.lastPaymentAmount || 0,
        spaceUsed: firestoreData.spaceUsed || 0,
        lastVisit: new Date().toISOString() // Local timestamp for immediate UI use
      }
    };

    // 4. Persist to LocalStorage
    localStorage.setItem("userSession", JSON.stringify(sessionData));

    // 5. Success UI Feedback
    loginBtn.innerHTML = `
      <svg style="width:20px;height:20px;margin-right:8px;vertical-align:bottom" viewBox="0 0 24 24">
        <path fill="#2e7d32" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
      Signed in! Redirecting...`;
    loginBtn.style.background = "#e8f5e9";
    loginBtn.style.color = "#2e7d32";
    loginBtn.style.borderColor = "#2e7d32";

    // 6. Dispatch Event for other tabs/scripts
    window.dispatchEvent(new CustomEvent("loginSuccess", { detail: sessionData }));

    console.log("✅ Login Successful. Redirecting to:", getRedirectPage(user.email));

    // 7. Redirect
    setTimeout(() => {
      window.location.href = getRedirectPage(user.email);
    }, 1000);

  } catch (error) {
    // Error Handling
    console.error("❌ Login Error:", error.code, error.message);
    
    // Reset Button
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalBtnContent;
    loginBtn.style.background = "";
    loginBtn.style.color = "";
    
    // Show Error Message
    let friendlyMessage = "Login failed. Please try again.";
    if (error.code === "auth/popup-closed-by-user") friendlyMessage = "Sign-in cancelled.";
    if (error.code === "auth/invalid-client") friendlyMessage = "Configuration error.";
    
    showErrorMessage(friendlyMessage);
  }
};

// ── Logout Handler ──
window.handleLogout = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem("userSession");
    console.log("👋 User signed out");
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent("logoutSuccess"));
    
    // Redirect to home
    window.location.href = "index.html";
  } catch (error) {
    console.error("❌ Logout Error:", error);
  }
};

// ── Auto-Login Check ──
onAuthStateChanged(auth, async (user) => {
  // Only auto-redirect if we are on the index/login page
  const isIndexPage = window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/");

  if (user && isIndexPage) {
    const sessionStr = localStorage.getItem("userSession");
    
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      
      // Legacy check: If session exists but lacks DB data, re-sync
      if (!session.db || session.db.spaceUsed === undefined) {
        console.log("🔄 Syncing legacy session with Firestore...");
        const dbData = await syncUserWithFirestore(user);
        
        session.db = {
          username: dbData.username || session.auth.displayName,
          lastPayment: dbData.lastPayment,
          lastPaymentAmount: dbData.lastPaymentAmount || 0,
          spaceUsed: dbData.spaceUsed || 0,
          lastVisit: new Date().toISOString()
        };
        localStorage.setItem("userSession", JSON.stringify(session));
      }
    } else {
      // No session exists in storage, but Firebase says we are logged in.
      // Create a fresh session.
      console.log("🔄 Creating session from existing Firebase auth...");
      const dbData = await syncUserWithFirestore(user);
      const newSession = {
        auth: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isAdmin: isAdminUser(user.email)
        },
        db: {
          username: dbData.username || user.displayName,
          lastPayment: dbData.lastPayment,
          lastPaymentAmount: dbData.lastPaymentAmount || 0,
          spaceUsed: dbData.spaceUsed || 0,
          lastVisit: new Date().toISOString()
        }
      };
      localStorage.setItem("userSession", JSON.stringify(newSession));
    }

    // Perform Redirect
    console.log("♻️ User already logged in. Redirecting...");
    window.location.href = getRedirectPage(user.email);
  }
});

// ── Helper: Error UI ──
function showErrorMessage(msg) {
  // Remove existing error
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();

  const errorDiv = document.createElement("div");
  errorDiv.id = "loginError";
  errorDiv.textContent = msg;
  errorDiv.style.cssText = `
    color: #d32f2f;
    background-color: #ffebee;
    border: 1px solid #ffcdd2;
    padding: 10px;
    border-radius: 6px;
    margin-top: 15px;
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease-in;
  `;

  const btn = document.getElementById("googleLoginBtn");
  if (btn) btn.parentNode.insertBefore(errorDiv, btn.nextSibling);

  // Auto remove
  setTimeout(() => {
    errorDiv.style.opacity = "0";
    errorDiv.style.transition = "opacity 0.5s";
    setTimeout(() => errorDiv.remove(), 500);
  }, 5000);

  // Animation Keyframes
  if (!document.getElementById("errorAnimCSS")) {
    const s = document.createElement("style");
    s.id = "errorAnimCSS";
    s.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(s);
  }
}
```
