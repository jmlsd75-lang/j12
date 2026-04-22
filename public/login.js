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

const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// ========================================
// INITIALIZATION
// ========================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ========================================
// DOM ELEMENT REFERENCES
// (Must match IDs in index.html)
// ========================================
const googleBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// Check if elements exist (Safety Check)
if (!googleBtn || !errorMsg || !loadingOverlay || !loadingText) {
  console.error("FATAL: One or more required HTML elements are missing.");
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function showError(message) {
  if (!errorMsg) return;
  errorMsg.textContent = message;
  errorMsg.style.display = "block"; // Make visible
  
  // Hide after 5 seconds
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
      createdAt: serverTimestamp()
    });
    console.log("✅ Login saved to Firestore:", user.email);
  } catch (e) {
    console.error("❌ Error saving login:", e);
  }
}

// ========================================
// AUTHENTICATION FLOW
// ========================================
(async function runAuthFlow() {
  
  // --- STEP 1: Check Redirect Result (Did user just come back from Google?) ---
  try {
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      // SUCCESS: User just logged in via Redirect
      showLoading("Verifying login...");
      
      console.log("User returned from Google:", result.user.email);
      console.log("Is Admin:", result.user.email === ADMIN_EMAIL);
      
      // Save to Database
      await saveLogin(result.user);

      // Set flag so index.html knows it's a fresh login
      sessionStorage.setItem("justLoggedIn", "1");

      // Small delay for UX
      await new Promise(r => setTimeout(r, 800));

      // Redirect to main app
      window.location.href = "index.html";
      return; // Stop execution here
    }
  } catch (error) {
    // ERROR: Something went wrong with the redirect
    hideLoading();
    console.error("Redirect Error:", error.code, error.message);
    
    // Handle specific errors
    switch (error.code) {
      case "auth/redirect-cancelled-by-user":
        showError("You cancelled the login.");
        break;
      case "auth/popup-closed-by-user": // Fallback for popup usage
        showError("Login popup closed.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check connection.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Please wait.");
        break;
      default:
        showError("Login failed: " + error.message);
    }
  }

  // --- STEP 2: Check Current Session (Is user already logged in?) ---
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is already logged in, but didn't just come from a redirect
      console.log("User already authenticated:", user.email);
      showLoading("Welcome back...");
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      // User is NOT logged in. Ensure loading screen is hidden.
      hideLoading();
    }
  });

})();

// ========================================
// BUTTON EVENT LISTENER
// ========================================
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    console.log("🔵 Google Button Clicked");

    // Visual Feedback
    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.7";
    googleBtn.style.cursor = "not-allowed";

    showLoading("Redirecting to Google...");

    // Initiate Login
    signInWithRedirect(auth, provider)
      .catch((error) => {
        console.error("Redirect Init Error:", error);
        showError("Failed to start login process.");
        hideLoading();
        // Reset button
        googleBtn.disabled = false;
        googleBtn.style.opacity = "1";
        googleBtn.style.cursor = "pointer";
      });
  });
}
