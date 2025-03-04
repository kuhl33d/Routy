import express from "express";
import {
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  getDashboardStats,
  addBusToSchool,
  addDriverToSchool,
} from "../controllers/school.controller.js";
import {
  adminRoute,
  mixRoute,
  protectRoute,
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
export default router;
