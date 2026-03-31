// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.appspot.com",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM element
const loginBtn = document.getElementById("loginBtn");

// Function to redirect based on email
function redirectUser(email) {
    if(email === "jmlsd75@gmail.com") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "free.html";
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    if(user) {
        sessionStorage.setItem("userName", user.displayName || "User");
        sessionStorage.setItem("userEmail", user.email || "");
        sessionStorage.setItem("userUid", user.uid || "");
        redirectUser(user.email);
    }
});

// Handle redirect result (first login)
getRedirectResult(auth)
    .then((result) => {
        if(result && result.user) {
            const user = result.user;
            sessionStorage.setItem("userName", user.displayName || "User");
            sessionStorage.setItem("userEmail", user.email || "");
            sessionStorage.setItem("userUid", user.uid || "");
            redirectUser(user.email);
        }
    })
    .catch((error) => {
        console.error("Login error:", error.code, error.message);
        loginBtn.disabled = false;
        loginBtn.textContent = "Login with Google";
    });

// Login button click
loginBtn.addEventListener("click", () => {
    loginBtn.disabled = true;
    loginBtn.textContent = "Redirecting...";
    signInWithRedirect(auth, provider);
});
