import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const loginBtn = document.getElementById("googleLoginBtn");

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
}

function showLoading(text) {
    loadingText.textContent = text;
    loadingOverlay.style.display = "flex";
}

function hideLoading() {
    loadingOverlay.style.display = "none";
}

function saveSession(user, fresh) {
    const isAdmin = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    sessionStorage.setItem("userName", user.displayName || "User");
    sessionStorage.setItem("userEmail", user.email || "");
    sessionStorage.setItem("userPhoto", user.photoURL || "");
    sessionStorage.setItem("userUid", user.uid || "");
    sessionStorage.setItem("isAdmin", isAdmin.toString());
    if (fresh) sessionStorage.setItem("justLoggedIn", "1");
    return isAdmin;
}

function redirect(isAdmin) {
    if (isAdmin) {
        window.location.replace("admin.html");
    } else {
        window.location.replace("free.html");
    }
}

function logToFirestore(user) {
    try {
        const isAdmin = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        addDoc(collection(db, "users", user.uid, "logins"), {
            name: user.displayName,
            email: user.email,
            role: isAdmin ? "admin" : "free",
            createdAt: serverTimestamp()
        }).catch(function (e) { console.warn("Firestore:", e); });
    } catch (e) { console.warn("Firestore:", e); }
}

function checkSession() {
    const email = sessionStorage.getItem("userEmail");
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (email) {
        showLoading("Resuming session...");
        setTimeout(function () { redirect(isAdmin); }, 500);
        return true;
    }
    return false;
}

if (!checkSession()) {
    getRedirectResult(auth).then(function (result) {
        if (result && result.user) {
            showLoading("Verifying...");
            const isAdmin = saveSession(result.user, true);
            logToFirestore(result.user);
            setTimeout(function () { redirect(isAdmin); }, 300);
        } else {
            hideLoading();
        }
    }).catch(function (error) {
        hideLoading();
        if (error.code === "auth/redirect-cancelled-by-user") {
            showError("Login cancelled. Try again.");
        } else {
            showError("Login failed. Please try again.");
        }
    });
}

loginBtn.addEventListener("click", function () {
    errorMsg.style.display = "none";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
    loginBtn.style.pointerEvents = "none";
    showLoading("Redirecting to Google...");
    signInWithRedirect(auth, provider);
});
