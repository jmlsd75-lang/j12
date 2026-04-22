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
// CONFIGURATION
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
// REDIRECT LOGIC CONFIG
// ========================================
const ADMIN_EMAIL = "camelkazembe1@gmail.com";
const ADMIN_PAGE = "index.html"; // Page for Admin
const FREE_PAGE = "free.html";   // Page for other users

// ========================================
// INITIALIZATION
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// DOM ELEMENT REFERENCES
// ========================================
const googleBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ========================================
// HELPER FUNCTIONS
// ========================================

function showError(message) {
  if (!errorMsg) return;
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
  setTimeout(() => {
    errorMsg.style.display = "none";
  }, 5000);
}

function showLoading(message) {
  if (!loadingOverlay || !loadingText) return;
  loadingText.textContent = message;
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  if (!loadingOverlay) return;
  loadingOverlay.style.display = "none";
}

// ========================================
// DATABASE LOGGING
// ========================================
async function saveLogin(user) {
  if (!user) return;
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      isAdmin: user.email === ADMIN_EMAIL, // Store role for reference
      createdAt: serverTimestamp()
    });
    console.log("✅ Login saved:", user.email);
  } catch (e) {
    console.error("❌ Firestore Save Error:", e);
  }
}

// ========================================
// ROUTING FUNCTION
// ========================================
function redirectToPage(userEmail) {
  // Trim whitespace and lowercase for safety comparison
  const email = (userEmail || "").trim().toLowerCase();

  if (email === ADMIN_EMAIL.toLowerCase()) {
    console.log("🔑 Redirecting Admin to:", ADMIN_PAGE);
    window.location.href = ADMIN_PAGE;
  } else {
    console.log("👤 Redirecting User to:", FREE_PAGE);
    window.location.href = FREE_PAGE;
  }
}

// ========================================
// MAIN AUTHENTICATION FLOW
// ========================================
(async function runAuthFlow() {
  
  // --- STEP 1: Check Redirect Result (Fresh Login) ---
  try {
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      // User just successfully logged in
      const user = result.user;
      showLoading("Verifying user...");
      
      console.log("Logged in as:", user.email);
      console.log("Role:", user.email === ADMIN_EMAIL ? "Admin" : "Free User");

      // Save data to Firestore first
      await saveLogin(user);

      // Mark session
      sessionStorage.setItem("justLoggedIn", "1");

      // Small delay for UX
      await new Promise(r => setTimeout(r, 800));

      // --- REDIRECT LOGIC HERE ---
      redirectToPage(user.email);
      return; 
    }
  } catch (error) {
    hideLoading();
    console.error("Auth Error:", error);
    
    switch (error.code) {
      case "auth/redirect-cancelled-by-user":
        showError("Login cancelled.");
        break;
      case "auth/network-request-failed":
        showError("Network error.");
        break;
      default:
        showError("Login failed: " + error.message);
    }
  }

  // --- STEP 2: Check Existing Session (Reload) ---
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is already logged in from a previous session
      console.log("Existing session found for:", user.email);
      showLoading("Welcome back...");

      setTimeout(() => {
        // --- REDIRECT LOGIC HERE ---
        redirectToPage(user.email);
      }, 1000);
    } else {
      // No session, show login screen
      hideLoading();
    }
  });

})();

// ========================================
// BUTTON EVENT LISTENER
// ========================================
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    console.log("🔵 Button Clicked");
    
    // Disable button
    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.7";
    googleBtn.style.cursor = "not-allowed";

    showLoading("Connecting to Google...");

    // Trigger Sign In
    signInWithRedirect(auth, provider)
      .catch((err) => {
        console.error("Redirect Error:", err);
        showError("Could not start Google Login.");
        hideLoading();
        
        // Re-enable button if it fails immediately
        googleBtn.disabled = false;
        googleBtn.style.opacity = "1";
        googleBtn.style.cursor = "pointer";
      });
  });
}
