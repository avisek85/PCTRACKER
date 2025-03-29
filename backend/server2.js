import fs from "fs/promises"; // Use fs/promises for async operations
import { activeWindow } from "active-win";
import axios from "axios";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "storage.json"); // Cross-platform path
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/track"; // Use env variable

let lastWindow = null;
let lastStartTime = Date.now();
let dataBuffer = []; // Store entries in memory before batch-saving
const SAVE_INTERVAL = 60 * 1000; // Save every 60 seconds

// Load existing data from file
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

// Save data from buffer to storage.json
async function saveLocalData() {
    if (dataBuffer.length === 0) return; // No new data to save

    try {
        let existingData = await loadLocalData();
        if (!Array.isArray(existingData)) existingData = []; // Ensure it's always an array

        existingData.push(...dataBuffer);
        await fs.writeFile(STORAGE_FILE, JSON.stringify(existingData, null, 4), { encoding: "utf8" });

        console.log(`[INFO] Saved ${dataBuffer.length} entries to disk.`);
        dataBuffer = []; // Clear buffer after saving
    } catch (error) {
        console.error("[ERROR] Failed to save data:", error);
    }
}

// Send data to backend
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

        await clearLocalStorage(); // Clear file only on success
    } catch (error) {
        console.error("[ERROR] Failed to send data to backend:", error.response?.data || error.message || error);
    }
}

// Clear storage after successful send
async function clearLocalStorage() {
    try {
        await fs.writeFile(STORAGE_FILE, JSON.stringify([], null, 4), "utf8");
        console.log("[INFO] Local storage cleared after successful upload.");
    } catch (error) {
        console.error("[ERROR] Failed to clear local storage:", error);
    }
}

// Track active window activity
async function trackActivity() {
    try {
        const window = await activeWindow();
        if (!window) return;

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
        console.error("[ERROR] Error tracking window:", error);
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
    await sendToBackend(); // Ensure all data is sent before exit
    process.exit(0);
});
