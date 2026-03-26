import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function setupLogin(app) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const btn = document.getElementById("loginBtn");

  // create logout button
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.style.display = "none";
  document.querySelector(".container").appendChild(logoutBtn);

  // click login
  btn.onclick = () => {
    signInWithRedirect(auth, provider);
  };

  // click logout
  logoutBtn.onclick = () => {
    signOut(auth);
  };

  // after redirect (login)
  getRedirectResult(auth).catch(console.error);

  // track user state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // logged in
      btn.style.display = "none";
      logoutBtn.style.display = "inline-block";

      document.querySelector("header h1").textContent =
        "Welcome " + user.displayName;
    } else {
      // logged out
      btn.style.display = "inline-block";
      logoutBtn.style.display = "none";

      document.querySelector("header h1").textContent =
        "JAMAL SAID KAZEMBE";
    }
  });
}
