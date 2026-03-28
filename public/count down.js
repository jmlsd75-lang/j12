// DOM elements for countdown & business
const countdownDisplay = document.getElementById("countdown");
const businessBtn = document.querySelector(".business-btn");
const afterFree = document.getElementById("afterFree");
const longCountdown = document.getElementById("longCountdown");
const payBtn = document.getElementById("payBtn");

// Function to start 3-min FREE countdown
function startFreeCountdown(duration) {
  let timer = duration;
  countdownDisplay.style.display = "block";
  businessBtn.style.display = "inline-block";

  const interval = setInterval(() => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    countdownDisplay.textContent = `${minutes}:${seconds}`;

    if (timer === 0) {
      clearInterval(interval);
      countdownDisplay.style.display = "none";
      businessBtn.style.display = "none";

      // Show 24-hour countdown + Pay button
      afterFree.style.display = "block";

      // Start 24-hour countdown visually
      let longTimer = 24 * 60 * 60; // 24 hours in seconds
      setInterval(() => {
        let hrs = Math.floor(longTimer / 3600);
        let mins = Math.floor((longTimer % 3600) / 60);
        let secs = longTimer % 60;

        hrs = hrs < 10 ? "0" + hrs : hrs;
        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;

        longCountdown.textContent = `${hrs}:${mins}:${secs}`;
        if (longTimer > 0) longTimer--;
      }, 1000);
    }

    timer--;
  }, 1000);
}

// Link FREE button
freeBtn.onclick = () => {
  startFreeCountdown(180); // 3 minutes
};

// PAY button logic (replace with your code)
payBtn.onclick = () => {
  alert("PAY button clicked!");
};
