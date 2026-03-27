// login.js
import { auth, provider } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// DOM elements
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const userDisplay = document.getElementById("userDisplay");

// Auth state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Hello, ${user.displayName}`;
    userDisplay.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});

// Login click
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Check console for details.");
  }
});

// Logout click
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully");
  } catch (err) {
    console.error("Logout failed:", err);
  }
});
