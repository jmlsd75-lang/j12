import { db } from "./firestore.js";

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Display system name
document.getElementById("title").innerText =
"JAMAL SAID KAZEMBE MULTISYSTEM MANAGEMENT";

// Button event
document.getElementById("saveBtn").addEventListener("click", async () => {
    try {
        await addDoc(collection(db, "test_data"), {
            message: "Hello from Jamal System",
            time: new Date().toString()
        });

        alert("Data saved successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error saving data");
    }
});
