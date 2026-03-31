// ========================================
// FIREBASE IMPORTS
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

const ADMIN_EMAIL = "jmlsd75@gmail.com";

// ========================================
// INITIALIZE FIREBASE
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Force Google to always ask for an account
provider.setCustomParameters({ prompt: "select_account" });

// ========================================
// DOM ELEMENTS
// ========================================
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

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
// REDIRECT ROUTER
// Sends Admin to admin.html, everyone else to dashboard.html
// ========================================
function routeUser(user) {
  if (user.email === ADMIN_EMAIL) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

// ========================================
// SAVE USER TO LOCAL STORAGE
// ========================================
function saveUserToStorage(user, isNewLogin) {
  localStorage.setItem("userName", user.displayName || "User");
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userPhoto", user.photoURL || "");
  localStorage.setItem("userUid", user.uid);
  localStorage.setItem("isAdmin", (user.email === ADMIN_EMAIL).toString());
  
  if (isNewLogin) {
    sessionStorage.setItem("justLoggedIn", "1");
  }
}

// ========================================
// SAVE LOGIN RECORD TO FIRESTORE
// ========================================
async function saveLoginRecord(user) {
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Firestore error:", e);
  }
}

// ========================================
// LOGIN INTENT TRACKER
// Prevents "false cancelled" errors
// ========================================
const INTENT_KEY = "loginIntent";
function markIntent() { sessionStorage.setItem(INTENT_KEY, "1"); }
function hadIntent() { return sessionStorage.getItem(INTENT_KEY) === "1"; }
function clearIntent() { sessionStorage.removeItem(INTENT_KEY); }

// ========================================
// AUTH STATE WAITER (THE FOOLPROOF FIX)
// 
// Sometimes getRedirectResult returns null even 
// on a successful login. This function waits for 
// Firebase to figure it out before giving up.
// ========================================
function waitForAuthState(timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        settled = true;
        unsubscribe();
        resolve(user);
      }
    });
    
    // Give up after X milliseconds
    setTimeout(() => {
      if (!settled) {
        settled = true;
        unsubscribe();
        resolve(null);
      }
    }, timeoutMs);
  });
}

// ========================================
// MASTER LOGIN HANDLER
// ========================================
async function finishLogin(user, isNewLogin) {
  showLoading("Verifying sign-in...");
  await saveLoginRecord(user);
  saveUserToStorage(user, isNewLogin);
  await new Promise(r => setTimeout(r, 800)); // Brief pause for UX
  routeUser(user);
}

// ========================================
// MAIN STARTUP LOGIC
// ========================================
(async () => {
  showLoading("Securing connection...");

  // 1. Set persistence (Remembers user forever)
  await setPersistence(auth, browserLocalPersistence);

  // 2. Check redirect result
  let result = null;
  let redirectError = null;

  try {
    result = await getRedirectResult(auth);
  } catch (err) {
    redirectError = err;
  }

  // 3. If we got a user directly, log them in!
  if (result && result.user) {
    clearIntent();
    await finishLogin(result.user, true);
    return;
  }

  // 4. If Google threw a real error, show it
  if (redirectError) {
    hideLoading();
    clearIntent();
    const msg = redirectError.code === "auth/network-request-failed" 
      ? "Network error. Check your internet." 
      : "Sign-in failed. Please try again.";
    showError(msg);
    return;
  }

  // 5. If we had intent but no result...
  // DON'T SAY CANCELLED YET! Wait up to 4 seconds for Firebase to sync.
  if (hadIntent()) {
    clearIntent();
    showLoading("Verifying sign-in...");
    
    const user = await waitForAuthState(4000); // Wait 4 seconds
    
    if (user) {
      await finishLogin(user, true); // Success!
    } else {
      hideLoading();
      showError("Sign-in was cancelled. Please select an account to continue."); // Truly failed
    }
    return;
  }

  // 6. Fresh visit (No intent). Check if they are already logged in.
  const user = await waitForAuthState(2000);
  
  if (user) {
    // They are logged in from a previous session!
    saveUserToStorage(user, false);
    showLoading("Welcome back...");
    setTimeout(() => routeUser(user), 1000);
  } else {
    // Brand new visitor. Show the login button.
    hideLoading();
  }

})();

// ========================================
// BUTTON CLICK HANDLER
// ========================================
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("googleLoginBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    markIntent(); // Leave a note that we are going to Google
    
    // Disable button to prevent double clicks
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";
    
    showLoading("Redirecting to Google...");
    signInWithRedirect(auth, provider);
  });
});

