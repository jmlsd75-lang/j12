// ============================================================
// login.js — Updated: Admin -> admin.html, User -> free.html
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
const ADMIN_EMAILS = [
  "jmlsd75@gmail.com",
  "mohd.khamis18.mk@gmail.com"
];

// ── Initialize Firebase ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence: LOCAL"))
  .catch((err) => console.error("Persistence error:", err));

// ── Routing Helpers ──
function isAdminUser(email) {
  return ADMIN_EMAILS.includes(email);
}

function getRedirectPath(email) {
  // UPDATED LOGIC:
  // If Admin -> Go to admin.html
  // If Non-Admin -> Go to free.html
  if (isAdminUser(email)) {
    return "admin.html";
  } else {
    return "free.html";
  }
}

// ── Firestore Sync ──
async function syncUserWithFirestore(authUser) {
  const userRef = doc(db, "users", authUser.email);
  const docSnapshot = await getDoc(userRef);

  if (docSnapshot.exists()) {
    await updateDoc(userRef, {
      lastVisit: serverTimestamp()
    });
    console.log("User updated:", authUser.email);
    return docSnapshot.data();
  } else {
    const newUserData = {
      email: authUser.email,
      username: authUser.displayName || "User",
      lastPayment: null,
      lastPaymentAmount: 0,
      spaceUsed: 0,
      createdAt: serverTimestamp(),
      lastVisit: serverTimestamp()
    };
    await setDoc(userRef, newUserData);
    console.log("User created:", authUser.email);
    return newUserData;
  }
}

// ── Login Handler ──
window.handleGoogleLogin = async function () {
  const loginBtn = document.getElementById("googleLoginBtn");
  if (!loginBtn) return;

  // 1. UI Loading
  const originalText = loginBtn.innerHTML;
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<div class="btn-spinner"></div> Signing in...';

  // Inject Spinner CSS
  if (!document.getElementById("spinnerCSS")) {
    const style = document.createElement("style");
    style.id = "spinnerCSS";
    style.textContent = `
      .btn-spinner { width:18px; height:18px; border:2px solid #ddd; border-top-color:#4285F4; border-radius:50%; animation:spin 1s linear infinite; display:inline-block; }
      @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  try {
    // 2. Google Auth
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 3. Firestore Sync
    const dbData = await syncUserWithFirestore(user);

    // 4. Session Object
    const sessionData = {
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

    // 5. Save Session
    localStorage.setItem("userSession", JSON.stringify(sessionData));

    // 6. Update UI to show success briefly
    loginBtn.innerHTML = `<span style="color:#2e7d32">✓ Success!</span>`;
    loginBtn.style.borderColor = "#2e7d32";
    
    console.log("✅ Login successful. User:", user.email);

    // 7. REDIRECT LOGIC
    const destination = getRedirectPath(user.email);
    const currentPath = window.location.pathname;

    // Loop Prevention: If we are somehow already on the correct page, reload to update state.
    // Otherwise, navigate to the new page.
    if (currentPath.includes(destination)) {
      console.log("Already on destination page. Reloading...");
      setTimeout(() => window.location.reload(), 800);
    } else {
      console.log("🚀 Redirecting to:", destination);
      setTimeout(() => {
        window.location.replace(destination); 
      }, 800);
    }

  } catch (error) {
    // Error Handling
    console.error("❌ Login error:", error);
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalText;
    loginBtn.style.borderColor = "";

    let msg = "Login failed. Try again.";
    if (error.code === "auth/popup-closed-by-user") msg = "Popup closed by user.";
    
    showError(msg);
  }
};

// ── Logout Handler ──
window.handleLogout = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem("userSession");
    window.location.replace("index.html");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ── Auto-Login Check ──
onAuthStateChanged(auth, async (user) => {
  // Check if we are on the login page (index.html)
  const isLoginOrIndexPage = window.location.pathname.includes("index.html") || 
                             window.location.pathname.endsWith("/");

  if (user && isLoginOrIndexPage) {
    console.log("♻️ User already logged in. Verifying session...");
    
    // Sync data if needed
    let sessionStr = localStorage.getItem("userSession");
    let session = sessionStr ? JSON.parse(sessionStr) : null;

    if (!session || !session.db) {
       const dbData = await syncUserWithFirestore(user);
       session = {
         auth: { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL, isAdmin: isAdminUser(user.email) },
         db: { username: dbData.username, lastPayment: dbData.lastPayment, lastPaymentAmount: dbData.lastPaymentAmount, spaceUsed: dbData.spaceUsed, lastVisit: new Date().toISOString() }
       };
       localStorage.setItem("userSession", JSON.stringify(session));
    }

    // REDIRECT LOGIC
    const destination = getRedirectPath(user.email);
    const currentPath = window.location.pathname;

    // If we are on index.html, we definitely want to redirect to the correct dashboard
    if (!currentPath.includes(destination)) {
      console.log("🚀 Auto-redirecting to:", destination);
      window.location.replace(destination);
    }
  }
});

// ── UI Helpers ──
function showError(msg) {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "loginError";
  div.textContent = msg;
  div.style.cssText = "color:#d32f2f;background:#ffebee;border:1px solid #ffcdd2;padding:10px;margin-top:10px;border-radius:4px;font-size:14px;text-align:center;";
  
  const btn = document.getElementById("googleLoginBtn");
  if (btn) btn.parentNode.insertBefore(div, btn.nextSibling);

  setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 4000);
}
