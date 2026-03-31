import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAIL = "jmlsd@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const statusMsg = document.getElementById("statusMsg");

// Prevent double redirect from race condition
let redirected = false;

function safeRedirect(url) {
  if (redirected) return;
  redirected = true;
  window.location.replace(url);
}

function buildAdminUrl(user) {
  const name = encodeURIComponent(user.displayName || "Admin");
  const email = encodeURIComponent(user.email);
  const photo = encodeURIComponent(user.photoURL || "");
  return "admin.html?admin=true&name=" + name + "&email=" + email + "&photo=" + photo + "&uid=" + user.uid;
}

function buildFeeUrl(user) {
  const name = encodeURIComponent(user.displayName || "User");
  const email = encodeURIComponent(user.email);
  const photo = encodeURIComponent(user.photoURL || "");
  return "fee.html?name=" + name + "&email=" + email + "&photo=" + photo;
}

function redirectUser(user) {
  const email = user.email.toLowerCase();
  if (email === ADMIN_EMAIL) {
    safeRedirect(buildAdminUrl(user));
  } else {
    safeRedirect(buildFeeUrl(user));
  }
}

// This handles BOTH: auto-redirect if already logged in,
// AND redirect after fresh login — no race condition
onAuthStateChanged(auth, (user) => {
  if (user) {
    redirectUser(user);
    return;
  }

  // No user — attach click handler (only runs once)
  loginBtn.onclick = async () => {
    loginBtn.disabled = true;
    statusMsg.textContent = "Signing in...";

    try {
      // Just trigger the popup — onAuthStateChanged above
      // will fire with the new user and handle redirect
      await signInWithPopup(auth, provider);
    } catch (error) {
      loginBtn.disabled = false;

      if (error.code === "auth/popup-closed-by-user") {
        statusMsg.textContent = "Sign-in cancelled.";
      } else {
        statusMsg.textContent = "Login failed. Try again.";
      }
    }
  };
});
