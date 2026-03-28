export function initFree() {} // for modular imports if needed

const freeBtn = document.querySelector(".free-btn");
const countdownDisplay = document.getElementById("countdown");
const businessBtn = document.querySelector(".business-btn");
const afterFree = document.getElementById("afterFree");
const longCountdown = document.getElementById("longCountdown");
const payBtn = document.getElementById("payBtn");

freeBtn.onclick = () => {
  let timer = 180; // 3 minutes
  countdownDisplay.style.display = "block";
  businessBtn.style.display = "inline-block";

  const interval = setInterval(() => {
    let minutes = Math.floor(timer/60);
    let seconds = timer%60;
    minutes = minutes <10 ? "0"+minutes : minutes;
    seconds = seconds <10 ? "0"+seconds : seconds;
    countdownDisplay.textContent = `${minutes}:${seconds}`;

    if(timer===0){
      clearInterval(interval);
      countdownDisplay.style.display = "none";
      businessBtn.style.display = "none";
      afterFree.style.display = "block";

      // 24-hour countdown
      let longTimer = 24*60*60;
      setInterval(() => {
        let hrs = Math.floor(longTimer/3600);
        let mins = Math.floor((longTimer%3600)/60);
        let secs = longTimer%60;
        hrs = hrs<10?"0"+hrs:hrs;
        mins = mins<10?"0"+mins:mins;
        secs = secs<10?"0"+secs:secs;
        longCountdown.textContent = `${hrs}:${mins}:${secs}`;
        if(longTimer>0) longTimer--;
      },1000);
    }
    timer--;
  },1000);
};

payBtn.onclick = () => alert("PAY button clicked!");
