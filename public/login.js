import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Put your exact admin email here
const ADMIN_EMAIL = "jmlsd75@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const statusMsg = document.getElementById("statusMsg");

let redirected = false;

function safeRedirect(url) {
  if (redirected) return;
  redirected = true;
  window.location.replace(url);
}

function checkAndRedirect(user) {
  if (!user || !user.email) return;

  var emailRaw = user.email.trim();
  var email = emailRaw.toLowerCase();
  var isAdmin = (email === ADMIN_EMAIL.toLowerCase());

  console.log("Logged in email:", email);
  console.log("Admin email:", ADMIN_EMAIL.toLowerCase());
  console.log("Is admin?", isAdmin);

  var name = encodeURIComponent(user.displayName || "User");
  var photo = encodeURIComponent(user.photoURL || "");

  if (isAdmin) {
    safeRedirect("admin.html?admin=true&name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo + "&uid=" + user.uid);
  } else {
    safeRedirect("fee.html?name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    checkAndRedirect(user);
    return;
  }

  loginBtn.onclick = async () => {
    loginBtn.disabled = true;
    statusMsg.textContent = "Signing in...";

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      loginBtn.disabled = false;
      if (error.code === "auth/popup-closed-by-user") {
        statusMsg.textContent = "Sign-in cancelled.";
      } else {
        statusMsg.textContent = "Login failed. Try again.";
      }
    }
  };
});
