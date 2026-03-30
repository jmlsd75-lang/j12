// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// ⚠️ PASTE YOUR REAL FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingText = document.getElementById("loadingText");

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("show");
  loadingText.classList.remove("show");
  loginBtn.disabled = false;
}

function showLoading() {
  errorMsg.classList.remove("show");
  loadingText.classList.add("show");
  loginBtn.disabled = true;
}

loginBtn.addEventListener("click", async () => {
  showLoading();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    switch (error.code) {
      case "auth/popup-closed-by-user":
        showError("Sign-in was cancelled. Please try again.");
        break;
      case "auth/invalid-credential":
        showError("Invalid credentials. Please try again.");
        break;
      case "auth/network-request-failed":
        showError("Network error. Check your connection and try again.");
        break;
      case "auth/too-many-requests":
        showError("Too many attempts. Please wait and try again.");
        break;
      default:
        showError("Something went wrong. Please try again.");
        console.error("Login error:", error);
    }
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});
