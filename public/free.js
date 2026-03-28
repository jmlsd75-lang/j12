const freeContainer = document.getElementById("freeContainer");

// FREE message
const freeMessage = document.createElement("p");
freeMessage.textContent = "Click Free to start using the system";
freeMessage.style.marginBottom = "10px";
freeMessage.style.fontSize = "16px";
freeMessage.style.color = "#333";

// FREE button
const freeBtn = document.createElement("button");
freeBtn.textContent = "FREE";
freeBtn.className = "free-btn";

// Append to container
freeContainer.appendChild(freeMessage);
freeContainer.appendChild(freeBtn);

// Countdown: 180 seconds
const COUNTDOWN_SECONDS = 180;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function showCountdown(endTimestamp) {
  // Hide FREE and LOGOUT
  document.querySelector(".logout-btn")?.style.display = "none";
  freeBtn.style.display = "none";
  freeMessage.style.display = "none";

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
  businessBtn.className = "business-btn";
  freeContainer.appendChild(businessBtn);

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

  businessBtn.onclick = () => alert("Business system activated!");
}

// Persistent countdown
const savedEnd = localStorage.getItem("freeCountdownEnd");
if (savedEnd && Number(savedEnd) > Date.now()) showCountdown(Number(savedEnd));

// Click FREE button
freeBtn.onclick = () => {
  const endTimestamp = Date.now() + COUNTDOWN_SECONDS * 1000;
  localStorage.setItem("freeCountdownEnd", endTimestamp);
  showCountdown(endTimestamp);
};
