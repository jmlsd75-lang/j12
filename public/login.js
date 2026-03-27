import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3"
};

/* INIT */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* GET ELEMENTS */
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

/* AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = user.displayName || user.email;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    freeBtn.style.display = "block";

  } else {
    userDisplay.textContent = "";

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    freeBtn.style.display = "none";
  }
});
