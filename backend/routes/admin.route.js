import express from "express";
import {
  getDashboardStats,
  getSystemOverview,
  getAnalytics,
  addSubscription,
  approveSchool,
  approveDriver,
  payFees,
  schoolSubscriptions,
  getFullReview,
} from "../controllers/admin.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.use(adminRoute);

router.get("/dashboard", getDashboardStats);
router.get("/overview", getSystemOverview); //edit to follow requirements
router.get("/analytics", getAnalytics); // error

// Not Tested
router.get("/fullReportSys", getFullReview);
// get school subscription
router.get("/schoolSubscriptions/:schoolId", schoolSubscriptions);
// add subscription to the school per bus
router.post("/subscription/:schoolId", addSubscription);
// approve school to go in system
router.put("/approveSchool/:schoolId", approveSchool); // error
// approve driver to go in system by school
router.put("/approveDriver/:driverId", approveDriver); // not implemented
// pay the bus fees (student) by school
router.put("/payFees/:studentId", payFees); // not tested

export default router;
