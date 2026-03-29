import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { initFreeMode } from "./free.js";
import { initPay } from "./pay.js";

// ─── Firebase Config ────────────────────────────────────
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

// ─── Admin Emails ───────────────────────────────────────
const ADMIN_EMAILS = ["jmlsd75@gmail.com"];

// ─── DOM References ─────────────────────────────────────
const loginScreen  = document.getElementById("loginScreen");
const loginBtn     = document.getElementById("loginBtn");
const appHeader    = document.getElementById("appHeader");
const bottomControls = document.getElementById("bottomControls");
const freeBtn      = document.getElementById("freeBtn");
const adminLinkBtn = document.getElementById("adminLinkBtn");
const logoutBtn    = document.getElementById("logoutBtn");
const userInfo     = document.getElementById("userInfo");
const userAvatar   = document.getElementById("userAvatar");
const userName     = document.getElementById("userName");
const userRole     = document.getElementById("userRole");
const welcomeMsg   = document.getElementById("welcomeMsg");
const toastEl      = document.getElementById("toast");

let toastTimer = null;

// ─── Toast Helper ───────────────────────────────────────
function showToast(message, type = "info", duration = 4000) {
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.className = "toast";
    void toastEl.offsetWidth;
    toastEl.className = `toast toast-${type} show`;
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
}

// ─── Initialize Subsystems ──────────────────────────────
initFreeMode(freeBtn, showToast);
initPay(showToast);

// ─── UI State Update ────────────────────────────────────
function updateUI(user) {
    if (user) {
        const isAdmin = ADMIN_EMAILS.includes(user.email);
        window.__AUTH_USER = user;
        window.__IS_ADMIN = isAdmin;

        // Show app, hide login
        loginScreen.classList.add("hidden");
        appHeader.style.display = "block";
        bottomControls.classList.remove("hidden");
        welcomeMsg.classList.remove("hidden");
        userInfo.classList.remove("hidden");

        // Populate user info
        userAvatar.src = user.photoURL || "https://via.placeholder.com/36";
        userName.textContent = user.displayName || user.email;
        userRole.textContent = isAdmin ? "ADMIN" : "USER";
        userRole.className = isAdmin ? "role-admin" : "role-user";
        const firstName = user.displayName?.split(" ")[0] || "User";
        welcomeMsg.textContent = `WELCOME, ${firstName.toUpperCase()}`;

        // Admin link
        if (isAdmin) {
            adminLinkBtn.classList.remove("hidden");
        } else {
            adminLinkBtn.classList.add("hidden");
        }

        showToast(`Signed in as ${user.email}`, "success");

    } else {
        window.__AUTH_USER = null;
        window.__IS_ADMIN = false;

        // Show login, hide app
        loginScreen.classList.remove("hidden");
        appHeader.style.display = "none";
        bottomControls.classList.add("hidden");
        welcomeMsg.classList.add("hidden");
        userInfo.classList.add("hidden");
        adminLinkBtn.classList.add("hidden");
        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";
    }
}

// ─── Auth Listener ──────────────────────────────────────
onAuthStateChanged(auth, updateUI);

// ─── Login Button ───────────────────────────────────────
loginBtn.addEventListener("click", async () => {
    if (loginBtn.classList.contains("loading")) return;
    loginBtn.classList.add("loading");
    loginBtn.textContent = "SIGNING IN...";

    try {
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(auth, provider);
    } catch (error) {
        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";
        const msg = error.code === "auth/popup-blocked"
            ? "Allow popups to sign in"
            : "Sign-in failed. Try again.";
        showToast(msg, "error");
    }
});

// ─── Logout Button ──────────────────────────────────────
logoutBtn.addEventListener("click", async () => {
    try {
        localStorage.removeItem("freeTrialStartTime");
        localStorage.removeItem("paidSessionData");
        await signOut(auth);
        showToast("Signed out", "info");
    } catch {
        showToast("Logout failed", "error");
    }
});

// ─── Admin Link Button ──────────────────────────────────
adminLinkBtn.addEventListener("click", () => {
    window.open("./admin.html", "_blank");
});
