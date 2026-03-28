import { selectedFile } from './imageUpload.js';
import { db, auth } from './firebase.js';

// Timer logic
let timerInterval = null;
function startTimer(seconds){
  clearInterval(timerInterval);
  const endTime = Date.now() + seconds*1000;
  localStorage.setItem("sessionEnd", endTime);
  timerInterval = setInterval(() => {
    const rem = Math.max(0, Math.floor((endTime - Date.now())/1000));
    if(rem<=0){ clearInterval(timerInterval); showPage("main"); }
    const hrs = Math.floor(rem/3600), mins = Math.floor((rem%3600)/60), secs = rem%60;
    document.getElementById("timerDisplay").textContent =
      `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  },1000);
}

function startTimerFromStorage(){
  const endTime = parseInt(localStorage.getItem("sessionEnd")); if(!endTime) return;
  startTimer(Math.floor((endTime-Date.now())/1000));
}

// Page navigation
function showPage(page){
  const pages = ["payPage","cameraMenuPage","previewPage","timerPage","businessPage","viewPage","transactionPage"];
  pages.forEach(p=>document.getElementById(p).style.display="none");

  if(page==="main"){ document.querySelector(".login-btn").style.display="block"; }
  else if(page==="timer"){ document.getElementById("timerPage").style.display="flex"; }
  else document.getElementById(page).style.display="flex";
}

export { showPage, startTimer, startTimerFromStorage };
