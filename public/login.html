import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Detect which page we're on
const loginBtn = document.getElementById("googleLoginBtn");
const loginMsg = document.getElementById("loginMsg");
const isLoginPage = !!loginBtn;

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (isLoginPage) {
            window.location.replace("index.html");
        } else {
            renderLoggedInState(user);
        }
    } else {
        if (!isLoginPage) {
            renderLoggedOutState();
        }
    }
});

// LOGIN PAGE LOGIC
if (isLoginPage) {
    loginBtn.addEventListener("click", async () => {
        loginBtn.disabled = true;
        loginMsg.className = "msg info";
        loginMsg.textContent = "Connecting to Google...";

        try {
            await signInWithPopup(auth, provider);
        } catch (e) {
            loginBtn.disabled = false;
            loginMsg.className = "msg error";
            if (e.code === "auth/popup-closed-by-user") {
                loginMsg.textContent = "Popup closed. Try again.";
            } else if (e.code === "auth/cancelled-popup-request") {
                loginMsg.textContent = "Request cancelled. Try again.";
            } else {
                loginMsg.textContent = "Login failed. Please try again.";
                console.error("Auth error:", e);
            }
        }
    });
}

// INDEX PAGE LOGIC
function renderLoggedInState(user) {
    const container = document.getElementById("authContainer");
    if (!container) return;

    const displayName = user.displayName || user.email;
    const photoUrl = user.photoUrl;

    container.innerHTML = `
        <div class="welcome-card">
            <div class="avatar">${photoUrl ? `<img src="${photoUrl}" alt="avatar">` : displayName.charAt(0).toUpperCase()}</div>
            <div class="welcome-text">
                <div class="welcome-label">WELCOME BACK</div>
                <div class="welcome-name">${displayName}</div>
            </div>
            <button class="logout-btn" id="logoutBtn">LOGOUT</button>
        </div>
        <div class="system-status">
            <div class="status-dot"></div>
            <span>SYSTEM ACTIVE</span>
        </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.reload();
        } catch (e) {
            console.error("Logout error:", e);
        }
    });
}

function renderLoggedOutState() {
    const container = document.getElementById("authContainer");
    if (!container) return;

    container.innerHTML = `
        <button class="login-btn" onclick="window.location.href='login.html'">Login</button>
    `;
}
