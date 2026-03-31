// ============================================
// login.js
// ============================================

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

// ============================================
// FIREBASE CONFIG
// ============================================
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

// ============================================
// HELPER FUNCTIONS
// ============================================
function saveSession(user) {
  const isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userPhoto", user.photoURL || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", isAdminUser.toString());

  return isAdminUser;
}

function redirectUser(isAdmin) {
  if (isAdmin) {
    // Redirect admin to admin.js
    window.location.href = "admin.js";
  } else {
    // Redirect regular user to free.js
    window.location.href = "free.js";
  }
}

async function saveLoginToFirestore(user) {
  try {
    const isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    await addDoc(collection(db, "users", user.uid, "logins"), {
      name: user.displayName,
      email: user.email,
      role: isAdminUser ? "admin" : "free",
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Error saving login to Firestore:", e);
  }
}

// ============================================
// LOGIN FLOW
// ============================================
async function login() {
  try {
    // Step 1: Sign in with redirect
    await signInWithRedirect(auth, provider);
    // After redirect, user comes back to this page
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again.");
  }
}

// ============================================
// CHECK REDIRECT RESULT (after Google login)
// ============================================
getRedirectResult(auth).then(async (result) => {
  if (result && result.user) {
    const user = result.user;

    // Save session
    const isAdmin = saveSession(user);

    // Save login to Firestore
    saveLoginToFirestore(user);

    // Redirect user based on role
    redirectUser(isAdmin);
  }
}).catch((error) => {
  console.error("Redirect result error:", error);
  alert("Login error: " + error.message);
});

// ============================================
// EXPORT FUNCTION FOR BUTTON CLICK
// ============================================
window.login = login;
