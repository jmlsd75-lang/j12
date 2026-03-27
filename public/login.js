import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3"
};

/* Initialize Firebase */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* Get Elements */
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const freeBtn = document.querySelector(".free-btn");
const userDisplay = document.getElementById("userDisplay");

/* LOGIN */
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
});

/* LOGOUT */
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    alert("Logout failed");
  }
});

/* AUTH STATE CHANGE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Show user name/email
    userDisplay.textContent = user.displayName || user.email;

    // Show/Hide buttons
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    freeBtn.style.display = "block"; // show Free button
  } else {
    // Clear user info
    userDisplay.textContent = "";

    // Show/Hide buttons
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    freeBtn.style.display = "none"; // hide Free button
  }
});
