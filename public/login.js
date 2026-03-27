// login.js
import { auth, provider } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.querySelector(".logout-btn");
const userDisplay = document.getElementById("userDisplay");

// Login function
export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      userDisplay.textContent = user.displayName;
      userDisplay.style.display = "block";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

// Logout function
logoutBtn.onclick = async () => {
  await signOut(auth);
  userDisplay.style.display = "none";
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
};

// Keep login/logout synced
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = user.displayName;
    userDisplay.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});
