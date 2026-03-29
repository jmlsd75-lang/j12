// ─── admin.js — Admin dashboard (standalone page) ─────────
import { firebaseConfig, ADMIN_EMAILS } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ─── Firebase init ────────────────────────────────────────
const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ─── DOM refs ─────────────────────────────────────────────
const adminContainer = document.getElementById("adminContainer");
const logoutBtn      = document.getElementById("logoutBtn");
const statCount      = document.getElementById("statCount");
const statAmount     = document.getElementById("statAmount");
const statUsers      = document.getElementById("statUsers");

// ─── Auth guard ───────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    if (!ADMIN_EMAILS.includes(user.email)) {
        alert("Access denied: not an admin.");
        window.location.href = "index.html";
        return;
    }
    await loadPayments();
});

// ─── Logout ───────────────────────────────────────────────
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});

// ─── Format number with commas ────────────────────────────
function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ─── Type tag helper ──────────────────────────────────────
function typeTag(type) {
    const t = (type || "Unknown").toLowerCase();
    let cls = "type-unknown";
    if (t.includes("tigo") || t.includes("mix")) cls = "type-tigo";
    else if (t.includes("airtel")) cls = "type-airtel";
    else if (t.includes("crdb") || t.includes("bank")) cls = "type-crdb";
    return `<span class="type-tag ${cls}">${type || "Unknown"}</span>`;
}

// ─── Load all payments ────────────────────────────────────
async function loadPayments() {
    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allPayments = [];
        const userSet = new Set();
        let totalAmount = 0;

        for (const userDoc of usersSnapshot.docs) {
            const paymentsSnapshot = await getDocs(collection(db, "users", userDoc.id, "payments"));
            paymentsSnapshot.forEach(paymentDoc => {
                const p = paymentDoc.data();
                allPayments.push(p);
                userSet.add(userDoc.id);
                totalAmount += (p.amount || 0);
            });
        }

        // Sort newest first
        allPayments.sort((a, b) => {
            const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return tb - ta;
        });

        // Update stats
        statCount.textContent  = allPayments.length;
        statAmount.textContent = formatNumber(totalAmount);
        statUsers.textContent  = userSet.size;

        // Build table
        if (allPayments.length === 0) {
            adminContainer.innerHTML = `<div class="empty-state">No payments recorded yet.</div>`;
            return;
        }

        let html = `<table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>USER NAME</th>
                    <th>AMOUNT (TZS)</th>
                    <th>TYPE</th>
                    <th>DATE</th>
                </tr>
            </thead>
            <tbody>`;

        allPayments.forEach((p, i) => {
            const dateStr = p.timestamp
                ? new Date(p.timestamp).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                })
                : "—";

            html += `<tr>
                <td style="color:var(--muted)">${i + 1}</td>
                <td>${p.userName || "—"}</td>
                <td style="font-weight:700;color:var(--accent)">${formatNumber(p.amount || 0)}</td>
                <td>${typeTag(p.type)}</td>
                <td style="color:var(--muted);font-size:0.6rem">${dateStr}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        adminContainer.innerHTML = html;

    } catch (error) {
        console.error("Failed to load payments:", error);
        adminContainer.innerHTML = `<div class="empty-state" style="color:var(--red)">Failed to load data. Check Firestore permissions.</div>`;
    }
}
