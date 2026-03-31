// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.appspot.com",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM elements
const loginBtn = document.getElementById("loginBtn");

// If user is already logged in, redirect to index.html
if (sessionStorage.getItem("userUid")) {
    window.location.href = "index.html";
}

// Handle redirect result from Google sign-in
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      const user = result.user;

      // Save session
      sessionStorage.setItem("userName", user.displayName || "User");
      sessionStorage.setItem("userEmail", user.email || "");
      sessionStorage.setItem("userUid", user.uid || "");

      // Redirect to dashboard
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    console.error("Login error:", error.code, error.message);
    loginBtn.disabled = false;
    loginBtn.textContent = "Login with Google";
  });

// Button click event
loginBtn.addEventListener("click", () => {
  loginBtn.disabled = true;
  loginBtn.textContent = "Redirecting...";
  signInWithRedirect(auth, provider);
});
