import express from "express";
import {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  updateBusLocation,
} from "../controllers/bus.controller.js";
import { validate } from "../middleware/validate.js";
import { busValidation } from "../utils/validation.js";
import {
  adminRoute,
  driverRoute,
  protectRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

// Tested

router.post("/", adminRoute, busValidation, validate, createBus);

router.get("/", getAllBuses);
router.get("/:id", getBusById);

router.put("/:id", adminRoute, busValidation, validate, updateBus);
router.put("/:id/location", driverRoute, updateBusLocation);

router.delete("/:id", adminRoute, deleteBus);

export default router;
