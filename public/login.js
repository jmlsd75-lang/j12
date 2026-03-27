import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* FIREBASE CONFIG */
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

/* ELEMENTS */
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector(".logout-btn");
const payBtn = document.querySelector(".pay-btn");
const userDisplay = document.getElementById("userDisplay");

/* LOGIN */
loginBtn.onclick = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    alert("Login failed");
  }
};

/* LOGOUT */
logoutBtn.onclick = async () => {
  await signOut(auth);
};

/* AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (user) {
    // USER INFO
    userDisplay.textContent = user.displayName;

    // SHOW BUTTONS
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    payBtn.style.display = "block";

  } else {
    // RESET
    userDisplay.textContent = "";

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    payBtn.style.display = "none";
  }
});

/* PAY ACTION */
payBtn.onclick = () => {
  alert("Go to payment page");
};
