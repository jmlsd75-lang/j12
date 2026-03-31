// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ============================================
// DOM ELEMENTS
// ============================================
const loginBtn = document.getElementById("loginBtn");

// ============================================
// MAIN AUTH FLOW
// ============================================

// Check if user returned from Google redirect
getRedirectResult(auth).then((result) => {
  if (result && result.user) {
    // User successfully logged in
    const user = result.user;
    console.log("User logged in:", user.displayName, user.email);

    // Save basic session data
    sessionStorage.setItem("userName", user.displayName || "User");
    sessionStorage.setItem("userEmail", user.email || "");
    sessionStorage.setItem("userUid", user.uid || "");

    // Redirect to main page after login
    window.location.href = "index.html"; // or any dashboard page
  }
}).catch((error) => {
  console.error("Login error:", error.code, error.message);
  loginBtn.disabled = false; // re-enable button if error
});

// ============================================
// LOGIN BUTTON CLICK
// ============================================
loginBtn.addEventListener("click", () => {
  loginBtn.disabled = true;
  loginBtn.textContent = "Redirecting...";
  signInWithRedirect(auth, provider);
});
