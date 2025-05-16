import express from "express";
import {
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
  getChildrenLocation,
  addChild,
  removeChild,
  updateNotificationPreferences,
  updateEmergencyContacts,
  updatePickupPreferences,
  updateAddress,
} from "../controllers/parent.controller.js";
import { validate } from "../middleware/validate.js";
import { parentValidation } from "../utils/validation.js";
import {
  adminRoute,
  mixRoute,
  protectRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", mixRoute(["admin", "school"]), getAllParents);

router.get("/:id", getParentById);

router.put("/:id", adminRoute, parentValidation.update, validate, updateParent);

router.delete("/:id", adminRoute, deleteParent);

router.get("/:id/children-location", getChildrenLocation);

router.post(
  "/:id/add-child",
  adminRoute,
  parentValidation.addChild,
  validate,
  addChild
);

router.delete(
  "/:id/remove-child",
  adminRoute,
  parentValidation.removeChild,
  validate,
  removeChild
);

router.put(
  "/:id/notification-preferences",
  parentValidation.updateNotificationPreferences,
  validate,
  updateNotificationPreferences
);

router.put(
  "/:id/emergency-contacts",
  parentValidation.updateEmergencyContacts,
  validate,
  updateEmergencyContacts
);

router.put(
  "/:id/pickup-preferences",
  parentValidation.updatePickupPreferences,
  validate,
  updatePickupPreferences
);

router.put(
  "/:id/address",
  parentValidation.updateAddress,
  validate,
  updateAddress
);

export default router;
