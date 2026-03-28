// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- DOM Elements ---
const loginBtn = document.querySelector(".login-btn");
const userDisplay = document.getElementById("userDisplay");

// Optional: Add a callback to handle login state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    userDisplay.textContent = user.displayName;
    userDisplay.style.display = "block";

    // Hide login button after login
    loginBtn.style.display = "none";

    console.log("✅ Logged in as:", user.email);
  } else {
    // User not logged in
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
  }
});

// --- Login Button Logic ---
loginBtn.onclick = async () => {
  try {
    await signInWithPopup(auth, provider);
    console.log("✅ Login successful");
  } catch (error) {
    console.error("❌ Login failed:", error);
    alert("Login failed. Try again.");
  }
};
