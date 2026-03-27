import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();
const freeBtn = document.querySelector(".free-btn");
const businessBtn = document.getElementById("business-btn");
const waitDiv = document.getElementById("waitDiv");

/* 3-min countdown */
function start3MinCountdown(endTime){
  freeBtn.disabled = true;
  businessBtn.style.display = "block";

  const timer = setInterval(()=>{
    let timeLeft = Math.floor((endTime - Date.now())/1000);
    if(timeLeft<=0) timeLeft=0;

    const min = Math.floor(timeLeft/60);
    const sec = timeLeft%60;
    freeBtn.textContent = `${min}:${sec.toString().padStart(2,'0')}`;

    if(timeLeft<=0){
      clearInterval(timer);
      freeBtn.style.display="none";
      businessBtn.style.display="none";
      waitDiv.style.display="block";

      const waitEnd = Date.now() + 24*60*60*1000;
      localStorage.setItem("waitEnd", waitEnd);
      start24HourCountdown(waitEnd);
    }
  },1000);
}

/* 24-hour countdown */
function start24HourCountdown(endTime){
  const timer = setInterval(()=>{
    let timeLeft = Math.floor((endTime - Date.now())/1000);
    if(timeLeft<=0) timeLeft=0;

    const h = Math.floor(timeLeft/3600);
    const m = Math.floor((timeLeft%3600)/60);
    const s = timeLeft%60;

    waitDiv.textContent = `WAIT: ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

    if(timeLeft<=0){
      clearInterval(timer);
      waitDiv.style.display="none";
      freeBtn.textContent="FREE";
      freeBtn.disabled=false;
      freeBtn.style.display="block";
      localStorage.removeItem("waitEnd");
      localStorage.removeItem("freeEnd");
    }
  },1000);
}

/* FREE click */
freeBtn.addEventListener("click",()=>{
  const endTime = Date.now() + 3*60*1000;
  localStorage.setItem("freeEnd", endTime);
  start3MinCountdown(endTime);
});

/* Restore timers after login */
function restoreTimers(){
  const freeEnd = localStorage.getItem("freeEnd");
  const waitEnd = localStorage.getItem("waitEnd");

  if(freeEnd && Date.now() < freeEnd){
    freeBtn.style.display="block";
    start3MinCountdown(Number(freeEnd));
  } else if(waitEnd && Date.now() < waitEnd){
    freeBtn.style.display="none";
    waitDiv.style.display="block";
    start24HourCountdown(Number(waitEnd));
  } else {
    freeBtn.style.display="block";
    freeBtn.disabled=false;
    businessBtn.style.display="none";
    waitDiv.style.display="none";
  }
}

onAuthStateChanged(auth,(user)=>{
  if(user){
    restoreTimers();
  } else {
    freeBtn.style.display="none";
    businessBtn.style.display="none";
    waitDiv.style.display="none";
  }
});
