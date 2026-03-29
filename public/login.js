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

// Wait for DOM to be ready before grabbing elements
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.error(`[AUTH] Missing DOM element: #${id}`);
    }
    return el;
}

const loginBtn       = getEl("loginBtn");
const bottomControls = getEl("bottomControls");
const freeBtn        = getEl("freeBtn");
const logoutBtn      = getEl("logoutBtn");
const userInfo       = getEl("userInfo");
const userAvatar     = getEl("userAvatar");
const userName       = getEl("userName");
const userRole       = getEl("userRole");
const welcomeMsg     = getEl("welcomeMsg");
const toastEl        = getEl("toast");
const initOverlay    = getEl("initOverlay");

// Hide the init overlay once everything is set up
function hideInitOverlay() {
    if (initOverlay) {
        // Small delay so the user sees a smooth transition
        setTimeout(() => {
            initOverlay.classList.add("done");
        }, 300);
    }
}

// Toast notification function
let toastTimer = null;
function showToast(message, type = "info", duration = 4000) {
    if (!toastEl) return;
    // Clear any existing timer
    if (toastTimer) clearTimeout(toastTimer);

    toastEl.textContent = message;
    toastEl.className = "toast"; // reset
    // Force reflow so re-adding the class triggers the transition
    void toastEl.offsetWidth;
    toastEl.classList.add(`toast-${type}`, "show");

    toastTimer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, duration);
}

// Update UI based on auth state
function updateUI(user) {
    // Always hide the init overlay after the first auth check
    hideInitOverlay();

    if (user) {
        currentUser = user;
        isAdmin = user.email === ADMIN_EMAIL;

        // Store in window for global access
        window.__AUTH_USER = user;
        window.__IS_ADMIN = isAdmin;

        // Hide login button, show controls
        if (loginBtn) loginBtn.classList.add("hidden");
        if (bottomControls) bottomControls.classList.remove("hidden");
        if (welcomeMsg) {
            welcomeMsg.classList.remove("hidden");
            const firstName = user.displayName
                ? user.displayName.split(" ")[0]
                : "User";
            welcomeMsg.textContent = `Welcome, ${firstName}`;
        }
        if (userInfo) userInfo.classList.remove("hidden");

        // Update user info display
        if (userAvatar) {
            userAvatar.src = user.photoURL || "https://via.placeholder.com/36";
        }
        if (userName) {
            userName.textContent = user.displayName || user.email;
        }
        if (userRole) {
            userRole.textContent = isAdmin ? "ADMIN" : "USER";
        }

        console.log("[AUTH] Logged in:", user.email, "| Admin:", isAdmin);

    } else {
        currentUser = null;
        isAdmin = false;

        // Clear global state
        window.__AUTH_USER = null;
        window.__IS_ADMIN = false;

        // Show login button, hide controls
        if (loginBtn) {
            loginBtn.classList.remove("hidden");
            loginBtn.classList.remove("loading");
            loginBtn.textContent = "LOGIN";
        }
        if (bottomControls) bottomControls.classList.add("hidden");
        if (welcomeMsg) welcomeMsg.classList.add("hidden");
        if (userInfo) userInfo.classList.add("hidden");

        console.log("[AUTH] Logged out");
    }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    updateUI(user);
});

// Login button click handler
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        // Prevent double clicks
        if (loginBtn.classList.contains("loading")) return;

        // Show loading state
        loginBtn.classList.add("loading");
        loginBtn.textContent = "SIGNING IN...";

        try {
            // Force account selection every time
            provider.setCustomParameters({
                prompt: "select_account"
            });

            const result = await signInWithPopup(auth, provider);
            // Success is handled by onAuthStateChanged
            console.log("[AUTH] Sign-in successful:", result.user.email);

        } catch (error) {
            // Reset button state on failure
            loginBtn.classList.remove("loading");
            loginBtn.textContent = "LOGIN";

            switch (error.code) {
                case "auth/popup-closed-by-user":
                    console.log("[AUTH] Popup closed by user");
                    break;
                case "auth/cancelled-popup-request":
                    console.log("[AUTH] Popup request cancelled");
                    break;
                case "auth/popup-blocked":
                    showToast(
                        "Popup blocked by browser. Allow popups for this site and try again.",
                        "error",
                        6000
                    );
                    break;
                case "auth/unauthorized-domain":
                    showToast(
                        "This domain is not authorized in Firebase Console. Add it under Authentication > Settings > Authorized domains.",
                        "error",
                        8000
                    );
                    break;
                case "auth/invalid-credential":
                case "auth/id-token-expired":
                    showToast("Session expired. Please try again.", "error");
                    break;
                default:
                    console.error("[AUTH] Login error:", error.code, error.message);
                    showToast(`Login failed: ${error.message}`, "error", 5000);
            }
        }
    });
}

// Logout button click handler
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            localStorage.removeItem("sessionEnd");
            await signOut(auth);
            showToast("Logged out successfully", "info");
        } catch (error) {
            console.error("[AUTH] Logout error:", error);
            showToast("Logout failed. Please try again.", "error");
        }
    });
}

// Free button click handler
if (freeBtn) {
    freeBtn.addEventListener("click", () => {
        showToast("FREE mode activated", "success");
        // Add your free mode logic here
    });
}

console.log("[AUTH] Firebase auth system initialized");
