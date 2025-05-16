import express from "express";
import studentRouter from "./student.route.js";
import schoolRouter from "./school.route.js";
import parentRouter from "./parent.route.js";
import routeRouter from "./route.route.js";
import driverRouter from "./driver.route.js";
import tripRouter from "./trip.route.js";
import busRouter from "./bus.route.js";
import userRouter from "./user.route.js";
import adminRouter from "./admin.route.js";
import authRouter from "./auth.route.js";
import subscriptionRouter from "./subscription.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);
router.use("/buses", busRouter);
router.use("/drivers", driverRouter);
router.use("/routes", routeRouter);
router.use("/parents", parentRouter);
router.use("/schools", schoolRouter);
router.use("/students", studentRouter);
router.use("/trips", tripRouter);
router.use("/subscriptions", subscriptionRouter);

export default router;
