<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Free Access</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            background: #050505;
            color: #f5f5f4;
            overflow-x: hidden;
        }

        .top-bar {
            position: sticky;
            top: 0;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 32px;
            background: rgba(5, 5, 5, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .top-bar-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .back-link {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgb(168, 162, 158);
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 500;
            transition: color 0.3s;
        }

        .back-link:hover { color: #f97316; }

        .back-arrow {
            display: inline-block;
            width: 18px;
            height: 18px;
            border-left: 2px solid currentColor;
            border-bottom: 2px solid currentColor;
            transform: rotate(45deg);
        }

        .free-badge {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: rgb(168, 162, 158);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 5px 12px;
            border-radius: 8px;
        }

        .top-bar-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .top-bar-right a {
            color: rgb(120, 113, 108);
            text-decoration: none;
            font-size: 0.78rem;
            font-weight: 500;
            transition: color 0.3s;
        }

        .top-bar-right a:hover { color: #f97316; }

        .btn-logout {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 8px 18px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: rgb(168, 162, 158);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Inter', sans-serif;
        }

        .btn-logout:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.08);
            border-color: rgba(239, 68, 68, 0.2);
        }

        .btn-logout:active {
            transform: scale(0.97);
        }

        .btn-logout:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            pointer-events: none;
        }

        .btn-logout svg {
            width: 15px;
            height: 15px;
            stroke: currentColor;
            stroke-width: 1.8;
            fill: none;
            flex-shrink: 0;
            transition: stroke 0.3s;
        }

        .btn-logout.loading svg {
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .glow-orb {
            position: fixed;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.04) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        .main-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 100px 24px 0;
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .main-content.active { display: flex; }

        .main-content h2 {
            font-size: 1.3rem;
            font-weight: 600;
            color: rgb(168, 162, 158);
            margin-bottom: 12px;
        }

        .btn-menu {
            display: inline-block;
            padding: 16px 64px;
            font-size: 1.05rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #050505;
            background: linear-gradient(135deg, #f97316, #fb923c);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 30px rgba(249, 115, 22, 0.2), 0 0 60px rgba(249, 115, 22, 0.05);
            text-decoration: none;
            font-family: 'Inter', sans-serif;
        }

        .btn-menu:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 40px rgba(249, 115, 22, 0.35), 0 0 80px rgba(249, 115, 22, 0.1);
        }

        .btn-menu:active { transform: translateY(0); }

        .timer-label {
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgb(87, 83, 78);
            margin-top: 40px;
        }

        .timer-display {
            font-size: 4rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #f5f5f4;
            font-variant-numeric: tabular-nums;
            line-height: 1;
            margin-bottom: 20px;
        }

        .timer-display.warning {
            color: #f97316;
            animation: pulse-glow 1s ease-in-out infinite;
        }

        .timer-display.danger {
            color: #ef4444;
            animation: pulse-glow-red 0.6s ease-in-out infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { text-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
            50% { text-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }

        @keyframes pulse-glow-red {
            0%, 100% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
            50% { text-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
        }

        .timer-bar {
            max-width: 360px;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            overflow: hidden;
        }

        .timer-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #f97316, #fb923c);
            border-radius: 4px;
            transition: width 1s linear;
        }

        .timer-bar-fill.warning { background: linear-gradient(90deg, #f97316, #ef4444); }
        .timer-bar-fill.danger { background: #ef4444; }

        .lock-section {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 50;
            background: #050505;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 24px;
            pointer-events: none;
        }

        .lock-icon-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(34, 197, 94, 0.08);
            border: 1px solid rgba(34, 197, 94, 0.15);
            margin-bottom: 28px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s;
            text-decoration: none;
        }

        .lock-icon-link:hover {
            background: rgba(34, 197, 94, 0.15);
            border-color: rgba(34, 197, 94, 0.3);
            transform: scale(1.08);
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.15);
        }

        .lock-icon-link:active { transform: scale(0.97); }

        .lock-icon-link svg {
            width: 32px;
            height: 32px;
            stroke: #22c55e;
            stroke-width: 1.5;
            fill: none;
            transition: stroke 0.3s;
        }

        .lock-icon-link:hover svg { stroke: #4ade80; }

        .lock-section h2 {
            font-size: 1.15rem;
            font-weight: 600;
            color: rgb(120, 113, 108);
            margin-bottom: 6px;
        }

        .lock-section .lock-sub {
            font-size: 0.78rem;
            color: rgb(87, 83, 78);
            margin-bottom: 40px;
        }

        .lock-row {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .wait-timer {
            font-size: 2.8rem;
            font-weight: 800;
            letter-spacing: 0.03em;
            color: rgb(87, 83, 78);
            font-variant-numeric: tabular-nums;
            line-height: 1;
        }

        .btn-pay {
            display: inline-block;
            padding: 14px 40px;
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #050505;
            background: linear-gradient(135deg, #22c55e, #4ade80);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.2), 0 0 60px rgba(34, 197, 94, 0.05);
            text-decoration: none;
            font-family: 'Inter', sans-serif;
            flex-shrink: 0;
            pointer-events: auto;
        }

        .btn-pay:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.35), 0 0 80px rgba(34, 197, 94, 0.1);
        }

        .btn-pay:active { transform: translateY(0); }

        .wait-bar {
            max-width: 360px;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 12px;
        }

        .wait-bar-fill {
            height: 100%;
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 3px;
            transition: width 1s linear;
        }

        .wait-label {
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgb(68, 64, 60);
        }

        .footer-text {
            text-align: center;
            padding: 48px 24px 32px;
            position: relative;
            z-index: 2;
            display: none;
        }

        .footer-text.active { display: block; }

        .footer-text p {
            font-size: 0.7rem;
            color: rgb(87, 83, 78);
            letter-spacing: 0.03em;
        }

        /* Logout toast */
        .logout-toast {
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.2);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #fca5a5;
            font-size: 0.78rem;
            font-weight: 500;
            padding: 12px 24px;
            border-radius: 10px;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s ease;
        }

        .logout-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        @media (max-width: 640px) {
            .top-bar { padding: 16px 20px; }
            .back-link span { display: none; }
            .main-content { padding: 70px 20px 0; }
            .main-content h2 { font-size: 1.1rem; }
            .timer-display { font-size: 3rem; }
            .wait-timer { font-size: 2rem; }
            .lock-row { flex-direction: column; gap: 16px; }
            .btn-menu, .btn-pay { padding: 14px 40px; font-size: 0.9rem; }
            .btn-logout span { display: none; }
            .btn-logout { padding: 8px 12px; }
        }
    </style>
</head>
<body>

    <div class="glow-orb"></div>

    <div class="top-bar" id="topBar">
        <div class="top-bar-left">
            <a href="index.html" class="back-link">
                <span class="back-arrow"></span>
                <span>Home</span>
            </a>
            <div class="free-badge">Free</div>
        </div>
        <div class="top-bar-right">
            <a href="index.html">Back to site</a>
            <button class="btn-logout" id="logoutBtn" type="button">
                <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Logout</span>
            </button>
        </div>
    </div>

    <div class="main-content" id="mainContent">
        <h2>Select an option below</h2>
        <a href="menu.html" class="btn-menu">MENU</a>
        <div class="timer-label">Session Time Remaining</div>
        <div class="timer-display" id="timerDisplay">03:00</div>
        <div class="timer-bar">
            <div class="timer-bar-fill" id="timerBarFill" style="width: 100%;"></div>
        </div>
    </div>

    <div class="lock-section" id="lockSection">
        <a href="pay.html" class="lock-icon-link">
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </a>
        <h2>Pay to continue use system</h2>
        <p class="lock-sub">Your session has expired — tap the lock or button below</p>
        <div class="lock-row">
            <div class="wait-timer" id="waitTimerDisplay">24:00:00</div>
            <a href="pay.html" class="btn-pay">Pay</a>
        </div>
        <div class="wait-bar">
            <div class="wait-bar-fill" id="waitBarFill" style="width: 100%;"></div>
        </div>
        <div class="wait-label">Waiting period</div>
    </div>

    <div class="footer-text" id="footerSection">
        <p>Jamal Said Kazembe Multisystem Management</p>
    </div>

    <div class="logout-toast" id="logoutToast">Signing out…</div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
            authDomain: "my-project-66803-95cb3.firebaseapp.com",
            projectId: "my-project-66803-95cb3",
            storageBucket: "my-project-66803-95cb3.firebasestorage.app",
            messagingSenderId: "167159607898",
            appId: "1:167159607898:web:23ca11366b88868b085e63"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const logoutBtn = document.getElementById("logoutBtn");
        const logoutToast = document.getElementById("logoutToast");

        logoutBtn.addEventListener("click", async () => {
            logoutBtn.disabled = true;
            logoutBtn.classList.add("loading");

            // Show toast
            logoutToast.classList.add("show");

            try {
                // Clear all local session data
                localStorage.removeItem("free_session_start");
                localStorage.removeItem("free_lock_start");

                // Actually sign out from Firebase
                await signOut(auth);

                // Small delay so the user sees the feedback
                setTimeout(() => {
                    logoutToast.textContent = "Signed out — redirecting…";
                }, 400);

                setTimeout(() => {
                    // Hard redirect — no going back
                    window.location.replace("index.html");
                }, 1200);

            } catch (error) {
                console.error("Logout error:", error);
                // Still clear and redirect even if Firebase throws
                localStorage.removeItem("free_session_start");
                localStorage.removeItem("free_lock_start");
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 800);
            }
        });

        // ─── Session / Lock Timer Logic ───
        (function () {
            var SESSION_KEY = "free_session_start";
            var LOCK_KEY = "free_lock_start";
            var SESSION_SEC = 180;
            var LOCK_SEC = 86400;

            var timerDisplay = document.getElementById("timerDisplay");
            var timerBarFill = document.getElementById("timerBarFill");
            var waitDisplay = document.getElementById("waitTimerDisplay");
            var waitBar = document.getElementById("waitBarFill");

            var now = Date.now();

            var lockStart = localStorage.getItem(LOCK_KEY);
            if (lockStart) {
                var lockElapsed = Math.floor((now - parseInt(lockStart, 10)) / 1000);
                if (lockElapsed < LOCK_SEC) {
                    showLockScreen(parseInt(lockStart, 10));
                    return;
                } else {
                    localStorage.removeItem(LOCK_KEY);
                    localStorage.removeItem(SESSION_KEY);
                }
            }

            var sessionStart = localStorage.getItem(SESSION_KEY);
            if (sessionStart) {
                var sessionElapsed = Math.floor((now - parseInt(sessionStart, 10)) / 1000);
                if (sessionElapsed < SESSION_SEC) {
                    showSession(parseInt(sessionStart, 10));
                    return;
                } else {
                    localStorage.removeItem(SESSION_KEY);
                    localStorage.setItem(LOCK_KEY, String(parseInt(sessionStart, 10) + SESSION_SEC * 1000));
                    showLockScreen(parseInt(sessionStart, 10) + SESSION_SEC * 1000);
                    return;
                }
            }

            var freshStart = now;
            localStorage.setItem(SESSION_KEY, String(freshStart));
            showSession(freshStart);

            function showSession(startTs) {
                document.getElementById("topBar").style.display = "flex";
                document.getElementById("mainContent").classList.add("active");
                document.getElementById("footerSection").classList.add("active");

                var interval = setInterval(function () {
                    var elapsed = Math.floor((Date.now() - startTs) / 1000);
                    var remaining = Math.max(0, SESSION_SEC - elapsed);

                    if (remaining <= 0) {
                        clearInterval(interval);
                        timerDisplay.textContent = "00:00";
                        timerBarFill.style.width = "0%";

                        setTimeout(function () {
                            document.getElementById("mainContent").classList.remove("active");
                            document.getElementById("footerSection").classList.remove("active");
                            document.getElementById("topBar").style.display = "none";

                            var lockTs = startTs + SESSION_SEC * 1000;
                            localStorage.removeItem(SESSION_KEY);
                            localStorage.setItem(LOCK_KEY, String(lockTs));
                            showLockScreen(lockTs);
                        }, 800);
                        return;
                    }

                    var m = Math.floor(remaining / 60);
                    var s = remaining % 60;
                    timerDisplay.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
                    timerBarFill.style.width = ((remaining / SESSION_SEC) * 100) + "%";

                    timerDisplay.classList.remove("warning", "danger");
                    timerBarFill.classList.remove("warning", "danger");

                    if (remaining <= 10) {
                        timerDisplay.classList.add("danger");
                        timerBarFill.classList.add("danger");
                    } else if (remaining <= 30) {
                        timerDisplay.classList.add("warning");
                        timerBarFill.classList.add("warning");
                    }
                }, 1000);
            }

            function showLockScreen(lockTs) {
                document.getElementById("lockSection").style.display = "flex";

                var interval = setInterval(function () {
                    var elapsed = Math.floor((Date.now() - lockTs) / 1000);
                    var remaining = Math.max(0, LOCK_SEC - elapsed);

                    if (remaining <= 0) {
                        clearInterval(interval);
                        waitDisplay.textContent = "00:00:00";
                        waitBar.style.width = "0%";
                        localStorage.removeItem(LOCK_KEY);
                        return;
                    }

                    var h = Math.floor(remaining / 3600);
                    var m = Math.floor((remaining % 3600) / 60);
                    var s = remaining % 60;
                    waitDisplay.textContent =
                        String(h).padStart(2, "0") + ":" +
                        String(m).padStart(2, "0") + ":" +
                        String(s).padStart(2, "0");
                    waitBar.style.width = ((remaining / LOCK_SEC) * 100) + "%";
                }, 1000);
            }
        })();
    </script>
</body>
</html>
