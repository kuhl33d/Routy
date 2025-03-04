import express from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getCurrentRoute,
  startRoute,
  endRoute,
  updateLocation,
  getAssignedStudents,
} from "../controllers/driver.controller.js";
import { validate } from "../middleware/validate.js";
import { driverValidation } from "../utils/validation.js";
import {
  adminRoute,
  driverRoute,
  mixRoute,
  protectRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Tested

router.use(protectRoute);

router.post("/", adminRoute, driverValidation, validate, createDriver);

router.get("/", mixRoute(["admin", "school"]), getAllDrivers);

router.get("/:id", mixRoute(["admin", "school", "driver"]), getDriverById);

router.put("/:id", adminRoute, driverValidation, validate, updateDriver);

router.delete("/:id", adminRoute, deleteDriver);

router.get(
  "/:id/current-route",
  mixRoute(["admin", "school", "driver"]),
  getCurrentRoute
);

router.post("/:id/start-route", driverRoute, startRoute);

router.post("/:id/end-route", driverRoute, endRoute);

router.post("/:id/update-location", driverRoute, updateLocation);

router.get("/:id/students", driverRoute, getAssignedStudents);

export default router;
