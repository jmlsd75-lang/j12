import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Configuration
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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const googleLoginBtn = document.getElementById("googleLoginBtn");
const errorMsg = document.getElementById("errorMsg");
const loadingText = document.getElementById("loadingText");

const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is already logged in, redirect to main system
    redirectToSystem();
  }
});

// Google Login Button Click
googleLoginBtn.onclick = async () => {
  // Reset states
  errorMsg.classList.remove("show");
  loadingText.classList.add("show");
  googleLoginBtn.disabled = true;
  googleLoginBtn.innerHTML = `
    <svg viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="30 70"/>
    </svg>
    Signing in...
  `;

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save login data to Firestore
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      createdAt: serverTimestamp()
    });

    // Redirect to main system
    redirectToSystem();

  } catch (error) {
    console.error("Login error:", error);
    loadingText.classList.remove("show");
    
    let errorMessage = "Login failed. Please try again.";
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Login cancelled. Please try again.";
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = "Too many requests. Please wait and try again.";
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = "Network error. Please check your connection.";
    }
    
    showError(errorMessage);
    
    // Reset button
    googleLoginBtn.disabled = false;
    googleLoginBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in with Google
    `;
  }
};

// Show Error Message
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("show");
  
  setTimeout(() => {
    errorMsg.classList.remove("show");
  }, 5000);
}

// Redirect to Main System
function redirectToSystem() {
  // Store login status
  localStorage.setItem("isLoggedIn", "true");
  
  // Redirect to your main system page
  // Change 'system.html' to your actual main page filename
  window.location.href = "system.html";
}
