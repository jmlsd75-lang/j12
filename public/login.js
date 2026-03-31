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
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const googleBtn = document.getElementById("googleLoginBtn");

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
// BUTTON CLICK → SEND TO GOOGLE
// FIXED: Module scripts load AFTER DOM is ready,
// so we don't need DOMContentLoaded. We attach directly.
// ========================================
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    console.log("CLICK WORKING");

    googleBtn.disabled = true;
    googleBtn.style.opacity = "0.5";
    googleBtn.style.pointerEvents = "none";

    showLoading("Redirecting to Google...");

    signInWithRedirect(auth, provider);
  });
} else {
  console.error("googleLoginBtn not found in HTML");
}

// ========================================
// MAIN FLOW — sequential, no race condition
// ========================================
(async () => {

  // ── STEP 1: Wait for redirect result COMPLETELY ──
  let redirectResult = null;
  try {
    redirectResult = await getRedirectResult(auth);
  } catch (error) {
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
    return; 
  }

  // ── STEP 2: User just came back from Google ──
  if (redirectResult && redirectResult.user) {
    showLoading("Verifying login...");

    const user = redirectResult.user;
    console.log("Returned from Google:", user.email);
    console.log("Is admin:", user.email === ADMIN_EMAIL);

    await saveLogin(user);

    sessionStorage.setItem("justLoggedIn", "1");

    await new Promise(r => setTimeout(r, 800));

    window.location.href = "index.html";
    return; 
  }

  // ── STEP 3: No redirect result — check if already logged in ──
  await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); 

      if (user) {
        console.log("Already authenticated:", user.email);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      }

      resolve();
    });
  });

})();
