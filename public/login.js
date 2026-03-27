// login.js
import { auth, provider } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in successfully
      const user = result.user;
      console.log("✅ User logged in:", user.displayName, user.email);
      
      // Redirect to your system page or Firestore dashboard
      window.location.href = 'dashboard.html'; // create this page for your system
    })
    .catch((error) => {
      console.error("❌ Login failed:", error);
      alert("Login failed! Check console for details.");
    });
});
