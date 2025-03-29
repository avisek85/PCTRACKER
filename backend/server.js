import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import activityRoutes from "./routes/activityRoutes.js";
import fetchRoutes from "./routes/fetchRoutes.js";

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes
app.use("/api", activityRoutes);
app.use('/api',fetchRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to Database and Start Server
connectDB();
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
