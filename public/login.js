import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
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
let hasRedirected = false;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingOverlay.style.display = "flex";
}

// ✅ ADD THIS — was missing!
function hideLoading() {
  loadingOverlay.style.display = "none";
}

function safeRedirect(user, fresh) {
  if (hasRedirected) return;
  hasRedirected = true;
  redirectUser(user, fresh);
}

function redirectUser(user, fresh) {
  console.log("Redirecting user:", user.email);
  
  let destination = "free.html";

  if (user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    destination = "admin.html";
    console.log("→ Admin detected → admin.html");
  } else {
    console.log("→ Regular user → free.html");
  }

  // Save session
  try {
    sessionStorage.setItem("userName", user.displayName || "User");
    sessionStorage.setItem("userEmail", user.email || "");
    sessionStorage.setItem("userPhoto", user.photoURL || "");
    sessionStorage.setItem("userUid", user.uid || "");
    sessionStorage.setItem("isAdmin", 
      (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()).toString()
    );
    if (fresh) sessionStorage.setItem("justLoggedIn", "1");
  } catch (e) {
    console.warn("Session error:", e);
  }

  // Save to Firestore (non-blocking)
  try {
    if (user && user.uid) {
      addDoc(collection(db, "users", user.uid, "logins"), {
        name: user.displayName,
        email: user.email,
        role: user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "free",
        createdAt: serverTimestamp()
      }).catch(function(err) { console.warn("Firestore error:", err); });
    }
  } catch (e) {
    console.warn("Firestore error:", e);
  }

  console.log("FINAL DESTINATION:", destination);
  window.location.href = destination;
}

// ============================================
// MAIN FLOW
// ============================================

getRedirectResult(auth).then(function(result) {
  if (result && result.user) {
    console.log("Got redirect result:", result.user.email);
    showLoading("Verifying...");
    safeRedirect(result.user, true);
  } else {
    console.log("No redirect result, checking auth state...");
    onAuthStateChanged(auth, function(user) {
      if (user) {
        console.log("Already logged in:", user.email);
        showLoading("Checking...");
        safeRedirect(user, false);  // ✅ Changed from redirectUser to safeRedirect
      } else {
        console.log("No user — showing login button");
      }
    });
  }
}).catch(function(error) {
  console.error("Auth error:", error.code, error.message);
  hideLoading();  // ✅ Now this works!
  
  if (error.code === "auth/redirect-cancelled-by-user") {
    showError("You cancelled the login. Try again.");
  } else {
    showError("Login failed. Please try again.");
  }
});

// ============================================
// BUTTON
// ============================================
document.getElementById("googleLoginBtn").addEventListener("click", function() {
  this.disabled = true;
  this.style.opacity = "0.5";
  this.style.pointerEvents = "none";
  showLoading("Redirecting to Google...");
  signInWithRedirect(auth, provider);
});
