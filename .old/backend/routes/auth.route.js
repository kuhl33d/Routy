import express from "express";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteAddress,
  finalDeleteUser,
  forgotPassword,
  getAddresses,
  getAllUsers,
  getAllUsersType,
  login,
  logout,
  makeNewAddress,
  reSendVerificationEmail,
  resetPassword,
  safeDeleteUser,
  signup,
  updateAddress,
  updateUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validId } from "../helpers/helpers.js";
const router = express.Router();

// Tested
// users
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/verifyEmail", verifyEmail);
router.post("/generateVerificationCode", reSendVerificationEmail);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.route("/users").all(protectRoute, adminRoute).get(getAllUsers);
router.delete(
  "/usersFinalDelete/:userId",
  protectRoute,
  adminRoute,
  finalDeleteUser
);
router
  .route("/users/:userId")
  .all(protectRoute, adminRoute, validId("userId"))
  .put(updateUser)
  .delete(safeDeleteUser);
router.get("/usersType", protectRoute, adminRoute, getAllUsersType);

// addresses
// Tested
router
  .route("/address")
  .all(protectRoute)
  .get(getAddresses)
  .post(makeNewAddress);

router.put("/address/:addressId", protectRoute, updateAddress);
router.delete("/address/:addressId", protectRoute, deleteAddress);

export default router;
