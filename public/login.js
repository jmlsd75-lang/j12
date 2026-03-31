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

// Redirect using URL parameters - MORE RELIABLE
function redirectAsAdmin(user) {
    const params = new URLSearchParams({
        name: user.displayName || "Admin",
        email: user.email,
        photo: user.photoURL || "",
        uid: user.uid,
        admin: "true"
    });
    window.location.href = "admin.html?" + params.toString();
}

function redirectAsFree(user) {
    const params = new URLSearchParams({
        name: user.displayName || "User",
        email: user.email,
        photo: user.photoURL || "",
        uid: user.uid,
        admin: "false"
    });
    window.location.href = "free.html?" + params.toString();
}

// Check if already on admin page with valid params
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
        showLoading("Resuming admin session...");
        setTimeout(function() {
            window.location.href = "admin.html?" + params.toString();
        }, 300);
        return true;
    }
    if (params.get('admin') === 'false') {
        showLoading("Resuming session...");
        setTimeout(function() {
            window.location.href = "free.html?" + params.toString();
        }, 300);
        return true;
    }
    return false;
})();

// Handle redirect result from Google
getRedirectResult(auth).then(function (result) {
    if (result && result.user) {
        showLoading("Verifying credentials...");
        const user = result.user;
        const email = (user.email || "").toLowerCase();
        const isAdmin = email === ADMIN_EMAIL.toLowerCase();
        
        console.log("Login success - Email:", email, "IsAdmin:", isAdmin);
        
        logToFirestore(user);
        
        if (isAdmin) {
            redirectAsAdmin(user);
        } else {
            redirectAsFree(user);
        }
    } else {
        hideLoading();
    }
}).catch(function (error) {
    hideLoading();
    console.error("Auth error:", error);
    if (error.code === "auth/redirect-cancelled-by-user") {
        showError("Login cancelled. Try again.");
    } else {
        showError("Login failed. Please try again.");
    }
});

loginBtn.addEventListener("click", function () {
    errorMsg.style.display = "none";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.5";
    loginBtn.style.pointerEvents = "none";
    showLoading("Redirecting to Google...");
    signInWithRedirect(auth, provider);
});
