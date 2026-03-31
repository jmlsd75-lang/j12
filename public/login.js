// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAIL = "jmlsd75@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===============================
// LOGIN BUTTON
// ===============================
const loginBtn = document.getElementById("googleLoginBtn");

loginBtn.addEventListener("click", () => {
  signInWithRedirect(auth, provider);
});

// ===============================
// REDIRECT AFTER LOGIN
// ===============================
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      const email = result.user.email;
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        window.location.replace("admin.html");
      } else {
        window.location.replace("free.html");
      }
    }
  })
  .catch((error) => {
    console.error("Login error:", error);
    alert("Login failed. Try again.");
  });
