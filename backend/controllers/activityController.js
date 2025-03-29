import { Activity } from "../models/Activity.js";

/**
 * Logs activity data into MongoDB
 */
export const trackActivity = async (req, res) => {
    try {
        const activities = req.body.data;
        if (!activities || !Array.isArray(activities)) {
            return res.status(400).json({ success: false, message: "Invalid data format" });
        }

        for (const entry of activities) {
            const { title, app, date, startTime, endTime, duration } = entry;

            let existingEntry = await Activity.findOne({ title, app, date });

            if (existingEntry) {
                existingEntry.endTime = endTime;
                existingEntry.duration += duration;
                await existingEntry.save();
            } else {
                const newEntry = new Activity({ title, app, date, startTime, endTime, duration });
                await newEntry.save();
            }
        }

        console.log(`[INFO] Processed ${activities.length} entries.`);
        res.status(200).json({ success: true, message: "Activities logged successfully" });
    } catch (error) {
        console.error("[ERROR] Failed to track activity:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
