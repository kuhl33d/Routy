import express from "express";
import {
  mixRoute,
  protectRoute,
  schoolRoute,
} from "../middleware/auth.middleware.js";
import { validId } from "../helpers/helpers.js";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentsByParentId,
  safeDeleteStudent,
  finalDeleteStudent,
  updateStudent,
  getStudentsBySchoolId,
} from "../controllers/student.controller.js";
import { parentValidation } from "../utils/validation.js";
import { validate } from "../middleware/validate.js";
import { studentValidation } from "../utils/validation.js";

const router = express.Router();
router.use(protectRoute);

// Tested

router
  .route("/")
  .all(protectRoute, mixRoute(["admin", "school"]))
  .get(getAllStudents) // get all users
  .post(studentValidation, validate, createStudent); // create a new user
router
  .route("/:studentId")
  .all(protectRoute, validId("studentId"), mixRoute(["admin", "school"]))
  .get(getStudentById)
  .put(updateStudent);

router.delete("/:studentId", safeDeleteStudent);
router.delete("/final/:studentId", finalDeleteStudent);

router.get(
  "/parent/:parentId",
  mixRoute(["admin", "school"]),
  validId("parentId"),
  getStudentsByParentId
);
router.get(
  "/school/:schoolId",
  mixRoute(["admin", "school"]),
  validId("schoolId"),
  getStudentsBySchoolId
);
router.put(
  "/:studentId/route/:routeId",
  mixRoute(["admin", "school"]),
  validId(["studentId", "routeId"])
);
router.put(
  "/:studentId/state",
  mixRoute(["admin", "school", "driver"]),
  validId(["studentId"])
);
router.put("/:studentId/location", schoolRoute, validId(["studentId"]));

export default router;
