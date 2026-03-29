const STORAGE_KEY = 'paidSessionData';
const RATE_PER_HOUR = 500; // 500 TZS = 1 hour

const VALID_NAMES = [
    "JAMAL SAID KAZEMBE",
    "JAMAL SAID",
    "JAMAL KAZEMBE"
];

const VALID_NUMBERS = [
    "655510714",
    "780526437"
];

export function initPay(showToastFn) {
    let selectedFile = null;
    let timerInterval = null;

    // Local toast wrapper
    function showToast(msg, type) {
        if (showToastFn) showToastFn(msg, type);
    }

    function formatTime(totalSec) {
        const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const s = String(totalSec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function showMainPage() {
        const mainContainer = document.querySelector('.main-container');
        const bottomControls = document.getElementById('bottomControls');
        const userInfo = document.getElementById('userInfo');
        if (mainContainer) mainContainer.style.display = 'flex';
        if (bottomControls) bottomControls.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'flex';
    }

    function hideMainPage() {
        const mainContainer = document.querySelector('.main-container');
        const bottomControls = document.getElementById('bottomControls');
        const userInfo = document.getElementById('userInfo');
        if (mainContainer) mainContainer.style.display = 'none';
        if (bottomControls) bottomControls.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }

    function removePayOverlays() {
        document.getElementById('payInfoPage')?.remove();
        document.getElementById('cameraMenuPage')?.remove();
        document.getElementById('previewPage')?.remove();
        document.getElementById('paidCountdownPage')?.remove();
        document.getElementById('payLoadingOverlay')?.remove();
    }

    // ─── LOADING OVERLAY ───────────────────────────────────────
    function showLoading(message) {
        removePayOverlays();
        const overlay = document.createElement('div');
        overlay.id = 'payLoadingOverlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 200; background: rgba(10, 15, 26, 0.95);
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; gap: 20px;
        `;
        const style = document.createElement('style');
        style.textContent = `@keyframes payspin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        const loader = document.createElement('div');
        loader.style.cssText = `
            border: 6px solid rgba(255,255,255,0.1); border-top: 6px solid #00d4aa;
            border-radius: 50%; width: 50px; height: 50px;
            animation: payspin 1s linear infinite;
        `;
        const text = document.createElement('p');
        text.id = 'payLoadingText';
        text.textContent = message;
        text.style.cssText = `color: #e8edf5; font-size: 1rem;`;
        overlay.appendChild(style);
        overlay.appendChild(loader);
        overlay.appendChild(text);
        document.body.appendChild(overlay);
    }

    function updateLoadingText(message) {
        const text = document.getElementById('payLoadingText');
        if (text) text.textContent = message;
    }

    function hideLoading() {
        document.getElementById('payLoadingOverlay')?.remove();
    }

    // ─── PAYMENT INFO PAGE ─────────────────────────────────────
    function showPayInfoPage() {
            // --- ADD THIS BLOCK HERE ---
    if (userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
        showToast("Admin access: skipping payment.", "success");
        showCameraMenuPage();
        return;
    }
        hideMainPage();
        removePayOverlays();

        const page = document.createElement('div');
        page.id = 'payInfoPage';
        page.style.cssText = `
            position: fixed; inset: 0; z-index: 100; background: #0a0f1a;
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; gap: 12px; padding: 20px; overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = 'PAYMENT INSTRUCTIONS';
        title.style.cssText = `color: #e8edf5; font-family: 'Orbitron', sans-serif; margin-bottom: 10px;`;

        ['Use your mobile payment app only.', 'Do not use USSD codes (*...#).', 'Upload the receipt after sending money.'].forEach(t => {
            const p = document.createElement('p');
            p.textContent = t;
            p.style.cssText = `color: #8a95a8; font-size: 0.9rem;`;
            page.appendChild(p);
        });

        const payLabel = document.createElement('p');
        payLabel.textContent = 'Pay through:';
        payLabel.style.cssText = `color: #e8edf5; font-weight: bold; margin-top: 15px;`;
        page.appendChild(payLabel);

        const mixLabel = document.createElement('p');
        mixLabel.textContent = 'Mix by Yas:'; mixLabel.style.cssText = `color: #00d4aa; font-weight: bold;`;
        page.appendChild(mixLabel);

        const mixNumber = document.createElement('p');
        mixNumber.textContent = '+255 655 510 714'; mixNumber.style.cssText = `color: #00d4aa; font-size: 1.2rem;`;
        page.appendChild(mixNumber);

        const airtelLabel = document.createElement('p');
        airtelLabel.textContent = 'Airtel Money:'; airtelLabel.style.cssText = `color: #dc3545; font-weight: bold; margin-top: 10px;`;
        page.appendChild(airtelLabel);

        const airtelNumber = document.createElement('p');
        airtelNumber.textContent = '+255 780 526 437'; airtelNumber.style.cssText = `color: #dc3545; font-size: 1.2rem;`;
        page.appendChild(airtelNumber);

        const nameLabel = document.createElement('p');
        nameLabel.textContent = 'JAMALI SAIDI KAZEMBE'; nameLabel.style.cssText = `color: #e8edf5; font-weight: bold; margin-top: 15px; font-size: 1.1rem;`;
        page.appendChild(nameLabel);

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `display: flex; gap: 20px; margin-top: 25px;`;

        const backBtn = document.createElement('button');
        backBtn.textContent = 'BACK';
        backBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 0.9rem; font-weight: 600; padding: 1rem 2rem; background: transparent; color: #8a95a8; border: 2px solid #8a95a8; cursor: pointer;`;
        backBtn.onclick = () => { removePayOverlays(); showMainPage(); };

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'NEXT';
        nextBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 0.9rem; font-weight: 600; padding: 1rem 2rem; background: #00d4aa; color: #0a0f1a; border: none; cursor: pointer;`;
        nextBtn.onclick = showCameraMenuPage;

        btnContainer.appendChild(backBtn);
        btnContainer.appendChild(nextBtn);
        page.appendChild(title);
        page.appendChild(btnContainer);
        document.body.appendChild(page);
    }

    // ─── CAMERA MENU PAGE ──────────────────────────────────────
    function showCameraMenuPage() {
        removePayOverlays();
        const page = document.createElement('div');
        page.id = 'cameraMenuPage';
        page.style.cssText = `position: fixed; inset: 0; z-index: 100; background: #0a0f1a; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;`;

        const cameraBtn = document.createElement('button');
        cameraBtn.textContent = 'CAMERA';
        cameraBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; padding: 1rem 3rem; background: #007bff; color: white; border: none; cursor: pointer;`;

        const photosBtn = document.createElement('button');
        photosBtn.textContent = 'PHOTOS';
        photosBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; padding: 1rem 3rem; background: #17a2b8; color: white; border: none; cursor: pointer;`;

        const backBtn = document.createElement('button');
        backBtn.textContent = 'BACK';
        backBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 0.9rem; font-weight: 600; padding: 1rem 2rem; background: transparent; color: #dc3545; border: 2px solid #dc3545; cursor: pointer;`;
        backBtn.onclick = showPayInfoPage;

        const cameraInput = document.createElement('input');
        cameraInput.type = 'file'; cameraInput.accept = 'image/*'; cameraInput.capture = 'environment'; cameraInput.style.display = 'none';

        const photosInput = document.createElement('input');
        photosInput.type = 'file'; photosInput.accept = 'image/*'; photosInput.style.display = 'none';

        cameraBtn.onclick = () => cameraInput.click();
        photosBtn.onclick = () => photosInput.click();
        cameraInput.onchange = (e) => handleFile(e.target.files[0]);
        photosInput.onchange = (e) => handleFile(e.target.files[0]);

        page.appendChild(cameraBtn);
        page.appendChild(photosBtn);
        page.appendChild(backBtn);
        page.appendChild(cameraInput);
        page.appendChild(photosInput);
        document.body.appendChild(page);
    }

    // ─── HANDLE FILE ───────────────────────────────────────────
    function handleFile(file) {
        if (!file) { showCameraMenuPage(); return; }
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => showPreviewPage(e.target.result);
        reader.readAsDataURL(file);
    }

    // ─── PREVIEW PAGE ──────────────────────────────────────────
    function showPreviewPage(imageSrc) {
        removePayOverlays();
        const page = document.createElement('div');
        page.id = 'previewPage';
        page.style.cssText = `position: fixed; inset: 0; z-index: 100; background: #0a0f1a; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 20px;`;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = `max-width: 90%; max-height: 60%; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);`;

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `display: flex; gap: 20px;`;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'SUBMIT';
        submitBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; padding: 1rem 2.5rem; background: #28a745; color: white; border: none; cursor: pointer;`;
        submitBtn.onclick = processPayment;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'CANCEL';
        cancelBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; padding: 1rem 2.5rem; background: #dc3545; color: white; border: none; cursor: pointer;`;
        cancelBtn.onclick = () => { selectedFile = null; showCameraMenuPage(); };

        btnContainer.appendChild(submitBtn);
        btnContainer.appendChild(cancelBtn);
        page.appendChild(img);
        page.appendChild(btnContainer);
        document.body.appendChild(page);
    }

    // ─── IMAGE PREPROCESSING ───────────────────────────────────
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
            data[i] = val; data[i + 1] = val; data[i + 2] = val;
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    // ─── TIME VALIDATION ───────────────────────────────────────
    function isTimeValidFromText(text) {
        const clean = text.toUpperCase().replace(/\s+/g, ' ');
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
        receipt.setHours(hours, minutes, 0);

        if (receipt > now) receipt.setDate(receipt.getDate() - 1);
        return Math.abs((now - receipt) / 60000) <= 10;
    }

    // ─── CURRENCY DETECTION ────────────────────────────────────
    function detectCurrency(text) {
        const match = text.match(/([A-Z]{3}|[$€£¥₦₵₱₴])\s?([\d,]+)/i);
        if (match) return { currency: match[1].toUpperCase(), amount: parseInt(match[2].replace(/,/g, "")) };
        const nums = text.match(/\d{3,7}/g);
        return { currency: "TZS", amount: nums ? Math.max(...nums.map(n => parseInt(n))) : 0 };
    }

    // ─── CURRENCY CONVERSION ───────────────────────────────────
    async function convertToTZS(amount, currency) {
        if (currency === "TZS" || currency === "TSH") return amount;
        try {
            const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
            const data = await res.json();
            return data.rates["TZS"] ? amount * data.rates["TZS"] : 0;
        } catch { return 0; }
    }

    // ─── MAIN PAYMENT PROCESSING ───────────────────────────────
    async function processPayment() {
        if (!selectedFile) { showToast("No file selected.", "error"); return; }

        showLoading("Verifying Account...");
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
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qr = jsQR(imageData.data, canvas.width, canvas.height);

            if (qr && qr.data) {
                detectedText = qr.data;
            } else {
                updateLoadingText("Reading text...");
                preprocessImage(canvas);
                const { data } = await Tesseract.recognize(canvas, "eng", { tessedit_pageseg_mode: 6 });
                detectedText = (data.text || "").replace(/\s+/g, " ").trim();
            }

            const cleanSearchText = detectedText.toUpperCase().replace(/\s+/g, " ");
            let nameFound = VALID_NAMES.some(name => cleanSearchText.includes(name));
            let numberFound = nameFound && VALID_NUMBERS.some(num => cleanSearchText.includes(num));
            const timeValid = isTimeValidFromText(cleanSearchText);
            const { currency, amount } = detectCurrency(cleanSearchText);
            const tzsAmount = await convertToTZS(amount, currency);
            const seconds = Math.floor((tzsAmount / RATE_PER_HOUR) * 3600);

            if (nameFound && numberFound && timeValid && seconds > 0) {
                const startTime = Date.now();
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime, totalSeconds: seconds }));
                enterPaidMode(startTime, seconds);
            } else {
                hideLoading();
                let err = "Invalid payment.";
                if (!nameFound) err += " Name not found.";
                else if (!numberFound) err += " Number not found.";
                if (!timeValid) err += " Receipt too old.";
                if (seconds <= 0) err += " Invalid amount.";
                showToast(err, "error");
                showPayInfoPage();
            }
        } catch (error) {
            console.error(error);
            hideLoading();
            showToast("Error processing image. Try again.", "error");
            showPayInfoPage();
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            selectedFile = null;
        }
    }

    // ─── PAID COUNTDOWN MODE ───────────────────────────────────
    function enterPaidMode(startTime, totalSeconds) {
        hideLoading();
        removePayOverlays();
        
        // Force hide free mode UI if it happens to be active
        document.getElementById('countdownPage')?.remove();
        hideMainPage();

        const page = document.createElement('div');
        page.id = 'paidCountdownPage';
        page.style.cssText = `position: fixed; inset: 0; z-index: 100; background: #0a0f1a; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px;`;

        const timerBtn = document.createElement('button');
        timerBtn.id = 'paidTimerBtn';
        timerBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 700; padding: 1.5rem 3rem; background: #00d4aa; color: #0a0f1a; border: none; cursor: default; letter-spacing: 0.1em;`;

        const menuBtn = document.createElement('button');
        menuBtn.id = 'paidmenuBtn';
        menuBtn.textContent = 'menu';
        menuBtn.style.cssText = `font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600; padding: 1rem 3rem; background: transparent; color: #e8edf5; border: 2px solid #e8edf5; cursor: pointer; letter-spacing: 0.1em; transition: all 0.3s ease;`;
        menuBtn.onmouseenter = () => { menuBtn.style.background = '#e8edf5'; menuBtn.style.color = '#0a0f1a'; };
        menuBtn.onmouseleave = () => { menuBtn.style.background = 'transparent'; menuBtn.style.color = '#e8edf5'; };

        page.appendChild(timerBtn);
        page.appendChild(menuBtn);
        document.body.appendChild(page);

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, totalSeconds - elapsed);

            if (remaining <= 0) {
                clearInterval(timerInterval);
                localStorage.removeItem(STORAGE_KEY);
                document.getElementById('paidCountdownPage')?.remove();
                showMainPage();
                showToast("Session expired. Pay again to continue.", "error");
                
                // Re-hook pay button in case it was unhooked or missed by observer
                const payBtn = document.getElementById('payBtn');
                if (payBtn && !payBtn._payInit) {
                    payBtn._payInit = true;
                    payBtn.onclick = showPayInfoPage;
                }
            } else {
                timerBtn.textContent = formatTime(remaining);
            }
        }, 1000);
    }

    // ─── RESTORE SESSION ON PAGE LOAD ──────────────────────────
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const { startTime, totalSeconds } = JSON.parse(savedData);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            if (totalSeconds - elapsed > 0) {
                enterPaidMode(startTime, totalSeconds);
                return; // Don't set up observer if currently in paid mode
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch { localStorage.removeItem(STORAGE_KEY); }
    }

    // ─── WATCH FOR PAY BUTTON (MutationObserver) ───────────────
    const observer = new MutationObserver(() => {
        const payBtn = document.getElementById('payBtn');
        if (payBtn && !payBtn._payInit) {
            payBtn._payInit = true;
            payBtn.onclick = showPayInfoPage;
            observer.disconnect(); // Stop watching once hooked
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}
