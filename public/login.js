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
const firebaseConfig = { /* your config */ };
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

/* CHECK REDIRECT RESULT */
getRedirectResult(auth)
  .then((result) => {
    if (result.user) {
      console.log("Redirect login success:", result.user);
    }
  })
  .catch((error) => {
    console.error("Redirect login error:", error);
  });

/* LOGOUT */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

/* AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userDisplay.textContent = user.displayName || user.email;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    freeBtn.style.display = "block"; // show Free button
  } else {
    userDisplay.textContent = "";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    freeBtn.style.display = "none";
  }
});
