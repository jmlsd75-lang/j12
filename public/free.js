// free.js

export function initFreeMode(freeBtn, showToast) {
    if (!freeBtn) return;

    freeBtn.addEventListener("click", () => {
        // Prevent spamming the button
        freeBtn.disabled = true;

        // 1. Hide the whole previous page
        const mainContainer = document.querySelector('.main-container');
        const bottomControls = document.getElementById('bottomControls');
        const userInfo = document.getElementById('userInfo');

        if (mainContainer) mainContainer.style.display = 'none';
        if (bottomControls) bottomControls.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';

        // 2. Create the Countdown Page overlay
        const countdownPage = document.createElement('div');
        countdownPage.id = 'countdownPage';
        countdownPage.style.cssText = `
            position: fixed; inset: 0; z-index: 100; 
            background: #0a0f1a; 
            display: flex; flex-direction: column; 
            align-items: center; justify-content: center; gap: 30px;
        `;

        // Green button showing the 180s countdown
        const greenTimerBtn = document.createElement('button');
        greenTimerBtn.id = 'greenTimerBtn';
        greenTimerBtn.style.cssText = `
            font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 700;
            padding: 1.5rem 3rem; background: #00d4aa; color: #0a0f1a; 
            border: none; cursor: default; letter-spacing: 0.1em;
        `;

        // Business button
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

        /* ---------------------------------------------------------
           HOOK FOR BUSINESS.JS: 
           Add your business.js import at the top of index.html 
           and initialize it here like this:
           import { initBusiness } from './business.js';
           initBusiness(businessBtn, showToast);
        --------------------------------------------------------- */

        countdownPage.appendChild(greenTimerBtn);
        countdownPage.appendChild(businessBtn);
        document.body.appendChild(countdownPage);

        // 3. Start 180 second countdown
        let totalSeconds = 180;

        function formatTime(seconds) {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        greenTimerBtn.textContent = formatTime(totalSeconds);
        showToast("Free session started. 3 minutes remaining.", "success");

        const timerInterval = setInterval(() => {
            totalSeconds--;
            greenTimerBtn.textContent = formatTime(totalSeconds);

            // 4. When countdown reaches 0
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);

                // Hide countdown page, go back to previous page
                countdownPage.remove();

                if (mainContainer) mainContainer.style.display = 'flex';
                if (userInfo) userInfo.style.display = 'flex';
                if (bottomControls) bottomControls.style.display = 'flex';

                // 5. Replace FREE button with non-clickable WAIT button and PAY button
                freeBtn.remove(); // Remove the original free button

                // Create Non-clickable Wait Button (24hr countdown)
                const waitBtn = document.createElement('button');
                waitBtn.id = 'waitBtn';
                waitBtn.disabled = true;
                waitBtn.style.cssText = `
                    font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 600;
                    padding: 1rem 1.5rem; background: rgba(255,255,255,0.05); color: #5a6b85; 
                    border: 2px solid #5a6b85; cursor: not-allowed; letter-spacing: 0.05em;
                    text-transform: uppercase;
                `;

                // Create PAY Button
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

                /* ---------------------------------------------------------
                   HOOK FOR PAY.JS: 
                   Add your pay.js import at the top of index.html 
                   and initialize it here like this:
                   import { initPay } from './pay.js';
                   initPay(payBtn, showToast);
                --------------------------------------------------------- */

                // Insert them into the bottom controls
                if (bottomControls) {
                    bottomControls.insertBefore(waitBtn, bottomControls.firstChild);
                    bottomControls.insertBefore(payBtn, waitBtn.nextSibling);
                }

                // 6. Start 24-hour countdown on the wait button
                let waitSeconds = 24 * 3600; // 86400 seconds
                waitBtn.textContent = `wait for ${formatTime(waitSeconds)}`;

                const waitInterval = setInterval(() => {
                    waitSeconds--;
                    waitBtn.textContent = `wait for ${formatTime(waitSeconds)}`;

                    // When 24 hours finish, restore the FREE button automatically
                    if (waitSeconds <= 0) {
                        clearInterval(waitInterval);
                        waitBtn.remove();
                        
                        const newFreeBtn = document.createElement('button');
                        newFreeBtn.id = 'freeBtn';
                        newFreeBtn.className = 'btn btn-free';
                        newFreeBtn.textContent = 'FREE';
                        payBtn.replaceWith(newFreeBtn);
                        
                        // Re-initialize the free mode cycle
                        initFreeMode(newFreeBtn, showToast);
                        showToast("Free mode is available again!", "success");
                    }
                }, 1000);
            }
        }, 1000);
    });
}
