// ========================================
// FIREBASE — ALL FROM CLOUD CDN
// Using YOUR exact project config
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,   // FULL PAGE REDIRECT — user goes to Google
  getRedirectResult,     // CATCHES USER WHEN GOOGLE SENDS THEM BACK
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================================
// YOUR EXACT FIREBASE CONFIG
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
// YOUR EXACT ADMIN EMAIL
// ========================================
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

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
const googleBtn = document.getElementById("googleLoginBtn");
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

// ========================================
// SAVE LOGIN TO FIRESTORE
// Same path as your index.html:
//   users/{uid}/logins/{docId}
// With same fields: name, email, userId, createdAt
// ========================================
async function saveLogin(user) {
  if (!user) return;
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
    console.log("Login saved:", user.email);
  } catch (e) {
    console.error("Save login error:", e);
  }
}

// ========================================
// PREVENT DOUBLE REDIRECT
// ========================================
let redirectHandled = false;

// ========================================
// STEP 1: CATCH USER RETURNING FROM GOOGLE
//
// When user clicks login → browser goes to Google
// After Google auth → Google redirects back HERE
// This function catches that return
//
// If user just opened the page normally,
// result is null — nothing happens, button stays
// ========================================
getRedirectResult(auth)
  .then(async (result) => {
    if (result && result.user) {
      // USER JUST CAME BACK FROM GOOGLE
      redirectHandled = true;
      showLoading("Verifying login...");

      const user = result.user;
      console.log("Returned from Google:", user.email);

      // Check admin
      const isAdmin = user.email === ADMIN_EMAIL;
      console.log("Is admin:", isAdmin);

      // Save to Firestore — same as your index.html saveUserData
      await saveLogin(user);

      // Small delay so user sees verification
      setTimeout(() => {
        // GO BACK TO YOUR MAIN SYSTEM
        // index.html onAuthStateChanged will fire
        // → LOGIN button disappears
        // → LOGOUT appears at bottom center
        // → FREE button appears between name and logout
        window.location.href = "index.html";
      }, 800);
    }
    // result is null = normal page open, show login button
  })
  .catch((error) => {
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
  });

// ========================================
// STEP 2: IF ALREADY LOGGED IN, SKIP THIS PAGE
// Covers edge case: user navigates here while authenticated
// ========================================
onAuthStateChanged(auth, (user) => {
  if (user && !redirectHandled) {
    // Already logged in, send straight to index.html
    // where LOGIN is hidden, LOGOUT + FREE are shown
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  }
});

// ========================================
// STEP 3: BUTTON CLICK → SEND TO GOOGLE
//
// signInWithRedirect = FULL PAGE NAVIGATION
// Browser URL bar changes to accounts.google.com
// User sees Google's real login page
// Not a popup, not an iframe — actual navigation
//
// After login Google redirects back to login.html
// Then Step 1 (getRedirectResult) catches it
// ========================================
// STEP 3: BUTTON CLICK → SEND TO GOOGLE
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLoginBtn");

  // Safety check
  if (!googleBtn) {
    console.error("googleLoginBtn not found in HTML");
    return;
  }

  googleBtn.addEventListener("click", () => {
    console.log("CLICK WORKING");

    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.5";
    googleBtn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    // Redirect to Google login
    signInWithRedirect(auth, provider);
  });
});
