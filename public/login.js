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
// ADMIN EMAIL
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

function getDestination(email) {
  return email === ADMIN_EMAIL ? "admin.html" : "free.html";
}

function storeUserSession(user, isNewLogin) {
  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userPhoto", user.photoURL || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());
  if (isNewLogin) {
    sessionStorage.setItem("justLoggedIn", "1");
  }
}

// ========================================
// SAVE LOGIN — FIRE AND FORGET
// This does NOT block the redirect.
// If Firestore fails, user STILL goes to dashboard.
// ========================================
function saveLogin(user) {
  if (!user) return;
  addDoc(collection(db, "users", user.uid, "logins"), {
    name: user.displayName,
    email: user.email,
    role: user.email === ADMIN_EMAIL ? "admin" : "free",
    createdAt: serverTimestamp()
  }).then(() => {
    console.log("Login saved:", user.email);
  }).catch((e) => {
    console.warn("Save login skipped:", e.message);
  });
}

// ========================================
// DO THE REDIRECT IMMEDIATELY
// Nothing before this. Nothing after.
// Just go.
// ========================================
function goToDashboard(user, isNewLogin) {
  const email = user.email;
  const destination = getDestination(email);

  console.log("=== REDIRECTING ===");
  console.log("Email:", email);
  console.log("Role:", email === ADMIN_EMAIL ? "ADMIN" : "FREE");
  console.log("Destination:", destination);
  console.log("===================");

  // Save session FIRST
  storeUserSession(user, isNewLogin);

  // Save to Firestore in background (won't block)
  saveLogin(user);

  // GO — no waiting, no delays
  window.location.href = destination;
}

// ========================================
// MAIN FLOW
// ========================================
(async () => {

  // ── STEP 1: Did user just come back from Google? ──
  try {
    const redirectResult = await getRedirectResult(auth);

    if (redirectResult && redirectResult.user) {
      showLoading("Verifying login...");
      goToDashboard(redirectResult.user, true);
      return; // page will unload
    }
  } catch (error) {
    hideLoading();
    console.error("Redirect error:", error.code);

    // If user cancelled, just show error — stay on login page
    if (error.code === "auth/redirect-cancelled-by-user") {
      showError("You cancelled the login. Try again.");
      return;
    }

    // For ANY other error, still show error but don't go anywhere
    showError("Login failed. Please try again.");
    return;
  }

  // ── STEP 2: Is user already logged in from before? ──
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showLoading("Checking session...");
      goToDashboard(user, false);
    }
    // If no user — do nothing, show the login page
  });

})();

// ========================================
// BUTTON CLICK → GOOGLE
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLoginBtn");

  if (!googleBtn) {
    console.error("googleLoginBtn not found");
    return;
  }

  googleBtn.addEventListener("click", () => {
    console.log("CLICK — going to Google...");

    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.5";
    googleBtn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    signInWithRedirect(auth, provider);
  });
});
