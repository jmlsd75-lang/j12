import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut
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
// DOM ELEMENTS
// ============================================
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const loginBtn = document.getElementById("googleLoginBtn");

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
// SAVE SESSION DATA (synchronous)
// ============================================
function saveSession(user, fresh) {
  const isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  
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
// REDIRECT USER TO CORRECT PAGE
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
// SAVE TO FIRESTORE (non-blocking, don't wait)
// ============================================
function saveLoginToFirestore(user) {
  try {
    const isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      role: isAdminUser ? "admin" : "free",
      createdAt: serverTimestamp()
    }).catch(function(err) {
      console.warn("Firestore write error:", err);
    });
  } catch (e) {
    console.warn("Firestore error:", e);
  }
}

// ============================================
// CHECK IF ALREADY LOGGED IN (session check)
// ============================================
function checkExistingSession() {
  var email = sessionStorage.getItem("userEmail");
  var isAdmin = sessionStorage.getItem("isAdmin") === "true";
  
  if (email) {
    console.log("Found existing session for:", email);
    showLoading("Resuming session...");
    
    // Small delay to let loading show
    setTimeout(function() {
      redirectToDashboard(isAdmin);
    }, 500);
    
    return true;
  }
  
  return false;
}

// ============================================
// MAIN AUTH FLOW
// ============================================

// Step 1: Check if session already exists
if (checkExistingSession()) {
  // Already have session, redirecting...
} else {
  // Step 2: Check for redirect result (user just came back from Google)
  getRedirectResult(auth).then(function(result) {
    if (result && result.user) {
      console.log("Got redirect result:", result.user.email);
      showLoading("Verifying...");
      
      // Save session FIRST
      var isAdmin = saveSession(result.user, true);
      
      // Save to Firestore (fire and forget)
      saveLoginToFirestore(result.user);
      
      // Small delay to ensure session is written
      setTimeout(function() {
        redirectToDashboard(isAdmin);
      }, 300);
      
    } else {
      console.log("No redirect result — showing login button");
      hideLoading();
      // Login button is already visible
    }
  }).catch(function(error) {
    console.error("Redirect result error:", error.code, error.message);
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
// LOGIN BUTTON CLICK
// ============================================
loginBtn.addEventListener("click", function() {
  this.disabled = true;
  this.style.opacity = "0.5";
  this.style.pointerEvents = "none";
  showLoading("Redirecting to Google...");
  signInWithRedirect(auth, provider);
});
