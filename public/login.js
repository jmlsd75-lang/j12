// login.js
import { auth, provider } from './firebase.js';

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("✅ User logged in:", user.displayName, user.email);

      // Redirect to dashboard after login
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      console.error("❌ Login failed:", error);
      alert("Login failed! Check console for details.");
    });
});
