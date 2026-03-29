import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ IMPORT FREE SYSTEM
import { initFree } from "./free.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.firebasestorage.app",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Admin
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// State
let currentUser = null;
let isAdmin = false;

// DOM
const loginBtn = document.getElementById("loginBtn");
const bottomControls = document.getElementById("bottomControls");
const freeBtn = document.getElementById("freeBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const welcomeMsg = document.getElementById("welcomeMsg");
const toastEl = document.getElementById("toast");

// Toast
function showToast(message, type = "info", duration = 4000) {
    toastEl.textContent = message;
    toastEl.className = `toast toast-${type} show`;
    setTimeout(() => toastEl.classList.remove("show"), duration);
}

// ✅ INIT FREE SYSTEM
initFree(showToast);

// UI update
function updateUI(user) {
    if (user) {
        currentUser = user;
        isAdmin = user.email === ADMIN_EMAIL;

        window.__AUTH_USER = user;
        window.__IS_ADMIN = isAdmin;

        loginBtn.classList.add("hidden");
        bottomControls.classList.remove("hidden");
        welcomeMsg.classList.remove("hidden");
        userInfo.classList.remove("hidden");

        userAvatar.src = user.photoURL || "https://via.placeholder.com/36";
        userName.textContent = user.displayName || user.email;
        userRole.textContent = isAdmin ? "ADMIN" : "USER";

        const firstName = user.displayName?.split(" ")[0] || "User";
        welcomeMsg.textContent = `Welcome, ${firstName}`;

        showToast(`Logged in as ${user.email}`, "success");

    } else {
        currentUser = null;
        isAdmin = false;

        window.__AUTH_USER = null;
        window.__IS_ADMIN = false;

        loginBtn.classList.remove("hidden");
        bottomControls.classList.add("hidden");
        welcomeMsg.classList.add("hidden");
        userInfo.classList.add("hidden");

        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";
    }
}

// Auth state listener
onAuthStateChanged(auth, updateUI);

// LOGIN
loginBtn.addEventListener("click", async () => {
    if (loginBtn.classList.contains("loading")) return;

    loginBtn.classList.add("loading");
    loginBtn.textContent = "SIGNING IN...";

    try {
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);
        console.log("Login:", result.user.email);
    } catch (error) {
        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";

        if (error.code === "auth/popup-blocked") {
            showToast("Allow popups for login", "error");
        } else {
            showToast("Login failed", "error");
        }
    }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
    try {
        localStorage.removeItem("sessionEnd");
        await signOut(auth);
        showToast("Logged out", "info");
    } catch {
        showToast("Logout failed", "error");
    }
});

// ✅ FREE BUTTON (CONNECTED)
freeBtn.addEventListener("click", () => {
    if (!currentUser) {
        showToast("Login first", "error");
        return;
    }

    if (window.startFreeMode) {
        window.startFreeMode();
    } else {
        showToast("Free system not ready", "error");
    }
});

console.log("Auth + Free system ready");
