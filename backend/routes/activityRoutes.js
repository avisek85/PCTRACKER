import express from "express";
import { trackActivity } from "../controllers/activityController.js";

const router = express.Router();

router.post("/track", trackActivity);

export default router;
