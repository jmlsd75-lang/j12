import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function setupLogin(app) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const btn = document.getElementById("loginBtn");

  // click → go to Google
  btn.onclick = () => {
    signInWithRedirect(auth, provider);
  };

  // after redirect → show name
  getRedirectResult(auth).then((result) => {
    if (result?.user) {
      document.body.innerHTML = `
        <h1 style="text-align:center; margin-top:50px;">
          Welcome ${result.user.displayName}
        </h1>
      `;
    }
  }).catch(console.error);
}
