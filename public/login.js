// login.js — Google Authentication only
// On successful login: hides LOGIN, shows FREE button
// FREE button logic lives in free.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
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

const loginBtn = document.getElementById("loginBtn");
const freeBtn = document.getElementById("freeBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.__AUTH_USER = user;
    loginBtn.classList.add("hidden");
    freeBtn.classList.remove("hidden");
  } else {
    window.__AUTH_USER = null;
    loginBtn.classList.remove("hidden");
    freeBtn.classList.add("hidden");
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
