// login.js
import { auth, provider } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.querySelector(".logout-btn");
const userDisplay = document.getElementById("userDisplay");

// Login function
export async function login() {
  try {
    await signInWithPopup(auth, provider);
    // UI updates are handled automatically by onAuthStateChanged below
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

// Logout function
logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
    // UI updates are handled automatically by onAuthStateChanged below
  } catch (err) {
    console.error(err);
  }
};

// Keep login/logout UI synced with Auth State
// This runs automatically when the page loads and when auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    userDisplay.textContent = user.displayName;
    userDisplay.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    // User is signed out
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});
