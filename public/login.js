// ============================================
// DYNAMICALLY CREATE UI ELEMENTS (no HTML changes needed)
// ============================================
(function createUIElements() {
  // Loading overlay
  var overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.style.cssText = "display:none;position:fixed;inset:0;z-index:9999;background:rgba(5,5,5,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);align-items:center;justify-content:center;flex-direction:column;gap:20px;";
  overlay.innerHTML =
    '<div style="width:40px;height:40px;border:3px solid rgba(255,255,255,0.08);border-top-color:#f97316;border-radius:50%;animation:spin 0.8s linear infinite;"></div>' +
    '<p id="loadingText" style="color:rgb(168,162,158);font-family:Inter,sans-serif;font-size:0.9rem;">Loading...</p>' +
    '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
  document.body.appendChild(overlay);

  // Error message
  var errDiv = document.createElement("div");
  errDiv.id = "errorMsg";
  errDiv.className = "hidden";
  errDiv.style.cssText = "margin-top:16px;padding:10px 16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:10px;color:#f87171;font-family:Inter,sans-serif;font-size:0.82rem;text-align:center;transition:opacity 0.3s ease;";
  document.querySelector(".login-card").appendChild(errDiv);

  // Hidden style for .hidden
  var style = document.createElement("style");
  style.textContent = ".hidden{display:none !important;}";
  document.head.appendChild(style);
})();

// ============================================
// FIREBASE IMPORTS
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ============================================
// FIREBASE CONFIG
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAIL = "jmlsd75@gmail.com";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ============================================
// DOM REFERENCES (created dynamically above)
// ============================================
var errorMsg = document.getElementById("errorMsg");
var loadingOverlay = document.getElementById("loadingOverlay");
var loadingText = document.getElementById("loadingText");

// ============================================
// HELPER FUNCTIONS
// ============================================
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

// ============================================
// SAVE SESSION TO SESSIONSTORAGE
// ============================================
function saveSession(user, fresh) {
  var isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userPhoto", user.photoURL || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", isAdminUser.toString());

  if (fresh) {
    sessionStorage.setItem("justLoggedIn", "1");
  }

  return isAdminUser;
}

// ============================================
// REDIRECT TO CORRECT DASHBOARD
// ============================================
function redirectToDashboard(isAdmin) {
  if (isAdmin) {
    console.log("→ Admin detected → admin.html");
    window.location.replace("admin.html");
  } else {
    console.log("→ Regular user → free.html");
    window.location.replace("free.html");
  }
}

// ============================================
// SAVE LOGIN RECORD TO FIRESTORE (fire & forget)
// ============================================
function saveLoginToFirestore(user) {
  try {
    var isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      role: isAdminUser ? "admin" : "free",
      createdAt: serverTimestamp()
    }).catch(function (err) {
      console.warn("Firestore write error:", err);
    });
  } catch (e) {
    console.warn("Firestore error:", e);
  }
}

// ============================================
// CHECK IF SESSION ALREADY EXISTS
// ============================================
function checkExistingSession() {
  var email = sessionStorage.getItem("userEmail");
  var isAdmin = sessionStorage.getItem("isAdmin") === "true";

  if (email) {
    console.log("Existing session found for:", email);
    showLoading("Resuming session...");
    setTimeout(function () {
      redirectToDashboard(isAdmin);
    }, 500);
    return true;
  }

  return false;
}

// ============================================
// MAIN AUTH FLOW
// ============================================

// Step 1: Already logged in?
if (checkExistingSession()) {
  // Redirecting...
} else {
  // Step 2: Check redirect result (returning from Google login)
  getRedirectResult(auth).then(function (result) {
    if (result && result.user) {
      console.log("Redirect result received:", result.user.email);
      showLoading("Verifying...");

      var isAdmin = saveSession(result.user, true);
      saveLoginToFirestore(result.user);

      setTimeout(function () {
        redirectToDashboard(isAdmin);
      }, 300);

    } else {
      console.log("No redirect result — login page ready");
      hideLoading();
    }
  }).catch(function (error) {
    console.error("Auth error:", error.code, error.message);
    hideLoading();

    if (error.code === "auth/redirect-cancelled-by-user") {
      showError("You cancelled the login. Try again.");
    } else if (error.code === "auth/popup-blocked") {
      showError("Popup was blocked. Please allow popups and try again.");
    } else {
      showError("Login failed. Please try again.");
    }
  });
}

// ============================================
// LOGIN FUNCTION (called by onclick="login()")
// ============================================
function login() {
  showLoading("Redirecting to Google...");
  signInWithRedirect(auth, provider);
}
