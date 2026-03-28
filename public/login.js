import { auth, provider, ADMIN_EMAIL } from './firebase.js';
import { showPage, startTimerFromStorage } from './payment.js';

const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const accessBtn = document.querySelector(".access-btn");
const userDisplay = document.getElementById("userDisplay");

let isAdmin = false;

loginBtn.onclick = async () => {
  try { await auth.signInWithPopup(provider); } 
  catch (e) { alert("Login failed"); }
};

logoutBtn.onclick = async () => {
  localStorage.removeItem("sessionEnd");
  await auth.signOut();
  showPage("main");
};

accessBtn.onclick = () => {
  startTimerFromStorage();
  showPage("timer");
};

auth.onAuthStateChanged(user => {
  if(user){
    isAdmin = user.email === ADMIN_EMAIL;
    userDisplay.textContent = user.displayName;
    if(isAdmin){
      userDisplay.style.display = "block";
      showPage("timer");
    } else {
      showPage("main");
    }
  } else {
    isAdmin = false;
    userDisplay.style.display = "none";
    loginBtn.style.display = "block";
  }
});

export { isAdmin };
