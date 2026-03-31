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

const ADMIN_EMAIL = "jmlsd@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const statusMsg = document.getElementById("statusMsg");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email.toLowerCase();
    const name = encodeURIComponent(user.displayName || "User");
    const photo = encodeURIComponent(user.photoURL || "");
    const uid = user.uid;

    if (email === ADMIN_EMAIL) {
      window.location.replace("admin.html?admin=true&name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo + "&uid=" + uid);
    } else {
      window.location.replace("fee.html?name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo);
    }
    return;
  }

  // Not logged in — attach click to button
  loginBtn.onclick = async () => {
    loginBtn.disabled = true;
    statusMsg.textContent = "Signing in...";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email.toLowerCase();
      const name = encodeURIComponent(user.displayName || "User");
      const photo = encodeURIComponent(user.photoURL || "");
      const uid = user.uid;

      if (email === ADMIN_EMAIL) {
        statusMsg.textContent = "Admin recognized. Redirecting...";
        window.location.replace("admin.html?admin=true&name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo + "&uid=" + uid);
      } else {
        statusMsg.textContent = "Welcome. Redirecting...";
        window.location.replace("fee.html?name=" + name + "&email=" + encodeURIComponent(email) + "&photo=" + photo);
      }
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
