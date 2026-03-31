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

// ======================
// Firebase Config
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const ADMIN_EMAIL = "jmlsd75@gmail.com";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ======================
// Save session info
// ======================
function saveSession(user) {
  const isAdminUser = user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  sessionStorage.setItem("userName", user.displayName || "User");
  sessionStorage.setItem("userEmail", user.email || "");
  sessionStorage.setItem("userUid", user.uid || "");
  sessionStorage.setItem("isAdmin", isAdminUser.toString());
  return isAdminUser;
}

// ======================
// Save login to Firestore
// ======================
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
    console.warn("Firestore error:", e);
  }
}

// ======================
// Redirect user based on role
// ======================
function redirectUser(isAdmin) {
  if (isAdmin) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "free.html";
  }
}

// ======================
// Trigger login
// ======================
function login() {
  signInWithRedirect(auth, provider);
}

// ======================
// Handle redirect result
// ======================
getRedirectResult(auth)
  .then(async (result) => {
    if (result && result.user) {
      const user = result.user;
      const isAdmin = saveSession(user);
      await saveLoginToFirestore(user);
      redirectUser(isAdmin);
    }
  })
  .catch((error) => {
    console.error("Redirect error:", error);
    alert("Login failed: " + error.message);
  });

// Expose login function globally (for inline button if needed)
window.login = login;

// Attach click listener to button
document.getElementById("googleLoginBtn").addEventListener("click", login);
