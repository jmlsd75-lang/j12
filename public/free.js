// ========================================
// DOM ELEMENTS
// ========================================
const kiliPhase = document.getElementById("kilimanjaroPhase");
const giraffePhase = document.getElementById("giraffePhase");
const kiliTimerEl = document.getElementById("kiliTimer");
const awaitTimerEl = document.getElementById("awaitTimer");
const menuBtnKili = document.getElementById("menuBtnKili");

// ========================================
// CONSTANTS
// ========================================
const FREE_SECONDS = 180;          // 3 minutes free session
const AWAIT_SECONDS = 86400;       // 24 hours await
const FREE_KEY = "freeEndTime";    // localStorage key for free countdown
const AWAIT_KEY = "awaitEndTime";  // localStorage key for await countdown

// ========================================
// STATE
// ========================================
let kiliInterval = null;
let awaitInterval = null;

// ========================================
// FORMAT SECONDS → HH:MM:SS
// ========================================
function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return String(hrs).padStart(2, "0") + ":" +
         String(mins).padStart(2, "0") + ":" +
         String(secs).padStart(2, "0");
}

// ========================================
// PHASE 1: KILIMANJARO FREE COUNTDOWN
// ========================================
function startFreeCountdown() {
  // Calculate end time — use stored value or set new one
  let endTime = parseInt(localStorage.getItem(FREE_KEY));
  if (!endTime || endTime <= Date.now()) {
    endTime = Date.now() + FREE_SECONDS * 1000;
    localStorage.setItem(FREE_KEY, String(endTime));
  }

  // Show Kilimanjaro phase
  kiliPhase.style.display = "flex";
  giraffePhase.style.display = "none";

  // Clear any existing interval
  clearInterval(kiliInterval);

  // Update every second
  kiliInterval = setInterval(() => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    kiliTimerEl.textContent = formatTime(remaining);

    if (remaining <= 0) {
      // FREE COUNTDOWN FINISHED
      clearInterval(kiliInterval);
      localStorage.removeItem(FREE_KEY);

      // Transition to Phase 2: Giraffe Await
      switchToAwait();
    }
  }, 1000);

  // Show current value immediately
  const initialRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  kiliTimerEl.textContent = formatTime(initialRemaining);
}

// ========================================
// PHASE 2: GIRAFFE AWAIT (24 HOURS)
// ========================================
function switchToAwait() {
  // Set await end time
  const awaitEnd = Date.now() + AWAIT_SECONDS * 1000;
  localStorage.setItem(AWAIT_KEY, String(awaitEnd));

  // Animate transition
  kiliPhase.classList.add("phase-out");

  setTimeout(() => {
    kiliPhase.style.display = "none";
    kiliPhase.classList.remove("phase-out");

    giraffePhase.style.display = "flex";
    giraffePhase.classList.add("phase-in");

    setTimeout(() => giraffePhase.classList.remove("phase-in"), 600);

    // Start await countdown
    startAwaitCountdown(awaitEnd);
  }, 500);
}

function startAwaitCountdown(endTime) {
  clearInterval(awaitInterval);

  awaitInterval = setInterval(() => {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    awaitTimerEl.textContent = formatTime(remaining);

    if (remaining <= 0) {
      // 24 HOURS FINISHED — free is available again
      clearInterval(awaitInterval);
      localStorage.removeItem(AWAIT_KEY);

      // Go back to index.html — PAY will show again as normal
      window.location.href = "index.html";
    }
  }, 1000);

  // Show immediately
  const initialRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  awaitTimerEl.textContent = formatTime(initialRemaining);
}

// ========================================
// MENU BUTTON — GO BACK TO INDEX
// (Cancels free session)
// ========================================
menuBtnKili.addEventListener("click", () => {
  clearInterval(kiliInterval);
  localStorage.removeItem(FREE_KEY);
  window.location.href = "index.html";
});

// ========================================
// ON PAGE LOAD — DECIDE WHICH PHASE TO SHOW
// ========================================
function init() {
  const freeEnd = parseInt(localStorage.getItem(FREE_KEY));
  const awaitEnd = parseInt(localStorage.getItem(AWAIT_KEY));
  const now = Date.now();

  if (freeEnd && freeEnd > now) {
    // Free countdown still running — show Kilimanjaro
    startFreeCountdown();
  } else if (awaitEnd && awaitEnd > now) {
    // Await period still running — show Giraffe directly
    kiliPhase.style.display = "none";
    giraffePhase.style.display = "flex";
    startAwaitCountdown(awaitEnd);
  } else {
    // Nothing active — start fresh free countdown
    localStorage.removeItem(FREE_KEY);
    localStorage.removeItem(AWAIT_KEY);
    startFreeCountdown();
  }
}

init();
