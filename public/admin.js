// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config (use the same as in your main app)
const firebaseConfig = {
  apiKey: "AIzaSyDpNJIZoLeZUhIoTepbLb_3rRLpseu9Zdo",
  authDomain: "my-project-66803-95cb3.firebaseapp.com",
  projectId: "my-project-66803-95cb3",
  storageBucket: "my-project-66803-95cb3.firebasestorage.app",
  messagingSenderId: "167159607898",
  appId: "1:167159607898:web:23ca11366b88868b085e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Admin Email
const ADMIN_EMAIL = "jmlsd75@gmail.com";

// HTML container for table
const adminContainer = document.getElementById("adminContainer");

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

// Check auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login to access admin dashboard.");
    window.location.href = "index.html"; // redirect to main page
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    alert("Access denied: not admin.");
    window.location.href = "index.html";
    return;
  }

  // If admin, fetch and display payments
  await loadPayments();
});

// Logout function
logoutBtn.onclick = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// Function to load all payments
async function loadPayments() {
  adminContainer.innerHTML = ""; // clear previous content

  // Create table
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";

  // Table header
  const header = document.createElement("tr");
  ["User Name", "Amount (TZS)", "Account Type"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    th.style.border = "1px solid #000";
    th.style.padding = "8px";
    th.style.backgroundColor = "#f0f0f0";
    header.appendChild(th);
  });
  table.appendChild(header);

  // Fetch all users
  const usersSnapshot = await getDocs(collection(db, "users"));
  let totalAmount = 0;
  let totalUsers = 0;

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const paymentsSnapshot = await getDocs(collection(db, "users", userId, "payments"));

    paymentsSnapshot.forEach(paymentDoc => {
      const payment = paymentDoc.data();
      const row = document.createElement("tr");

      // User Name
      const tdName = document.createElement("td");
      tdName.textContent = payment.userName || "-";
      tdName.style.border = "1px solid #000";
      tdName.style.padding = "8px";
      row.appendChild(tdName);

      // Amount
      const tdAmount = document.createElement("td");
      tdAmount.textContent = payment.amount || 0;
      tdAmount.style.border = "1px solid #000";
      tdAmount.style.padding = "8px";
      row.appendChild(tdAmount);

      // Account Type
      const tdType = document.createElement("td");
      tdType.textContent = payment.type || "-";
      tdType.style.border = "1px solid #000";
      tdType.style.padding = "8px";
      row.appendChild(tdType);

      table.appendChild(row);

      totalAmount += payment.amount || 0;
      totalUsers++;
    });
  }

  // Totals row
  const totalRow = document.createElement("tr");
  totalRow.style.fontWeight = "bold";

  const tdTotalUsers = document.createElement("td");
  tdTotalUsers.textContent = `Total Users: ${totalUsers}`;
  tdTotalUsers.style.border = "1px solid #000";
  tdTotalUsers.style.padding = "8px";
  totalRow.appendChild(tdTotalUsers);

  const tdTotalAmount = document.createElement("td");
  tdTotalAmount.textContent = `Total: ${totalAmount}`;
  tdTotalAmount.style.border = "1px solid #000";
  tdTotalAmount.style.padding = "8px";
  totalRow.appendChild(tdTotalAmount);

  const tdEmpty = document.createElement("td");
  tdEmpty.textContent = "-";
  tdEmpty.style.border = "1px solid #000";
  tdEmpty.style.padding = "8px";
  totalRow.appendChild(tdEmpty);

  table.appendChild(totalRow);

  adminContainer.appendChild(table);
}
