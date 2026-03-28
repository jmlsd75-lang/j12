const freeContainer = document.getElementById("freeContainer");

// ------------------ FREE message ------------------
const freeMessage = document.createElement("p");
freeMessage.textContent = "Click Free to start using the system"; // no quotes
freeMessage.style.marginBottom = "10px";
freeMessage.style.fontSize = "16px";
freeMessage.style.color = "#333";

// ------------------ FREE button ------------------
const freeBtn = document.createElement("button");
freeBtn.textContent = "FREE";
freeBtn.style.padding = "15px 40px";
freeBtn.style.fontSize = "20px";
freeBtn.style.border = "none";
freeBtn.style.borderRadius = "8px";
freeBtn.style.cursor = "pointer";
freeBtn.style.color = "white";
freeBtn.style.background = "#007bff"; // BLUE
freeBtn.style.marginTop = "10px";

// Append to container
freeContainer.appendChild(freeMessage);
freeContainer.appendChild(freeBtn);

// ------------------ Countdown setup ------------------
const COUNTDOWN_SECONDS = 180;

// Format MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ------------------ Show countdown + BUSINESS button ------------------
function showCountdown(endTimestamp) {
  // Hide FREE message/button & logout
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) logoutBtn.style.display = "none";
  freeBtn.style.display = "none";
  freeMessage.style.display = "none";

  // Clear container
  freeContainer.innerHTML = "";

  // Countdown display
  const countdown = document.createElement("p");
  countdown.id = "countdown";
  countdown.style.fontSize = "24px";
  countdown.style.color = "green";
  countdown.style.marginBottom = "20px";
  countdown.style.fontWeight = "bold";
  freeContainer.appendChild(countdown);

  // BUSINESS button
  const businessBtn = document.createElement("button");
  businessBtn.textContent = "BUSINESS";
  businessBtn.style.padding = "15px 40px";
  businessBtn.style.fontSize = "20px";
  businessBtn.style.border = "none";
  businessBtn.style.borderRadius = "8px";
  businessBtn.style.cursor = "pointer";
  businessBtn.style.color = "white";
  businessBtn.style.background = "#ff6600";
  freeContainer.appendChild(businessBtn);

  // Update countdown every second
  function updateCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimestamp - now) / 1000));
    countdown.textContent = remaining > 0 ? `Time left: ${formatTime(remaining)}` : "Time's up!";

    if (remaining <= 0) {
      businessBtn.disabled = true;
      businessBtn.style.opacity = "0.5";
      clearInterval(timer);
    }
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // BUSINESS button click
  businessBtn.onclick = () => alert("Business system activated!");
}

// ------------------ Persistent countdown ------------------
const savedEnd = localStorage.getItem("freeCountdownEnd");
if (savedEnd && Number(savedEnd) > Date.now()) {
  showCountdown(Number(savedEnd));
}

// ------------------ FREE button click ------------------
freeBtn.onclick = () => {
  const endTimestamp = Date.now() + COUNTDOWN_SECONDS * 1000;
  localStorage.setItem("freeCountdownEnd", endTimestamp);
  showCountdown(endTimestamp);
};
