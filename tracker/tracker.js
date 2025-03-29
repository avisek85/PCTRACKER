import fs from "fs/promises"; // Use fs/promises for async operations
import { activeWindow } from "active-win";
import axios from "axios";

// const STORAGE_FILE = "storage.json";
let lastWindow = null;
let lastStartTime = Date.now();
let dataBuffer = []; // Store entries in memory before batch-saving
const SAVE_INTERVAL = 60 * 1000; // Save every 60 seconds

const STORAGE_FILE =  "storage.json"; // Cross-platform path
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/api/track"; // Use env variable




async function loadLocalData() {
    try {
        await fs.access(STORAGE_FILE); // Check if file exists
        const rawData = await fs.readFile(STORAGE_FILE, { encoding: "utf8" });
        return rawData ? JSON.parse(rawData) : [];
    } catch (error) {
        console.warn("[WARN] Storage file not found or corrupted. Creating a new one...");
        await fs.writeFile(STORAGE_FILE, JSON.stringify([]), { encoding: "utf8" });
        return [];
    }
}

async function saveLocalData() {
    if (dataBuffer.length === 0) return; // Avoid unnecessary writes
    try {
        let existingData = await loadLocalData();
        if (!Array.isArray(existingData)) existingData = [];
        existingData.push(...dataBuffer);
        await fs.writeFile(STORAGE_FILE, JSON.stringify(existingData, null, 4), { encoding: "utf8" });



        console.log(`[INFO] Saved ${dataBuffer.length} entries to disk.`);
        dataBuffer = []; // Clear buffer after saving
    } catch (error) {
        console.error("[ERROR] Failed to save data:", error);
    }
}

// Send data to backend & clear local file after successful send
async function sendToBackend() {
    try {

        await saveLocalData(); // Ensure latest data is written before sending
        let storedData = await loadLocalData();
        if (!Array.isArray(storedData) || storedData.length === 0) {
            console.log("[INFO] No new data to send.");
            return;
        }

        const response = await axios.post(BACKEND_URL, { data: storedData });
        console.log(`[INFO] Successfully sent ${storedData.length} entries to backend.`);
        console.log("[DEBUG] Server Response:", response.data);

        if (response.status === 200) {
            console.log(`[INFO] Successfully sent ${storedData.length} entries to backend.`);
            await clearLocalStorage(); // Clear file only on success
        } else {
            console.warn("[WARNING] Backend did not return success response:", response.statusText);
        } // Clear file after send
    } catch (error) {
        console.error("[ERROR] Failed to send data to backend:", error);
    }
}

/**
 * Clears the local storage file by resetting it to an empty array.
 */
async function clearLocalStorage() {
    try {
        await fs.writeFile(STORAGE_FILE, JSON.stringify([], null, 4), "utf8");
        console.log("[INFO] Local storage cleared after successful upload.");
    } catch (error) {
        console.error("[ERROR] Failed to clear local storage:", error);
    }
}

async function trackActivity() {
  try {
    const window = await activeWindow();
    if (!window) return;

    // let data = loadLocalData();
    let now = Date.now();

    if (lastWindow && lastWindow.title !== window.title) {
      let entry = {
        title: lastWindow.title,
        app: lastWindow.owner.name,
        date: new Date(lastStartTime).toISOString().split("T")[0],
        startTime: new Date(lastStartTime).toISOString(),
        endTime: new Date(now).toISOString(),
        duration: Math.floor((now - lastStartTime) / 1000),
      };

     
      dataBuffer.push(entry); // Store in buffer instead of writing immediately
    }

    lastWindow = window;
    lastStartTime = now;
  } catch (error) {
    console.error("Error tracking window:", error);
  }
}

// Run tracking every 5 seconds
setInterval(trackActivity, 5000);

// Batch save every 60 seconds
setInterval(saveLocalData, SAVE_INTERVAL);

// Send batch data to backend every 60 seconds
setInterval(sendToBackend, SAVE_INTERVAL); 

process.on("SIGINT", async () => {
    console.log("\n[INFO] Exiting... Saving remaining data.");
    await saveLocalData();
    // await sendToBackend();   UNcomment it
    process.exit(0);
});