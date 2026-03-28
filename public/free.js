// free.js
const freeContainer = document.getElementById("freeContainer");

// Create FREE message
const freeMessage = document.createElement("p");
freeMessage.textContent = "Click 'Free' to start using the system";
freeMessage.style.marginBottom = "10px";
freeMessage.style.fontSize = "16px";
freeMessage.style.color = "#333";

// Create FREE button
const freeBtn = document.createElement("button");
freeBtn.textContent = "FREE";
freeBtn.style.padding = "15px 40px";
freeBtn.style.fontSize = "20px";
freeBtn.style.border = "none";
freeBtn.style.borderRadius = "8px";
freeBtn.style.cursor = "pointer";
freeBtn.style.color = "white";
freeBtn.style.background = "#007bff";
freeBtn.style.marginTop = "10px";

// Append FREE message and button
freeContainer.appendChild(freeMessage);
freeContainer.appendChild(freeBtn);

const COUNTDOWN_SECONDS = 10;

// Function to show countdown + Business button
function showCountdown(endTimestamp) {
  // Hide FREE message/button and LOGOUT button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) logoutBtn.style.display = "none";
  freeBtn.style.display = "none";
  freeMessage.style.display = "none";

  // Clear container
  freeContainer.innerHTML = "";

  // Countdown element
  const countdown = document.createElement("p");
  countdown.id = "countdown";
  countdown.style.fontSize = "24px";
  countdown.style.color = "green";
  countdown.style.marginBottom = "20px";
  countdown.style.fontWeight = "bold";
  freeContainer.appendChild(countdown);

  // Business button (appears only now)
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

  // Countdown logic
  function updateCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimestamp - now)/1000));
    countdown.textContent = remaining > 0 ? `Time left: ${remaining}s` : "Time's up!";

    if (remaining <= 0) {
      businessBtn.disabled = true;
      businessBtn.style.opacity = "0.5";
      clearInterval(timer);
    }
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  // Business button click
  businessBtn.onclick = () => {
    alert("Business system activated!");
  };
}

// Persistent countdown across reloads
const savedEnd = localStorage.getItem("freeCountdownEnd");
if (savedEnd && Number(savedEnd) > Date.now()) {
  showCountdown(Number(savedEnd));
}

// Click FREE button
freeBtn.onclick = () => {
  const endTimestamp = Date.now() + COUNTDOWN_SECONDS * 1000;
  localStorage.setItem("freeCountdownEnd", endTimestamp);
  showCountdown(endTimestamp);
};
