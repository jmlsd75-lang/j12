// free.js
const freeContainer = document.getElementById("freeContainer");

// Create FREE message
const freeMessage = document.createElement("p");
freeMessage.textContent = "Click 'Free' to start using the system";
freeMessage.id = "freeMessage";
freeMessage.style.marginBottom = "10px";
freeMessage.style.fontSize = "16px";
freeMessage.style.color = "#333";

// Create FREE button
const freeBtn = document.createElement("button");
freeBtn.textContent = "FREE";
freeBtn.className = "free-btn";
freeBtn.style.padding = "15px 40px";
freeBtn.style.fontSize = "20px";
freeBtn.style.border = "none";
freeBtn.style.borderRadius = "8px";
freeBtn.style.cursor = "pointer";
freeBtn.style.color = "white";
freeBtn.style.background = "#007bff";
freeBtn.style.marginTop = "10px";

// Append message and button to container
freeContainer.appendChild(freeMessage);
freeContainer.appendChild(freeBtn);

// ------------------ Click FREE button ------------------
freeBtn.onclick = () => {
  // Remove FREE button and message
  freeBtn.remove();
  freeMessage.remove();

  // Create countdown element
  const countdown = document.createElement("p");
  countdown.id = "countdown";
  countdown.style.fontSize = "18px";
  countdown.style.color = "green";
  countdown.style.marginBottom = "15px";
  freeContainer.appendChild(countdown);

  // Create Business button
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

  // Countdown logic: 10 seconds
  let timeLeft = 10;
  countdown.textContent = `Time left: ${timeLeft}s`;

  const timer = setInterval(() => {
    timeLeft--;
    countdown.textContent = `Time left: ${timeLeft}s`;
    if(timeLeft <= 0){
      clearInterval(timer);
      countdown.textContent = "Time's up!";
      businessBtn.disabled = true; // Disable business button when countdown ends
      businessBtn.style.opacity = "0.5";
    }
  }, 1000);

  // Optional: Business button click
  businessBtn.onclick = () => {
    alert("Business system activated!");
  };
};
