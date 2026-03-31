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

// ============================================
// THIS IS THE ONLY FUNCTION THAT REDIRECTS
// IT CAN NEVER FAIL
// IT CAN NEVER GO TO index.html
// ONLY admin.html OR free.html
// ============================================
function redirectUser(user, fresh) {
  // Default destination — impossible to be anything else
  var destination = "free.html";

  try {
    if (user && user.email === ADMIN_EMAIL) {
      destination = "admin.html";
    }
  } catch (e) {
    // If anything breaks, still goes to free.html
    destination = "free.html";
  }

  // Save session — wrapped so it can NEVER block
  try {
    sessionStorage.setItem("userName", (user && user.displayName) || "User");
    sessionStorage.setItem("userEmail", (user && user.email) || "");
    sessionStorage.setItem("userPhoto", (user && user.photoURL) || "");
    sessionStorage.setItem("userUid", (user && user.uid) || "");
    sessionStorage.setItem("isAdmin", ((user && user.email) === ADMIN_EMAIL).toString());
    if (fresh) sessionStorage.setItem("justLoggedIn", "1");
  } catch (e) {
    // Session storage blocked? WHO CARES. Still redirect.
  }

  // Save to Firestore — completely separate, can never block
  try {
    if (user && user.uid) {
      addDoc(collection(db, "users", user.uid, "logins"), {
        name: user.displayName,
        email: user.email,
        role: user.email === ADMIN_EMAIL ? "admin" : "free",
        createdAt: serverTimestamp()
      }).catch(function() {});
    }
  } catch (e) {
    // Firestore failed? WHO CARES. Still redirect.
  }

  // THIS LINE ALWAYS RUNS
  // NO MATTER WHAT HAPPENED ABOVE
  // NO await. NO delay. NO condition.
  window.location.href = destination;
}

// ============================================
// MAIN FLOW
// ============================================

// Step 1: User just came back from Google?
getRedirectResult(auth).then(function(result) {
  if (result && result.user) {
    showLoading("Verifying...");
    redirectUser(result.user, true);
  } else {
    // Step 2: No redirect — check if already logged in
    onAuthStateChanged(auth, function(user) {
      if (user) {
        showLoading("Checking...");
        redirectUser(user, false);
      }
      // No user? Stay here. Show the button.
    });
  }
}).catch(function(error) {
  hideLoading();
  if (error.code === "auth/redirect-cancelled-by-user") {
    showError("You cancelled the login. Try again.");
  } else {
    showError("Login failed. Try again.");
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
