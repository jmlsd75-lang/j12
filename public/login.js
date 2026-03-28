// 1. Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 2. Import Free Logic
import { handleFree } from './free.js';

// 3. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// 4. Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 5. DOM Elements (MATCH HTML IDs ✅)
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const freeBtn = document.getElementById('freeBtn');
const bottomControls = document.getElementById('bottomControls');

// 6. LOGIN
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed");
    }
});

// 7. LOGOUT
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
});

// 8. FREE BUTTON
freeBtn.addEventListener('click', handleFree);

// 9. AUTH STATE
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in:", user.displayName);

        // Hide login
        loginBtn.classList.add("hidden");

        // Show FREE + LOGOUT
        bottomControls.classList.remove("hidden");

    } else {
        console.log("Logged out");

        // Show login
        loginBtn.classList.remove("hidden");

        // Hide controls
        bottomControls.classList.add("hidden");
    }
});
