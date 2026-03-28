import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const headerName = document.getElementById("headerName");

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    headerName.textContent = `Welcome, ${user.displayName}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    headerName.textContent = "JAMAL SAID KAZEMBE";
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});

// Login & Logout
loginBtn.onclick = async () => { try { await signInWithPopup(auth, provider); } catch { alert("Login failed"); } };
logoutBtn.onclick = async () => { try { await signOut(auth); location.reload(); } catch { console.error(); } };
