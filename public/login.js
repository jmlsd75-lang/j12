import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.firebasestorage.app",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Admin email
const ADMIN_EMAIL = "camelkazembe1@gmail.com";

// Global state
let isAdmin = false;
let currentUser = null;

// DOM elements
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

// Toast notification function
function showToast(message, type = "info", duration = 4000) {
    toastEl.textContent = message;
    toastEl.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toastEl.classList.remove("show");
    }, duration);
}

// Update UI based on auth state
function updateUI(user) {
    if (user) {
        currentUser = user;
        isAdmin = user.email === ADMIN_EMAIL;

        // Store in window for global access
        window.__AUTH_USER = user;
        window.__IS_ADMIN = isAdmin;

        // Hide login button, show controls
        loginBtn.classList.add("hidden");
        bottomControls.classList.remove("hidden");
        welcomeMsg.classList.remove("hidden");
        userInfo.classList.remove("hidden");

        // Update user info display
        userAvatar.src = user.photoURL || "https://via.placeholder.com/36";
        userName.textContent = user.displayName || user.email;
        userRole.textContent = isAdmin ? "ADMIN" : "USER";

        // Update welcome message
        const firstName = user.displayName ? user.displayName.split(" ")[0] : "User";
        welcomeMsg.textContent = `Welcome, ${firstName}`;

        // Success notification
        showToast(`Logged in as ${user.email}`, "success");

    } else {
        currentUser = null;
        isAdmin = false;

        // Clear global state
        window.__AUTH_USER = null;
        window.__IS_ADMIN = false;

        // Show login button, hide controls
        loginBtn.classList.remove("hidden");
        bottomControls.classList.add("hidden");
        welcomeMsg.classList.add("hidden");
        userInfo.classList.add("hidden");

        // Remove loading state
        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";
    }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    updateUI(user);
});

// Login button click handler
loginBtn.addEventListener("click", async () => {
    // Prevent double clicks
    if (loginBtn.classList.contains("loading")) return;

    // Show loading state
    loginBtn.classList.add("loading");
    loginBtn.textContent = "SIGNING IN...";

    try {
        // Set custom parameters for better popup experience
        provider.setCustomParameters({
            prompt: "select_account"
        });

        const result = await signInWithPopup(auth, provider);
        
        // Login successful - onAuthStateChanged will handle UI update
        console.log("Login successful:", result.user.email);

    } catch (error) {
        // Remove loading state
        loginBtn.classList.remove("loading");
        loginBtn.textContent = "LOGIN";

        switch (error.code) {
            case "auth/popup-closed-by-user":
                // User closed the popup - silent
                console.log("Popup closed by user");
                break;
            case "auth/cancelled-popup-request":
                // Another popup was already open
                console.log("Popup request cancelled");
                break;
            case "auth/popup-blocked":
                showToast("Popup blocked! Please allow popups for this site.", "error", 5000);
                break;
            case "auth/unauthorized-domain":
                showToast("This domain is not authorized. Contact admin.", "error", 5000);
                break;
            default:
                console.error("Login failed:", error);
                showToast(`Login failed: ${error.message}`, "error", 5000);
        }
    }
});

// Logout button click handler
logoutBtn.addEventListener("click", async () => {
    try {
        // Clear any stored session data
        localStorage.removeItem("sessionEnd");
        
        // Sign out from Firebase
        await signOut(auth);
        
        showToast("Logged out successfully", "info");

    } catch (error) {
        console.error("Logout failed:", error);
        showToast("Logout failed. Please try again.", "error");
    }
});

// Free button click handler (placeholder)
freeBtn.addEventListener("click", () => {
    showToast("FREE mode activated", "success");
    // Add your free mode logic here
});

// Log initialization
console.log("Auth system initialized");
