import { app } from "./firebase-config.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const freeBtn = document.querySelector(".free-btn");
const userDisplay = document.getElementById("userDisplay");

/* LOGIN */
loginBtn.onclick = () => signInWithRedirect(auth, provider);

/* REDIRECT RESULT */
getRedirectResult(auth).catch(console.error);

/* LOGOUT */
logoutBtn.onclick = () => signOut(auth);

/* STATE */
onAuthStateChanged(auth, (user)=>{
  if(user){
    userDisplay.textContent = user.displayName || user.email;
    loginBtn.style.display="none";
    logoutBtn.style.display="block";
    freeBtn.style.display="block";
  }else{
    userDisplay.textContent="";
    loginBtn.style.display="block";
    logoutBtn.style.display="none";
    freeBtn.style.display="none";
  }
});
