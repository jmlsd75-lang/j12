export function initFreeMode(freeBtn, showToast) {
    if (!freeBtn) return;

    const STORAGE_KEY = "freeTrialStartTime";
    const FREE_SECONDS = 180;   // 3 minutes
    const WAIT_SECONDS = 86400; // 24 hours

    let clickGuard = false;

    // ─── Helpers ─────────────────────────────────────────
    function formatTime(sec) {
        const h = String(Math.floor(sec / 3600)).padStart(2, "0");
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function showMainPage() {
        document.querySelector(".main-container")?.style && 
            (document.querySelector(".main-container").style.display = "flex");
        document.getElementById("bottomControls")?.style &&
            (document.getElementById("bottomControls").style.display = "flex");
        document.getElementById("userInfo")?.style &&
            (document.getElementById("userInfo").style.display = "flex");
        document.getElementById("appHeader")?.style &&
            (document.getElementById("appHeader").style.display = "block");
    }

    function hideMainPage() {
        document.querySelector(".main-container")?.style &&
            (document.querySelector(".main-container").style.display = "none");
        document.getElementById("bottomControls")?.style &&
            (document.getElementById("bottomControls").style.display = "none");
        document.getElementById("userInfo")?.style &&
            (document.getElementById("userInfo").style.display = "none");
        document.getElementById("appHeader")?.style &&
            (document.getElementById("appHeader").style.display = "none");
    }

    // ─── Wait Mode (after free trial expires) ────────────
    function enterWaitMode(startTime) {
        document.getElementById("countdownPage")?.remove();
        showMainPage();
        freeBtn.classList.add("hidden");

        const bc = document.getElementById("bottomControls");
        if (!bc) return;

        // Only create buttons once
        if (!document.getElementById("waitBtn")) {
            const waitBtn = document.createElement("button");
            waitBtn.id = "waitBtn";
            waitBtn.disabled = true;

            const payBtn = document.createElement("button");
            payBtn.id = "payBtn";
            payBtn.textContent = "PAY";
            // NO click handler here — pay.js MutationObserver handles it

            bc.insertBefore(waitBtn, bc.firstChild);
            bc.insertBefore(payBtn, waitBtn.nextSibling);
        }

        const waitBtnEl = document.getElementById("waitBtn");

        const waitInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = WAIT_SECONDS - elapsed;

            if (remaining <= 0) {
                clearInterval(waitInterval);
                localStorage.removeItem(STORAGE_KEY);
                waitBtnEl?.remove();
                document.getElementById("payBtn")?.remove();
                clickGuard = false;
                freeBtn.classList.remove("hidden");
                showToast("Free mode available again!", "success");
            } else {
                waitBtnEl.textContent = `WAIT ${formatTime(remaining)}`;
            }
        }, 1000);
    }

    // ─── Free Countdown (3 minutes) ──────────────────────
    function enterFreeMode(startTime) {
        hideMainPage();

        if (!document.getElementById("countdownPage")) {
            const page = document.createElement("div");
            page.id = "countdownPage";
            page.style.cssText = `
                position:fixed;inset:0;z-index:100;background:#0a0f1a;
                display:flex;flex-direction:column;align-items:center;
                justify-content:center;gap:30px;
            `;

            const timer = document.createElement("button");
            timer.id = "greenTimerBtn";
            timer.style.cssText = `
                font-family:'Orbitron',monospace;font-size:2rem;font-weight:700;
                padding:1.5rem 3rem;background:#00d4aa;color:#0a0f1a;
                border:none;cursor:default;letter-spacing:0.1em;
            `;

            const bizBtn = document.createElement("button");
            bizBtn.id = "businessBtn";
            bizBtn.textContent = "BUSINESS";
            bizBtn.style.cssText = `
                font-family:'Orbitron',monospace;font-size:1rem;font-weight:600;
                padding:1rem 3rem;background:transparent;color:#e8edf5;
                border:2px solid #e8edf5;cursor:pointer;letter-spacing:0.1em;
                transition:all 0.3s ease;
            `;
            bizBtn.onmouseenter = () => { bizBtn.style.background = "#e8edf5"; bizBtn.style.color = "#0a0f1a"; };
            bizBtn.onmouseleave = () => { bizBtn.style.background = "transparent"; bizBtn.style.color = "#e8edf5"; };

            page.appendChild(timer);
            page.appendChild(bizBtn);
            document.body.appendChild(page);
        }

        const timerEl = document.getElementById("greenTimerBtn");

        const freeInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = FREE_SECONDS - elapsed;

            if (remaining <= 0) {
                clearInterval(freeInterval);
                document.getElementById("countdownPage")?.remove();
                enterWaitMode(startTime);
            } else {
                timerEl.textContent = formatTime(remaining);
            }
        }, 1000);
    }

    // ─── Restore State on Load ───────────────────────────
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

    // ─── Click → Start Free Trial ────────────────────────
    if (!clickGuard) {
        clickGuard = true;
        freeBtn.addEventListener("click", () => {
            const now = Date.now();
            localStorage.setItem(STORAGE_KEY, now.toString());
            enterFreeMode(now);
        });
    }
}
