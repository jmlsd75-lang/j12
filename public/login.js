// ========================================
// FIREBASE — ALL FROM CLOUD CDN
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========================================
// FIREBASE CONFIG
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// FORCE GOOGLE ACCOUNT PICKER
// User MUST choose an account or create new.
// Google will never auto-select the last account.
// ========================================
provider.setCustomParameters({
  prompt: "select_account"
});

// ========================================
// DOM ELEMENTS
// ========================================
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ========================================
// LOGIN INTENT — survives page reload
// When user clicks "Continue with Google",
// we mark intent in sessionStorage BEFORE
// the browser leaves the page.
// When the page reloads after the redirect,
// we check: did we have intent?
//   - Yes + no result = user cancelled
//   - No + no result = fresh visit, check session
// ========================================
const INTENT_KEY = "loginIntent";

function markIntent() {
  sessionStorage.setItem(INTENT_KEY, "1");
}

function hadIntent() {
  return sessionStorage.getItem(INTENT_KEY) === "1";
}

function clearIntent() {
  sessionStorage.removeItem(INTENT_KEY);
}

// ========================================
// UI HELPERS
// ========================================
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 7000);
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

// ========================================
// SAVE USER DATA TO LOCAL STORAGE
// localStorage survives closing the browser
// so the dashboard can read it on next visit
// ========================================
function saveUserToStorage(user, isNewLogin) {
  localStorage.setItem("userName", user.displayName || "User");
  localStorage.setItem("userEmail", user.email || "");
  localStorage.setItem("userPhoto", user.photoURL || "");
  localStorage.setItem("userUid", user.uid || "");
  localStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());

  // justLoggedIn stays in sessionStorage so the
  // welcome toast only shows once per tab visit,
  // not every time they reopen the browser
  if (isNewLogin) {
    sessionStorage.setItem("justLoggedIn", "1");
  }
}

// ========================================
// SAVE LOGIN RECORD TO FIRESTORE
// ========================================
async function saveLoginRecord(user) {
  if (!user) return;
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Failed to save login record:", e);
  }
}

// ========================================
// GO TO DASHBOARD
// ========================================
function goToDashboard() {
  window.location.href = "dashboard.html";
}

// ========================================
// CLEAR ALL SESSION DATA (for errors)
// ========================================
function clearAllSessionData() {
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPhoto");
  localStorage.removeItem("userUid");
  localStorage.removeItem("isAdmin");
  sessionStorage.removeItem("justLoggedIn");
  sessionStorage.removeItem(INTENT_KEY);
}

// ========================================
// MAIN AUTH FLOW
//
// Step 0: Set Firebase persistence (remember forever)
// Step 1: Check if user just returned from Google
// Step 2: If successful login → save → dashboard
// Step 3: If had intent but no result → cancelled → show error
// Step 4: If no intent → fresh visit → check existing session
// ========================================
(async () => {

  // ── STEP 0: Persist login across browser closes ──
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.error("Failed to set persistence:", e);
  }

  // ── STEP 1: Check redirect result ──
  let result = null;
  try {
    result = await getRedirectResult(auth);
  } catch (error) {
    hideLoading();
    clearIntent();

    switch (error.code) {
      case "auth/redirect-cancelled-by-user":
        showError("You cancelled the sign-in. Please select an account to continue.");
        break;
      case "auth/credential-already-in-use":
        showError("This account is already linked. Try a different account.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check your connection and try again.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Wait a moment and try again.");
        break;
      case "auth/invalid-credential":
        showError("Invalid credentials. Use a valid Google account.");
        break;
      default:
        showError("Sign-in failed. Please try again.");
    }
    return;
  }

  // ── STEP 2: Successful redirect from Google ──
  if (result && result.user) {
    clearIntent();
    showLoading("Verifying sign-in...");

    const user = result.user;

    await saveLoginRecord(user);
    saveUserToStorage(user, true);

    // Brief pause so user sees "Verifying" before redirect
    await new Promise(r => setTimeout(r, 800));
    goToDashboard();
    return;
  }

  // ── STEP 3: Had intent but no result = USER CANCELLED ──
  if (hadIntent()) {
    clearIntent();
    hideLoading();
    showError("Sign-in was cancelled. Please select a Google account or create a new one to continue.");
    return;
  }

  // ── STEP 4: No redirect, no intent = fresh page load ──
  // Check if user already has an active session
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (user) {
        saveUserToStorage(user, false);
        showLoading("Welcome back...");
        setTimeout(() => goToDashboard(), 1200);
      } else {
        hideLoading();
      }

      resolve();
    });
  });

})();

// ========================================
// BUTTON CLICK → MARK INTENT → GOOGLE
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("googleLoginBtn");

  if (!btn) {
    console.error("googleLoginBtn not found");
    return;
  }

  btn.addEventListener("click", () => {
    // Mark intent BEFORE redirect so it survives the reload
    markIntent();

    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    // This sends user to Google where they MUST:
    // - Pick an existing account, OR
    // - Click "Use another account", OR
    // - Click "Create account"
    // No auto-selection is possible because of
    // provider.setCustomParameters({ prompt: "select_account" })
    signInWithRedirect(auth, provider);
  });
});
