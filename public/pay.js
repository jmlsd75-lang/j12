import { initPay } from './pay.js';

export function initFreeMode(freeBtn, showToast) {
    if (!freeBtn) return;

    const STORAGE_KEY = 'freeTrialStartTime';
    const FREE_SECONDS = 180;       // 3 minutes
    const WAIT_SECONDS = 86400;     // 24 hours

    // ─── CHECK IF PAID SESSION IS ACTIVE ──────────────────────
    // If user has a valid paid session, don't interfere at all
    function isPaidSessionActive() {
        try {
            const data = localStorage.getItem('paidSessionData');
            if (!data) return false;
            const { startTime, totalSeconds } = JSON.parse(data);
            const remaining = totalSeconds - Math.floor((Date.now() - startTime) / 1000);
            return remaining > 0;
        } catch { return false; }
    }

    if (isPaidSessionActive()) return; // Let pay.js handle everything

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

    // --- STATE 2: THE 24-HOUR WAIT MODE ---
    function enterWaitMode(startTime) {
        document.getElementById('countdownPage')?.remove();

        showMainPage();
        freeBtn.classList.add('hidden');

        const bottomControls = document.getElementById('bottomControls');
        if (!bottomControls) return;

        if (!document.getElementById('waitBtn')) {
            const waitBtn = document.createElement('button');
            waitBtn.id = 'waitBtn';
            waitBtn.disabled = true;
            waitBtn.style.cssText = `
                font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 600;
                padding: 1rem 1.5rem; background: rgba(255,255,255,0.05); color: #5a6b85; 
                border: 2px solid #5a6b85; cursor: not-allowed; letter-spacing: 0.05em;
                text-transform: uppercase;
            `;

            const payBtn = document.createElement('button');
            payBtn.id = 'payBtn';
            payBtn.textContent = 'PAY';
            payBtn.style.cssText = `
                font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600;
                padding: 1rem 3rem; background: transparent; color: #dc3545; 
                border: 2px solid #dc3545; cursor: pointer; letter-spacing: 0.1em;
                text-transform: uppercase; transition: all 0.3s ease;
            `;
            payBtn.onmouseenter = () => { payBtn.style.background = '#dc3545'; payBtn.style.color = 'white'; };
            payBtn.onmouseleave = () => { payBtn.style.background = 'transparent'; payBtn.style.color = '#dc3545'; };

            bottomControls.insertBefore(waitBtn, bottomControls.firstChild);
            bottomControls.insertBefore(payBtn, waitBtn.nextSibling);

            // ✅ THIS IS THE FIX — actually call initPay instead of commenting it
            initPay(payBtn, showToast);
        }

        const waitBtnEl = document.getElementById('waitBtn');

        const waitInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const remainingSeconds = WAIT_SECONDS - elapsedSeconds;

            if (remainingSeconds <= 0) {
                clearInterval(waitInterval);
                localStorage.removeItem(STORAGE_KEY);
                waitBtnEl?.remove();
                document.getElementById('payBtn')?.remove();
                freeBtn.classList.remove('hidden');
                showToast("Free mode is available again!", "success");
                initFreeMode(freeBtn, showToast);
            } else {
                waitBtnEl.textContent = `wait for ${formatTime(remainingSeconds)}`;
            }
        }, 1000);
    }

    // --- STATE 1: THE 3-MINUTE FREE MODE ---
    function enterFreeMode(startTime) {
        hideMainPage();

        if (!document.getElementById('countdownPage')) {
            const countdownPage = document.createElement('div');
            countdownPage.id = 'countdownPage';
            countdownPage.style.cssText = `
                position: fixed; inset: 0; z-index: 100; background: #0a0f1a; 
                display: flex; flex-direction: column; align-items: center; 
                justify-content: center; gap: 30px;
            `;

            const greenTimerBtn = document.createElement('button');
            greenTimerBtn.id = 'greenTimerBtn';
            greenTimerBtn.style.cssText = `
                font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 700;
                padding: 1.5rem 3rem; background: #00d4aa; color: #0a0f1a; 
                border: none; cursor: default; letter-spacing: 0.1em;
            `;

            const businessBtn = document.createElement('button');
            businessBtn.id = 'businessBtn';
            businessBtn.textContent = 'BUSINESS';
            businessBtn.style.cssText = `
                font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600;
                padding: 1rem 3rem; background: transparent; color: #e8edf5; 
                border: 2px solid #e8edf5; cursor: pointer; letter-spacing: 0.1em;
                transition: all 0.3s ease;
            `;
            businessBtn.onmouseenter = () => { businessBtn.style.background = '#e8edf5'; businessBtn.style.color = '#0a0f1a'; };
            businessBtn.onmouseleave = () => { businessBtn.style.background = 'transparent'; businessBtn.style.color = '#e8edf5'; };

            countdownPage.appendChild(greenTimerBtn);
            countdownPage.appendChild(businessBtn);
            document.body.appendChild(countdownPage);
        }

        const greenTimerBtn = document.getElementById('greenTimerBtn');

        const freeInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const remainingSeconds = FREE_SECONDS - elapsedSeconds;

            if (remainingSeconds <= 0) {
                clearInterval(freeInterval);
                document.getElementById('countdownPage')?.remove();
                enterWaitMode(startTime);
            } else {
                greenTimerBtn.textContent = formatTime(remainingSeconds);
            }
        }, 1000);
    }

    // --- INITIAL CHECK ON PAGE LOAD ---
    const savedStartTime = localStorage.getItem(STORAGE_KEY);

    if (savedStartTime) {
        const startTime = parseInt(savedStartTime, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

        if (elapsedSeconds < FREE_SECONDS) {
            enterFreeMode(startTime);
            return;
        } else if (elapsedSeconds < WAIT_SECONDS) {
            enterWaitMode(startTime);
            return;
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    // --- NORMAL STATE: AWAITING CLICK ---
    freeBtn.disabled = false;
    freeBtn.addEventListener("click", () => {
        const now = Date.now();
        localStorage.setItem(STORAGE_KEY, now.toString());
        enterFreeMode(now);
    }, { once: true });
}
