import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const userDisplay = document.getElementById("userDisplay");

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = `Welcome, ${user.displayName}`;
    userDisplay.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});

// Login & Logout
loginBtn.onclick = async () => {
  try { await signInWithPopup(auth, provider); } 
  catch { alert("Login failed. Please try again."); }
};

logoutBtn.onclick = async () => {
  try { await signOut(auth); alert("Logged out."); } 
  catch (e) { console.error(e); }
};
