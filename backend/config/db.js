import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// import { MONGO_URI } from "./env.js";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trackify";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("[DB] MongoDB Connected...");
    } catch (error) {
        console.error("[DB ERROR] Failed to connect:", error);
        process.exit(1);
    }
};



mongoose.connection.on('disconnected', () => {
    console.log('[DB] Mongoose disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[DB] Mongoose connection closed due to app termination');
    process.exit(0);
});