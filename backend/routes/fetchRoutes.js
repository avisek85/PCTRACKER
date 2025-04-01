import express from "express";
import { fetchAllActivities, fetchSpecificDateActivities, fetchSpecificMonthActivity, fetchSpecificWeekActivity, fetchSpecificYearActivity, fetchTopUsedApps } from "../controllers/fetchController.js";

const router = express.Router();

// Route to fetch all activities
router.get("/all-activities", fetchAllActivities);
router.get("/date-activities",fetchSpecificDateActivities);
router.get("/week-activities",fetchSpecificWeekActivity);
router.get("/month-activities",fetchSpecificMonthActivity);
router.get("/year-activities",fetchSpecificYearActivity);
router.get("/topused-apps",fetchTopUsedApps);

export default router;