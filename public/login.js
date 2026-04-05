// ============================================================
// login.js — Handles Google Login & Logout ONLY
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Your Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ── Admin emails — add more here anytime ──
const ADMIN_EMAILS = [
  "jmlsd75@gmail.com",
  "mohd.khamis18.mk@gmail.com"
];

// ── Initialize ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence: LOCAL"))
  .catch((err) => console.error("Persistence error:", err));

// ── ONLY two possible destinations ──
function getDestination(email) {
  if (ADMIN_EMAILS.includes(email)) return "admin.html";
  return "free.html";
}

function isAdmin(email) {
  return ADMIN_EMAILS.includes(email);
}

// ── LOGIN ──
async function handleGoogleLogin() {
  const btn = document.getElementById("googleLoginBtn");
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '<div class="btn-spinner"></div> Signing in...';

  if (!document.getElementById("spinnerCSS")) {
    const s = document.createElement("style");
    s.id = "spinnerCSS";
    s.textContent = `.btn-spinner{width:22px;height:22px;border:3px solid #e0e0e0;border-top-color:#4285F4;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(s);
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      name: user.displayName || "User",
      email: user.email,
      photo: user.photoURL || "",
      uid: user.uid,
      isAdmin: isAdmin(user.email),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem("userSession", JSON.stringify(userData));

    btn.innerHTML = `
      <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#34A853"/>
      </svg>
      Signed in! Redirecting...`;
    btn.style.background = "#e8f5e9";
    btn.style.color = "#2e7d32";

    console.log("Login success:", userData.email, "| Admin:", userData.isAdmin);

    window.dispatchEvent(new CustomEvent("loginSuccess", { detail: userData }));

    setTimeout(() => {
      window.location.href = getDestination(user.email);
    }, 1200);

  } catch (error) {
    btn.disabled = false;
    btn.style.background = "#ffffff";
    btn.style.color = "#3c4043";
    btn.innerHTML = `
      <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in with Google`;

    let msg = "Login failed. Try again.";
    if (error.code === "auth/popup-closed-by-user") msg = "Sign-in cancelled.";
    else if (error.code === "auth/cancelled-popup-request") msg = "Popup already open.";
    else if (error.code === "auth/invalid-client") msg = "Invalid client configuration.";

    showError(msg);
    console.error("Login error:", error.code, error.message);
  }
}

// ── LOGOUT ──
async function handleLogout() {
  try {
    await signOut(auth);
    localStorage.removeItem("userSession");
    console.log("User signed out");

    window.dispatchEvent(new CustomEvent("logoutSuccess"));
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// ── Show error message below button ──
function showError(message) {
  const existing = document.getElementById("loginError");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "loginError";
  div.style.cssText = "color:#ff6b6b;font-size:13px;margin-top:14px;padding:10px 14px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.25);border-radius:8px;text-align:center;animation:errorIn .3s ease";
  div.textContent = message;

  const btn = document.getElementById("googleLoginBtn");
  if (btn) btn.parentNode.insertBefore(div, btn.nextSibling);

  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transition = "opacity 0.3s";
    setTimeout(() => div.remove(), 300);
  }, 5000);

  if (!document.getElementById("errorCSS")) {
    const s = document.createElement("style");
    s.id = "errorCSS";
    s.textContent = "@keyframes errorIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}";
    document.head.appendChild(s);
  }
}

// ── Auto-redirect if already logged in ──
onAuthStateChanged(auth, (user) => {
  if (user && (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/"))) {
    const session = localStorage.getItem("userSession");
    if (session) {
      console.log("Session active, redirecting...");
      window.location.href = getDestination(user.email);
    }
  }
});

// ── Expose to global scope so HTML onclick can find them ──
window.handleGoogleLogin = handleGoogleLogin;
window.handleLogout = handleLogout;
