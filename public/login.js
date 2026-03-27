import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
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

/* Elements */
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const freeBtn = document.querySelector(".free-btn");
const userDisplay = document.getElementById("userDisplay");

/* LOGIN */
loginBtn.addEventListener("click", () => {
  signInWithRedirect(auth, provider);
});

/* Optional: handle redirect result */
getRedirectResult(auth)
  .then((result) => {
    if (result.user) {
      console.log("Redirect login success:", result.user);
    }
  })
  .catch((error) => console.error("Redirect login error:", error));

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
  console.log("Auth state changed:", user);
  if (user) {
    userDisplay.textContent = user.displayName || user.email;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    freeBtn.style.display = "block"; // show FREE after login
  } else {
    userDisplay.textContent = "";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    freeBtn.style.display = "none";
  }
});
