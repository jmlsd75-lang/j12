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
const freeBtn = document.querySelector(".free-btn");
const headerH1 = document.querySelector("header h1");
const loginMessage = document.getElementById("loginMessage");

onAuthStateChanged(auth, (user) => {
  if(user){
    headerH1.textContent = `Welcome, ${user.displayName}`;
    loginMessage.style.display = "none";
    loginBtn.style.display = "none";
    freeBtn.style.display = "block";
    logoutBtn.style.display = "block";
    document.getElementById("userDisplay").style.display = "block";
  } else {
    headerH1.textContent = "JAMAL SAID KAZEMBE";
    loginMessage.style.display = "block";
    loginBtn.style.display = "block";
    freeBtn.style.display = "none";
    logoutBtn.style.display = "none";
    document.getElementById("userDisplay").style.display = "none";
  }
});

loginBtn.onclick = async () => { 
  try { await signInWithPopup(auth, provider); } 
  catch(e){ alert("Login failed."); } 
};
logoutBtn.onclick = async () => { 
  try { await signOut(auth); alert("Logged out successfully."); } 
  catch(e){ console.error(e); } 
};
