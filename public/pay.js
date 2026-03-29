// ─── pay.js — Receipt verification & paid countdown ───────
const STORAGE_KEY = "paidSessionData";
const RATE_PER_HOUR = 500;

const VALID_NAMES = [
    "JAMAL SAID KAZEMBE",
    "JAMAL SAID",
    "JAMAL KAZEMBE"
];

const MOBILE_NUMBERS = ["655510714", "780526437"];
const BANK_ACCOUNTS  = ["0152001GN6K00"];

let selectedFile = null;
let timerInterval = null;
let _showToast = () => {};
let _recordPayment = null;

// ─── Exported init ────────────────────────────────────────
export function initPay(showToastFn, recordPaymentFn) {
    _showToast = showToastFn || (() => {});
    _recordPayment = recordPaymentFn || null;

    // Listen for pay button creation from free.js
    document.addEventListener("pay-btn-ready", attachPayBtnHandler);

    // Also use MutationObserver as fallback
    const observer = new MutationObserver(() => attachPayBtnHandler());
    observer.observe(document.body, { childList: true, subtree: true });

    // Restore existing paid session
    restorePaidSession();
}

function attachPayBtnHandler() {
    const payBtn = document.getElementById("payBtn");
    if (payBtn && !payBtn._payInit) {
        payBtn._payInit = true;
        payBtn.onclick = showPayInfoPage;
    }
}

// ─── Helpers ──────────────────────────────────────────────
function showToast(msg, type, dur) { _showToast(msg, type, dur); }

function formatTime(totalSec) {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

function showMainPage() {
    const mc = document.querySelector(".main-container");
    const bc = document.getElementById("bottomControls");
    const tb = document.getElementById("topBar");
    const wm = document.getElementById("welcomeMsg");
    if (mc) mc.style.display = "flex";
    if (bc) bc.style.display = "flex";
    if (tb) tb.style.display = "flex";
    if (wm) wm.style.display = "block";
}

function hideMainPage() {
    const mc = document.querySelector(".main-container");
    const bc = document.getElementById("bottomControls");
    if (mc) mc.style.display = "none";
    if (bc) bc.style.display = "none";
}

function removePayOverlays() {
    ["payInfoPage", "cameraMenuPage", "previewPage",
     "paidCountdownPage", "payLoadingOverlay"].forEach(id => {
        document.getElementById(id)?.remove();
    });
}

// ─── Loading overlay ──────────────────────────────────────
function showLoading(message) {
    removePayOverlays();
    const overlay = document.createElement("div");
    overlay.id = "payLoadingOverlay";
    overlay.style.cssText = `
        position:fixed;inset:0;z-index:200;background:rgba(10,15,26,0.95);
        display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:20px;
    `;
    const style = document.createElement("style");
    style.textContent = `@keyframes payspin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`;
    const loader = document.createElement("div");
    loader.style.cssText = `
        border:6px solid rgba(255,255,255,0.1);border-top:6px solid #00d4aa;
        border-radius:50%;width:50px;height:50px;animation:payspin 1s linear infinite;
    `;
    const text = document.createElement("p");
    text.id = "payLoadingText";
    text.textContent = message;
    text.style.cssText = "color:#e8edf5;font-size:1rem;";
    overlay.append(style, loader, text);
    document.body.appendChild(overlay);
}

function updateLoadingText(msg) {
    const el = document.getElementById("payLoadingText");
    if (el) el.textContent = msg;
}

function hideLoading() {
    document.getElementById("payLoadingOverlay")?.remove();
}

// ─── Payment info page ────────────────────────────────────
function showPayInfoPage() {
    hideMainPage();
    removePayOverlays();

    const page = document.createElement("div");
    page.id = "payInfoPage";
    page.style.cssText = `
        position:fixed;inset:0;z-index:100;background:#0a0f1a;
        display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:8px;padding:20px;overflow-y:auto;
    `;

    const addText = (content, styles) => {
        const p = document.createElement("p");
        p.textContent = content;
        p.style.cssText = styles;
        page.appendChild(p);
    };

    addText("PAYMENT INSTRUCTIONS",
        "color:#e8edf5;font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:6px;");

    [
        "Use mobile money, bank app, or bank transfer.",
        "Do not use USSD codes (*...#).",
        "Upload the receipt after sending money."
    ].forEach(t => addText(t, "color:#8a95a8;font-size:0.8rem;"));

    addText("Pay through:", "color:#e8edf5;font-weight:bold;margin-top:14px;");
    addText("Mix by Yas (Tigo):", "color:#00d4aa;font-weight:bold;margin-top:10px;");
    addText("+255 655 510 714", "color:#00d4aa;font-size:1.05rem;");
    addText("Airtel Money:", "color:#dc3545;font-weight:bold;margin-top:10px;");
    addText("+255 780 526 437", "color:#dc3545;font-size:1.05rem;");
    addText("CRDB Bank:", "color:#007bff;font-weight:bold;margin-top:10px;");
    addText("0152001GN6K00", "color:#007bff;font-size:1.05rem;letter-spacing:0.05em;");
    addText("JAMAL SAID KAZEMBE", "color:#e8edf5;font-weight:bold;margin-top:14px;font-size:1rem;");

    const btnBox = document.createElement("div");
    btnBox.style.cssText = "display:flex;gap:16px;margin-top:22px;";

    const backBtn = document.createElement("button");
    backBtn.textContent = "BACK";
    backBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:600;
        padding:0.9rem 1.8rem;background:transparent;color:#8a95a8;
        border:2px solid #8a95a8;cursor:pointer;letter-spacing:0.08em;
    `;
    backBtn.onclick = () => { removePayOverlays(); showMainPage(); };

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "NEXT";
    nextBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:600;
        padding:0.9rem 1.8rem;background:#00d4aa;color:#0a0f1a;
        border:none;cursor:pointer;letter-spacing:0.08em;
    `;
    nextBtn.onclick = showCameraMenuPage;

    btnBox.append(backBtn, nextBtn);
    page.appendChild(btnBox);
    document.body.appendChild(page);
}

// ─── Camera / Gallery menu ────────────────────────────────
function showCameraMenuPage() {
    removePayOverlays();
    const page = document.createElement("div");
    page.id = "cameraMenuPage";
    page.style.cssText = `
        position:fixed;inset:0;z-index:100;background:#0a0f1a;
        display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:20px;
    `;

    const makeBtn = (text, bg, handler) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.style.cssText = `
            font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
            padding:1rem 3rem;background:${bg};color:white;border:none;
            cursor:pointer;letter-spacing:0.08em;
        `;
        btn.onclick = handler;
        return btn;
    };

    const cameraInput = document.createElement("input");
    cameraInput.type = "file"; cameraInput.accept = "image/*";
    cameraInput.capture = "environment"; cameraInput.style.display = "none";
    cameraInput.onchange = (e) => handleFile(e.target.files[0]);

    const photosInput = document.createElement("input");
    photosInput.type = "file"; photosInput.accept = "image/*";
    photosInput.style.display = "none";
    photosInput.onchange = (e) => handleFile(e.target.files[0]);

    page.appendChild(makeBtn("CAMERA", "#007bff", () => cameraInput.click()));
    page.appendChild(makeBtn("PHOTOS", "#17a2b8", () => photosInput.click()));

    const backBtn = document.createElement("button");
    backBtn.textContent = "BACK";
    backBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:600;
        padding:0.9rem 1.8rem;background:transparent;color:#dc3545;
        border:2px solid #dc3545;cursor:pointer;letter-spacing:0.08em;
    `;
    backBtn.onclick = showPayInfoPage;

    page.append(backBtn, cameraInput, photosInput);
    document.body.appendChild(page);
}

// ─── Handle file selection ────────────────────────────────
function handleFile(file) {
    if (!file) { showCameraMenuPage(); return; }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => showPreviewPage(e.target.result);
    reader.readAsDataURL(file);
}

// ─── Preview page ─────────────────────────────────────────
function showPreviewPage(imageSrc) {
    removePayOverlays();
    const page = document.createElement("div");
    page.id = "previewPage";
    page.style.cssText = `
        position:fixed;inset:0;z-index:100;background:#0a0f1a;
        display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:20px;padding:20px;
    `;

    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.cssText = "max-width:90%;max-height:60%;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.3);";

    const btnBox = document.createElement("div");
    btnBox.style.cssText = "display:flex;gap:16px;";

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "SUBMIT";
    submitBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
        padding:1rem 2.2rem;background:#28a745;color:white;border:none;cursor:pointer;
    `;
    submitBtn.onclick = processPayment;

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "CANCEL";
    cancelBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
        padding:1rem 2.2rem;background:#dc3545;color:white;border:none;cursor:pointer;
    `;
    cancelBtn.onclick = () => { selectedFile = null; showCameraMenuPage(); };

    btnBox.append(submitBtn, cancelBtn);
    page.append(img, btnBox);
    document.body.appendChild(page);
}

// ─── Image preprocessing for OCR ──────────────────────────
function preprocessImage(canvas) {
    const ctx = canvas.getContext("2d");
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

// ═══════════════════════════════════════════════════════════
//  STRICT VERIFICATION ENGINE
// ═══════════════════════════════════════════════════════════

function isNameMatch(text, names) {
    const subs = { I:"1", "1":"I", S:"5", "5":"S", B:"8", "8":"B", O:"0", "0":"O" };
    for (const name of names) {
        if (text.includes(name)) return true;
        for (let i = 0; i < name.length; i++) {
            const r = subs[name[i]];
            if (r) {
                const variant = name.substring(0, i) + r + name.substring(i + 1);
                if (variant !== name && text.includes(variant)) return true;
            }
        }
    }
    return false;
}

function isBankAccountMatch(text, accounts) {
    const noSpaces = text.replace(/\s+/g, "");
    const subs = { "0":"O", O:"0", "1":"I", I:"1", "5":"S", S:"5", "8":"B", B:"8" };
    for (const acc of accounts) {
        if (noSpaces.includes(acc)) return true;
        for (let i = 0; i < acc.length; i++) {
            const r = subs[acc[i]];
            if (r) {
                const variant = acc.substring(0, i) + r + acc.substring(i + 1);
                if (variant !== acc && noSpaces.includes(variant)) return true;
            }
        }
        for (let len = acc.length - 1; len >= Math.max(8, acc.length - 2); len--) {
            if (noSpaces.includes(acc.substring(0, len))) return true;
        }
    }
    return false;
}

function isMobileNumberMatch(text, numbers) {
    const digits = text.replace(/\D/g, "");
    for (const num of numbers) {
        if (digits.includes(num)) return true;
        if (digits.includes("255" + num)) return true;
        if (digits.includes("0" + num)) return true;
    }
    return false;
}

function isNumberMatch(text) {
    return isBankAccountMatch(text, BANK_ACCOUNTS) || isMobileNumberMatch(text, MOBILE_NUMBERS);
}

function isTimeValidFromText(text) {
    const clean = text.toUpperCase().replace(/\s+/g, " ");
    const timeRegex = /\b(\d{1,2})[:\.](\d{2})(?:[:\.](\d{2}))?\s?(AM|PM)?\b/gi;
    let match;
    while ((match = timeRegex.exec(clean)) !== null) {
        const before = clean.substring(Math.max(0, match.index - 2), match.index);
        const after  = clean.substring(match.index + match[0].length, Math.min(clean.length, match.index + match[0].length + 4));
        if (/[\/\-]/.test(before) || /[\/\-]/.test(after)) continue;
        if (/\d{4}/.test(after.substring(0, 3))) continue;

        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const ampm = match[4];
        if (hours > 23 || minutes > 59) continue;
        if (ampm) {
            if (ampm === "PM" && hours < 12) hours += 12;
            if (ampm === "AM" && hours === 12) hours = 0;
        }

        const now = new Date();
        const receipt = new Date();
        receipt.setHours(hours, minutes, 0, 0);
        if (receipt > now) receipt.setDate(receipt.getDate() - 1);
        if (Math.abs((now - receipt) / 60000) <= 10) return true;
    }
    return false;
}

function detectAmount(text) {
    const clean = text.toUpperCase();
    const keywords = [
        "TZS","TSH","AMOUNT","AMT","PAID","SENT",
        "TRANSFER","TRANSFERT","DEBIT","CREDIT",
        "MONTANT","MONTANTT","/=","RECVD","RECEIVED",
        "WITHDRAW","DEPOSIT"
    ];
    const kwPos = [];
    for (const kw of keywords) {
        let idx = clean.indexOf(kw);
        while (idx !== -1) {
            kwPos.push({ start: idx, end: idx + kw.length });
            idx = clean.indexOf(kw, idx + 1);
        }
    }

    const numRegex = /(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+\.\d{1,2}|\d{3,})/g;
    let numMatch;
    const candidates = [];

    while ((numMatch = numRegex.exec(clean)) !== null) {
        const raw = numMatch[1].replace(/,/g, "");
        const value = parseFloat(raw);
        if (isNaN(value) || value < 100 || value > 999999999) continue;

        const numStart = numMatch.index;
        const numEnd = numMatch.index + numMatch[0].length;
        let nearKw = false;
        let minDist = Infinity;
        for (const kp of kwPos) {
            const dist = Math.min(Math.abs(numEnd - kp.start), Math.abs(numStart - kp.end));
            if (dist < minDist) minDist = dist;
            if (dist <= 25) { nearKw = true; break; }
        }
        candidates.push({ value: Math.floor(value), nearKw, dist: minDist });
    }

    const near = candidates.filter(c => c.nearKw);
    if (near.length > 0) {
        near.sort((a, b) => a.dist - b.dist);
        return near[0].value;
    }

    const phoneStrs = MOBILE_NUMBERS.map(n => n.toString());
    const notPhone = candidates.filter(c => {
        const s = c.value.toString();
        return !phoneStrs.some(pn => s.includes(pn) || s.includes("255" + pn) || ("0" + pn).includes(s));
    });
    if (notPhone.length > 0) return Math.max(...notPhone.map(c => c.value));
    if (candidates.length > 0) return Math.max(...candidates.map(c => c.value));
    return 0;
}

function detectPaymentType(text) {
    const upper = text.toUpperCase();
    if (upper.includes("TIGO") || upper.includes("MIX")) return "Mix (Tigo)";
    if (upper.includes("AIRTEL")) return "Airtel Money";
    if (upper.includes("CRDB") || upper.includes("BANK")) return "CRDB Bank";
    return "Unknown";
}

// ─── Main payment processing ──────────────────────────────
async function processPayment() {
    if (!selectedFile) { showToast("No file selected.", "error"); return; }

    showLoading("Verifying Account...");
    let objectUrl = null;

    try {
        const img = new Image();
        objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;

        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Timeout")), 8000);
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
            const { data } = await Tesseract.recognize(canvas, "eng", {
                tessedit_pageseg_mode: 6
            });
            detectedText = (data.text || "").replace(/\s+/g, " ").trim();
        }

        const cleanText = detectedText.toUpperCase().replace(/\s+/g, " ");

        const nameFound   = isNameMatch(cleanText, VALID_NAMES);
        const numberFound = nameFound && isNumberMatch(cleanText);
        const timeValid   = isTimeValidFromText(cleanText);
        const amount      = detectAmount(cleanText);
        const payType     = detectPaymentType(cleanText);
        const seconds     = Math.floor((amount / RATE_PER_HOUR) * 3600);

        if (nameFound && numberFound && timeValid && seconds > 0) {
            // Record to Firestore
            if (_recordPayment) {
                try { await _recordPayment(amount, payType); } catch (e) { console.error(e); }
            }
            const startTime = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ startTime, totalSeconds: seconds }));
            enterPaidMode(startTime, seconds);
        } else {
            hideLoading();
            let err = "Invalid receipt. ";
            if (!nameFound) err += "Name not matched. ";
            else if (!numberFound) err += "Account/number not matched. ";
            if (!timeValid) err += "Receipt older than 10min. ";
            if (seconds <= 0) err += "Amount not found. ";
            showToast(err, "error", 6000);
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

// ─── Paid countdown mode ──────────────────────────────────
function enterPaidMode(startTime, totalSeconds) {
    hideLoading();
    removePayOverlays();
    document.getElementById("countdownPage")?.remove();
    hideMainPage();

    const page = document.createElement("div");
    page.id = "paidCountdownPage";
    page.style.cssText = `
        position:fixed;inset:0;z-index:100;background:#0a0f1a;
        display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:30px;
    `;

    const timerBtn = document.createElement("button");
    timerBtn.id = "paidTimerBtn";
    timerBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:2rem;font-weight:700;
        padding:1.5rem 3rem;background:#00d4aa;color:#0a0f1a;
        border:none;cursor:default;letter-spacing:0.1em;
    `;

    const bizBtn = document.createElement("button");
    bizBtn.textContent = "BUSINESS";
    bizBtn.style.cssText = `
        font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
        padding:1rem 3rem;background:transparent;color:#e8edf5;
        border:2px solid #e8edf5;cursor:pointer;letter-spacing:0.1em;
        transition:all 0.3s ease;
    `;
    bizBtn.onmouseenter = () => { bizBtn.style.background = "#e8edf5"; bizBtn.style.color = "#0a0f1a"; };
    bizBtn.onmouseleave = () => { bizBtn.style.background = "transparent"; bizBtn.style.color = "#e8edf5"; };

    page.append(timerBtn, bizBtn);
    document.body.appendChild(page);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            localStorage.removeItem(STORAGE_KEY);
            document.getElementById("paidCountdownPage")?.remove();
            showMainPage();
            showToast("Session expired. Pay again to continue.", "error");
            attachPayBtnHandler();
        } else {
            timerBtn.textContent = formatTime(remaining);
        }
    }, 1000);
}

// ─── Restore paid session on load ─────────────────────────
function restorePaidSession() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return;

    try {
        const { startTime, totalSeconds } = JSON.parse(savedData);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (totalSeconds - elapsed > 0) {
            enterPaidMode(startTime, totalSeconds);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
}
