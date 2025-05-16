import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserNotifications,
  markNotificationRead,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { userValidation } from "../utils/validation.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", adminRoute, getAllUsers);
router.post("/", adminRoute, userValidation.createUser, validate, createUser);

router.get("/:id", getUserById);
router.put("/:id", userValidation.updateUser, validate, updateUser);
router.delete("/:id", adminRoute, deleteUser);

// notifications not tested
router.get("/notifications/:userId", getUserNotifications);
router.patch("/notifications/:notificationId", markNotificationRead);

export default router;
