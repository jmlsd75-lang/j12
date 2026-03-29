import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
    authDomain: "my-project-66803-95cb3.firebaseapp.com",
    projectId: "my-project-66803-95cb3",
    storageBucket: "my-project-66803-95cb3.firebasestorage.app",
    messagingSenderId: "167159607898",
    appId: "1:167159607898:web:23ca11366b88868b085e63"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// ===== Page detection =====
const onFreePage = document.getElementById('freeCountdown') !== null;

if (onFreePage) {
    initFreePage();
} else {
    // On index.html — just expose the navigation function
    window.handleFree = function () {
        window.location.href = 'free.html';
    };
}

// ===== Free page logic =====
function initFreePage() {
    const FREE_SECONDS = 300; // ← change duration here (300 = 5 min)
    let freeInterval = null;
    let awaitInterval = null;

    // Auth guard — redirect if not logged in
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        startFreeCountdown(FREE_SECONDS);
        startAwaitCountdown();
        spawnFireflies();
    });

    // --- Free session countdown ---
    function startFreeCountdown(seconds) {
        const endTime = Date.now() + seconds * 1000;
        const el = document.getElementById('freeCountdown');
        el.textContent = fmt(seconds);

        freeInterval = setInterval(() => {
            const rem = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            el.textContent = fmt(rem);
            if (rem <= 0) {
                clearInterval(freeInterval);
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    // --- AWAIT 24h countdown ---
    function startAwaitCountdown() {
        let rem = 24 * 3600; // 86400 seconds
        const el = document.getElementById('awaitCountdown');
        if (!el) return;
        el.textContent = fmt(rem);

        awaitInterval = setInterval(() => {
            rem = Math.max(0, rem - 1);
            el.textContent = fmt(rem);
        }, 1000);
    }

    // --- Format seconds → HH:MM:SS ---
    function fmt(s) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }

    // --- Menu panel ---
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.getElementById('menuPanel').classList.add('open');
    });
    document.getElementById('menuClose').addEventListener('click', () => {
        document.getElementById('menuPanel').classList.remove('open');
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('menuPanel').classList.remove('open');
            alert(item.dataset.action.toUpperCase() + ' — coming soon');
        });
    });

    // --- Pay button ---
    document.getElementById('payBtn').addEventListener('click', () => {
        alert('Pay — coming soon');
    });

    // --- Fireflies ---
    function spawnFireflies() {
        const box = document.getElementById('fireflies');
        if (!box) return;
        for (let i = 0; i < 55; i++) {
            const f = document.createElement('div');
            f.className = 'firefly';
            f.style.left = Math.random() * 100 + '%';
            f.style.top = Math.random() * 68 + '%';
            f.style.animationDelay = (Math.random() * 6) + 's';
            f.style.animationDuration = (Math.random() * 3 + 4) + 's';
            box.appendChild(f);
        }
    }
}
