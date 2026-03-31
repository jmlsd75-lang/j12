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
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// ========================================
// INITIALIZE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// ★ FIX #1: Force Google account picker
//    — user MUST choose an account
//    — "Use another account" / "Create account" visible
//    — never auto-selects the last used account
// ========================================
provider.setCustomParameters({
  prompt: "select_account"
});

// ========================================
// DOM
// ========================================
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ========================================
// ★ FIX #2: Persist login intent across page reload
//    A plain JS variable resets on reload,
//    so a cancelled redirect looked like
//    "no attempt" → stale session redirected anyway.
//    sessionStorage survives the redirect round-trip.
// ========================================
const LOGIN_INTENT_KEY = "loginIntent";

function markLoginIntent() {
  sessionStorage.setItem(LOGIN_INTENT_KEY, "1");
}

function hadLoginIntent() {
  return sessionStorage.getItem(LOGIN_INTENT_KEY) === "1";
}

function clearLoginIntent() {
  sessionStorage.removeItem(LOGIN_INTENT_KEY);
}

// ========================================
// HELPERS
// ========================================
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  // Keep error visible longer so user actually reads it
  setTimeout(() => errorMsg.classList.add("hidden"), 7000);
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

function storeSession(user, justLoggedIn = false) {
  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userPhoto", user.photoURL || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());
  if (justLoggedIn) {
    sessionStorage.setItem("justLoggedIn", "1");
  }
}

function goToDashboard(delay = 0) {
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, delay);
}

// ========================================
// SAVE LOGIN TO FIRESTORE
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
// MAIN FLOW
//
//  getRedirectResult()  →  did user just come back from Google?
//  hadLoginIntent()     →  did they click the button before the redirect?
//
//  result + user       → success, go to dashboard
//  result + error      → show specific error
//  null  + intent=true → user CANCELLED, show error, stay here
//  null  + intent=false→ no redirect happened, check existing session
// ========================================
(async () => {

  // ── STEP 1: Check redirect result ──
  let redirectResult = null;
  try {
    redirectResult = await getRedirectResult(auth);
  } catch (error) {
    hideLoading();
    clearLoginIntent();
    console.error("Redirect result error:", error.code, error.message);

    switch (error.code) {
      case "auth/redirect-cancelled-by-user":
        showError("You cancelled the sign-in. Please select an account to continue.");
        break;
      case "auth/credential-already-in-use":
        showError("This account is already linked to another method. Try a different account.");
        break;
      case "auth/network-request-failed":
        showError("Network error — check your connection and try again.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Please wait a moment and try again.");
        break;
      case "auth/popup-closed-by-user":
        showError("Sign-in window was closed. Please try again.");
        break;
      case "auth/invalid-credential":
        showError("Invalid credentials. Please try again with a valid Google account.");
        break;
      default:
        showError("Sign-in failed. Please try again.");
    }
    return;
  }

  // ── STEP 2: Successful redirect — user came back with credentials ──
  if (redirectResult && redirectResult.user) {
    clearLoginIntent();
    showLoading("Verifying sign-in...");

    const user = redirectResult.user;
    console.log("Returned from Google:", user.email);
    console.log("Is admin:", user.email === ADMIN_EMAIL);

    await saveLogin(user);
    storeSession(user, true);

    await new Promise(r => setTimeout(r, 800));
    goToDashboard();
    return;
  }

  // ── STEP 3: No result + had intent = USER CANCELLED ──
  //    This is the critical fix. Without this check,
  //    a cancelled redirect falls through to Step 4,
  //    finds a stale session, and redirects anyway.
  if (hadLoginIntent()) {
    clearLoginIntent();
    hideLoading();
    showError("Sign-in was cancelled. Please select a Google account or create a new one to continue.");
    return;
  }

  // ── STEP 4: No redirect, no intent = page loaded fresh ──
  //    Only auto-redirect if there's an active session
  //    AND the user didn't just cancel a login.
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (user) {
        console.log("Existing session found:", user.email);
        storeSession(user, false);
        showLoading("Welcome back...");
        goToDashboard(1200);
      } else {
        hideLoading();
      }

      resolve();
    });
  });

})();

// ========================================
// BUTTON CLICK → mark intent → send to Google
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googleLoginBtn");

  if (!googleBtn) {
    console.error("googleLoginBtn not found in HTML");
    return;
  }

  googleBtn.addEventListener("click", () => {
    console.log("CLICK — marking intent and sending to Google");

    // ★ Mark intent BEFORE redirect so it survives the page reload
    markLoginIntent();

    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.5";
    googleBtn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    signInWithRedirect(auth, provider);
  });
});
