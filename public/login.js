// login.js

// 1. Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 2. Import Free Button Function
import { handleFree } from './free.js';

// 3. Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// 4. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 5. DOM Elements
const loginBtn = document.querySelector('.login-btn');
const logoutBtn = document.querySelector('.logout-btn');

// Create "Free" button dynamically (since it wasn't in your original HTML)
const freeBtn = document.createElement('button');
freeBtn.textContent = 'FREE';
freeBtn.className = 'free-btn'; 
freeBtn.style.cssText = 'padding:15px 40px; font-size:20px; background:#ffc107; color:black; border:none; border-radius:6px; cursor:pointer; position:fixed; bottom:30px; left:50%; transform:translateX(-120%); display:none;'; // Position left of center
document.body.appendChild(freeBtn);

// Position Logout button to the right of center
logoutBtn.style.transform = 'translateX(20%)'; 

// 6. Authentication State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User logged in:", user.displayName);
        
        // Hide Login
        loginBtn.style.display = 'none';
        
        // Show Logout and Free buttons
        logoutBtn.style.display = 'block';
        freeBtn.style.display = 'block';
        
    } else {
        // User is signed out
        console.log("User logged out");
        
        // Show Login
        loginBtn.style.display = 'block';
        
        // Hide Logout and Free buttons
        logoutBtn.style.display = 'none';
        freeBtn.style.display = 'none';
    }
});

// 7. Login Click Handler
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
        // The page will automatically update via onAuthStateChanged above
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed. Please try again.");
    }
});

// 8. Logout Click Handler
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // The page will automatically update via onAuthStateChanged above
    } catch (error) {
        console.error("Logout Error:", error);
    }
});

// 9. Free Button Click Handler
freeBtn.addEventListener('click', handleFree);
