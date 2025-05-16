import Bus from "../models/bus.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import mongoose from "mongoose";
import { getSchoolIdbyUserId } from "../utils/getSchoolIdbyUserId.js";
export const createBus = controllerWrapper("createBus", async (req, res) => {
  const { busNumber, capacity, schoolId, routeId } = req.body;

  const bus = await Bus.create({
    busNumber,
    capacity,
    schoolId,
    routeId,
  });
  if (!bus)
    return res.status(400).json({ success: false, message: "Bus not created" });

  return res.status(201).json({ success: true, bus });
});

export const getAllBuses = controllerWrapper(
  "getAllBuses",
  async (req, res) => {
    const user = req.user;

    // For non-school users, return all buses if no schoolId is specified
    if (user.role !== "school") {
      const buses = await Bus.find({})
        .populate("driverId", "name")
        .populate("routeId", "name")
        .sort("-createdAt");
      return res.status(200).json({ success: true, data: buses });
    }

    // For school users, handle schoolId logic
    let schoolId = req.query.schoolId;

    // If schoolId not provided in query, try to get it from user
    if (!schoolId) {
      schoolId = await getSchoolIdbyUserId(user._id);
    }

    // Validate schoolId exists
    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: "Missing schoolId for school user",
      });
    }

    const buses = await Bus.find({ schoolId })
      .populate("driverId", "name")
      .populate("routeId", "name")
      .sort("-createdAt");

    return res.status(200).json({ success: true, data: buses });
  }
);
export const getBusById = controllerWrapper("getBusById", async (req, res) => {
  const bus = await Bus.findById(req.params.id)
    .populate("driverId", "name")
    .populate("routeId", "name")
    .populate("studentsOnBoard.studentId", "name");

  if (!bus) {
    const error = new Error("Bus not found");
    error.status = 404;
    throw error;
  }

  res.json(bus);
});

export const updateBus = controllerWrapper("updateBus", async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bus) {
    const error = new Error("Bus not found");
    error.status = 404;
    throw error;
  }

  res.json(bus);
});

export const deleteBus = controllerWrapper("deleteBus", async (req, res) => {
  const bus = await Bus.findByIdAndDelete(req.params.id);

  if (!bus) {
    const error = new Error("Bus not found");
    error.status = 404;
    throw error;
  }

  res.json({ message: "Bus deleted successfully" });
});

export const updateBusLocation = controllerWrapper(
  "updateBusLocation",
  async (req, res) => {
    const { latitude, longitude } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        currentLocation: { latitude, longitude },
        lastLocationUpdate: Date.now(),
      },
      { new: true }
    );

    if (!bus) {
      const error = new Error("Bus not found");
      error.status = 404;
      throw error;
    }

    res.json(bus);
  }
);
