// ===== FIREBASE CLOUD CDN IMPORTS =====
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

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ===== INITIALIZE =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== DOM ELEMENTS =====
const googleBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ===== HELPERS =====
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 5000);
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  loadingOverlay.style.display = "none";
  loadingOverlay.classList.add("hidden");
}

// ===== SAVE LOGIN TO FIRESTORE =====
async function saveLogin(user) {
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Save login error:", e);
  }
}

// ===== HANDLE REDIRECT RESULT WHEN GOOGLE SENDS USER BACK =====
// This runs every time login.html loads — if user just came back from Google,
// getRedirectResult will have the credential. Otherwise it returns null.
getRedirectResult(auth)
  .then(async (result) => {
    if (result) {
      // User just returned from Google login successfully
      showLoading("Welcome back, verifying...");

      const user = result.user;

      // Save login record to Firestore
      await saveLogin(user);

      // Short pause so user sees the loading message
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    }
    // If result is null, user either just opened the page fresh
    // or hasn't logged in yet — do nothing, show the login button
  })
  .catch((error) => {
    hideLoading();

    switch (error.code) {
      case "auth/popup-closed-by-user":
        // Not applicable for redirect, but handle just in case
        showError("Login was cancelled. Please try again.");
        break;
      case "auth/credential-already-in-use":
        showError("This account is already linked. Please try again.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check your connection and try again.");
        break;
      case "auth/redirect-cancelled-by-user":
        showError("You cancelled the login. Please try again.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Please wait a moment and try again.");
        break;
      default:
        showError("Login failed. Please try again.");
        console.error("Redirect result error:", error);
    }
  });

// ===== ALSO CHECK IF USER IS ALREADY LOGGED IN =====
// This covers the case where user is already authenticated
// and somehow lands on login.html — just send them back
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is already signed in, skip login page entirely
    // But wait — if getRedirectResult is still processing above,
    // don't redirect twice. Use a small delay to let redirect result handle it.
    setTimeout(() => {
      // Only redirect if we're still on login.html
      // (getRedirectResult would have already redirected if it fired)
      if (!window.location.href.includes("index.html")) {
        window.location.href = "index.html";
      }
    }, 1500);
  }
});

// ===== GOOGLE LOGIN BUTTON — REDIRECTS TO GOOGLE =====
googleBtn.addEventListener("click", async () => {
  // Disable button immediately to prevent double-clicks
  googleBtn.disabled = true;
  googleBtn.style.opacity = "0.6";
  googleBtn.style.pointerEvents = "none";

  showLoading("Redirecting to Google...");

  try {
    // This ACTUALLY navigates the browser to Google's sign-in page
    // The browser URL bar changes to accounts.google.com
    // After user logs in, Google redirects back to this login.html
    await signInWithRedirect(auth, provider);
  } catch (error) {
    hideLoading();
    googleBtn.disabled = false;
    googleBtn.style.opacity = "1";
    googleBtn.style.pointerEvents = "auto";

    if (error.code !== "auth/redirect-cancelled-by-user") {
      showError("Could not start login. Please try again.");
      console.error("Redirect error:", error);
    }
  }
});
