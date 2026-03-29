import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { initFreeMode } from "./free.js";
import { initPay } from "./pay.js"; // ✅ ADDED

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
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

let currentUser = null;
let isAdmin = false;

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

let toastTimer = null;
function showToast(message, type = "info", duration = 4000) {
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.className = "toast";
    void toastEl.offsetWidth;
    toastEl.className = `toast toast-${type} show`;
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration);
}

// ✅ INIT SYSTEMS
initFreeMode(freeBtn, showToast);
initPay(showToast); // ✅ ADDED (this connects PAY)

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

onAuthStateChanged(auth, updateUI);

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
        if (error.code === "auth/popup-blocked") {
            showToast("Allow popups for login", "error");
        } else {
            showToast("Login failed", "error");
        }
    }
});

logoutBtn.addEventListener("click", async () => {
    try {
        localStorage.removeItem("freeTrialStartTime");
        localStorage.removeItem("paidSessionData");
        await signOut(auth);
        showToast("Logged out", "info");
    } catch {
        showToast("Logout failed", "error");
    }
});
