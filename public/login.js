import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function setupLogin(app) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const loginBtn = document.getElementById("loginBtn");
  const container = document.querySelector(".container");
  const title = document.getElementById("title");

  // create logout button
  let logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) {
    logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = "Logout";
    logoutBtn.style.display = "none";
    container.appendChild(logoutBtn);
  }

  // login
  loginBtn.onclick = () => {
    signInWithRedirect(auth, provider);
  };

  // logout
  logoutBtn.onclick = () => {
    signOut(auth);
  };

  // 🔥 IMPORTANT: this controls UI correctly
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // user is logged in
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";

      title.textContent = "Welcome " + (user.displayName || "User");
    } else {
      // user is logged out
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";

      title.textContent = "JAMAL SAID KAZEMBE MULTISYSTEM MANAGEMENT";
    }
  });
}
