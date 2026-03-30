// ===== FIREBASE IMPORTS (Cloud CDN) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== FIREBASE CONFIG (from your existing code) =====
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

// ===== DOM REFS =====
const googleBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

// ===== SAVE LOGIN TO FIRESTORE =====
async function saveLogin(user) {
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

// ===== SHOW / HIDE HELPERS =====
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  setTimeout(() => errorMsg.classList.add("hidden"), 4000);
}

function showLoading(text) {
  loadingText.textContent = text || "Authenticating...";
  loadingOverlay.classList.remove("hidden");
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
  loadingOverlay.style.display = "none";
}

// ===== CHECK IF ALREADY LOGGED IN =====
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Already signed in — redirect immediately to main system
    window.location.href = "index.html";
  }
});

// ===== GOOGLE LOGIN BUTTON CLICK =====
googleBtn.addEventListener("click", async () => {
  showLoading("Connecting to Google...");

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      showLoading("Saving session...");
      await saveLogin(user);

      // Short delay so user sees "success" feel
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    }
  } catch (error) {
    hideLoading();

    // Handle specific errors
    switch (error.code) {
      case "auth/popup-closed-by-user":
        showError("Login popup was closed. Please try again.");
        break;
      case "auth/cancelled-popup-request":
        showError("Too many popups opened. Please try again.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check your connection.");
        break;
      case "auth/invalid-email":
        showError("Invalid email address.");
        break;
      default:
        showError("Login failed. Please try again.");
        console.error("Login error:", error);
    }
  }
});
