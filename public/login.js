import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const msg = document.getElementById("loginMsg");
const btn = document.getElementById("googleLoginBtn");

// Already logged in? Go straight to fre.html
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "fre.html";
    }
});

btn.addEventListener("click", async () => {
    btn.disabled = true;
    msg.className = "msg info";
    msg.textContent = "Connecting to Google...";
    try {
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will redirect to fre.html
    } catch (e) {
        btn.disabled = false;
        msg.className = "msg error";
        if (e.code === "auth/popup-closed-by-user") {
            msg.textContent = "Popup closed. Try again.";
        } else {
            msg.textContent = "Login failed. Try again.";
        }
    }
});
