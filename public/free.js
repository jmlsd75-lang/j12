import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);

const freeBtn = document.querySelector(".free-btn");
const businessBtn = document.getElementById("business-btn");
const waitDiv = document.getElementById("waitDiv");

let t1, t2;

/* FORMAT TIME */
function format(h,m,s){
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

/* 3 MIN */
function start3min(end){
  clearInterval(t1);

  freeBtn.style.display="none";
  waitDiv.style.display="none";
  businessBtn.style.display="block";

  t1 = setInterval(()=>{
    let s = Math.floor((end - Date.now())/1000);
    if(s<0) s=0;

    let m = Math.floor(s/60);
    let sec = s%60;

    businessBtn.textContent = `BUSINESS ${m}:${sec.toString().padStart(2,'0')}`;

    if(s===0){
      clearInterval(t1);

      businessBtn.style.display="none";
      waitDiv.style.display="block";

      let waitEnd = Date.now()+86400000;
      localStorage.setItem("waitEnd",waitEnd);

      start24h(waitEnd);
    }
  },1000);
}

/* 24 H */
function start24h(end){
  clearInterval(t2);

  t2 = setInterval(()=>{
    let s = Math.floor((end - Date.now())/1000);
    if(s<0) s=0;

    let h = Math.floor(s/3600);
    let m = Math.floor((s%3600)/60);
    let sec = s%60;

    waitDiv.textContent = "WAIT "+format(h,m,sec);

    if(s===0){
      clearInterval(t2);

      waitDiv.style.display="none";
      freeBtn.style.display="block";

      localStorage.clear();
    }
  },1000);
}

/* CLICK FREE */
freeBtn.onclick = ()=>{
  let end = Date.now()+180000;
  localStorage.setItem("freeEnd",end);
  start3min(end);
};

/* RESTORE */
function restore(){
  let freeEnd = localStorage.getItem("freeEnd");
  let waitEnd = localStorage.getItem("waitEnd");

  if(freeEnd && Date.now()<freeEnd){
    start3min(Number(freeEnd));
  }
  else if(waitEnd && Date.now()<waitEnd){
    freeBtn.style.display="none";
    businessBtn.style.display="none";
    waitDiv.style.display="block";
    start24h(Number(waitEnd));
  }
  else{
    freeBtn.style.display="block";
    businessBtn.style.display="none";
    waitDiv.style.display="none";
  }
}

/* AUTH */
onAuthStateChanged(auth,(user)=>{
  if(user) restore();
  else{
    freeBtn.style.display="none";
    businessBtn.style.display="none";
    waitDiv.style.display="none";
  }
});
