import express from "express";
import {
  adminRoute,
  mixRoute,
  protectRoute,
} from "../middleware/auth.middleware.js";
import {
  createNewSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
} from "../controllers/subscription.controller.js";
const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .all(adminRoute)
  .get(getAllSubscriptions)
  .post(createNewSubscription);
router
  .route("/:subscriptionId")
  .get(mixRoute(["school", "admin"]), getSubscriptionById)
  .put(adminRoute, updateSubscription)
  .delete(adminRoute, deleteSubscription);

export default router;
