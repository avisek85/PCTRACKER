import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    app: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD format
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
}, { timestamps: true });

export const Activity = mongoose.model("Activity", activitySchema);
