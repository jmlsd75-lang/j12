// free.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

// Existing code for freeBtn, businessBtn, waitDiv, start3MinCountdown, start24HourCountdown…

// Function to restore timers
function restoreTimers() {
  let freeEnd = localStorage.getItem("freeEnd");
  let waitEnd = localStorage.getItem("waitEnd");

  if (freeEnd && Date.now() < freeEnd) {
    freeBtn.style.display = "block";
    start3MinCountdown(Number(freeEnd));
  } else if (waitEnd && Date.now() < waitEnd) {
    freeBtn.style.display = "none";
    waitDiv.style.display = "block";
    start24HourCountdown(Number(waitEnd));
  } else {
    freeBtn.style.display = "block";
    businessBtn.style.display = "none";
    waitDiv.style.display = "none";
  }
}

// Only restore/start countdown after login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // user is logged in
    restoreTimers();
  } else {
    // logged out
    freeBtn.style.display = "none";
    businessBtn.style.display = "none";
    waitDiv.style.display = "none";
  }
});
