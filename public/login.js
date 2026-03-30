// ===== FIREBASE — CLOUD CDN =====
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

// ===== YOUR FIRESTORE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ===== INIT =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== ADMIN CHECK — same as your index.html =====
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// ===== DOM =====
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
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

// ===== SAVE LOGIN — same pattern as your saveUserData =====
async function saveLogin(user) {
  if (!user) return;
  try {
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
    console.log("Login saved to Firestore");
  } catch (e) {
    console.error("Save login error:", e);
  }
}

// ===== FLAG — prevents double redirect =====
let redirectHandled = false;

// ===== STEP 1: CHECK IF USER JUST CAME BACK FROM GOOGLE =====
// When Google redirects back to this page after login,
// getRedirectResult() returns the credential.
// If user opened the page normally, it returns null.
getRedirectResult(auth)
  .then(async (result) => {
    if (result && result.user) {
      // User just returned from Google — this is the login result
      redirectHandled = true;
      showLoading("Verifying login...");

      const user = result.user;
      console.log("User returned from Google:", user.email);

      // Save to Firestore — same path as your index.html: users/{uid}/logins
      await saveLogin(user);

      // Small delay so user sees "verifying" before jump
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    }
    // result is null = user just opened the page, not a redirect return
    // The login button stays visible, waiting for click
  })
  .catch((error) => {
    hideLoading();

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
        showError("Too many attempts. Wait and try again.");
        break;
      default:
        showError("Login failed. Please try again.");
        console.error("Redirect result error:", error);
    }
  });

// ===== STEP 2: CHECK IF ALREADY LOGGED IN =====
// Covers case where user is authenticated but didn't just come from redirect
onAuthStateChanged(auth, (user) => {
  if (user && !redirectHandled) {
    // Already logged in, skip login page
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
});

// ===== STEP 3: BUTTON CLICK — SEND USER TO GOOGLE =====
googleBtn.addEventListener("click", async () => {
  // Lock button to prevent double click
  googleBtn.disabled = true;
  googleBtn.style.opacity = "0.6";
  googleBtn.style.pointerEvents = "none";

  showLoading("Redirecting to Google...");

  try {
    // THIS IS THE KEY DIFFERENCE FROM POPUP:
    // signInWithRedirect makes the BROWSER itself navigate to Google.
    // The URL bar changes to accounts.google.com.
    // The user sees Google's real login page — email, password, 2FA.
    // After login, Google redirects back to THIS page (login.html).
    // Then getRedirectResult() at the top catches it.
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
