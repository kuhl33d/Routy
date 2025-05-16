import express from "express";
import {
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  getDashboardStats,
  addBusToSchool,
  addDriverToSchool,
  addDriver,
  addStudent,
  getSchoolStatsById,
} from "../controllers/school.controller.js";
import {
  adminRoute,
  mixRoute,
  protectRoute,
  schoolRoute,
} from "../middleware/auth.middleware.js";
import { schoolValidation } from "../utils/validation.js";
import { validate } from "../middleware/validate.js";
import { getAllStudents } from "../controllers/student.controller.js";
import School from "../models/school.model.js";
const router = express.Router();

router.use(protectRoute);

// Tested

router.get("/", adminRoute, getAllSchools);

router.get("/:id", mixRoute(["admin", "school"]), getSchoolById);

router.get("/:id/stats", mixRoute(["admin", "school"]), getSchoolStatsById);

router.put("/:id", adminRoute, schoolValidation, validate, updateSchool);

router.delete("/:id", adminRoute, deleteSchool);

router.get("/:id/dashboard", mixRoute(["admin", "school"]), getDashboardStats);

router.post("/:schoolId/addBus", mixRoute(["admin", "school"]), addBusToSchool);
router.post(
  "/:schoolId/addDriver",
  mixRoute(["admin", "school"]),
  addDriverToSchool
);
router.get("/students/", mixRoute(["admin", "school"]), getAllStudents);
router.post("/addDriver", schoolRoute, addDriver);
router.post("/addStudent", schoolRoute, addStudent);
export default router;
