export function initFreeMode(freeBtn, showToast) {
    if (!freeBtn) return;

    const STORAGE_KEY = 'freeTrialStartTime';
    const FREE_SECONDS = 180;
    const WAIT_SECONDS = 86400;

    let clickGuard = false;

    function formatTime(sec) {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function showMainPage() {
        const mc = document.querySelector('.main-container');
        const bc = document.getElementById('bottomControls');
        const ui = document.getElementById('userInfo');
        if (mc) mc.style.display = 'flex';
        if (bc) bc.style.display = 'flex';
        if (ui) ui.style.display = 'flex';
    }

    function hideMainPage() {
        const mc = document.querySelector('.main-container');
        const bc = document.getElementById('bottomControls');
        const ui = document.getElementById('userInfo');
        if (mc) mc.style.display = 'none';
        if (bc) bc.style.display = 'none';
        if (ui) ui.style.display = 'none';
    }

    // ─── WAIT MODE ─────────────────────────────────────────
    function enterWaitMode(startTime) {
        document.getElementById('countdownPage')?.remove();
        showMainPage();
        freeBtn.classList.add('hidden');

        const bc = document.getElementById('bottomControls');
        if (!bc) return;

        if (!document.getElementById('waitBtn')) {
            const waitBtn = document.createElement('button');
            waitBtn.id = 'waitBtn';
            waitBtn.disabled = true;
            waitBtn.style.cssText = `
                font-family:'Orbitron',sans-serif;font-size:0.7rem;font-weight:600;
                padding:1rem 1.5rem;background:rgba(255,255,255,0.05);color:#5a6b85;
                border:2px solid #5a6b85;cursor:not-allowed;letter-spacing:0.05em;
                text-transform:uppercase;
            `;

            const payBtn = document.createElement('button');
            payBtn.id = 'payBtn';
            payBtn.textContent = 'PAY';
            payBtn.style.cssText = `
                font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
                padding:1rem 3rem;background:transparent;color:#dc3545;
                border:2px solid #dc3545;cursor:pointer;letter-spacing:0.1em;
                text-transform:uppercase;transition:all 0.3s ease;
            `;
            payBtn.onmouseenter = () => { payBtn.style.background = '#dc3545'; payBtn.style.color = 'white'; };
            payBtn.onmouseleave = () => { payBtn.style.background = 'transparent'; payBtn.style.color = '#dc3545'; };

            bc.insertBefore(waitBtn, bc.firstChild);
            bc.insertBefore(payBtn, waitBtn.nextSibling);
        }

        const waitBtnEl = document.getElementById('waitBtn');

        const waitInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = WAIT_SECONDS - elapsed;

            if (remaining <= 0) {
                clearInterval(waitInterval);
                localStorage.removeItem(STORAGE_KEY);
                waitBtnEl?.remove();
                document.getElementById('payBtn')?.remove();
                clickGuard = false;
                freeBtn.classList.remove('hidden');
                showToast("Free mode available again!", "success");
            } else {
                waitBtnEl.textContent = `wait for ${formatTime(remaining)}`;
            }
        }, 1000);
    }

    // ─── FREE COUNTDOWN ────────────────────────────────────
    function enterFreeMode(startTime) {
        hideMainPage();

        if (!document.getElementById('countdownPage')) {
            const page = document.createElement('div');
            page.id = 'countdownPage';
            page.style.cssText = `
                position:fixed;inset:0;z-index:100;background:#0a0f1a;
                display:flex;flex-direction:column;align-items:center;
                justify-content:center;gap:30px;
            `;

            const timer = document.createElement('button');
            timer.id = 'greenTimerBtn';
            timer.style.cssText = `
                font-family:'Orbitron',sans-serif;font-size:2rem;font-weight:700;
                padding:1.5rem 3rem;background:#00d4aa;color:#0a0f1a;
                border:none;cursor:default;letter-spacing:0.1em;
            `;

            const bizBtn = document.createElement('button');
            bizBtn.id = 'businessBtn';
            bizBtn.textContent = 'BUSINESS';
            bizBtn.style.cssText = `
                font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:600;
                padding:1rem 3rem;background:transparent;color:#e8edf5;
                border:2px solid #e8edf5;cursor:pointer;letter-spacing:0.1em;
                transition:all 0.3s ease;
            `;
            bizBtn.onmouseenter = () => { bizBtn.style.background = '#e8edf5'; bizBtn.style.color = '#0a0f1a'; };
            bizBtn.onmouseleave = () => { bizBtn.style.background = 'transparent'; bizBtn.style.color = '#e8edf5'; };

            page.appendChild(timer);
            page.appendChild(bizBtn);
            document.body.appendChild(page);
        }

        const timerEl = document.getElementById('greenTimerBtn');

        const freeInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = FREE_SECONDS - elapsed;

            if (remaining <= 0) {
                clearInterval(freeInterval);
                document.getElementById('countdownPage')?.remove();
                enterWaitMode(startTime);
            } else {
                timerEl.textContent = formatTime(remaining);
            }
        }, 1000);
    }

    // ─── RESTORE STATE ON LOAD ─────────────────────────────
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        const startTime = parseInt(saved, 10);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        if (elapsed < FREE_SECONDS) {
            enterFreeMode(startTime);
            return;
        } else if (elapsed < WAIT_SECONDS) {
            enterWaitMode(startTime);
            return;
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    // ─── CLICK → COUNTDOWN IMMEDIATELY ─────────────────────
    freeBtn.disabled = false;

    if (!clickGuard) {
        clickGuard = true;
        freeBtn.addEventListener("click", () => {
            const now = Date.now();
            localStorage.setItem(STORAGE_KEY, now.toString());
            enterFreeMode(now);
        });
    }
}
