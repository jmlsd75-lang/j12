// ========================================
// FIREBASE — ALL FROM CLOUD CDN
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================================
// YOUR FIREBASE CONFIG
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ========================================
// ADMIN EMAIL — change this to your admin
// ========================================
const ADMIN_EMAIL = "jmlsd75@gmail.com";

// ========================================
// INITIALIZE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// DOM
// ========================================
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ========================================
// HELPERS
// ========================================
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 5000);
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

/**
 * Decide where to send the user after login.
 * ADMIN_EMAIL  → admin.html  (admin.js handles it)
 * anyone else   → free.html   (free.js handles it)
 */
function getDestination(email) {
  return email === ADMIN_EMAIL ? "admin.html" : "free.html";
}

/**
 * Store user info in sessionStorage so the
 * destination page can read it immediately
 * without waiting for Firebase again.
 */
function storeUserSession(user, isNewLogin) {
  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userPhoto", user.photoURL || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());

  // Flag: this page just completed a fresh login
  // The destination page can use this to show a welcome toast
  if (isNewLogin) {
    sessionStorage.setItem("justLoggedIn", "1");
  }
}

// ========================================
// SAVE LOGIN RECORD TO FIRESTORE
// ========================================
async function saveLogin(user) {
  if (!user) return;
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      role: user.email === ADMIN_EMAIL ? "admin" : "free",
      createdAt: serverTimestamp()
    });
    console.log("Login saved:", user.email);
  } catch (e) {
    console.error("Save login error:", e);
  }
}

// ========================================
// MAIN FLOW
//
// Step 1: await getRedirectResult() — user just came back from Google
// Step 2: onAuthStateChanged       — user was already logged in
// Step 3: neither                  — show the login page and wait for click
//
// Every successful path stores session data,
// saves a login record, then redirects to
// admin.html or free.html based on email.
// ========================================
(async () => {

  // ── STEP 1: Check if user just returned from Google redirect ──
  let redirectResult = null;
  try {
    redirectResult = await getRedirectResult(auth);
  } catch (error) {
    hideLoading();
    console.error("Redirect result error:", error.code, error.message);

    switch (error.code) {
      case "auth/redirect-cancelled-by-user":
        showError("You cancelled the login. Please try again.");
        break;
      case "auth/credential-already-in-use":
        showError("This account is already linked. Try again.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check your connection.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Wait a moment.");
        break;
      default:
        showError("Login failed. Please try again.");
    }
    return; // stop here — let user click the button again
  }

  // ── STEP 2: User just came back from Google successfully ──
  if (redirectResult && redirectResult.user) {
    showLoading("Verifying login...");

    const user = redirectResult.user;
    const destination = getDestination(user.email);

    console.log("Returned from Google:", user.email);
    console.log("Role:", user.email === ADMIN_EMAIL ? "ADMIN" : "FREE");
    console.log("Destination:", destination);

    // Save login record to Firestore
    await saveLogin(user);

    // Store session data for the destination page
    storeUserSession(user, true);

    // Brief pause so user sees "Verifying login..."
    await new Promise(r => setTimeout(r, 800));

    // Redirect to the correct dashboard
    window.location.href = destination;
    return; // stop — page will unload
  }

  // ── STEP 3: No redirect result — check if already logged in ──
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // listen once only

      if (user) {
        const destination = getDestination(user.email);

        console.log("Already authenticated:", user.email);
        console.log("Role:", user.email === ADMIN_EMAIL ? "ADMIN" : "FREE");
        console.log("Destination:", destination);

        // Store session data (no "justLoggedIn" flag since this isn't a fresh login)
        storeUserSession(user, false);

        // Brief pause then redirect
        setTimeout(() => {
          window.location.href = destination;
        }, 1200);
      }

      resolve();
    });
  });

})();

// ========================================
// BUTTON CLICK → SEND USER TO GOOGLE
//
// The user leaves this page entirely.
// Google shows their account picker.
// They pick an account (or create a new one).
// Google sends them back here.
// Then getRedirectResult() above catches it.
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLoginBtn");

  if (!googleBtn) {
    console.error("googleLoginBtn not found in HTML");
    return;
  }

  googleBtn.addEventListener("click", () => {
    console.log("CLICK — sending user to Google...");

    // Disable button to prevent double-clicks
    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.5";
    googleBtn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    // This takes the user AWAY from this site
    // to Google's sign-in page
    signInWithRedirect(auth, provider);
  });
});
