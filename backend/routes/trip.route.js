import express from "express";
import {
  createTrip,
  startTrip,
  endTrip,
  getAllTrips,
  getTripsById,
  pickStudent,
  deleteTrip,
} from "../controllers/trip.controller.js";
import {
  adminRoute,
  mixRoute,
  protectRoute,
  schoolRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

router.post("/", mixRoute(["driver", "school"]), createTrip);
router.post("/:tripId/start", mixRoute(["driver", "school"]), startTrip);
router.post("/:tripId/end", mixRoute(["driver", "school"]), endTrip);
router.get("/", getAllTrips);
router.get("/:id", getTripsById);
router.post(
  "/:tripId/pick/:studentId",
  mixRoute(["driver", "school"]),
  pickStudent
);
router.delete("/:id", schoolRoute, deleteTrip);

export default router;
