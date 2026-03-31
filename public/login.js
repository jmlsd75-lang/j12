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

// ========================================
// 🔴 CHANGED: ADMIN EMAIL HERE
// ========================================
const ADMIN_EMAIL = "jmlsd75@gmail.com";

// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// FORCE GOOGLE ACCOUNT PICKER
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
// LOGIN INTENT
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
// ========================================
function saveUserToStorage(user, isNewLogin) {
  localStorage.setItem("userName", user.displayName || "User");
  localStorage.setItem("userEmail", user.email || "");
  localStorage.setItem("userPhoto", user.photoURL || "");
  localStorage.setItem("userUid", user.uid || "");
  
  // Automatically marks "true" if jmlsd75@gmail.com, "false" for everyone else
  localStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());

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
// 🔴 CHANGED: SMART REDIRECT FUNCTION
// Checks the email and sends to the correct page
// ========================================
function goToDashboard(user) {
  if (user && user.email === ADMIN_EMAIL) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
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
// HANDLE AUTH STATE
// ========================================
function waitForAuthState() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// ========================================
// HANDLE SUCCESSFUL LOGIN
// ========================================
async function handleSuccessfulLogin(user, isNewLogin) {
  showLoading("Verifying sign-in...");
  await saveLoginRecord(user);
  saveUserToStorage(user, isNewLogin);
  await new Promise(r => setTimeout(r, 800));
  
  // 🔴 CHANGED: Pass 'user' to goToDashboard so it knows where to go
  goToDashboard(user);
}

// ========================================
// MAIN AUTH FLOW
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
  let redirectError = null;

  try {
    result = await getRedirectResult(auth);
  } catch (error) {
    redirectError = error;
  }

  // ── STEP 2: Got a user directly from redirect ──
  if (result && result.user) {
    clearIntent();
    await handleSuccessfulLogin(result.user, true);
    return;
  }

  // ── STEP 3: Redirect returned an actual error ──
  if (redirectError) {
    hideLoading();
    clearIntent();

    switch (redirectError.code) {
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

  // ── STEP 4: Had intent but no result and no error ──
  if (hadIntent()) {
    clearIntent();
    showLoading("Verifying sign-in...");

    const user = await waitForAuthState();

    if (user) {
      await handleSuccessfulLogin(user, true);
    } else {
      hideLoading();
      showError("Sign-in was cancelled. Please select a Google account or create a new one to continue.");
    }
    return;
  }

  // ── STEP 5: No redirect, no intent = fresh page load ──
  showLoading("Checking session...");

  const user = await waitForAuthState();

  if (user) {
    saveUserToStorage(user, false);
    showLoading("Welcome back...");
    
    // 🔴 CHANGED: Pass 'user' to goToDashboard so it knows where to go
    setTimeout(() => goToDashboard(user), 1200);
  } else {
    hideLoading();
  }

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
    markIntent();

    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    signInWithRedirect(auth, provider);
  });
});
