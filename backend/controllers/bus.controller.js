import Bus from "../models/bus.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import mongoose from "mongoose";

export const createBus = controllerWrapper(
  "createBus",
  async (req, res) => {
    const { busNumber, driverId, routeId, capacity, currentPassengers, currentLocation} = req.body;

    const bus = new Bus({
      busNumber,
      driverId: new mongoose.Types.ObjectId(driverId),
      routeId: new mongoose.Types.ObjectId(routeId),
      capacity,
      currentPassengers,
      currentLocation,
    });

    await bus.save();
    res.status(201).json({ success: true, bus });
  }
);

export const getAllBuses = controllerWrapper(
  "getAllBuses",
  async (req, res) => {
    const buses = await Bus.find()
      .populate("driverId", "name")
      .populate("routeId", "name")
      .sort("-createdAt");
    return res.status(200).json({success: true, data: buses});
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
