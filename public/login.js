import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const ADMIN_EMAIL = "camelkazembe1@gmail.com";
let isAdmin = false;

const loginBtn = document.getElementById("loginBtn");
const bottomControls = document.getElementById("bottomControls");
const freeBtn = document.getElementById("freeBtn");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin = user.email === ADMIN_EMAIL;
    window.__AUTH_USER = user;
    window.__IS_ADMIN = isAdmin;

    loginBtn.classList.add("hidden");
    bottomControls.classList.remove("hidden");
  } else {
    isAdmin = false;
    window.__AUTH_USER = null;
    window.__IS_ADMIN = false;

    loginBtn.classList.remove("hidden");
    bottomControls.classList.add("hidden");
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (error.code !== "auth/popup-closed-by-user") {
      console.error("Login failed:", error);
    }
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    localStorage.removeItem("sessionEnd");
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
});
