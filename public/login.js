import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function setupLogin(app) {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const title = document.getElementById("title");

  // 🔥 LOGIN (popup - no redirect errors)
  loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("✅ Login:", result.user.displayName);
      })
      .catch((error) => {
        console.error("❌ Error:", error);
      });
  });

  // 🔥 LOGOUT
  logoutBtn.addEventListener("click", () => {
    signOut(auth);
  });

  // 🔥 AUTH STATE (controls UI)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      title.textContent = "Welcome " + (user.displayName || "User");
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      title.textContent = "JAMAL SAID KAZEMBE MULTISYSTEM MANAGEMENT";
    }
  });
}
