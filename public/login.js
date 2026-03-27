// free.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const freeBtn = document.querySelector(".free-btn");
const businessBtn = document.getElementById("business-btn");
const waitDiv = document.getElementById("waitDiv");

// Countdown functions
function start3MinCountdown(endTime) {
  freeBtn.disabled = true;
  businessBtn.style.display = "block";

  const timer = setInterval(() => {
    let timeLeft = Math.floor((endTime - Date.now()) / 1000);
    if(timeLeft <= 0) timeLeft = 0;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    freeBtn.textContent = `${minutes}:${seconds.toString().padStart(2,'0')}`;

    if(timeLeft <= 0) {
      clearInterval(timer);
      freeBtn.style.display = "none";
      businessBtn.style.display = "none";
      waitDiv.style.display = "block";

      const waitEndTime = Date.now() + 24*60*60*1000; // 24 hours
      localStorage.setItem("waitEnd", waitEndTime);
      start24HourCountdown(waitEndTime);
    }
  }, 1000);
}

function start24HourCountdown(endTime) {
  const timer = setInterval(() => {
    let timeLeft = Math.floor((endTime - Date.now()) / 1000);
    if(timeLeft <= 0) timeLeft = 0;

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600)/60);
    const seconds = timeLeft % 60;

    waitDiv.textContent = `WAIT: ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

    if(timeLeft <= 0) {
      clearInterval(timer);
      waitDiv.style.display = "none";
      freeBtn.textContent = "FREE";
      freeBtn.disabled = false;
      freeBtn.style.display = "block";
      localStorage.removeItem("waitEnd");
      localStorage.removeItem("freeEnd");
    }
  }, 1000);
}

// FREE button click
freeBtn.addEventListener("click", () => {
  const endTime = Date.now() + 3*60*1000; // 3 minutes
  localStorage.setItem("freeEnd", endTime);
  start3MinCountdown(endTime);
});

// Restore timers after login
function restoreTimers() {
  const freeEnd = localStorage.getItem("freeEnd");
  const waitEnd = localStorage.getItem("waitEnd");

  if(freeEnd && Date.now() < freeEnd) {
    freeBtn.style.display = "block";
    start3MinCountdown(Number(freeEnd));
  } else if(waitEnd && Date.now() < waitEnd) {
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
  if(user) {
    restoreTimers();
  } else {
    freeBtn.style.display = "none";
    businessBtn.style.display = "none";
    waitDiv.style.display = "none";
  }
});
