// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Import the Free button function
import { handleFree } from './free.js';

// Your Firebase Configuration
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

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const freeBtn = document.getElementById('freeBtn');
const bottomControls = document.getElementById('bottomControls');

// 1. CHECK AUTH STATE ON LOAD
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User IS logged in
    console.log("User logged in:", user.displayName);
    
    // Hide Login, Show Bottom Controls
    loginBtn.classList.add('hidden');
    bottomControls.classList.remove('hidden');
    
  } else {
    // User IS NOT logged in
    console.log("No user logged in");
    
    // Show Login, Hide Bottom Controls
    loginBtn.classList.remove('hidden');
    bottomControls.classList.add('hidden');
  }
});

// 2. LOGIN BUTTON LOGIC
loginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will handle the UI update automatically
  } catch (error) {
    console.error("Login Error:", error);
    alert("Login failed. Please try again.");
  }
});

// 3. LOGOUT BUTTON LOGIC
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    // onAuthStateChanged will handle the UI update automatically
  } catch (error) {
    console.error("Logout Error:", error);
  }
});

// 4. FREE BUTTON LOGIC
freeBtn.addEventListener('click', handleFree);
