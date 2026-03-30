// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// ============================================
// 📦 FIREBASE INITIALIZATION
// ============================================
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// ============================================
// 👤 ADMIN EMAIL
// ============================================
const ADMIN_EMAIL = "camelkazembe1@gmail.com";
let isAdmin = false;

// ============================================
// 🔍 DETECT WHICH PAGE WE ARE ON
// ============================================
const isLoginPage = document.getElementById('googleLoginBtn') !== null;
const isMainPage = document.querySelector('.login-btn') !== null;

// ============================================
// 🔐 LOGIN PAGE LOGIC
// ============================================
if (isLoginPage) {
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const errorMessage = document.getElementById('errorMessage');
  const loaderBox = document.getElementById('loaderBox');

  googleLoginBtn.onclick = async () => {
    errorMessage.style.display = 'none';
    loaderBox.style.display = 'block';
    googleLoginBtn.disabled = true;

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      
      // ✅ Save login data
      await saveUserData("logins", {
        name: user.displayName,
        email: user.email
      });

      // ✅ Redirect back to index.html
      window.location.href = 'index.html';

    } catch (error) {
      loaderBox.style.display = 'none';
      googleLoginBtn.disabled = false;

      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage.textContent = '⚠️ Popup blocked! Please allow popups for this site.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage.textContent = '⚠️ Login cancelled by user.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage.textContent = '⚠️ Login cancelled.';
          break;
        case 'auth/invalid-email':
          errorMessage.textContent = '⚠️ Invalid email address.';
          break;
        default:
          errorMessage.textContent = '❌ Login failed: ' + error.message;
      }
      errorMessage.style.display = 'block';
    }
  };

  // ✅ If already logged in, redirect immediately
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.location.href = 'index.html';
    }
  });
}

// ============================================
// 🏠 MAIN PAGE (INDEX.HTML) LOGIC
// ============================================
if (isMainPage) {
  let timerInterval = null;
  let selectedFile = null;

  // Get DOM elements
  const educationPage = document.getElementById("educationPage");
  const healthPage = document.getElementById("healthPage");
  const businessPage = document.getElementById("businessPage");
  const loginBtn = document.querySelector(".login-btn");
  const logoutBtn = document.querySelector(".logout-btn");
  const payBtn = document.querySelector(".pay-btn");
  const accessBtn = document.querySelector(".access-btn");
  const userDisplay = document.getElementById("userDisplay");
  const payPage = document.getElementById("payPage");
  const backBtn = document.querySelector(".back-btn");
  const nextBtn = document.querySelector(".next-btn");
  const cameraMenuPage = document.getElementById("cameraMenuPage");
  const openCameraBtn = document.getElementById("openCameraBtn");
  const openPhotosBtn = document.getElementById("openPhotosBtn");
  const backFromCameraBtn = document.getElementById("backFromCameraBtn");
  const cameraInput = document.getElementById("cameraInput");
  const photosInput = document.getElementById("photosInput");
  const previewPage = document.getElementById("previewPage");
  const previewImage = document.getElementById("previewImage");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const timerPage = document.getElementById("timerPage");
  const timerDisplay = document.getElementById("timerDisplay");
  const userDisplayTimer = document.getElementById("userDisplayTimer");
  const timerStatus = document.getElementById("timerStatus");
  const timerButtons = document.getElementById("timerButtons");
  const exitBtn = document.getElementById("exitBtn");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");

  // Health elements
  const healthRegisterPage = document.getElementById("healthRegisterPage");
  const topDisplay = document.getElementById("topDisplay");
  const firstInput = document.getElementById("firstNameInput");
  const secondInput = document.getElementById("secondNameInput");
  const thirdInput = document.getElementById("thirdNameInput");
  const ageInput = document.getElementById("ageInput");
  const tribeInput = document.getElementById("tribeInput");
  const genderBox = document.getElementById("genderBox");
  const maleBtn = document.getElementById("maleBtn");
  const femaleBtn = document.getElementById("femaleBtn");
  const okBtn = document.getElementById("okHealthBtn");
  const cancelBtnH = document.getElementById("cancelHealthBtn");

  // Business elements
  const businessRegisterPage = document.getElementById("businessRegisterPage");
  const businessTopDisplay = document.getElementById("businessTopDisplay");
  const businessNameInput = document.getElementById("businessNameInput");
  const businessAmountInput = document.getElementById("businessAmountInput");
  const inOutBox = document.getElementById("inOutBox");
  const inBtn = document.getElementById("inBtn");
  const outBtn = document.getElementById("outBtn");
  const methodBox = document.getElementById("methodBox");
  const cashBtn = document.getElementById("cashBtn");
  const creditBtn = document.getElementById("creditBtn");
  const bankBtn = document.getElementById("bankBtn");
  const creditNameInput = document.getElementById("creditNameInput");
  const okBusinessBtn = document.getElementById("okBusinessBtn");
  const cancelBusinessBtn = document.getElementById("cancelBusinessBtn");
  const viewBusinessBtn = document.getElementById("viewBusinessBtn");
  const viewOptions = document.getElementById("viewOptions");
  const backViewBtn = document.getElementById("backViewBtn");

  let businessData = {
    name: "", amount: "", type: "", method: "", creditName: ""
  };

  let data = {
    first: "", second: "", third: "",
    age: "", gender: "", tribe: ""
  };

  // ============================================
  // 👤 AUTH STATE LISTENER
  // ============================================
  auth.onAuthStateChanged((user) => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      
      isAdmin = user.email === ADMIN_EMAIL;
      userDisplay.textContent = user.displayName;

      if (isAdmin) {
        userDisplay.style.display = "block";
        showPage('timer');
        timerDisplay.textContent = "UNLIMITED";
        timerStatus.textContent = "Admin Access";
        timerButtons.style.display = "flex";
      } else {
        showPage('main');
      }
    } else {
      isAdmin = false;
      userDisplay.style.display = "none";
      loginBtn.style.display = "block";
      payBtn.style.display = "none";
      accessBtn.style.display = "none";
      logoutBtn.style.display = "none";
    }
  });

  // ============================================
  // 🔘 BUTTON CLICK HANDLERS
  // ============================================
  loginBtn.onclick = () => {
    window.location.href = 'login.html';
  };

  logoutBtn.onclick = async () => {
    clearInterval(timerInterval);
    localStorage.removeItem("sessionEnd");
    await auth.signOut();
    showPage('main');
  };

  accessBtn.onclick = () => {
    startTimerFromStorage();
    showPage('timer');
  };

  payBtn.onclick = () => showPage('pay');
  backBtn.onclick = () => showPage('main');
  nextBtn.onclick = () => showPage('camera');
  backFromCameraBtn.onclick = () => showPage('main');
  openCameraBtn.onclick = () => cameraInput.click();
  openPhotosBtn.onclick = () => photosInput.click();

  // ============================================
  // 📄 PAGE NAVIGATION
  // ============================================
  function showPage(page) {
    logoutBtn.style.display = "none";
    businessPage.style.display = "none";
    payPage.style.display = "none";
    healthPage.style.display = "none";
    educationPage.style.display = "none";
    cameraMenuPage.style.display = "none";
    previewPage.style.display = "none";
    timerPage.style.display = "none";

    if (page === 'main' && auth.currentUser) {
      userDisplay.style.display = "block";
      logoutBtn.style.display = "block";
      const endTime = localStorage.getItem("sessionEnd");
      if (endTime && Date.now() < parseInt(endTime)) {
        accessBtn.style.display = "block";
      } else {
        payBtn.style.display = "block";
      }
    }
    else if (page === 'business') {
      timerPage.style.display = "none";
      businessPage.style.display = "flex";
      logoutBtn.style.display = isAdmin ? "block" : "none";
    }
    else if (page === 'health') {
      timerPage.style.display = "none";
      healthPage.style.display = "flex";
      logoutBtn.style.display = isAdmin ? "block" : "none";
    }
    else if (page === 'education') {
      timerPage.style.display = "none";
      educationPage.style.display = "flex";
    }
    else if (page === 'pay') {
      payPage.style.display = "flex";
    }
    else if (page === 'camera') {
      cameraMenuPage.style.display = "flex";
    }
    else if (page === 'preview') {
      previewPage.style.display = "flex";
    }
    else if (page === 'timer') {
      loginBtn.style.display = "none";
      payBtn.style.display = "none";
      accessBtn.style.display = "none";
      if (!isAdmin) {
        logoutBtn.style.display = "none";
        exitBtn.style.display = "inline-block";
      } else {
        logoutBtn.style.display = "block";
        exitBtn.style.display = "none";
      }
      userDisplay.style.display = "none";
      timerPage.style.display = "flex";
      timerButtons.style.display = "flex";
      userDisplayTimer.textContent = auth.currentUser ? auth.currentUser.displayName : "User";
    }
  }

  // ============================================
  // 📷 FILE HANDLING
  // ============================================
  function handleFile(file) {
    if (!file) { showPage('main'); return; }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      showPage('preview');
    };
    reader.readAsDataURL(file);
    cameraInput.value = "";
    photosInput.value = "";
  }

  cameraInput.onchange = (e) => handleFile(e.target.files[0]);
  photosInput.onchange = (e) => handleFile(e.target.files[0]);
  cancelBtn.onclick = () => {
    selectedFile = null;
    previewImage.src = "";
    showPage('camera');
  };

  // ============================================
  // ⏱️ TIMER FUNCTIONS
  // ============================================
  function startTimer(seconds) {
    if (isAdmin) return;
    clearInterval(timerInterval);
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem("sessionEnd", String(endTime));
    
    saveUserData("sessions", {
      seconds: seconds,
      startTime: new Date(),
      endTime: new Date(endTime)
    });

    timerInterval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00:00";
        timerStatus.textContent = "Session Expired";
        localStorage.removeItem("sessionEnd");
        setTimeout(() => {
          showPage('main');
          timerButtons.style.display = "none";
        }, 2000);
        return;
      }
      const hrs = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const secs = remaining % 60;
      timerDisplay.textContent =
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0');
    }, 1000);
  }

  function startTimerFromStorage() {
    if (isAdmin) return;
    const endTime = parseInt(localStorage.getItem("sessionEnd"));
    if (!endTime) return;
    timerButtons.style.display = "flex";
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const rem = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (rem <= 0) {
        clearInterval(timerInterval);
        localStorage.removeItem("sessionEnd");
        showPage('main');
        return;
      }
      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;
      timerDisplay.textContent =
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0');
    }, 1000);
  }

  exitBtn.onclick = () => {
    clearInterval(timerInterval);
    localStorage.removeItem("sessionEnd");
    timerButtons.style.display = "none";
    showPage('main');
  };

  // ============================================
  // 🔘 TIMER PAGE BUTTONS
  // ============================================
  document.getElementById("educationBtn").onclick = () => showPage('education');
  document.getElementById("healthBtn").onclick = () => showPage('health');
  document.getElementById("businessBtn").onclick = () => showPage('business');
  document.getElementById("backHealthBtn").onclick = () => showPage('timer');
  document.getElementById("backEduBtn").onclick = () => showPage('timer');
  document.getElementById("backBusinessBtn").onclick = () => showPage('timer');

  // ============================================
  // 📊 BUSINESS FUNCTIONS
  // ============================================
  function resetBusinessForm() {
    businessNameInput.value = "";
    businessAmountInput.value = "";
    creditNameInput.value = "";
    businessTopDisplay.innerHTML = "";
    businessNameInput.style.display = "block";
    businessAmountInput.style.display = "none";
    inOutBox.style.display = "none";
    methodBox.style.display = "none";
    creditNameInput.style.display = "none";
    okBusinessBtn.style.display = "none";
    businessData = { name: "", amount: "", type: "", method: "", creditName: "" };
  }

  document.getElementById("addBusinessBtn").onclick = () => {
    resetBusinessForm();
    businessPage.style.display = "none";
    businessRegisterPage.style.display = "flex";
  };

  businessNameInput.oninput = () => {
    if (businessNameInput.value.length === 1) {
      businessAmountInput.style.display = "block";
    }
  };

  businessAmountInput.oninput = () => {
    if (businessAmountInput.value.length === 1) {
      businessData.name = businessNameInput.value;
      addBusinessButton(businessData.name);
      businessNameInput.style.display = "none";
      inOutBox.style.display = "block";
    }
  };

  inBtn.onclick = () => setType("IN");
  outBtn.onclick = () => setType("OUT");

  function setType(type) {
    businessData.amount = businessAmountInput.value;
    businessData.type = type;
    addBusinessButton(type);
    businessAmountInput.style.display = "none";
    inOutBox.style.display = "none";
    methodBox.style.display = "block";
  }

  cashBtn.onclick = () => setMethod("CASH");
  bankBtn.onclick = () => setMethod("BANK");
  creditBtn.onclick = () => {
    businessData.method = "CREDIT";
    addBusinessButton("CREDIT");
    methodBox.style.display = "none";
    creditNameInput.style.display = "block";
    okBusinessBtn.style.display = "inline-block";
  };

  function setMethod(method) {
    businessData.method = method;
    addBusinessButton(method);
    methodBox.style.display = "none";
    okBusinessBtn.style.display = "inline-block";
  }

  creditNameInput.oninput = () => {
    businessData.creditName = creditNameInput.value;
  };

  okBusinessBtn.onclick = async () => {
    okBusinessBtn.disabled = true;
    okBusinessBtn.textContent = "Saving...";
    try {
      if (!businessData.name || !businessData.amount) {
        alert("Fill required fields");
        return;
      }
      saveUserData("records", {
        category: "business",
        name: businessData.name,
        amount: Number(businessData.amount),
        type: businessData.type,
        method: businessData.method,
        creditName: businessData.creditName || "",
        userName: auth.currentUser?.displayName || "User"
      }).catch(err => console.error(err));
      resetBusinessForm();
      businessRegisterPage.style.display = "none";
      businessPage.style.display = "flex";
    } catch (e) {
      console.error(e);
      alert("Error saving transaction");
    } finally {
      okBusinessBtn.disabled = false;
      okBusinessBtn.textContent = "OK";
    }
  };

  cancelBusinessBtn.onclick = () => {
    resetBusinessForm();
    businessRegisterPage.style.display = "none";
    businessPage.style.display = "flex";
  };

  function addBusinessButton(text) {
    const btn = document.createElement("button");
    btn.className = "big-btn";
    btn.style.background = "#007bff";
    btn.textContent = text;
    businessTopDisplay.appendChild(btn);
  }

  viewBusinessBtn.onclick = () => {
    viewBusinessBtn.style.display = "none";
    document.getElementById("addBusinessBtn").style.display = "none";
    viewOptions.style.display = "flex";
  };

  backViewBtn.onclick = () => {
    viewOptions.style.display = "none";
    viewBusinessBtn.style.display = "block";
    document.getElementById("addBusinessBtn").style.display = "block";
  };

  // ============================================
  // 🏥 HEALTH FUNCTIONS
  // ============================================
  function resetHealthForm() {
    firstInput.value = "";
    secondInput.value = "";
    thirdInput.value = "";
    ageInput.value = "";
    tribeInput.value = "";
    data = { first: "", second: "", third: "", age: "", gender: "", tribe: "" };
    topDisplay.innerHTML = "";
    firstInput.style.display = "block";
    secondInput.style.display = "none";
    thirdInput.style.display = "none";
    ageInput.style.display = "none";
    tribeInput.style.display = "none";
    genderBox.style.display = "none";
    okBtn.style.display = "none";
  }

  document.getElementById("registerNewBtn").onclick = () => {
    resetHealthForm();
    healthPage.style.display = "none";
    healthRegisterPage.style.display = "flex";
  };

  cancelBtnH.onclick = () => {
    resetHealthForm();
    healthRegisterPage.style.display = "none";
    healthPage.style.display = "flex";
  };

  firstInput.oninput = () => {
    if (firstInput.value.length === 1) {
      secondInput.style.display = "block";
    }
  };

  secondInput.oninput = () => {
    if (secondInput.value.length === 1) {
      data.first = firstInput.value;
      addButton(data.first);
      firstInput.style.display = "none";
      thirdInput.style.display = "block";
    }
  };

  thirdInput.oninput = () => {
    if (thirdInput.value.length === 1) {
      data.second = secondInput.value;
      updateNameButton();
      secondInput.style.display = "none";
      ageInput.style.display = "block";
    }
  };

  ageInput.oninput = () => {
    if (ageInput.value.length === 1) {
      data.third = thirdInput.value;
      updateNameButton();
      thirdInput.style.display = "none";
      genderBox.style.display = "block";
    }
  };

  maleBtn.onclick = () => setGender("MALE");
  femaleBtn.onclick = () => setGender("FEMALE");

  function setGender(g) {
    data.age = ageInput.value;
    data.gender = g;
    addButton(data.age);
    addButton(g);
    ageInput.style.display = "none";
    genderBox.style.display = "none";
    tribeInput.style.display = "block";
    okBtn.style.display = "inline-block";
  }

  tribeInput.oninput = () => {
    data.tribe = tribeInput.value;
  };

  okBtn.onclick = async () => {
    okBtn.disabled = true;
    okBtn.textContent = "Saving...";
    try {
      if (!data.first || !data.age || !data.gender) {
        alert("Please complete all required fields");
        return;
      }
      saveUserData("records", {
        category: "health",
        firstName: data.first,
        secondName: data.second,
        thirdName: data.third,
        age: data.age,
        gender: data.gender,
        tribe: data.tribe,
        userName: auth.currentUser?.displayName || "User"
      }).catch(err => console.error(err));
      resetHealthForm();
      healthRegisterPage.style.display = "none";
      healthPage.style.display = "flex";
    } catch (error) {
      console.error(error);
      alert("Error saving patient!");
    } finally {
      okBtn.disabled = false;
      okBtn.textContent = "OK";
    }
  };

  function addButton(text) {
    const btn = document.createElement("button");
    btn.className = "big-btn";
    btn.style.background = "#007bff";
    btn.textContent = text;
    topDisplay.appendChild(btn);
  }

  function updateNameButton() {
    topDisplay.innerHTML = "";
    const full = firstInput.value + " " + secondInput.value + " " + thirdInput.value;
    addButton(full.trim());
  }

  // ============================================
  // 📤 SUBMIT PAYMENT
  // ============================================
  const VALID_NAMES = ["JAMAL SAID KAZEMBE", "JAMAL SAID", "JAMAL KAZEMBE"];
  const VALID_NUMBERS = ["655510714", "780526437"];

  submitBtn.onclick = async () => {
    if (!selectedFile) { alert("No file selected."); return; }
    loadingOverlay.style.display = "flex";
    loadingText.textContent = "Verifying Account...";
    let objectUrl = null;
    try {
      const img = new Image();
      objectUrl = URL.createObjectURL(selectedFile);
      img.src = objectUrl;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout")), 5000);
        img.onload = () => { clearTimeout(timer); resolve(); };
        img.onerror = () => reject(new Error("Invalid image"));
      });

      const MAX_W = 1500;
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let detectedText = "";
      let isQR = false;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imageData.data, canvas.width, canvas.height);

      if (qr && qr.data) {
        detectedText = qr.data;
        isQR = true;
      } else {
        loadingText.textContent = "Reading text...";
        preprocessImage(canvas);
        const { data } = await Tesseract.recognize(canvas, "eng", {
          tessedit_pageseg_mode: 6
        });
        detectedText = (data.text || "").replace(/\s+/g, " ").trim();
      }

      const upperText = detectedText.toUpperCase();
      const cleanSearchText = upperText.replace(/\s+/g, " ");
      let timeValid = isTimeValidFromText(cleanSearchText);
      let nameFound = false;

      for (const name of VALID_NAMES) {
        if (cleanSearchText.includes(name)) {
          nameFound = true;
          break;
        }
      }

      let numberFound = false;
      if (nameFound) {
        for (const num of VALID_NUMBERS) {
          if (cleanSearchText.includes(num)) {
            numberFound = true;
            break;
          }
        }
      }

      const { currency, amount } = detectCurrency(cleanSearchText);
      const tzsAmount = await convertToTZS(amount, currency);
      const seconds = Math.floor((tzsAmount / 300) * 3600);

      if (nameFound && numberFound && timeValid && seconds > 0) {
        startTimer(seconds);
        timerButtons.style.display = "flex";
        showPage("timer");
      } else {
        alert("Invalid payment");
        showPage("pay");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing image. Please try again.");
      showPage("pay");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      loadingOverlay.style.display = "none";
    }
  };

  function preprocessImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
      totalBrightness += avg;
    }
    const avgBrightness = totalBrightness / (data.length / 4);
    for (let i = 0; i < data.length; i += 4) {
      let val = data[i];
      if (avgBrightness < 128) val = 255 - val;
      if (val > 140) val = 255; else if (val < 120) val = 0;
      data[i] = val; data[i+1] = val; data[i+2] = val;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function isTimeValidFromText(text) {
    const clean = text.toUpperCase().replace(/\s+/g, " ");
    const match = clean.match(/\b(\d{1,2})[:. ](\d{2})([:. ](\d{2}))?\s?(AM|PM)?\b/);
    if (!match) return false;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[5];
    if (ampm) {
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }
    const now = new Date();
    const receipt = new Date();
    receipt.setHours(hours);
    receipt.setMinutes(minutes);
    receipt.setSeconds(0);
    if (receipt > now) receipt.setDate(receipt.getDate() - 1);
    const diff = Math.abs((now - receipt) / 60000);
    return diff <= 10;
  }

  function detectCurrency(text) {
    const match = text.match(/([A-Z]{3}|[$€£¥₦₵₱₴])\s?([\d,]+)/i);
    if (match) {
      return {
        currency: match[1].toUpperCase(),
        amount: parseInt(match[2].replace(/,/g, ""))
      };
    }
    const nums = text.match(/\d{3,7}/g);
    return {
      currency: "TZS",
      amount: nums ? Math.max(...nums.map(n => parseInt(n))) : 0
    };
  }

  async function convertToTZS(amount, currency) {
    if (currency === "TZS" || currency === "TSH") return amount;
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const data = await res.json();
      const rate = data.rates["TZS"];
      return rate ? amount * rate : 0;
    } catch {
      return 0;
    }
  }
}

// ============================================
// 💾 SAVE USER DATA TO FIRESTORE
// ============================================
async function saveUserData(collectionName, data) {
  const user = auth.currentUser;
  if (!user) {
    console.log("❌ No user logged in");
    return;
  }
  console.log("✅ USER ID:", user.uid);
  try {
    await db.collection("users").doc(user.uid).collection(collectionName).add({
      ...data,
      userId: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("✅ Data saved to:", collectionName);
  } catch (e) {
    console.error("Save error:", e);
  }
}
