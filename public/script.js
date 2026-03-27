import { db } from "./firestore.js";

// Set system title
const titleEl = document.getElementById("title");
titleEl.innerText = "JAMAL SAID KAZEMBE MULTISYSTEM MANAGEMENT";

/**
 * Function to adjust appearance dynamically
 * Ensures full-screen coverage and consistent look on PC and mobile
 */
function setAppearance() {
    const container = document.querySelector(".container");
    const vh = window.innerHeight; // viewport height
    const vw = window.innerWidth;  // viewport width

    // Set container height to full viewport
    container.style.height = vh + "px";

    // Set overlay opacity
    container.style.backgroundColor = "rgba(0,0,0,0.4)";

    // Adjust font size based on screen width
    if (vw >= 1024) {
        titleEl.style.fontSize = "40px"; // large screens
    } else if (vw >= 768) {
        titleEl.style.fontSize = "35px"; // tablets
    } else {
        titleEl.style.fontSize = "30px"; // phones
    }

    // Center title horizontally (already via CSS)
    titleEl.style.textAlign = "center";

    // Optional: add line height for better spacing
    titleEl.style.lineHeight = "1.2";
}

// Run once at start
setAppearance();

// Run on window resize to adjust dynamically
window.addEventListener("resize", setAppearance);
