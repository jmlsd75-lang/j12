import { showPage, startTimer } from './payment.js';

const cameraInput = document.getElementById("cameraInput");
const photosInput = document.getElementById("photosInput");
const previewImage = document.getElementById("previewImage");
let selectedFile = null;

cameraInput.onchange = e => handleFile(e.target.files[0]);
photosInput.onchange = e => handleFile(e.target.files[0]);

function handleFile(file){
  if(!file) return showPage("main");
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = e => { previewImage.src = e.target.result; showPage("preview"); };
  reader.readAsDataURL(file);
  cameraInput.value = ""; photosInput.value = "";
}

export { selectedFile };
