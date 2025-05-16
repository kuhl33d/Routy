import express from "express";
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  optimizeRoute,
} from "../controllers/route.controller.js";
import { validate } from "../middleware/validate.js";
import { routeValidation } from "../utils/validation.js";
import {
  adminRoute,
  protectRoute,
  schoolRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Tested

router.use(protectRoute);

router.post("/", schoolRoute, routeValidation, validate, createRoute);

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);

router.put("/:id", adminRoute, routeValidation, validate, updateRoute);

router.delete("/:id", schoolRoute, deleteRoute);

router.post("/:id/optimize", adminRoute, optimizeRoute);

export default router;
